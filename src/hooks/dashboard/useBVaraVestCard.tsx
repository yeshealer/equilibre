
import { CONTRACTS } from '@/config/company';
import { usebVaraTokenStore } from '@/store/bVaraTokenStore';
import { useState } from 'react';
import { getBalanceInEther, getBalanceInWei } from '@/utils/formatBalance';
import { Token } from '@/interfaces';
import { useRouter } from 'next/router';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import callContractWait from '@/lib/callContractWait';
import { useVeBVaraStore } from '@/store/veBVaraStore';
import { getAccount } from '@wagmi/core';

const useBVaraVestCard = () => {
  const router = useRouter();

  const [isVestLoading, setVestLoading] = useState<boolean>(false);
  const [lockAmount, setLockAmount] = useState<string>('');
  const { fetVeVaras } = useVeBVaraStore(state => state.actions);

  const { balance, allowance, fetAllData } = usebVaraTokenStore(state => ({
    balance: state.balance,
    allowance: state.veVaraAllowance,
    fetAllData: state.actions.fetAllData
  }));
  const { getBaseAsset } = useBaseAssetStore(state => state.actions);

  const balanceInEther = getBalanceInEther(balance, CONTRACTS.BVARA_TOKEN_DECIMALS);
  const token = {
    address: CONTRACTS.BVARA_TOKEN_ADDRESS,
    stable: false,
    price: getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS)?.price,
    name: CONTRACTS.BVARA_TOKEN_NAME,
    symbol: CONTRACTS.BVARA_TOKEN_SYMBOL,
    decimals: CONTRACTS.BVARA_TOKEN_DECIMALS,
    logoURI: CONTRACTS.BVARA_TOKEN_LOGO,
    liquidStakedAddress: "",
    balance: balanceInEther,
  } as Token;

  const onStartVest = async () => {
    if (Number(lockAmount) == 0) return;
    setVestLoading(true);
    const txObj = {
      address: CONTRACTS.BVARA_TOKEN_ADDRESS,
      abi: CONTRACTS.BVARA_TOKEN_ABI,
      functionName: 'vest',
      args: [getBalanceInWei(lockAmount.toString(), CONTRACTS.BVARA_TOKEN_DECIMALS)],
    };
    const toastObj = {
      title: 'Start bVara Vest',
      description: `New Vest is started with ${lockAmount} bVara`,
    };
    const result = await callContractWait(txObj, toastObj);

    setVestLoading(false);
    setLockAmount('');
    if (result) {
      const { address } = getAccount();
      if (address) {
        await fetVeVaras(address);
        await fetAllData(address);
      }
    }
  }

  return {
    token,
    lockAmount,
    router,
    isVestLoading,

    setLockAmount,
    onStartVest,
  };
};

export default useBVaraVestCard;
