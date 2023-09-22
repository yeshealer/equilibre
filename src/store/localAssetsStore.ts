import { Token } from '@/interfaces';
import { fetchBalance, fetchToken, getAccount } from '@wagmi/core';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware';

interface LocalAssetState {
  localAssets: Token[];
  getLocalAsset: (str: string) => Token | undefined;
  saveLocalAsset: (tokenAddress: `0x${string}`, userAddress: `0x${string}`) => void;
  delLocalAsset: (address: `0x${string}`) => void;
}

export const useLocalAssetStore = create<LocalAssetState>()(
  persist(
    devtools(
      (set, get) => ({
        localAssets: [],

        getLocalAsset: (str: string) => {
          const { localAssets } = get();
          return localAssets.find(
            (token: Token) =>
              token.address.toLowerCase() === str.toLowerCase() ||
              token.symbol.toLowerCase() === str.toLowerCase() ||
              token.name.toLowerCase() === str.toLowerCase()
          )
        },
        saveLocalAsset: async (tokenAddress: `0x${string}`, userAddress: `0x${string}`) => {
          try {
            const { localAssets } = get();
            const data = await Promise.all([
              fetchToken({
                address: tokenAddress,
              }),
              fetchBalance({
                address: userAddress!,
                token: tokenAddress
              })
            ])
            const token = {
              price: -1,
              stable: false,
              address: tokenAddress,
              name: data[0].name,
              symbol: data[0].symbol,
              decimals: data[0].decimals,
              liquidStakedAddress: "",
              balance: Number(data[1].value)
            } as Token;
            set({ localAssets: localAssets.concat(token) })
          } catch (e) {
            console.log(e);
          }
        },
        delLocalAsset: (address: `0x${string}`) => {
          const { localAssets } = get();
          const index = localAssets.findIndex((asset) => address.toLowerCase() == asset.address.toLowerCase());
          if (index == -1) return;
          let tempAssets = Array<Token>().concat(localAssets);
          tempAssets.splice(index, 1);
          set({ localAssets: tempAssets });
        }
      })
    ),
    {
      name: 'local-token-list',
    }
  )
);

// if (process.env.NODE_ENV === 'development') {
//   mountStoreDevtool('BaseAssets', useBaseAssetStore);
// }
