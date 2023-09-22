import { CONTRACTS } from "@/config/company";
import { Pair, Reward } from "@/interfaces";

export function getPairAddresses(reward: Reward) {
  const tempPairs: Pair[] = reward.info.map((item) => {
    return (item.pair as Pair)
  });
  let pairs: Pair[] = [];
  tempPairs.map(tempPair => {
    if (pairs.findIndex(pair => pair == tempPair) == -1)
      pairs.push(tempPair);
  })
  return pairs;
}

export function getBribesArray(pairs: Pair[], fromLockCall: boolean) {
  let sendGauges: `0x${string}`[] = [];
  let sendTokens: `0x${string}`[][] = [];
  pairs.map(pair => {
    sendGauges.push(pair.gauge!.wrappedBribeAddress as `0x${string}`);
    sendTokens.push(
      pair.gauge!.bribes!.map(bribe => bribe.token.address).filter(address => (!fromLockCall || address == CONTRACTS.GOV_TOKEN_ADDRESS))
    );
  });

  return { sendGauges: sendGauges, sendTokens: sendTokens };
}

export function getFeesArray(pairs: Pair[], fromLockCall: boolean) {
  let sendGauges: `0x${string}`[] = [];
  let sendTokens: `0x${string}`[][] = [];
  pairs.map(pair => {
    sendGauges.push(pair.gauge!.feesAddress as `0x${string}`);
    sendTokens.push(pair.gauge!.feesEarned!.filter(address => (!fromLockCall || address == CONTRACTS.GOV_TOKEN_ADDRESS)))
  });

  return { sendGauges: sendGauges, sendTokens: sendTokens };
}

export function getEmissionsArray(pairs: Pair[]) {
  let sendGauges: `0x${string}`[] = [];
  let sendTokens: `0x${string}`[][] = [];
  pairs.map(pair => {
    sendGauges.push(pair.gauge!.address as `0x${string}`);
    sendTokens.push([CONTRACTS.GOV_TOKEN_ADDRESS])
  });

  return { sendGauges: sendGauges, sendTokens: sendTokens };
}