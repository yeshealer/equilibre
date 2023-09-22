import generateToast from '@/components/toast/generateToast';
import { CONTRACTS } from '@/config/company';
import { Pair, Token } from '@/interfaces';
import callContractWait from '@/lib/callContractWait';
import { readErc20, readWrappedExternalBribeFactory } from '@/lib/equilibre';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useDisclosure } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useEffect, useState, MouseEvent } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

const useAddBribe = (pair: Pair) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const { getBaseAsset } = useBaseAssetStore(state => state.actions);
  const [tokenSelected, setTokenSelected] = useState({} as Token);
  const [inputBalance, setInputBalance] = useState('');
  useEffect(() => {
    setTokenSelected(getBaseAsset(CONTRACTS.WKAVA_ADDRESS)!);
    setInputBalance('');
  }, [isOpen]);
  const handleTokenOnClick = (token: Token): void => {
    setTokenSelected(token);
  };

  const handleAddBribeOnClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!isConnected) return;
    //First we create the wrapped bribe
    const checkIfBribeExists = await callContractWait(
      {
        address: CONTRACTS.WRAPPED_EXTERNAL_BRIBE_FACTORY_ADDRESS,
        abi: CONTRACTS.WRAPPED_EXTERNAL_BRIBE_FACTORY_ABI,
        functionName: 'createBribe',
        args: [pair.gauge?.bribeAddress],
      },
      {
        title: 'Wrapped Bribe created',
        description: `Wrapped Bribe created for ${pair.symbol.substring(5)}`,
      }
    );
    if (!checkIfBribeExists)
      generateToast(
        'Bribe already exists',
        'Bribe already exists, proccess will continue',
        'info'
      );
    // Retrieve the wrapped bribe address
    const wrappedBribeAddress = await readWrappedExternalBribeFactory({
      functionName: 'oldBribeToNew',
      args: [pair.gauge?.bribeAddress as `0x${string}`],
    });
    // Now allowance
    let allowance: bigint | BigNumber = await readErc20({
      address: tokenSelected.address,
      functionName: 'allowance',
      args: [address!, pair.gauge?.bribeAddress as `0x${string}`],
    });
    allowance = BigNumber(Number(allowance)).div(
      10 ** Number(tokenSelected.decimals)
    );

    const amountBigInt = parseUnits(
      `${Number(inputBalance)}`,
      tokenSelected?.decimals! as number
    );
    // If allowance is 0 we need to approve
    if (allowance.lt(inputBalance)) {
      await callContractWait(
        {
          address: tokenSelected.address,
          abi: CONTRACTS.ERC20_ABI,
          functionName: 'approve',
          args: [wrappedBribeAddress as `0x${string}`, amountBigInt],
        },
        {
          title: 'Bribe Amount Approved',
          description: `${tokenSelected.symbol} succesfully approved`,
        }
      );
    }
    // Now we can add the bribe
    await callContractWait(
      {
        address: wrappedBribeAddress as `0x${string}`,
        abi: CONTRACTS.BRIBE_ABI,
        functionName: 'notifyRewardAmount',
        args: [tokenSelected.address, amountBigInt],
      },
      {
        title: 'Bribe Added',
        description: `${tokenSelected.symbol} added to ${pair.symbol.substring(
          5
        )} as a bribe`,
      }
    );
    onClose();
  };
  return {
    handleAddBribeOnClick,
    handleTokenOnClick,
    tokenSelected,
    inputBalance,
    setInputBalance,
    isOpen,
    onOpen,
    onClose,
  };
};

export default useAddBribe;
