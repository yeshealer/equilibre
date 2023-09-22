import { useState, useEffect } from 'react';
import moment from 'moment';
import { useAccount } from 'wagmi';

import generateToast from '@/components/toast/generateToast';
import { ILockDuration, IInputPercentage, Token } from '@/interfaces';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useVaraTokenStore } from '@/store/varaTokenStore';
import { getBalanceInEther, getBalanceInWei } from '@/utils/formatBalance';
import { CONTRACTS } from '@/config/company';
import callContractWait from '@/lib/callContractWait';
import { CONSTANTS_VEVARA } from '@/config/constants';

const { LOCK_DURATIONS } = CONSTANTS_VEVARA;

const useVeVaraMint = () => {
  const [lockAmount, setLockAmount] = useState<string>('');
  const [unlockDate, setUnlockDate] = useState<string>('');
  const [varaPrice, setVaraPrice] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>('');

  const { address } = useAccount();
  const { baseAssets, getBaseAsset } = useBaseAssetStore(state => ({
    baseAssets: state.baseAssets,
    getBaseAsset: state.actions.getBaseAsset,
  }));
  const {
    balance: userVaraBalanceInWei,
    allowance,
    fetBalanceAndAllowance,
  } = useVaraTokenStore(state => ({
    balance: state.balance,
    allowance: state.veVaraAllowance,
    fetBalanceAndAllowance: state.actions.fetBalanceAndAllowance,
  }));

  const userVaraBalance = getBalanceInEther(
    userVaraBalanceInWei,
    CONTRACTS.GOV_TOKEN_DECIMALS
  );
  const lockDuration = moment.duration(moment(unlockDate).diff(moment()));
  const lockDays = Math.floor(lockDuration.asDays());
  const votingPower = (Number(lockAmount) * (lockDays + 1)) / (4 * 365);
  const lockAmountInWei = getBalanceInWei(lockAmount || '0');

  const token = {
    ...getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS),
    balance: userVaraBalance,
  } as Token;

  useEffect(() => {
    onSelectLockDuration(LOCK_DURATIONS[3]);
  }, []);

  useEffect(() => {
    const varaAsset: Token | undefined = getBaseAsset(
      CONTRACTS.GOV_TOKEN_ADDRESS
    );
    if (varaAsset) {
      setVaraPrice(Number(varaAsset?.price) || 0);
    }
  }, [baseAssets.length]);

  useEffect(() => {
    setAmountError(
      lockAmountInWei.gt(userVaraBalanceInWei)
        ? 'Greater than your available balance'
        : ''
    );
  }, [lockAmount]);

  // select lock duration
  const onSelectLockDuration = (newLockDuration: ILockDuration) => {
    const newUnlockDate = moment()
      .add(newLockDuration.value, 'days')
      .format('YYYY-MM-DD');

    if (newUnlockDate !== unlockDate) {
      setUnlockDate(newUnlockDate);
    }
  };

  // change lock amount
  const onChangeLockAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLockAmount = e.target.value;
    if (Number(newLockAmount) < 0) return;

    setLockAmount(newLockAmount);
  };

  // change unlock date
  const onChangeUnLockDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (new Date(selectedDate).valueOf() < new Date().valueOf()) {
      generateToast(
        'Date Invalid',
        `It's not allowed to select previous date.`,
        'error'
      );
      return;
    }

    setUnlockDate(selectedDate);
  };

  // lock vara to get veVARA
  const onLockVara = async () => {
    if (!!amountError) return;
    setLoading(true);
    let isAllowanceLtAmount: undefined | boolean =
      allowance.lt(lockAmountInWei);
    let result: boolean | undefined = false;
    if (isAllowanceLtAmount) {
      // 1. implement approve logic
      const txObj = {
        address: CONTRACTS.GOV_TOKEN_ADDRESS,
        abi: CONTRACTS.GOV_TOKEN_ABI,
        functionName: 'approve',
        args: [CONTRACTS.VE_TOKEN_ADDRESS, lockAmountInWei],
      };
      const toastObj = {
        title: 'Approve',
        description: 'Vara Token approved',
      };
      result = await callContractWait(txObj, toastObj);
      if (result) isAllowanceLtAmount = false;
    }
    // 2. implement 'create_lock' logic
    if (!isAllowanceLtAmount) {
      const txObj = {
        address: CONTRACTS.VE_TOKEN_ADDRESS,
        abi: CONTRACTS.VE_TOKEN_ABI,
        functionName: 'create_lock',
        args: [lockAmountInWei, Math.floor(lockDuration.asSeconds())],
      };
      const toastObj = {
        title: 'Mint VeVara',
        description: 'New VeVara minted',
      };
      result = await callContractWait(txObj, toastObj);
    }

    setLoading(false);
    if (result) {
      setLockAmount('');
      await fetBalanceAndAllowance(address);
    }
  };

  return {
    // states
    lockAmount,
    unlockDate,
    varaPrice,
    isLoading,
    amountError,
    token,

    userVaraBalance,
    lockDays,
    votingPower,
    lockAmountInWei,
    userVaraBalanceInWei,
    allowance,

    // advanced actions
    onSelectLockDuration,
    setLockAmount,
    setUnlockDate,
    onLockVara,
  };
};

export default useVeVaraMint;
