import { CONTRACTS } from '@/config/company';
import { readVeToken } from '@/lib/equilibre';
import { usePairStore } from '@/store/pairsStore';
import { useVeTokenStore } from '@/store/veTokenStore';
import { multicall } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { shallow } from 'zustand/shallow';
const useSimpleVeNFTs = () => {
  const { address } = useAccount();
  const { veToken, veNFTs, setVeNFTs, setSelectedVeNFT } = useVeTokenStore(
    state => ({
      veToken: state.veToken,
      veNFTs: state.veNFTs,
      setVeNFTs: state.actions.setVeNFTs,
      setSelectedVeNFT: state.actions.setSelectedVeNFT,
    })
  );
  const { pairs } = usePairStore(
    state => ({
      pairs: state.pairs,
    }),
    shallow
  );

  const getSimpleVeNfts = async () => {
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
            percent: (Number(votesCall[i].result) / totalVotes) * 100,
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

  return { veNFTs, getSimpleVeNfts };
};

export default useSimpleVeNFTs;
