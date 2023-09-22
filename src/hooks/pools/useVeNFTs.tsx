import { CONTRACTS } from '@/config/company';
import { configuration } from '@/config/wagmi';
import { readBribe, readVeToken } from '@/lib/equilibre';
import { usePairStore } from '@/store/pairsStore';
import { useVeTokenStore } from '@/store/veTokenStore';
import { multicall } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { shallow } from 'zustand/shallow';
const useVeNFTs = () => {
  const { address, isConnected, status } = useAccount();
  const { veToken, veNFTs, setVeNFTs, setSelectedVeNFT } = useVeTokenStore(
    state => ({
      veToken: state.veToken,
      veNFTs: state.veNFTs,
      setVeNFTs: state.actions.setVeNFTs,
      setSelectedVeNFT: state.actions.setSelectedVeNFT,
    })
  );
  const { pairs, initPairs } = usePairStore(
    state => ({
      pairs: state.pairs,
      initPairs: state.actions.initPairs,
    }),
    shallow
  );
  const [epochFinishes, setEpochFinishes] = useState(0);

  useEffect(() => {
    initPairs();
    calcCountDown();
  }, [pairs.length === 0]);

  useEffect(() => {
    if (isConnected) {
      getNfts();
    }
  }, [address, pairs.length]);

  const getNfts = async () => {
    const nftsLength = await readVeToken({
      functionName: 'balanceOf',
      args: [address!],
    });
    const arr = Array.from(
      { length: parseInt(nftsLength.toString()) },
      (v, i) => i
    );
    const gauges = pairs.filter(pair => pair.gauge?.address);

    const nfts = await Promise.all(
      arr.map(async (id: number) => {
        const tokenIndex = await readVeToken({
          functionName: 'tokenOfOwnerByIndex',
          args: [address!, BigInt(id)],
        });
        const locked = await readVeToken({
          functionName: 'locked',
          args: [tokenIndex],
        });
        const lockValue = await readVeToken({
          functionName: 'balanceOfNFT',
          args: [tokenIndex],
        });

        // Get votes for each gauge for this nft
        const voterContract = {
          address: CONTRACTS.VOTER_ADDRESS as `0x${string}`,
          abi: CONTRACTS.VOTER_ABI,
        };
        const callObject = gauges.map(gauge => {
          return {
            ...voterContract,
            functionName: 'votes',
            args: [tokenIndex, gauge.address!],
          };
        });

        const votesCall = await multicall({
          contracts: callObject,
        });
        const totalVotes = votesCall.reduce((curr, acc) => {
          return curr + Number(acc.result);
        }, 0);
        let votes = [];
        for (let i = 0; i < votesCall.length; i++) {
          if (Number(votesCall[i].result) === 0) continue;
          votes.push({
            pair: gauges[i],
            votes: Number(votesCall[i].result),
            percent: Math.round(
              (Number(votesCall[i].result) / totalVotes) * 100
            ),
          });
        }
        return {
          id: Number(tokenIndex),
          lockEnds: locked[1],
          lockAmount: Number(
            BigNumber(locked[0].toString())
              .div(10 ** (veToken.decimals as number))
              .toFixed(veToken.decimals as number)
          ),
          lockValue: Number(
            BigNumber(lockValue.toString())
              .div(10 ** (veToken.decimals as number))
              .toFixed(veToken.decimals as number)
          ),
          votes: votes,
        };
      })
    );
    setVeNFTs(nfts);
    setSelectedVeNFT(nfts[0]);
  };
  const calcCountDown = async () => {
    if (pairs.length === 0) return;
    const pairAddressWithGauge = pairs.find(
      x => x.gauge?.address !== undefined
    );
    if (!pairAddressWithGauge) console.log('no pair found');
    const lastBlockTimestamp = await configuration.publicClient.getBlock({
      blockTag: 'latest',
    });
    const epochStarted = await readBribe({
      address: pairAddressWithGauge?.gauge?.bribeAddress! as `0x${string}`,
      functionName: 'getEpochStart',
      args: [lastBlockTimestamp.timestamp],
    });
    setEpochFinishes(Number(epochStarted) + 604800);
  };

  return { veNFTs, epochFinishes, getNfts };
};

export default useVeNFTs;
