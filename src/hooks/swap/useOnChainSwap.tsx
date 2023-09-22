import { CONTRACTS } from '@/config/company';
import {
  prepareWriteErc20,
  prepareWriteRouter,
  prepareWriteWrappedKava,
  readErc20,
  writeWrappedKava,
} from '@/lib/equilibre';
import { useSwapStore } from '@/store/features/swap/swapStore';
import {
  prepareSendTransaction,
  prepareWriteContract,
  getContract,
} from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { add, getUnixTime } from 'date-fns';
import { MouseEvent, useEffect } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import callContractWait from '@/lib/callContractWait';
import callSendTransactionWait from '@/lib/callSendTransactionWait';
import { displayNumber } from '@/utils/formatNumbers';
import { shallow } from 'zustand/shallow';
import { Token, TransactionText } from '@/interfaces';
import generateToast from '@/components/toast/generateToast';
import { getBalanceInWei } from '@/utils/formatBalance';
import useGetBalances from './useGetBalances';

const useOnChainSwap = () => {
  const { isDisconnected, status, address } = useAccount();
  const {
    initAssets,
    updateAssets,
    setAsset,
    cleanRoute,
    inputAsset,
    outputAsset,
    swapQuote,
    slippage,
    txDeadline,
    priceImpact,
  } = useSwapStore(
    state => ({
      initAssets: state.actions.initAssets,
      updateAssets: state.actions.updateAssets,
      setAsset: state.actions.setAsset,
      cleanRoute: state.actions.cleanRoute,
      inputAsset: state.inputAsset,
      outputAsset: state.outputAsset,
      swapQuote: state.swapQuote,
      slippage: state.slippage,
      txDeadline: state.txDeadline,
      priceImpact: state.priceImpact,
    }),
    shallow
  );

  useEffect(() => {
    initAssets();
  }, [status]);

  const checkAllowanceAndApprove = async (routerAddress: `0x${string}`) => {
    if (
      inputAsset?.address.toLowerCase() !== CONTRACTS.KAVA_ADDRESS.toLowerCase()
    ) {
      let allowance: bigint | BigNumber = await readErc20({
        address: inputAsset?.address!,
        functionName: 'allowance',
        args: [address!, routerAddress],
      });
      allowance = BigNumber(Number(allowance)).div(
        10 ** Number(inputAsset?.decimals!)
      );
      console.log(swapQuote?.inAmount!);
      if (allowance.gt(swapQuote?.inAmount!)) {
        console.log('allowance is enough');
        return true;
      } else {
        console.log('allowance is not enough');
        const inAmountBigInt = getBalanceInWei(
          swapQuote?.inAmount!,
          inputAsset?.decimals! as number
        ).toBigInt();
        console.log(
          '🚀 ~ file: useOnChainSwap.tsx:85 ~ checkAllowanceAndApprove ~ inAmountBigInt:',
          inAmountBigInt
        );
        const { request } = await prepareWriteErc20({
          address: inputAsset?.address!,
          functionName: 'approve',
          args: [routerAddress, inAmountBigInt],
        });

        return await callContractWait(request, {
          title: 'Approve has been successful!',
          description: `Token ${inputAsset?.symbol} has been approved!`,
        });
      }
    }
    return true;
  };

  const handleOnClickSwitchAssets = (e: MouseEvent<HTMLButtonElement>) => {
    const auxInputAsset = inputAsset;
    setAsset(outputAsset?.address as string, 'input');
    setAsset(auxInputAsset?.address as string, 'output');
  };

  const wrapAction = async (
    inAmount: string,
    outAmount: string,
    inputAsset: Token,
    outputAsset: Token
  ) => {
    const inAmountBigInt = getBalanceInWei(
      inAmount,
      inputAsset?.decimals! as number
    ).toBigInt();

    //! This is a workaround to avoid the error of the contract, we believe we cannot
    //! prepare the contract as other calls since is an EOA (External Owener Address)
    //! KEEP AN EYE ON THIS, IT WAS WORKING BEFORE WITH MODE: PREPARED, NOW IT IS NOT
    await callContractWait(
      {
        address: CONTRACTS.WKAVA_ADDRESS,
        abi: CONTRACTS.WKAVA_ABI,
        functionName: 'deposit',
        value: inAmountBigInt,
      },
      {
        title: 'Wrap has been successful!',
        description: `Swapped ${inAmount} ${
          inputAsset?.symbol
        } to ${displayNumber(outAmount)} ${outputAsset?.symbol}`,
      }
    );
  };

  const unwrapAction = async (
    inAmount: string,
    outAmount: string,
    inputAsset: Token,
    outputAsset: Token
  ) => {
    const inAmountBigInt = getBalanceInWei(
      inAmount,
      inputAsset?.decimals! as number
    ).toBigInt();
    //! This is a workaround to avoid the error of the contract, we believe we cannot
    //! prepare the contract as other calls since is an EOA (External Owener Address)
    //! KEEP AN EYE ON THIS, IT WAS WORKING BEFORE WITH MODE: PREPARED, NOW IT IS NOT
    await callContractWait(
      {
        address: CONTRACTS.WKAVA_ADDRESS,
        abi: CONTRACTS.WKAVA_ABI,
        functionName: 'withdraw',
        args: [inAmountBigInt],
      },
      {
        title: 'Unwrap has been successful!',
        description: `Swapped ${inAmount} ${
          inputAsset?.symbol
        } to ${displayNumber(outAmount)} ${outputAsset?.symbol}`,
      }
    );
  };

  const handleOnClickSwap = async (e: MouseEvent<HTMLButtonElement>) => {
    //* WRAP CASE
    if (
      inputAsset?.address === CONTRACTS.KAVA_ADDRESS &&
      outputAsset?.address === CONTRACTS.WKAVA_ADDRESS.toLowerCase()
    ) {
      await wrapAction(
        swapQuote?.inAmount!,
        swapQuote?.outAmount!,
        inputAsset,
        outputAsset
      );
    }
    //* UNWRAP CASE
    else if (
      inputAsset?.address === CONTRACTS.WKAVA_ADDRESS.toLowerCase() &&
      outputAsset?.address === CONTRACTS.KAVA_ADDRESS
    ) {
      await unwrapAction(
        swapQuote?.inAmount!,
        swapQuote?.outAmount!,
        inputAsset,
        outputAsset
      );
    }
    //* SWAP CASE
    else {
      try {
        if (swapQuote?.type === 'internal' && swapQuote?.routes) {
          //* 1st step: check allowance
          const allowance = await checkAllowanceAndApprove(
            CONTRACTS.ROUTER_ADDRESS
          );
          if (!allowance) return;
          //* 2nd step: swap
          const sendSlippage = BigNumber(100).minus(slippage).div(100);
          const inAmountBigInt = getBalanceInWei(
            swapQuote.inAmount!,
            inputAsset?.decimals! as number
          ).toBigInt();

          // const minAmountOutBigInt = BigInt(
          //   BigNumber(swapQuote?.outAmount!)
          //     .times(10 ** Number(outputAsset?.decimals!))
          //     .times(sendSlippage)
          //     .toFixed(0)
          // );

          const minAmountOutBigInt = getBalanceInWei(
            BigNumber(swapQuote?.outAmount!)
              .times(sendSlippage)
              .toFixed(outputAsset?.decimals! as number),
            outputAsset?.decimals! as number
          ).toBigInt();

          const deadline = BigInt(
            getUnixTime(add(Date.now(), { seconds: Number(txDeadline) }))
          );
          const rawRoutes: {
            from: `0x${string}`;
            to: `0x${string}`;
            stable: boolean;
          }[] = swapQuote?.routes[0]?.subRoutes.map(route => {
            return {
              from: route.from.address,
              to: route.to.address,
              stable: route.pairIsStable,
            };
          });

          const transactionToast: TransactionText = {
            title: 'Swap has been successful!',
            description: `Swapped ${swapQuote.inAmount!} ${
              inputAsset?.symbol
            } to ${displayNumber(swapQuote.outAmount!)} ${outputAsset?.symbol}`,
          };

          if (
            inputAsset?.address.toLowerCase() ===
            CONTRACTS.KAVA_ADDRESS.toLowerCase()
          ) {
            const { request } = await prepareWriteRouter({
              functionName:
                'swapExactETHForTokensSupportingFeeOnTransferTokens',
              //@ts-ignore
              args: [minAmountOutBigInt, rawRoutes, address!, deadline],
              //@ts-ignore
              value: inAmountBigInt,
            });
            await callContractWait(request, transactionToast);
          } else if (
            outputAsset?.address.toLowerCase() ===
            CONTRACTS.KAVA_ADDRESS.toLowerCase()
          ) {
            const { request } = await prepareWriteRouter({
              functionName:
                'swapExactTokensForETHSupportingFeeOnTransferTokens',

              args: [
                //@ts-ignore
                inAmountBigInt,
                //@ts-ignore
                minAmountOutBigInt,
                rawRoutes,
                address!,
                deadline,
              ],
            });
            await callContractWait(request, transactionToast);
          } else {
            const { request } = await prepareWriteRouter({
              functionName:
                'swapExactTokensForTokensSupportingFeeOnTransferTokens',
              args: [
                //@ts-ignore
                inAmountBigInt,
                //@ts-ignore
                minAmountOutBigInt,
                rawRoutes,
                address!,
                deadline,
              ],
            });
            await callContractWait(request, transactionToast);
          }
        }
        if (swapQuote?.type === 'external' && swapQuote?.routes) {
          const allowance = await checkAllowanceAndApprove(
            CONTRACTS.OPENOCEAN_ADDRESS
          );
          if (!allowance) return;

          const sendOpenOceanTx = await prepareSendTransaction({
            account: address!,
            chainId: 2222,
            to: CONTRACTS.OPENOCEAN_ADDRESS,
            gas: BigInt(swapQuote.externalData?.estimatedGas!),
            gasPrice: BigInt(swapQuote.externalData?.gasPrice!),
            data: swapQuote.externalData?.data,
          }).catch(err => {
            console.log(err);
          });
          await callSendTransactionWait(sendOpenOceanTx, {
            title: 'Swap has been successful!',
            description: `Swapped ${swapQuote.inAmount!} ${
              inputAsset?.symbol
            } to ${displayNumber(swapQuote.outAmount!)} ${outputAsset?.symbol}`,
          }).catch(err => {
            console.log(err);
          });
        }
      } catch (err) {
        console.log(err);
        generateToast(
          'Swap has failed!',
          'Please try again later, if the problem persists contact support.',
          'error'
        );
        updateAssets();
      }
    }
    cleanRoute();
    // initAssets();
    console.log('swap done');
    updateAssets();
  };

  return {
    inputAsset,
    outputAsset,
    handleOnClickSwitchAssets,
    handleOnClickSwap,
    isDisconnected,
    swapQuote,
    priceImpact,
  };
};

export default useOnChainSwap;
