import { factoryABI, routerABI, veTokenABI } from '@/config/company/abis';
import * as MAINNET from '@/config/company/contracts';
import * as TESTNET from '@/config/company/contractsTestnet';
import { defineConfig, loadEnv } from '@wagmi/cli';
import { actions, react } from '@wagmi/cli/plugins';

//@ts-expect-error
export default defineConfig(() => {
  let contracts = [];
  const env = loadEnv({
    envDir: process.cwd(),
    mode: process.env.NODE_ENV,
  });
  if (env.NEXT_PUBLIC_CHAINID === '2222') {
    contracts = [
      {
        abi: veTokenABI,
        address: { 2222: MAINNET.VE_TOKEN_ADDRESS },
        name: 'VeToken',
      },
      {
        abi: factoryABI,
        address: { 2222: MAINNET.FACTORY_ADDRESS },
        name: 'PairFactory',
      },
      {
        abi: routerABI,
        address: { 2222: MAINNET.ROUTER_ADDRESS },
        name: 'Router',
      },
      {
        abi: MAINNET.VE_DIST_ABI,
        address: { 2222: MAINNET.VE_DIST_ADDRESS },
        name: 'RewardsDistributor',
      },
      {
        abi: MAINNET.LIBRARY_ABI,
        address: { 2222: MAINNET.LIBRARY_ADDRESS },
        name: 'Library',
      },
      {
        abi: MAINNET.WRAPPED_EXTERNAL_BRIBE_FACTORY_ABI,
        address: { 2222: MAINNET.WRAPPED_EXTERNAL_BRIBE_FACTORY_ADDRESS },
        name: 'WrappedExternalBribeFactory',
      },
      {
        abi: MAINNET.VE_SPLITTER_ABI,
        address: { 2222: MAINNET.VE_SPLITTER_ADDRESS },
        name: 'VeSplitter',
      },
      {
        abi: MAINNET.WKAVA_ABI,
        address: { 2222: MAINNET.WKAVA_ADDRESS },
        name: 'WrappedKava',
      },
      {
        abi: MAINNET.VOTER_ABI,
        address: { 2222: MAINNET.VOTER_ADDRESS },
        name: 'Voter',
      },
      {
        abi: MAINNET.ERC20_ABI,
        name: 'Erc20',
      },
      {
        abi: MAINNET.PAIR_ABI,
        name: 'Pair',
      },
      {
        abi: MAINNET.GAUGE_ABI,
        name: 'Gauge',
      },
      {
        abi: MAINNET.BRIBE_ABI,
        name: 'Bribe',
      },
    ];
  } else {
    contracts = [
      {
        abi: TESTNET.VE_TOKEN_ABI,
        address: { 2222: TESTNET.VE_TOKEN_ADDRESS },
        name: 'VeToken',
      },
      {
        abi: TESTNET.FACTORY_ABI,
        address: TESTNET.FACTORY_ADDRESS,
        name: 'PairFactory',
      },
      {
        abi: TESTNET.ROUTER_ABI,
        address: TESTNET.ROUTER_ADDRESS,
        name: 'Router',
      },
      {
        abi: TESTNET.VE_DIST_ABI,
        address: TESTNET.VE_DIST_ADDRESS,
        name: 'RewardsDistributor',
      },
      {
        abi: TESTNET.LIBRARY_ABI,
        address: TESTNET.LIBRARY_ADDRESS,
        name: 'Library',
      },
      {
        abi: TESTNET.WRAPPED_EXTERNAL_BRIBE_FACTORY_ABI,
        address: TESTNET.WRAPPED_EXTERNAL_BRIBE_FACTORY_ADDRESS,
        name: 'WrappedExternalBribeFactory',
      },
      {
        abi: TESTNET.VE_SPLITTER_ABI,
        address: TESTNET.VE_SPLITTER_ADDRESS,
        name: 'VeSplitter',
      },
      {
        abi: TESTNET.WKAVA_ABI,
        address: TESTNET.WKAVA_ADDRESS,
        name: 'WrappedKava',
      },
      {
        abi: TESTNET.VOTER_ABI,
        address: TESTNET.VOTER_ADDRESS,
        name: 'Voter',
      },
      {
        abi: TESTNET.ERC20_ABI,
        name: 'Erc20',
      },
      {
        abi: TESTNET.PAIR_ABI,
        name: 'Pair',
      },
      {
        abi: TESTNET.GAUGE_ABI,
        name: 'Gauge',
      },
      {
        abi: TESTNET.BRIBE_ABI,
        name: 'Bribe',
      },
    ];
  }
  return {
    out: 'src/lib/equilibre.ts',
    contracts: contracts,
    plugins: [actions(), react()],
  };
});
