import { Pair, Token } from '@/interfaces';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { fetchBalance } from 'wagmi/dist/actions';
import { create } from 'zustand';

interface AccountState {
  assets?: Token[];
  vestNFTs?: any[];
  pairs?: Pair[];
}

export const useAccountStore = create<AccountState>(set => ({
  assets: [],
  vestNFTs: [],
  pairs: [],
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('account', useAccountStore);
}
