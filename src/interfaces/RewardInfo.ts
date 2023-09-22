import { Pair } from './Pair';
import { Token } from './Token';

export interface RewardInfo {
  rewardToken: Token;
  earned: number;
  earnedValue: number;
  pair?: Pair;
  userGaugeBalance?: number;
}