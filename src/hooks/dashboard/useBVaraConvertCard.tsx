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
import useSimpleVeNFTs from './useSimpleVeNFTs';

const useBVaraConvertCard = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [lockAmount, setLockAmount] = useState<string>('');
  const { getSimpleVeNfts } = useSimpleVeNFTs();

  const { balance, allowance, fetAllData } = usebVaraTokenStore(state => ({
    balance: state.balance,
    allowance: state.veVaraAllowance,
    fetAllData: state.actions.fetAllData,
  }));
  const { getBaseAsset } = useBaseAssetStore(state => state.actions);

  const balanceInEther = getBalanceInEther(
    balance,
    CONTRACTS.BVARA_TOKEN_DECIMALS
  );
  const token = {
    address: CONTRACTS.BVARA_TOKEN_ADDRESS,
    stable: false,
    price: getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS)?.price,
    name: CONTRACTS.BVARA_TOKEN_NAME,
    symbol: CONTRACTS.BVARA_TOKEN_SYMBOL,
    decimals: CONTRACTS.BVARA_TOKEN_DECIMALS,
    logoURI: CONTRACTS.BVARA_TOKEN_LOGO,
    liquidStakedAddress: '',
    balance: balanceInEther,
  } as Token;

  const onConvertToVe = async () => {
    setLoading(true);
    const txObj = {
      address: CONTRACTS.BVARA_TOKEN_ADDRESS,
      abi: CONTRACTS.BVARA_TOKEN_ABI,
      functionName: 'convertToVe',
      args: [
        getBalanceInWei(lockAmount.toString(), CONTRACTS.BVARA_TOKEN_DECIMALS),
      ],
    };
    const toastObj = {
      title: 'Convert bVara to veVARA',
      description: `${lockAmount} bVara is converted to veVARA with 4 years of lock period`,
    };
    const result = await callContractWait(txObj, toastObj);

    setLoading(false);
    setLockAmount('');
    if (result) {
      const { address } = getAccount();
      if (address) {
        await Promise.all([fetAllData(address), getSimpleVeNfts()]);
      }
    }
  };

  return {
    token,
    lockAmount,
    isLoading,

    setLockAmount,
    onConvertToVe,
  };
};

export default useBVaraConvertCard;
