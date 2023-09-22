import { CONTRACTS } from '@/config/company';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { readContract } from '@wagmi/core';
import { create } from 'zustand';
import { VeBVara } from '@/interfaces/VeBVara';

interface VeBVaraState {
  veBVaras: Array<VeBVara>;
  actions: {
    reset: () => void;
    fetVeVaras: (address: `0x${string}` | undefined) => void;
  };
}

export const useVeBVaraStore = create<VeBVaraState>((set, get) => ({
  veBVaras: [],
  actions: {
    reset: () => set({ veBVaras: new Array<VeBVara>() }),
    fetVeVaras: async (address) => {
      const reset = get().actions.reset;
      if (!address) {
        reset();
        return;
      }
      const result = await readContract({
        address: CONTRACTS.BVARA_TOKEN_ADDRESS,
        abi: CONTRACTS.BVARA_TOKEN_ABI,
        functionName: "getAllVestInfo",
        args: [address]
      })
      const data = result
        .map(item => ({
          vestID: Number(item.vestID),
          lockedBVaraAmount: Number(item.amount),
          startTimestamp: Number(item.start),
          maxEndTimestamp: Number(item.maxEnd),
          exitIn: Number(item.exitIn)
        } as VeBVara))
        .filter(item => item.exitIn == 0);
      set({ veBVaras: data })
    }
  },
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('veBVara', useVeBVaraStore);
}
