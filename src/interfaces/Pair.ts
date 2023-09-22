import { Gauge } from './Gauge';
import { Token } from './Token';
import { Vote } from './Vote';

export interface Pair {
  address: `0x${string}`;
  tvl: number;
  apr: number;
  symbol: string;
  decimals: number;
  stable: boolean;
  totalSupply: number;
  reserve0: number;
  reserve1: number;
  token0: Token;
  token1: Token;
  gauge?: Gauge;
  // vote?: Vote;
  balanceStaked: number | string;
  balanceStakedWei: bigint;
  balanceStakedUSD: number | string;
  balanceDeposited: number | string;
  balanceDepositedWei: bigint;
  balanceDepositedUSD: number | string;
}
