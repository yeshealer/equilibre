import { CONTRACTS } from '@/config/company';
import { Token, VeNFT, Vote } from '@/interfaces';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { readContract } from '@wagmi/core';
import { create } from 'zustand';

interface VeTokenState {
  veToken: Token;
  veNFTs: Array<VeNFT>;
  selectedVeNFT: VeNFT | null;
  allowedToClaimAll: boolean;
  newVotes: Array<Vote>;
  percentChangedPairAddress: string;
  actions: {
    reset: () => void;
    setVeNFTs: (x: Array<VeNFT>) => void;
    setSelectedVeNFT: (x: VeNFT) => void;
    getSelectedVeNFT: () => VeNFT | null;
    getAllowedToClaimAll: () => boolean;
    setNewVotes: (x: Array<Vote>) => void;
    setNewVote: (x: Vote) => void;
    setPercentChangedPairAddress: (addr: string) => void;
    getPercentChangedPairAddress: () => string;
  };
}

export const useVeTokenStore = create<VeTokenState>((set, get) => ({
  veToken: <Token>{
    address: CONTRACTS.VE_TOKEN_ADDRESS,
    name: CONTRACTS.VE_TOKEN_NAME,
    symbol: CONTRACTS.VE_TOKEN_SYMBOL,
    decimals: CONTRACTS.VE_TOKEN_DECIMALS,
    logoURI: CONTRACTS.VE_TOKEN_LOGO,
    stable: false,
    price: 0,
    liquidStakedAddress: '',
    balance: 0,
  },
  veNFTs: [],
  selectedVeNFT: null,
  allowedToClaimAll: false,
  newVotes: [],
  percentChangedPairAddress: '',
  actions: {
    reset: () => set({ veNFTs: new Array<VeNFT>() }),
    setVeNFTs: (x: Array<VeNFT>) => set({ veNFTs: x }),
    setSelectedVeNFT: async (x: VeNFT) => {
      const allowedAddress = await readContract({
        address: CONTRACTS.VE_TOKEN_ADDRESS,
        abi: CONTRACTS.VE_TOKEN_ABI,
        functionName: 'getApproved',
        args: [BigInt(x.id)],
      });
      set({
        selectedVeNFT: x,
        allowedToClaimAll: allowedAddress == CONTRACTS.VE_CLAIM_ALL_ADDRESS,
      });
    },
    getSelectedVeNFT: () => get().selectedVeNFT,
    getAllowedToClaimAll: () => get().allowedToClaimAll,
    setNewVotes: (x: Array<Vote>) => set({ newVotes: x }),
    setNewVote: (x: Vote) => {
      const newVotes = get().newVotes;
      const index = newVotes.findIndex(
        (y: Vote) => y.pair.address === x.pair.address
      );
      if (index === -1) {
        newVotes.push(x);
      } else {
        newVotes[index] = x;
      }
      set({ newVotes: newVotes });
    },
    setPercentChangedPairAddress: (addr: string) => {
      set({ percentChangedPairAddress: addr });
    },
    getPercentChangedPairAddress: () => {
      return get().percentChangedPairAddress;
    },
  },
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('veToken', useVeTokenStore);
}
