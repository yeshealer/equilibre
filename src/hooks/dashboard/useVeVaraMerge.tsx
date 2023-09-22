import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import generateToast from '@/components/toast/generateToast';

import { CONTRACTS } from '@/config/company';
import callContractWait from '@/lib/callContractWait';
import { CONSTANTS_VEVARA } from '@/config/constants';
import { useRouter } from 'next/navigation';
import useSimpleVeNFTs from './useSimpleVeNFTs';

const { LOCK_DURATIONS } = CONSTANTS_VEVARA;

const useVeVaraMerge = () => {
    const router = useRouter();
    const [firstSelectedNFTId, setFirstSelectedNFTId] = useState<number>(0);
    const [secondSelectedNFTId, setSecondSelectedNFTId] = useState<number>(1);
    const [isLoading, setLoading] = useState<boolean>(false);

    const { address, isConnected } = useAccount();

    const {
        veNFTs,
        getSimpleVeNfts,
    } = useSimpleVeNFTs();

    const onMergeVeNFTs = async () => {
        setLoading(true);
        const txObj = {
            address: CONTRACTS.VE_TOKEN_ADDRESS,
            abi: CONTRACTS.VE_TOKEN_ABI,
            functionName: 'merge',
            args: [veNFTs[firstSelectedNFTId].id, veNFTs[secondSelectedNFTId].id],
        };
        const toastObj = {
            title: 'Merge VeVaras',
            description: 'VeVaras merged',
        };
        const result = await callContractWait(txObj, toastObj, (error: any) => {
            console.log(error);
            if (String(error).includes("attached"))
                generateToast("Reset required", "The above NFT have to be already reset", 'error');
            return false;
        });

        if (result) {
            await getSimpleVeNfts();
        }

        setLoading(false);
    }

    const onClickSplit = () => {
        router.push("/dashboard/split")
    }

    const onClickBack = () => router.push('/dashboard')

    return {
        // states
        firstSelectedNFTId,
        secondSelectedNFTId,
        isLoading,

        veNFTs,

        // actions
        setFirstSelectedNFTId,
        setSecondSelectedNFTId,

        // advanced actions
        onMergeVeNFTs,
        onClickSplit,
        onClickBack,
    };
};

export default useVeVaraMerge;
