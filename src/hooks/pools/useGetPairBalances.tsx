import { CONTRACTS } from '@/config/company';
import { Pair, Token } from '@/interfaces';
import { getPair, readErc20, readGauge, readPair } from '@/lib/equilibre';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { usePairStore } from '@/store/pairsStore';
import { getContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { fetchBalance } from 'wagmi/dist/actions';

//* Returns 2 lists of tokens with their balance
//* tokenList -> whole list
//* fixedTokens -> banner/fav tokens

const useGetPairBalances = () => {
  const pairs = usePairStore(state => state.pairs);
  const initPairs = usePairStore(state => state.actions.initPairs);
  const { address, isConnected, status } = useAccount();
  const [pairList, setPairList] = useState<Pair[]>(pairs);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      const getBalances = async () => {
        let localList = await Promise.all(
          pairs.map(async (pair: Pair) => {
            if (pair.gauge) {
              return await readGauge({
                address: pair.gauge?.address,
                functionName: 'balanceOf',
                args: [address!],
              })
                .then(async r => {
                  const reserve0 =
                    pair.totalSupply > 0
                      ? BigNumber(pair.reserve0)
                          .times(pair.gauge?.totalSupply!)
                          .div(pair.totalSupply)
                          .toFixed(pair.token0.decimals! as number)
                      : '0';
                  const reserve1 =
                    pair.totalSupply > 0
                      ? BigNumber(pair.reserve1)
                          .times(pair.gauge?.totalSupply!)
                          .div(pair.totalSupply)
                          .toFixed(pair.token1.decimals! as number)
                      : '0';
                  pair.balanceStaked = pair.gauge
                    ? formatUnits(r, pair.gauge?.decimals!)
                    : 0;
                  pair.balanceStakedUSD = BigNumber(pair.balanceStaked)
                    .div(pair.gauge?.totalSupply!)
                    .times(reserve0)
                    .times(pair.token0.price)
                    .plus(
                      BigNumber(pair.balanceStaked)
                        .div(pair.gauge?.totalSupply!)
                        .times(reserve1)
                        .times(pair.token1.price)
                    )
                    .toFixed(2);
                  pair.token0.balance = BigNumber(pair.balanceStaked)
                    .div(pair.gauge?.totalSupply!)
                    .times(reserve0)
                    .toFixed(pair.token0.decimals! as number);
                  pair.token1.balance = BigNumber(pair.balanceStaked)
                    .div(pair.gauge?.totalSupply!)
                    .times(reserve1)
                    .toFixed(pair.token1.decimals! as number);
                  if (isNaN(Number(pair.balanceStaked))) console.log(pair);
                  pair.balanceDeposited =
                    formatUnits(
                      await readPair({
                        address: pair.address!,
                        functionName: 'balanceOf',
                        args: [address!],
                      }),
                      pair.decimals!
                    ) || 0;
                  return pair;
                })
                .catch(e => {
                  // console.log(e);
                  return pair;
                });
            } else {
              pair.balanceStaked = Number(0).toFixed(2);
              pair.balanceStakedUSD = Number(0).toFixed(2);
              pair.balanceDeposited =
                formatUnits(
                  await readPair({
                    address: pair.address!,
                    functionName: 'balanceOf',
                    args: [address!],
                  }).catch(e => {
                    // console.log(e);
                    return BigInt(0);
                  }),
                  pair.decimals!
                ) || 0;
            }
            return pair;
          })
        );
        // console.log(pairList);
        setIsLoading(false);
        setPairList(localList);
      };

      getBalances();
    } else {
      setIsLoading(true);
      setPairList(pairs);
      setIsLoading(false);
    }
  }, [status, pairs]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   initPairs().then(() => {
  //     setPairList(pairs);
  //     console.log('refresh');
  //     setIsLoading(false);
  //   });
  // }, [status]);

  return { pairList, isLoading };
};

export default useGetPairBalances;
