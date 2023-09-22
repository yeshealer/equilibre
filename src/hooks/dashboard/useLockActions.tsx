import { CONTRACTS } from "@/config/company";
import { VeNFT } from "@/interfaces";
import callContractWait from "@/lib/callContractWait";
import { useVaraTokenStore } from "@/store/varaTokenStore";
import { isPastTimestamp } from "@/utils/manageTime";
import { useState } from "react";
import { readContract } from "@wagmi/core";
import { useAccount } from "wagmi";
import generateToast from "@/components/toast/generateToast";


const useLockActions = (nft: VeNFT, getSimpleVeNfts: () => Promise<void>) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const isExpired = isPastTimestamp(Number(nft.lockEnds));

  const { address } = useAccount();
  const { fetBalanceAndAllowance } = useVaraTokenStore(state => ({
    fetBalanceAndAllowance: state.actions.fetBalanceAndAllowance,
  }));

  const onWithdraw = async () => {
    setLoading(true);

    const txObj = {
      address: CONTRACTS.VE_TOKEN_ADDRESS,
      abi: CONTRACTS.VE_TOKEN_ABI,
      functionName: 'withdraw',
      args: [nft.id],
    };
    const toastObj = {
      title: 'Withdraw',
      description: 'Vara Token withdrawed',
    };
    const result = await callContractWait(txObj, toastObj);

    setLoading(false);
    if (result) {
      await Promise.all([fetBalanceAndAllowance(address), getSimpleVeNfts()]);
    }
  };
  const onReset = async () => {
    setLoading(true);
    const voted = await readContract({
      address: CONTRACTS.VE_TOKEN_ADDRESS,
      abi: CONTRACTS.VE_TOKEN_ABI,
      functionName: 'voted',
      args: [BigInt(nft.id)],
    });

    if (!voted) {
      generateToast(
        'Reset',
        'Your veNFT is not attached to any vote',
        'info'
      );
      setLoading(false);
      return;
    }
    const txObj = {
      address: CONTRACTS.VOTER_ADDRESS,
      abi: CONTRACTS.VOTER_ABI,
      functionName: 'reset',
      args: [nft.id],
    };
    const toastObj = {
      title: 'Reset',
      description: 'VeNFT reset',
    };
    const result = await callContractWait(txObj, toastObj);

    setLoading(false);
    if (result) {
      await getSimpleVeNfts();
    }
  };


  return {
    // states
    isLoading,
    isExpired,

    // advanced actions
    onWithdraw,
    onReset
  };
};

export default useLockActions;
