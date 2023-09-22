import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { Chain, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { http } from 'viem';

//* Chain definitions
const kavaMainnet = {
  id: 2222,
  name: 'Kava EVM Mainnet',
  network: 'KAVA',
  nativeCurrency: {
    decimals: 18,
    name: 'Kava',
    symbol: 'KAVA',
  },
  rpcUrls: {
    public: {
      http: ['https://kava-mainnet.gateway.pokt.network/v1/lb/ece57ea3/'],
    },
    default: {
      http: ['https://kava-mainnet.gateway.pokt.network/v1/lb/ece57ea3/'],
    },
  },
  blockExplorers: {
    blockscout: {
      name: 'Kava Explorer',
      url: 'https://explorer.kava.io',
    },
    mintscan: { name: 'Mintscan', url: 'https://www.mintscan.io/kava' },
    default: { name: 'Kava Explorer', url: 'https://explorer.kava.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 3_661_165,
    },
  },
} as const satisfies Chain;

const kavaTestnet = {
  id: 2221,
  name: 'Kava EVM Testnet',
  network: 'KAVA',
  nativeCurrency: {
    decimals: 18,
    name: 'TKava',
    symbol: 'TKAVA',
  },
  rpcUrls: {
    public: { http: ['https://evm.testnet.kava.io'] },
    default: {
      http: ['https://evm.testnet.kava.io'],
    },
  },
  blockExplorers: {
    blockscout: {
      name: 'Kava Testnet Explorer',
      url: 'https://explorer.testnet.kava.io',
    },
    default: {
      name: 'Kava Testnet Explorer',
      url: 'https://explorer.testnet.kava.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0x1Af096bFA8e495c2F5Eeb56141E7E2420066Cf78',
      blockCreated: 2_325_404,
    },
  },
  testnet: true,
} as const satisfies Chain;

//* Rainbow wallet configuration

//* Wagmi + Rainbow wallet configuration
export const { chains, publicClient } = configureChains(
  [kavaMainnet],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://evm2.kava.io',
      }),
    }),
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://evm.kava.io',
      }),
    }),
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://evm.data.equilibre.kava.io',
      }),
    }),
  ],

  { stallTimeout: 4_000 }
);

const { connectors } = getDefaultWallets({
  appName: 'Équilibre ve(3,3)',
  chains,
});

export const configuration = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  logger: {
    warn: null,
  },
});
