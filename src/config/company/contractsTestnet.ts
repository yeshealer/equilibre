import {
  bribeABI,
  erc20ABI,
  factoryABI,
  gaugeABI,
  minterABI,
  pairABI,
  routerABI,
  solidlyLibraryABI,
  splitterABI,
  tokenABI,
  veDistABI,
  veTokenABI,
  voterABI,
  wftmABI,
  wrappedBribeFactoryABI,
  veClaimAllFeesABI,
  bVaraABI
} from './abis';

export const GOV_TOKEN_ADDRESS = '0x38d7Dc5790c007D784C267f4a58561Caf0936C4e';
export const GOV_TOKEN_NAME = 'Vara';
export const GOV_TOKEN_SYMBOL = 'VARA';
export const GOV_TOKEN_DECIMALS = 18;
export const GOV_TOKEN_LOGO = 'https://github.com/equilibre-finance.png';
export const GOV_TOKEN_ABI = tokenABI;

//VotingEscrow
export const VE_TOKEN_ADDRESS = '0x9e5EF504ee5c6B0D6735771845F3850989bad369';
export const VE_TOKEN_NAME = 'veVARA';
export const VE_TOKEN_SYMBOL = 'veVARA';
export const VE_TOKEN_DECIMALS = 18;
export const VE_TOKEN_LOGO = 'https://github.com/equilibre-finance.png';
export const VE_TOKEN_ABI = veTokenABI;

//bVara
export const BVARA_TOKEN_ADDRESS = '0xEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const BVARA_TOKEN_NAME = 'bVara Token';
export const BVARA_TOKEN_SYMBOL = 'bVARA';
export const BVARA_TOKEN_DECIMALS = 18;
export const BVARA_TOKEN_LOGO = 'https://cdn.discordapp.com/attachments/1019726901008412712/1147231926474772621/bVARA.png';
export const BVARA_TOKEN_ABI = bVaraABI;

export const WKAVA_ADDRESS = '0x6c2a54580666d69cf904a82d8180f198c03ece67';
export const WKAVA_NAME = 'Wrapped Kava';
export const WKAVA_SYMBOL = 'wKAVA';
export const WKAVA_DECIMALS = 18;
export const WKAVA_ABI = wftmABI;
export const WKAVA_LOGO =
  'https://assets.coingecko.com/coins/images/9761/large/kava.png';

export const KAVA_ADDRESS = 'KAVA';
export const KAVA_NAME = 'Kava';
export const KAVA_SYMBOL = 'KAVA';
export const KAVA_DECIMALS = 18;
export const KAVA_LOGO =
  'https://assets.coingecko.com/coins/images/9761/large/kava.png';

// PairFactory
export const FACTORY_ADDRESS = '0x3ca3dA6092C2dd7347638690423f867b8aED1e65';
export const FACTORY_ABI = factoryABI;
// Classic Router
export const ROUTER_ADDRESS = '0x9607aC5221B91105C29FAff5E282B8Af081B0063';
export const ROUTER_ABI = routerABI;
//RewardsDistributor
export const VE_DIST_ADDRESS = '0x222EB6337820Dd8AdbFccad6d50B4d9a9ee415c4';
export const VE_DIST_ABI = veDistABI;

export const VOTER_ADDRESS = '0xa8B1E1B4333202355785C90fB434964046ef2E64';
export const VOTER_ABI = voterABI;

export const LIBRARY_ADDRESS = '0x386AEA12c0A14107046eEe3aFDA495e51A5d7D1b';
export const LIBRARY_ABI = solidlyLibraryABI;

export const WRAPPED_EXTERNAL_BRIBE_FACTORY_ADDRESS =
  '0x3e30362B5A56891991a227e18b18DDb8F326d6b5';
export const VE_SPLITTER_ADDRESS = '0xd5798208171A23AA2421f6d2E85ADc5a4fFBEF7e';

export const MINTER_ADDRESS = '';
export const MINTER_ABI = minterABI;

export const ERC20_ABI = erc20ABI;
export const PAIR_ABI = pairABI;
export const GAUGE_ABI = gaugeABI;
export const BRIBE_ABI = bribeABI;
export const TOKEN_ABI = tokenABI;
export const WRAPPED_EXTERNAL_BRIBE_FACTORY_ABI = wrappedBribeFactoryABI;
export const VE_SPLITTER_ABI = splitterABI;

export const MULTICALL_ADDRESS = '0x1Af096bFA8e495c2F5Eeb56141E7E2420066Cf78';
export const OPENOCEAN_ADDRESS = '0x6352a56caadC4F1E25CD6c75970Fa768A3304e64';

export const VE_CLAIM_ALL_ADDRESS = '0x9f80f639Ff87BE7299Eec54a08dB20dB3b3a4171';  // not exactly
export const VE_CLAIM_ALL_ABI = veClaimAllFeesABI;