import { Vote } from './Vote';

export interface VeNFT {
  id: number;
  lockEnds: bigint;
  lockAmount: number;
  lockValue: number;
  votes: Array<Vote>;
}
export interface ILockDuration {
  label: string;
  value: number;
}

export interface IInputPercentage {
  label: string;
  value: number;
}