import { Token } from '@/interfaces';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useLocalAssetStore } from '@/store/localAssetsStore';
import { fetchBalance } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

//* Returns 2 lists of tokens with their balance
//* tokenList -> whole list
//* fixedTokens -> banner/fav tokens

const useGetBalances = (
  dropGasToken: boolean = false,
  isForLocalAssets: boolean = false
) => {
  const { baseAssets: tempBaseAssets } = useBaseAssetStore(state => state);
  const { localAssets } = useLocalAssetStore(state => state);
  const baseAssets = isForLocalAssets ? localAssets : tempBaseAssets;

  const { address, isConnected, status } = useAccount();
  const [tokenList, setTokenList] = useState<Token[]>();
  const [fixedTokens, setFixedTokens] = useState<Token[]>();

  useEffect(() => {
    if (isConnected) {
      const getBalances = async () => {
        let localList = await Promise.all(
          baseAssets.map(async (token: Token) => {
            if (token.symbol === 'KAVA') {
              return await fetchBalance({
                address: address!,
              })
                .then(r => {
                  token.balance = r.formatted;
                  token.balanceWei = r.value.toString();
                  return token;
                })
                .catch(e => {
                  token.balance = '0';
                  return token;
                });
            }
            return await fetchBalance({
              address: address!,
              token: token.address,
            })
              .then(r => {
                token.balance = r.formatted;
                token.balanceWei = r.value.toString();
                return token;
              })
              .catch(e => {
                token.balance = '0';
                return token;
              });
          })
        );
        localList = localList
          .sort((a, b) => Number(b.balance) - Number(a.balance))
          .map(token => {
            token.balance = token.balance;

            return token;
          });
        if (dropGasToken) {
          localList = localList.filter(x => x.symbol !== 'KAVA');
        }
        setTokenList(localList);
        setFixedTokens(
          localList.filter(
            token =>
              token.symbol === 'axlUSDC' ||
              token.symbol === 'wKAVA' ||
              token.symbol === 'VARA'
          )
        );
      };

      getBalances();
    } else {
      let localList = baseAssets;
      if (dropGasToken) {
        localList = localList.filter(x => x.symbol !== 'KAVA');
      }
      setTokenList(localList);
      setFixedTokens(
        baseAssets.filter(
          token =>
            token.symbol === 'axlUSDC' ||
            token.symbol === 'wKAVA' ||
            token.symbol === 'VARA'
        )
      );
    }
  }, [status, baseAssets]);

  return { tokenList, fixedTokens };
};

export default useGetBalances;
