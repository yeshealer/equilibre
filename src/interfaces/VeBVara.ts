import { Vote } from './Vote';

export interface VeBVara {
  vestID: number;
  lockedBVaraAmount: number;
  startTimestamp: number;
  maxEndTimestamp: number;
  exitIn: number;
}