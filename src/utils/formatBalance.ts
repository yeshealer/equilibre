import { BigNumber, ethers } from 'ethers';

export const getBalanceInEther = (balance: BigNumber | BigInt | undefined, decimals = 18): number | string => {
  if (!balance) return 0;
  const displayBalance = ethers.utils.formatUnits(balance.toString(), decimals);
  return displayBalance;
};

export const getBalanceInWei = (balance: string, decimals = 18): BigNumber => {
  if (balance == "") return BigNumber.from(0);
  return ethers.utils.parseUnits(balance, decimals);
}
