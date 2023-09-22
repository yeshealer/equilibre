import { CONTRACTS } from '@/config/company';
import { Pair, SwapQuote, Token } from '@/interfaces';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { fetchBalance, getAccount } from '@wagmi/core';
import { create } from 'zustand';
import { readPairFactory } from '@/lib/equilibre';
import { usePairStore } from '@/store/pairsStore';
import BigNumber from 'bignumber.js';

interface LiquidityState {
  token0?: Token;
  token1?: Token;
  pair?: Pair;
  inputToken0Balance: string;
  inputToken1Balance: string;
  inputPairBalance: string;
  depositedLp: string;
  stakedLp: string;
  newStakeLp: string;
  stakedValue: string;
  slippage: string;
  txDeadline: string;
  advancedMode: boolean;
  priorityAsset: number;
  poolType: string;
  activeTab: number;
  actions: {
    initAssets: () => void;
    setAsset: (token: Token | string, type: string) => void;
    initPair: () => void;
    setPair: (pair?: Pair) => void;
    setPairByAddress: (address: string) => void;
    setInputToken0Balance: (inputToken0Balance: string) => void;
    setInputToken1Balance: (inputToken1Balance: string) => void;
    setInputPairBalance: (inputPairBalance: string) => void;
    setDepositedLp: (depositedLp: string) => void;
    setStakedLp: (stakedLp: string) => void;
    setNewStakeLp: (newStakeLp: string) => void;
    setStakedValue: (stakedValue: string) => void;
    setSlippage: (slippage: string) => void;
    setTxDeadline: (txDeadline: string) => void;
    setAdvancedMode: (advancedMode: boolean) => void;
    setPriorityAsset: (priorityAsset: number) => void;
    setPoolType: (poolType: string) => void;
    setActiveTab: (activeTab: number, pairAddress: string) => void;
  };
}

