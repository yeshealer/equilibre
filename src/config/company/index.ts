import * as mainnet from './contracts';
import * as testnet from './contractsTestnet';
import { chains } from '../wagmi';

export const CONTRACTS = chains[0].id === 2222 ? mainnet : testnet;
