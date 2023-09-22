import { useEffect, useState } from 'react';
import { Pair, Reward, RewardInfo } from '@/interfaces';
import { readContract, fetchBalance } from '@wagmi/core';
import { CONTRACTS } from '@/config/company';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useVeTokenStore } from '@/store/veTokenStore';
import { getBalanceInEther } from '@/utils/formatBalance';
import { useAccount } from 'wagmi';
import { useRewardsStore } from '@/store/rewardsStore';
import { usePairStore } from '@/store/pairsStore';

const useRewards = (tokenId: number) => {
  const { allPairs } = usePairStore(state => ({ allPairs: state.pairs }));

  const { setReward } = useRewardsStore(state => ({
    setReward: state.actions.setReward,
  }));
  const { address } = useAccount();

  const { selectedVeNFT } = useVeTokenStore(state => ({
    selectedVeNFT: state.selectedVeNFT,
  }));

  const { getBaseAsset } = useBaseAssetStore(state => ({
    getBaseAsset: state.actions.getBaseAsset,
  }));

  useEffect(() => {
    if (address) {
      getTotalRewards();
      getEmissionReward();
    }
  }, [selectedVeNFT, address]);

  const getEmissionReward = async () => {
    const reward = await getRewards(
      allPairs.filter(pair => (pair.gauge ? true : false))
    );
    setReward(reward, 'emissions');
  };
  const getTotalRewards = async () => {
    if (!address) return;
    if (!tokenId) {
      return;
    }
    const pairs = selectedVeNFT?.votes.map(vote => vote.pair);

    const rewards = await Promise.all([
      getBribes(pairs),
      getFees(pairs),
      getDistribution(),
    ]);

    setReward(rewards[0], 'bribes');
    setReward(rewards[1], 'fees');
    setReward(rewards[2], 'rebase');
  };

  /// get fees reward
  const getFees = async (
    pairs: Array<Pair> | undefined
  ): Promise<Reward | undefined> => {
    if (!pairs) return undefined;

    let totalEarned = 0;
    let varaEarned = 0;
    let totalEarnedValue = 0;
    let info: RewardInfo[] = [];
    let showInfo: RewardInfo[] = [];

    await Promise.all(
      pairs.map(async pair => {
        const rewardsListLength = await readContract({
          address: pair.gauge?.feesAddress as `0x${string}`,
          abi: CONTRACTS.BRIBE_ABI,
          functionName: 'rewardsListLength',
        });

        const feesEarned = await Promise.all(
          Array.from({ length: Number(rewardsListLength) }, (_, index) =>
            readContract({
              address: pair.gauge?.feesAddress as `0x${string}`,
              abi: CONTRACTS.BRIBE_ABI,
              functionName: 'rewards',
              args: [BigInt(index)],
            })
          )
        );

        let asset;
        const tempInfos = (await Promise.all(
          feesEarned.map(async address => {
            asset = getBaseAsset(address);

            const earned = await readContract({
              address: pair.gauge?.feesAddress as `0x${string}`,
              abi: CONTRACTS.BRIBE_ABI,
              functionName: 'earned',
              args: [asset?.address as `0x${string}`, BigInt(tokenId)],
            });

            if (earned > 0) {
              const rewardPrice = getBaseAsset(address)?.price ?? 0;
              const earnedValue =
                (getBalanceInEther(
                  earned,
                  Number(getBaseAsset(address)?.decimals ?? 18)
                ) as number) * Number(rewardPrice);

              totalEarned += Number(earned);
              if (
                (
                  getBaseAsset(address)?.address as `0x${string}`
                ).toLowerCase() == CONTRACTS.GOV_TOKEN_ADDRESS.toLowerCase()
              )
                varaEarned += Number(earned);
              totalEarnedValue += earnedValue;
              let updatedPair = pair;
              updatedPair.gauge!.feesEarned = feesEarned;
              const infoResult = {
                pair: updatedPair,
                rewardToken: getBaseAsset(address),
                earned: Number(earned),
                earnedValue: earnedValue,
              } as RewardInfo;
              const index = showInfo.findIndex(
                showItem =>
                  showItem.rewardToken.address == infoResult.rewardToken.address
              );

              if (index == -1) {
                const temp = { ...infoResult };
                showInfo.push(temp);
              } else {
                showInfo[index].earned += infoResult.earned;
                showInfo[index].earnedValue += infoResult.earnedValue;
              }
              return infoResult;
            }
          })
        ).then(Infos => Infos.filter(info => !!info))) as RewardInfo[];

        info = info.concat(tempInfos);
      })
    );
    return {
      veNft: selectedVeNFT,
      info: info,
      totalEarned: totalEarned,
      varaEarned: varaEarned,
      totalEarnedValue: totalEarnedValue,
      rewardType: 'Fee',
      showInfo: showInfo,
    } as Reward;
  };

  /// get emissions reward
  const getRewards = async (
    pairs: Array<Pair> | undefined
  ): Promise<Reward | undefined> => {
    if (!pairs) return undefined;

    let totalEarned = 0;
    let totalEarnedValue = 0;

    let showInfo: RewardInfo[] = [];
    const info = await Promise.all(
      pairs.map(async pair => {
        if (!pair.gauge?.address) return undefined;
        const earned = await readContract({
          address: pair.gauge?.address as `0x${string}`,
          abi: CONTRACTS.GAUGE_ABI,
          functionName: 'earned',
          args: [CONTRACTS.GOV_TOKEN_ADDRESS, address!],
        });

        if (earned > 0) {
          const userGaugeBalance = await readContract({
            address: pair.gauge.address as `0x${string}`,
            abi: CONTRACTS.GAUGE_ABI,
            functionName: 'balanceOf',
            args: [address!],
          });
          const rewardPrice =
            getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS)?.price ?? 0;
          const earnedValue =
            (getBalanceInEther(
              earned,
              CONTRACTS.GOV_TOKEN_DECIMALS
            ) as number) * Number(rewardPrice);
          totalEarned += Number(earned);
          totalEarnedValue += earnedValue;
          const infoResult = {
            pair: pair,
            rewardToken: getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS),
            earned: Number(earned),
            earnedValue: earnedValue,
            userGaugeBalance: Number(userGaugeBalance),
          } as RewardInfo;
          const index = showInfo.findIndex(
            showItem =>
              showItem.rewardToken.address == infoResult.rewardToken.address
          );
          if (index == -1) {
            const temp = { ...infoResult };
            showInfo.push(temp);
          } else {
            showInfo[index].earned += infoResult.earned;
            showInfo[index].earnedValue += infoResult.earnedValue;
          }
          return infoResult;
        }
      })
    ).then(Emissions => Emissions.filter(emission => !!emission));

    return {
      veNft: selectedVeNFT,
      info: info,
      totalEarned: totalEarned,
      varaEarned: totalEarned,
      totalEarnedValue: totalEarnedValue,
      rewardType: 'Emission',
      showInfo: showInfo,
    } as Reward;
  };

  /// get bribes reward
  const getBribes = async (
    pairs: Array<Pair> | undefined
  ): Promise<Reward | undefined> => {
    if (!pairs) return undefined;

    let info: RewardInfo[] = [];
    let showInfo: RewardInfo[] = [];
    let totalEarned = 0;
    let varaEarned = 0;
    let totalEarnedValue = 0;

    await Promise.all(
      pairs
        .filter(pair => pair.gauge?.bribeAddress)
        .map(async pair => {
          if (!pair.gauge?.bribes) return {};
          const tempInfos = (await Promise.all(
            pair.gauge?.bribes.map(async bribe => {
              if (!pair.gauge?.wrappedBribeAddress) return undefined;
              const earned = await readContract({
                address: pair.gauge?.wrappedBribeAddress as `0x${string}`,
                abi: CONTRACTS.BRIBE_ABI,
                functionName: 'earned',
                args: [bribe.token.address, BigInt(tokenId)],
              });
              if (earned > 0) {
                const rewardPrice =
                  getBaseAsset(bribe.token.address)?.price ?? 0;
                const earnedValue =
                  (getBalanceInEther(
                    earned,
                    Number(bribe.token.decimals ?? 18)
                  ) as number) * Number(rewardPrice);
                totalEarned += Number(earned);
                if (
                  bribe.token.address.toLowerCase() ==
                  CONTRACTS.GOV_TOKEN_ADDRESS.toLowerCase()
                )
                  varaEarned += Number(earned);
                totalEarnedValue += earnedValue;

                const infoResult = {
                  pair: pair,
                  rewardToken: getBaseAsset(bribe.token.address),
                  earned: Number(earned),
                  earnedValue: earnedValue,
                } as RewardInfo;
                const index = showInfo.findIndex(
                  showItem =>
                    showItem.rewardToken.address ==
                    infoResult.rewardToken.address
                );
                if (index == -1) {
                  const temp = { ...infoResult };
                  showInfo.push(temp);
                } else {
                  showInfo[index].earned += infoResult.earned;
                  showInfo[index].earnedValue += infoResult.earnedValue;
                }
                return infoResult;
              }
            })
          ).then(bribes => bribes.filter(bribe => !!bribe))) as RewardInfo[];
          info = info.concat(tempInfos);
        })
    );

    return {
      veNft: selectedVeNFT,
      info: info,
      totalEarned: totalEarned,
      varaEarned: varaEarned,
      totalEarnedValue: totalEarnedValue,
      rewardType: 'Bribe',
      showInfo: showInfo,
    } as Reward;
  };

  /// get rebase reward
  const getDistribution = async (): Promise<Reward | undefined> => {
    const veDistEarned = await readContract({
      address: CONTRACTS.VE_DIST_ADDRESS,
      abi: CONTRACTS.VE_DIST_ABI,
      functionName: 'claimable',
      args: [BigInt(tokenId)],
    });

    let info: RewardInfo[] = [];
    const rewardPrice = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS)?.price ?? 0;
    if (veDistEarned > 0) {
      info = [
        {
          rewardToken: getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS),
          earned: Number(veDistEarned),
          earnedValue:
            (getBalanceInEther(
              veDistEarned,
              CONTRACTS.GOV_TOKEN_DECIMALS
            ) as number) * Number(rewardPrice),
        } as RewardInfo,
      ];
    }
    const veDistReward = {
      veNft: selectedVeNFT,
      info: info,
      totalEarned: Number(veDistEarned),
      varaEarned: Number(veDistEarned),
      totalEarnedValue:
        (getBalanceInEther(
          veDistEarned,
          CONTRACTS.GOV_TOKEN_DECIMALS
        ) as number) * Number(rewardPrice),
      rewardType: 'Rebase',
      showInfo: info,
    } as Reward;

    return veDistReward;
  };

  return {
    getTotalRewards,
    getEmissionReward
  };
};

export default useRewards;