export const useLiquidityStore = create<LiquidityState>((set, get) => ({
  token0: undefined,
  token1: undefined,
  pair: undefined,
  inputToken0Balance: '',
  inputToken1Balance: '',
  inputPairBalance: '',
  depositedLp: '0',
  stakedLp: '0',
  newStakeLp: '0',
  stakedValue: '0',
  slippage: '2',
  txDeadline: '300',
  advancedMode: false,
  priorityAsset: 0,
  poolType: 'Volatile',
  activeTab: 0,
  actions: {
    initAssets: async (pairAddress?: string) => {
      const { getBaseAsset } = useBaseAssetStore.getState().actions;
      const token0 = getBaseAsset(CONTRACTS.WKAVA_ADDRESS);
      const token1 = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS);
      const { address } = getAccount();
      if (address) {
        if (token0) {
          token0.balance =
            token0.balance != 0
              ? (
                await fetchBalance({
                  address: address,
                  token: token0.address,
                })
              ).formatted
              : token0.balance;
        }
        if (token1) {
          token1.balance =
            token1.balance != 0
              ? (
                await fetchBalance({
                  address: address,
                  token: token1.address,
                })
              ).formatted
              : token1.balance;
        }
      }

      set({
        token0,
        token1,
        inputToken0Balance: '',
        inputToken1Balance: '',
      });
    },
    setAsset: async (token, type) => {
      const { getBaseAsset } = useBaseAssetStore.getState().actions;
      const { pairs } = usePairStore.getState();
      const { address } = getAccount();
      if (typeof token === 'string') {
        if (type === 'token0') {
          set({
            token0: getBaseAsset(token),
          });
        } else if (type === 'token1') {
          set({
            token1: getBaseAsset(token),
          });
        } else {
          console.log("Wrong type parameter: use 'token0' or 'token1'");
        }
      } else {
        if (type === 'token0') {
          set({
            token0: token,
          });
        } else if (type === 'token1') {
          set({
            token1: token,
          });
        } else {
          console.log("Wrong type parameter: use 'token0' or 'token1'");
        }
      }
      const token0 = get().token0;
      const token1 = get().token1;

      if (token0 && token1) {
        if (address) {
          token0.balance =
            token0.balance != 0
              ? token0.balance
              : (
                await fetchBalance({
                  address: address,
                  token: token0.address,
                })
              ).formatted;
          token1.balance =
            token1.balance != 0
              ? token1.balance
              : (
                await fetchBalance({
                  address: address,
                  token: token1.address,
                })
              ).formatted;
          // console.log('hello');
          // console.log(token0.balance);
          // console.log(token1.balance);
          // console.log(
          //   (await fetchBalance({ address, token: token0.address })).formatted
          // );
          // console.log(
          //   (await fetchBalance({ address, token: token1.address })).formatted
          // );
        }

        const searchPair = pairs.find(
          pair =>
            (pair.token0.address.toLowerCase() ===
              token0?.address.toLowerCase() &&
              pair.token1.address.toLowerCase() ===
              token1?.address.toLowerCase()) ||
            (pair.token0.address.toLowerCase() ===
              token1?.address.toLowerCase() &&
              pair.token1.address.toLowerCase() ===
              token0?.address.toLowerCase())
        );
        if (searchPair) {
          set({
            pair: searchPair,
            depositedLp: (searchPair.balanceDeposited as string) || '0',
            stakedLp: (searchPair.balanceStaked as string) || '0',
          });

          if (
            searchPair.token0.address.toLowerCase() !==
            token0.address.toLowerCase()
          ) {
            set({
              token0: token1,
              token1: token0,
            });
          }

          //! Temporary fix for stakedValue
          if (
            searchPair.balanceStakedUSD === '0.00' &&
            (searchPair.balanceStaked as number) > 0
          ) {
            searchPair.balanceStakedUSD = BigNumber(searchPair.balanceStaked)
              .div(searchPair.totalSupply!)
              .times(searchPair.reserve0)
              .times(searchPair.token0.price)
              .plus(
                BigNumber(searchPair.balanceStaked)
                  .div(searchPair.totalSupply!)
                  .times(searchPair.reserve1)
                  .times(searchPair.token1.price)
              )
              .toFixed(2);
          }
          set({
            stakedValue: (searchPair.balanceStakedUSD as string) || '0',
          });
        } else {
          set({ depositedLp: '0', stakedLp: '0', stakedValue: '0' });
        }
      }
    },
    initPair: async () => {
      const { pairs } = usePairStore.getState();
      const initialPair = pairs.find(
        pair =>
          pair.token0.address.toLowerCase() ===
          CONTRACTS.WKAVA_ADDRESS.toLowerCase() &&
          pair.token1.address.toLowerCase() ===
          CONTRACTS.GOV_TOKEN_ADDRESS.toLowerCase()
      );
      if (initialPair) {
        set({
          pair: initialPair,
          token0: initialPair.token0,
          token1: initialPair.token1,
          depositedLp: (initialPair.balanceDeposited as string) || '0',
          stakedLp: (initialPair.balanceStaked as string) || '0',
          stakedValue: (initialPair.balanceStakedUSD as string) || '0',
        });
      }
    },
    setPair: pair => {
      if (pair)
        set({
          pair,
          token0: pair?.token0,
          token1: pair?.token1,
          depositedLp: (pair?.balanceDeposited as string) || '0',
          stakedLp: (pair?.balanceStaked as string) || '0',
          stakedValue: (pair?.balanceStakedUSD as string) || '0',
          inputPairBalance: '',
        });
      else {
        set({
          pair,
        });
      }
    },
    setPairByAddress: address => {
      const { getPair } = usePairStore.getState().actions;
      const newPair = getPair(address);
      set({
        pair: newPair,
        token0: newPair?.token0,
        token1: newPair?.token1,
        depositedLp: (newPair?.balanceDeposited as string) || '0',
        stakedLp: (newPair?.balanceStaked as string) || '0',
        stakedValue: (newPair?.balanceStakedUSD as string) || '0',
        inputPairBalance: '',
      });
    },
    setInputToken0Balance: (inputToken0Balance: string) =>
      set({ inputToken0Balance }),
    setInputToken1Balance: (inputToken1Balance: string) =>
      set({ inputToken1Balance }),
    setInputPairBalance: (inputPairBalance: string) =>
      set({ inputPairBalance }),
    setDepositedLp: (depositedLp: string) => set({ depositedLp }),
    setStakedLp: (stakedLp: string) => set({ stakedLp }),
    setNewStakeLp: (newStakeLp: string) => set({ newStakeLp }),
    setStakedValue: (stakedValue: string) => set({ stakedValue }),
    setSlippage: (slippage: string) => set({ slippage }),
    setTxDeadline: (txDeadline: string) => set({ txDeadline }),
    setAdvancedMode: (advancedMode: boolean) => set({ advancedMode }),
    setPriorityAsset: (priorityAsset: number) => set({ priorityAsset }),
    setPoolType: (poolType: string) => set({ poolType }),
    setActiveTab: (activeTab: number, pairAddress: string) => {
      if (activeTab === 0) {
        if (pairAddress) {
          get().actions.setPairByAddress(pairAddress);
        } else {
          get().actions.initAssets();
        }
      } else {
        pairAddress
          ? get().actions.setPairByAddress(pairAddress)
          : get().actions.initPair();
      }
      set({ activeTab });
    },
  },
}));
