import { CONTRACTS } from '@/config/company';
import { SwapQuote, Token } from '@/interfaces';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { fetchBalance, getAccount } from '@wagmi/core';
import { create } from 'zustand';
import _getRoute from './_getRoute';
import { readPairFactory } from '@/lib/equilibre';
import { useLocalAssetStore } from '@/store/localAssetsStore';

interface SwapState {
  inputAsset?: Token;
  outputAsset?: Token;
  displayRoute: boolean;
  swapQuote?: SwapQuote;
  amountRaw: string;
  slippage: string;
  txDeadline: string;
  isFetching: boolean;
  priceImpact: string;
  actions: {
    initAssets: () => void;
    updateAssets: () => void;
    setAsset: (address: string, type: string) => void;
    setAmountRaw: (amount: string) => void;
    setSlippage: (slippage: string) => void;
    setTxDeadline: (txDeadline: string) => void;
    getSwapQuote: () => void;
    cleanRoute: () => void;
    changeDisplayRoute: (value: boolean) => void;
    getFeePercentage: () => Promise<{ stableFee: number; volatileFee: number }>;
    setPriceImpact: (value: string) => void;
  };
}

export const useSwapStore = create<SwapState>((set, get) => ({
  inputAsset: undefined,
  outputAsset: undefined,
  displayRoute: true,
  swapQuote: {},
  amountRaw: '0',
  slippage: '2',
  txDeadline: '300',
  isFetching: false,
  priceImpact: '0',
  actions: {
    initAssets: async () => {
      const { getBaseAsset } = useBaseAssetStore.getState().actions;
      const inputAsset = getBaseAsset(CONTRACTS.KAVA_ADDRESS);
      const outputAsset = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS);
      const { address } = getAccount();
      if (address) {
        if (inputAsset) {
          inputAsset.balance = (
            await fetchBalance({ address: address })
          ).formatted;
        }
        if (outputAsset) {
          outputAsset.balance = (
            await fetchBalance({ address: address, token: outputAsset.address })
          ).formatted;
        }
      }

      set({
        inputAsset,
        outputAsset,
      });
    },
    updateAssets: async () => {
      const { address } = getAccount();
      const { inputAsset, outputAsset } = get();
      const { setBaseAsset } = useBaseAssetStore.getState().actions;
      if (address) {
        if (inputAsset) {
          if (
            inputAsset.address.toLowerCase() ===
            CONTRACTS.KAVA_ADDRESS.toLowerCase()
          ) {
            inputAsset.balance = (
              await fetchBalance({ address: address })
            ).formatted;
            inputAsset.balanceWei = (
              await fetchBalance({ address: address })
            ).value.toString();
          } else {
            inputAsset.balance = (
              await fetchBalance({
                address: address,
                token: inputAsset.address,
              })
            ).formatted;
            inputAsset.balanceWei = (
              await fetchBalance({
                address: address,
                token: inputAsset.address,
              })
            ).value.toString();
          }
          setBaseAsset(inputAsset);
        }
        if (outputAsset) {
          if (
            outputAsset.address.toLowerCase() ===
            CONTRACTS.KAVA_ADDRESS.toLowerCase()
          ) {
            outputAsset.balance = (
              await fetchBalance({ address: address })
            ).formatted;
            outputAsset.balanceWei = (
              await fetchBalance({ address: address })
            ).value.toString();
          } else {
            outputAsset.balance = (
              await fetchBalance({
                address: address,
                token: outputAsset.address,
              })
            ).formatted;
            outputAsset.balanceWei = (
              await fetchBalance({
                address: address,
                token: outputAsset.address,
              })
            ).value.toString();
          }
          setBaseAsset(outputAsset);
        }
      }

      set({
        inputAsset,
        outputAsset,
      });
    },
    setAsset: (address, type) => {
      const { getBaseAsset } = useBaseAssetStore.getState().actions;
      const { getLocalAsset } = useLocalAssetStore.getState();
      const temp = getBaseAsset(address) ?? getLocalAsset(address);
      if (type === 'input') {
        set({
          inputAsset: temp,
        });
      } else if (type === 'output') {
        set({
          outputAsset: temp,
        });
      } else {
        console.log("Wrong type parameter: use 'input' or 'output'");
      }
    },
    setAmountRaw: (amount: string) => {
      set({ amountRaw: amount });
    },
    setSlippage: (slippage: string) => set({ slippage }),
    setTxDeadline: (txDeadline: string) => set({ txDeadline }),
    getSwapQuote: async () => {
      set({ isFetching: true });
      const swapQuote = await _getRoute();
      set({ swapQuote: swapQuote });
      set({ isFetching: false });
    },
    cleanRoute: () => set({ swapQuote: {} }),
    changeDisplayRoute: (value: boolean) => set({ displayRoute: value }),
    getFeePercentage: async () => {
      const stableFee = await readPairFactory({
        functionName: 'stableFee',
      });
      const volatileFee = await readPairFactory({
        functionName: 'volatileFee',
      });

      return {
        stableFee: Number(stableFee) / 100,
        volatileFee: Number(volatileFee) / 100,
      };
    },
    setPriceImpact: (value: string) => set({ priceImpact: value }),
  },
}));
