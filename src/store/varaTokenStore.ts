import { create } from 'zustand';
import { BigNumber } from 'ethers';
import { multicall } from '@wagmi/core';

import { CONTRACTS } from '@/config/company';

interface VaraTokenState {
  balance: BigNumber;
  veVaraAllowance: BigNumber;
  actions: {
    reset: () => void;
    setBalance: (value: BigNumber) => void;
    setVeVaraAllowance: (value: BigNumber) => void;
    fetBalanceAndAllowance: (address?: string) => void;
  };
}

export const useVaraTokenStore = create<VaraTokenState>((set, get) => ({
  balance: BigNumber.from(0),
  veVaraAllowance: BigNumber.from(0),
  actions: {
    reset: () =>
      set({ balance: BigNumber.from(0), veVaraAllowance: BigNumber.from(0) }),

    setBalance: (x: BigNumber) => set({ balance: x }),

    setVeVaraAllowance: (x: BigNumber) => set({ veVaraAllowance: x }),

    fetBalanceAndAllowance: async (address?: string) => {
      const {
        actions: { reset, setBalance, setVeVaraAllowance },
      } = get();

      if (!address) {
        reset();
        return;
      }

      const [balanceResult, allowanceResult] = await multicall({
        contracts: [
          {
            address: CONTRACTS.GOV_TOKEN_ADDRESS,
            //@ts-ignore
            abi: CONTRACTS.GOV_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address],
          },
          {
            address: CONTRACTS.GOV_TOKEN_ADDRESS,
            //@ts-ignore
            abi: CONTRACTS.GOV_TOKEN_ABI,
            functionName: 'allowance',
            args: [address, CONTRACTS.VE_TOKEN_ADDRESS],
          },
        ],
      });

      if (balanceResult.status === 'success') {
        setBalance(BigNumber.from(balanceResult.result));
      }
      if (allowanceResult.status === 'success') {
        setVeVaraAllowance(BigNumber.from(allowanceResult.result));
      }
    },
  },
}));
