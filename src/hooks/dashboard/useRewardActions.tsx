import generateToast from '@/components/toast/generateToast';
import { CONTRACTS } from '@/config/company';
import { Pair, Reward, RewardInfo, VeNFT } from '@/interfaces';
import callContractWait from '@/lib/callContractWait';
import { useVeTokenStore } from '@/store/veTokenStore';
import { getBalanceInEther } from '@/utils/formatBalance';
import { displayNumber } from '@/utils/formatNumbers';
import {
  getBribesArray,
  getEmissionsArray,
  getFeesArray,
  getPairAddresses,
} from '@/utils/manageRewards';
import { getAccount } from '@wagmi/core';

const useRewardActions = () => {
  const { address } = getAccount();
  const getAllowedToClaimAll = useVeTokenStore(
    state => state.actions.getAllowedToClaimAll
  );
  const allowedToClaimAll = getAllowedToClaimAll();

  const claimRebase = async (reward: Reward) => {
    if (reward.totalEarned == 0) return false;
    const txObj = {
      address: CONTRACTS.VE_DIST_ADDRESS,
      abi: CONTRACTS.VE_DIST_ABI,
      functionName: 'claim',
      args: [reward.veNft.id],
    };
    const toastObj = {
      title: 'Claimed Rebase Rewards',
      description: `${displayNumber(
        getBalanceInEther(
          BigInt(reward.varaEarned),
          CONTRACTS.GOV_TOKEN_DECIMALS
        )
      )} Vara calimed as Distribution for veNFT ID #${reward.veNft.id} `,
    };

    const result = await callContractWait(txObj, toastObj);
    return result;
  };

  const claimEmissions = async (reward: Reward) => {
    if (reward.totalEarned == 0) return false;
    const pairs: Pair[] = reward.info.map(item => {
      return item.pair as Pair;
    });

    if (pairs.length == 0) return false;

    const { sendGauges, sendTokens } = getEmissionsArray(
      pairs.filter(pair => !!pair.gauge?.address)
    );

    const toastObj = {
      title: `Claimed Emissions`,
      description: `${displayNumber(
        getBalanceInEther(
          BigInt(reward.totalEarned),
          CONTRACTS.GOV_TOKEN_DECIMALS
        )
      )} Vara calimed for ${reward.info.length} pairs`,
    };
    const result = await callContractWait(
      {
        address: CONTRACTS.VOTER_ADDRESS,
        abi: CONTRACTS.VOTER_ABI,
        functionName: 'claimRewards',
        args: [sendGauges, sendTokens],
      },
      toastObj
    );
    return result;
  };

  const claimFees = async (reward: Reward, fromLockCall = false) => {
    if (reward.totalEarned == 0) return false;

    const pairs = getPairAddresses(reward);

    const { sendGauges, sendTokens } = getFeesArray(pairs, fromLockCall);

    const toastObj = {
      title: `Claim Fees`,
      description: !fromLockCall
        ? `Claim Fees for veNFT ID #${reward.veNft.id}`
        : `${displayNumber(
            getBalanceInEther(
              BigInt(reward.varaEarned),
              CONTRACTS.GOV_TOKEN_DECIMALS
            )
          )} Vara calimed as Fees for veNFT ID #${reward.veNft.id}`,
    };
    const result = await callContractWait(
      {
        address: CONTRACTS.VOTER_ADDRESS,
        abi: CONTRACTS.VOTER_ABI,
        functionName: 'claimFees',
        args: [sendGauges, sendTokens, reward.veNft.id],
      },
      toastObj
    );
    return result;
  };

  const claimBribes = async (reward: Reward, fromLockCall = false) => {
    if (reward.totalEarned == 0) return false;

    const pairs = getPairAddresses(reward);

    const { sendGauges, sendTokens } = getBribesArray(pairs, fromLockCall);

    const toastObj = {
      title: `Claimed Bribes`,
      description: !fromLockCall
        ? `Claimed Bribes for veNFT ID #${reward.veNft.id}`
        : `${displayNumber(
            getBalanceInEther(
              BigInt(reward.varaEarned),
              CONTRACTS.GOV_TOKEN_DECIMALS
            )
          )} Vara calimed as Bribes for veNFT ID #${reward.veNft.id}`,
    };
    const result = await callContractWait(
      {
        address: CONTRACTS.VOTER_ADDRESS,
        abi: CONTRACTS.VOTER_ABI,
        functionName: 'claimBribes',
        args: [sendGauges, sendTokens, reward.veNft.id],
      },
      toastObj
    );
    return result;
  };

  const claimAllRewards = async (
    nftId: number | undefined,
    emissions: Reward | undefined,
    fees: Reward | undefined,
    bribes: Reward | undefined,
    rebase: Reward | undefined,
    fromLockCall: boolean = false
  ) => {
    let result: undefined | boolean = allowedToClaimAll;
    if (!allowedToClaimAll) {
      const txObj = {
        address: CONTRACTS.VE_TOKEN_ADDRESS,
        abi: CONTRACTS.VE_TOKEN_ABI,
        functionName: 'approve',
        args: [CONTRACTS.VE_CLAIM_ALL_ADDRESS, nftId],
      };
      const toastObj = {
        title: 'Approve to claim',
        description: `veNFT ID #${nftId} approved to claim all`,
      };
      result = await callContractWait(txObj, toastObj);
    }
    let sendGauges: `0x${string}`[] = [];
    let sendTokens: `0x${string}`[][] = [];
    if (fees) {
      const tPairs = getPairAddresses(fees);
      const { sendGauges: tGauges, sendTokens: tTokens } = getFeesArray(
        tPairs,
        fromLockCall
      );
      sendGauges = sendGauges.concat(tGauges);
      sendTokens = sendTokens.concat(tTokens);
    }
    if (bribes) {
      const tPairs = getPairAddresses(bribes);
      const { sendGauges: tGauges, sendTokens: tTokens } = getBribesArray(
        tPairs,
        fromLockCall
      );
      sendGauges = sendGauges.concat(tGauges);
      sendTokens = sendTokens.concat(tTokens);
    }
    let sendGaugesEmissions: `0x${string}`[] = [];
    let sendTokensEmissions: `0x${string}`[][] = [];
    if (emissions) {
      const tPairs = emissions.info.map(item => {
        return item.pair as Pair;
      });
      const { sendGauges: tGauges, sendTokens: tTokens } = getEmissionsArray(
        tPairs.filter(pair => !!pair.gauge?.address)
      );
      sendGaugesEmissions = sendGaugesEmissions.concat(tGauges);
      sendTokensEmissions = sendTokensEmissions.concat(tTokens);
    }
    const txObj1 = {
      address: CONTRACTS.VE_CLAIM_ALL_ADDRESS,
      abi: CONTRACTS.VE_CLAIM_ALL_ABI,
      functionName: 'claimFees',
      args: [sendGauges, sendTokens, nftId],
    };
    const toastObj1 = {
      title: 'Fees and Bribes claimed',
      description: `All Fees and Bribes for veNFT ID #${fees?.veNft.id} claimed`,
    };
    const txObj2 = {
      address: CONTRACTS.VE_CLAIM_ALL_ADDRESS,
      abi: CONTRACTS.VE_CLAIM_ALL_ABI,
      functionName: 'claimRewards',
      args: [address],
    };
    const toastObj2 = {
      title: 'Rebase reward claimed',
      description: `Rebase reward claimed for veNFT ID #${fees?.veNft.id} claimed`,
    };
    const txObj3 = {
      address: CONTRACTS.VOTER_ADDRESS,
      abi: CONTRACTS.VOTER_ABI,
      functionName: 'claimRewards',
      args: [sendGaugesEmissions, sendTokensEmissions],
    };
    const toastObj3 = {
      title: `Claimed Emissions`,
      description: `${displayNumber(
        getBalanceInEther(
          BigInt(emissions?.totalEarned!),
          CONTRACTS.GOV_TOKEN_DECIMALS
        )
      )} Vara calimed for ${emissions?.info.length} pairs`,
    };

    const resultArray = await Promise.all([
      sendGauges.length && result ? callContractWait(txObj1, toastObj1) : false, /// For bribes and fees
      rebase?.totalEarned ? callContractWait(txObj2, toastObj2) : false, /// For rebase
      sendGaugesEmissions.length ? callContractWait(txObj3, toastObj3) : false, /// For emissions
    ]);
    const varaEarned =
      Number(resultArray[0]) *
        ((fees?.varaEarned ?? 0) + (bribes?.varaEarned ?? 0)) +
      Number(resultArray[1]) * (rebase?.varaEarned ?? 0) +
      Number(resultArray[2]) * (emissions?.varaEarned ?? 0);
    result = resultArray.reduce((prev, cur) => prev || cur);
    return { result: result, varaEarned: varaEarned };
  };

  const addVaraToLock = async (lockAmount: number, nftId: number) => {
    // 1. implement approve logic

    const txObj = {
      address: CONTRACTS.GOV_TOKEN_ADDRESS,
      abi: CONTRACTS.GOV_TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS.VE_TOKEN_ADDRESS, lockAmount],
    };
    const toastObj = {
      title: 'Approve',
      description: `${displayNumber(
        getBalanceInEther(BigInt(lockAmount))
      )} Vara Token approved`,
    };
    let result = await callContractWait(txObj, toastObj);

    // 2. implement 'increase_amount' logic
    if (result) {
      const txObj = {
        address: CONTRACTS.VE_TOKEN_ADDRESS,
        abi: CONTRACTS.VE_TOKEN_ABI,
        functionName: 'increase_amount',
        args: [nftId, lockAmount],
      };
      const toastObj = {
        title: 'Vara Added',
        description: `${displayNumber(
          Number(getBalanceInEther(BigInt(lockAmount))).toFixed(
            CONTRACTS.GOV_TOKEN_DECIMALS
          )
        )} Vara added to ID #${nftId}`,
      };
      result = await callContractWait(txObj, toastObj);
    }
    return result;
  };
  const getVaraReward = (reward: Reward | undefined) => {
    if (!reward) return undefined;
    let lockAmount = 0;
    const info = reward.info
      .map(item => {
        if (
          item.rewardToken.address ==
          CONTRACTS.GOV_TOKEN_ADDRESS.toLocaleLowerCase()
        ) {
          lockAmount += item.earned;
          return item;
        }
      })
      .filter(item => item != undefined) as RewardInfo[];
    let temp: Reward;
    temp = Object.assign({}, reward);
    temp.info = info;
    temp.totalEarned = lockAmount;
    return temp;
  };
  const claimAndAddVaraToLock = async (reward: Reward) => {
    const temp = getVaraReward(reward);
    const lockAmount = temp!.totalEarned;
    let result;
    switch (temp!.rewardType) {
      case 'Bribe':
        result = await claimBribes(temp!);
        break;
      case 'Emission':
        result = await claimEmissions(temp!);
        break;
      case 'Fee':
        result = await claimFees(temp!);
        break;
      case 'Rebase':
        result = await claimRebase(temp!);
        break;
    }
    if (result) {
      await addVaraToLock(lockAmount, temp!.veNft.id);
    }
    return result;
  };
  const claimAndAddVaraToLockForAll = async (
    nftId: number,
    emissions: Reward | undefined,
    fees: Reward | undefined,
    bribes: Reward | undefined,
    rebase: Reward | undefined
  ) => {
    const { result, varaEarned: totalLockAmount } = await claimAllRewards(
      nftId,
      emissions,
      fees,
      bribes,
      rebase,
      true
    );

    if (result) {
      generateToast(
        'Vara Reward Claimed',
        `${displayNumber(
          getBalanceInEther(
            BigInt(totalLockAmount),
            CONTRACTS.GOV_TOKEN_DECIMALS
          )
        )} Vara claimed to lock`,
        'info'
      );
      await Promise.all([
        addVaraToLock(totalLockAmount, nftId),
        emissions ? claimEmissions(emissions) : false, /// For emissions
      ]);
    }
    return result;
  };
  return {
    claimAllRewards,
    claimRebase,
    claimEmissions,
    claimFees,
    claimBribes,
    claimAndAddVaraToLock,
    claimAndAddVaraToLockForAll,
  };
};

export default useRewardActions;
