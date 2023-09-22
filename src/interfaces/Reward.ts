import { RewardInfo } from './RewardInfo';
import { VeNFT } from './VeNFT';

export interface Reward {
  veNft: VeNFT;
  info: RewardInfo[];
  totalEarned: number;
  varaEarned: number,
  totalEarnedValue: number;
  rewardType: 'Rebase' | 'Fee' | 'Bribe' | 'Emission';
  showInfo?: RewardInfo[];
}