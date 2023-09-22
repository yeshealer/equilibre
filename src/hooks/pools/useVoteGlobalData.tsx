import { CONTRACTS } from '@/config/company';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { usePairStore } from '@/store/pairsStore';
import { readContract } from '@wagmi/core';
import { useEffect, useState } from 'react';

const useVoteGlobalData = () => {
  const [avgApr, setAvgApr] = useState(0);
  const [emissionsPerVote, setEmissionsPerVote] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const pairs = usePairStore(state => state.pairs);
  const { getBaseAsset } = useBaseAssetStore(state => ({
    getBaseAsset: state.actions.getBaseAsset,
  }));

  const calcAvgApr = () => {
    // const totalApr = pairs.reduce((acc, pair) => acc + pair.gauge?.apr!, 0);
    const pairsWithGauge = pairs.filter(pair => pair.gauge);
    const totalApr = pairsWithGauge.reduce(
      (acc, pair) => acc + pair.gauge?.apr!,
      0
    );
    setAvgApr(totalApr / pairsWithGauge.length);
  };

  // TODO: know how to get the emission per vote
  const calcEmissionsPerVote = async () => {
    const pairsWithGauge = pairs.filter(pair => pair.gauge);
    const totalApr = pairsWithGauge.reduce(
      (acc, pair) => acc + pair.gauge?.apr!,
      0
    );
    const emissionRaw = await readContract({
      address: CONTRACTS.MINTER_ADDRESS as `0x${string}`,
      abi: CONTRACTS.MINTER_ABI,
      functionName: 'weekly_emission',
    });
    const emission = Number(emissionRaw) / 10 ** CONTRACTS.GOV_TOKEN_DECIMALS;

    const varaToken = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS);
    if (!varaToken) return;
    const emissionsInUSD = emission * (varaToken.price as number);

    setEmissionsPerVote(emissionsInUSD * 0.01);
  };

  const calcTotalVotes = () => {
    const pairsWithGauge = pairs.filter(pair => pair.gauge);
    const totalVotes = pairsWithGauge.reduce(
      (acc, pair) => acc + pair.gauge?.votes!,
      0
    );

    setTotalVotes(totalVotes);
  };

  useEffect(() => {
    if (totalVotes !== 0) return;
    calcAvgApr();
    calcTotalVotes();
    calcEmissionsPerVote();
  }, [pairs]);

  return { avgApr, emissionsPerVote, totalVotes };
};

export default useVoteGlobalData;
