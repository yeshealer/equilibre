import { Pair, Reward } from '@/interfaces';
import { mapPair } from '@/utils/interfaceMaps';
import axios from 'axios';
import { fetchBalance } from '@wagmi/core';
import { create } from 'zustand';

interface RewardsStore {
  bribes: Reward | undefined,
  fees: Reward | undefined,
  emissions: Reward | undefined,
  rebase: Reward | undefined,
  estimatedRewardValue: number;
  actions: {
    setReward: (reward: Reward | undefined, type: "bribes" | "fees" | "emissions" | "rebase") => void;
  };
}

export const useRewardsStore = create<RewardsStore>((set, get) => ({
  bribes: undefined,
  fees: undefined,
  emissions: undefined,
  rebase: undefined,
  estimatedRewardValue: 0,
  actions: {
    setReward: (reward, type) => {
      const { bribes, fees, emissions, rebase } = get();

      set({ [type]: reward });
      set({
        estimatedRewardValue: Number(bribes?.totalEarnedValue ?? 0) + Number(fees?.totalEarnedValue ?? 0) +
          Number(emissions?.totalEarnedValue ?? 0) + Number(rebase?.totalEarnedValue ?? 0)
      });
    }
  },
}));
