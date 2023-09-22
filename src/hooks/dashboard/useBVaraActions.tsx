import { CONTRACTS } from "@/config/company";
import { VeNFT } from "@/interfaces";
import callContractWait from "@/lib/callContractWait";
import { useState } from "react";
import { readContract } from "@wagmi/core";
import generateToast from "@/components/toast/generateToast";
import { usebVaraTokenStore } from "@/store/bVaraTokenStore";
import { useVeBVaraStore } from "@/store/veBVaraStore";
import { getAccount } from "@wagmi/core";
import { useVaraTokenStore } from "@/store/varaTokenStore";


const useBVaraActions = () => {
  const [isRedeemLoading, setRedeemLoading] = useState<boolean>(false);
  const [isCancelLoading, setCancelLoading] = useState<boolean>(false);
  const { address } = getAccount();
  const fetBVaraAllData = usebVaraTokenStore(state => state.actions.fetAllData);
  const fetVeVaras = useVeBVaraStore(state => state.actions.fetVeVaras);
  const fetVaraBalanceAndAllowance = useVaraTokenStore(state => state.actions.fetBalanceAndAllowance);

  const onRedeem = async (vestID: number) => {
    setRedeemLoading(true);

    const txObj = {
      address: CONTRACTS.BVARA_TOKEN_ADDRESS,
      abi: CONTRACTS.BVARA_TOKEN_ABI,
      functionName: 'redeem',
      args: [vestID],
    };
    const toastObj = {
      title: 'Redemption',
      description: `bVara Vest Token #${vestID} have been redeemed`,
    };
    const result = await callContractWait(txObj, toastObj);

    if (result) {
      await Promise.all([fetVeVaras(address), fetVaraBalanceAndAllowance(address)]);
    }
    setRedeemLoading(false);
  };
  const onCancel = async (vestID: number) => {
    setCancelLoading(true);
    const txObj = {
      address: CONTRACTS.BVARA_TOKEN_ADDRESS,
      abi: CONTRACTS.BVARA_TOKEN_ABI,
      functionName: 'cancelVest',
      args: [vestID],
    };
    const toastObj = {
      title: 'Cancel',
      description: `bVara Vest Token #${vestID} have been cancelled`,
    };
    const result = await callContractWait(txObj, toastObj);

    if (result) {
      await Promise.all([fetVeVaras(address), fetBVaraAllData(address)]);
    }
    setCancelLoading(false);
  };


  return {
    // states
    isRedeemLoading,
    isCancelLoading,

    onRedeem,
    onCancel
  };
};

export default useBVaraActions;
