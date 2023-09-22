import { Pair } from '@/interfaces';
import { mapPair } from '@/utils/interfaceMaps';
import axios from 'axios';
import { fetchBalance } from '@wagmi/core';
import { create } from 'zustand';
import { getAccount } from '@wagmi/core';
import { readGauge, readPair } from '@/lib/equilibre';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'viem';
import { displayNumber } from '@/utils/formatNumbers';

interface PairsState {
  pairs: Pair[];
  isLoading: boolean;
  actions: {
    initPairs: () => Promise<void>;
    getPair: (address: string) => Pair | undefined;
  };
}
const BASE_URL = process.env.NEXT_PUBLIC_API ?? 'https://localhost:8000';

export const usePairStore = create<PairsState>((set, get) => ({
  pairs: [],
  isLoading: false,
  actions: {
    initPairs: async () => {
      const { isConnected, address } = getAccount();
      set({ isLoading: true });
      await axios
        .get(BASE_URL.concat('/pairs'))
        .then(response => {
          let pairs = response.data.data;
          pairs = mapPair(pairs);
          set({ pairs });
        })
        .catch(error => console.log(error));
      if (isConnected) {
        const pairs = get().pairs;
        let localList = await Promise.all(
          pairs.map(async (pair: Pair) => {
            if (pair.gauge) {
              return await readGauge({
                address: pair.gauge?.address,
                functionName: 'balanceOf',
                args: [address!],
              })
                .then(async r => {
                  pair.balanceStaked = formatUnits(r, pair.gauge?.decimals!);
                  pair.balanceStakedUSD = BigNumber(pair.balanceStaked)
                    .div(pair.totalSupply!)
                    .times(pair.reserve0)
                    .times(pair.token0.price)
                    .plus(
                      BigNumber(pair.balanceStaked)
                        .div(pair.totalSupply!)
                        .times(pair.reserve1)
                        .times(pair.token1.price)
                    )
                    .toFixed(2);
                  pair.balanceDeposited =
                    formatUnits(
                      await readPair({
                        address: pair.address!,
                        functionName: 'balanceOf',
                        args: [address!],
                      }),
                      pair.decimals!
                    ) || 0;
                  pair.balanceDepositedUSD = BigNumber(pair.balanceDeposited)
                    .div(pair.totalSupply!)
                    .times(pair.reserve0)
                    .times(pair.token0.price)
                    .plus(
                      BigNumber(pair.balanceDeposited)
                        .div(pair.totalSupply!)
                        .times(pair.reserve1)
                        .times(pair.token1.price)
                    )
                    .toFixed(2);
                  pair.token0.balance = BigNumber(pair.balanceStaked)
                    .plus(pair.balanceDeposited)
                    .div(pair.totalSupply!)
                    .times(pair.reserve0)
                    .toFixed(pair.token0.decimals! as number);
                  pair.token1.balance = BigNumber(pair.balanceStaked)
                    .plus(pair.balanceDeposited)
                    .div(pair.totalSupply!)
                    .times(pair.reserve1)
                    .toFixed(pair.token1.decimals! as number);

                  return pair;
                })
                .catch(e => {
                  console.log(e);
                  return pair;
                });
            }
            return pair;
          })
        );
        set({ pairs: localList });
      }
      set({ isLoading: false });
    },
    getPair: (address: string) => {
      const { pairs } = get();
      return pairs.find(
        (pair: Pair) => pair.address.toLowerCase() === address.toLowerCase()
      );
    },
  },
}));
