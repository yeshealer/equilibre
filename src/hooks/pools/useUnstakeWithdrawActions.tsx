import { CONTRACTS } from '@/config/company';
import {
  prepareWriteGauge,
  prepareWriteRouter,
  prepareWriteVoter,
  readErc20,
  readPair,
  readPairFactory,
  readRouter,
} from '@/lib/equilibre';
import BigNumber from 'bignumber.js';
import { add, getUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useLiquidityStore } from '@/store/features/liquidity/liquidityStore';
import { shallow } from 'zustand/shallow';
import callContractWait from '@/lib/callContractWait';
import { usePairStore } from '@/store/pairsStore';
import generateToast from '@/components/toast/generateToast';
import { Pair } from '@/interfaces';
import { getBalanceInWei } from '@/utils/formatBalance';

const useUnstakeWithdrawActions = () => {
  const { address, isConnected } = useAccount();

  const {
    pair,
    setPair,
    token0,
    token1,
    inputPairBalance,
    setInputPairBalance,
    poolType,
    slippage,
    setDepositedLp,
    setCurrentStake,
    setNewStake,
    txDeadline,
  } = useLiquidityStore(
    state => ({
      pair: state.pair,
      setPair: state.actions.setPair,
      token0: state.token0,
      token1: state.token1,
      inputPairBalance: state.inputPairBalance,
      setInputPairBalance: state.actions.setInputPairBalance,
      poolType: state.poolType,
      slippage: state.slippage,
      setDepositedLp: state.actions.setDepositedLp,
      setNewStake: state.actions.setNewStakeLp,
      setCurrentStake: state.actions.setStakedLp,
      txDeadline: state.txDeadline,
    }),
    shallow
  );
  const { initPairs, getPair } = usePairStore(state => ({
    initPairs: state.actions.initPairs,
    getPair: state.actions.getPair,
  }));
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingUnstake, setIsLoadingUnstake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setNewStake('0');
    if (pair && isConnected) {
      setCurrentStake(pair.balanceStaked.toString());
      setDepositedLp(pair.balanceDeposited.toString());
    } else {
      setCurrentStake('0');
      setDepositedLp('0');
    }
  }, [isLoadingRemove === false, isLoadingUnstake === false]);

  useEffect(() => {
    setInputPairBalance('');
    setIsSuccess(false);
  }, [isSuccess === true]);

  // QUOTE LP REMOVE ACTION
  //! We are doing this inside the dapp, more fast, leaving here for reference
  const _quoteRemoveLiquidity = async (balance: string | bigint) => {
    if (!pair || balance === '') return { amount0: '0', amount1: '0' };

    const amount =
      typeof balance === 'bigint'
        ? balance
        : parseUnits(balance as `${number}`, pair?.decimals as number);
    const { amount0, amount1 } = await readRouter({
      functionName: 'quoteRemoveLiquidity',
      args: [token0?.address!, token1?.address!, pair.stable, amount],
    })
      .then(r => {
        return {
          amount0: formatUnits(r[0], token0?.decimals as number),
          amount1: formatUnits(r[1], token1?.decimals as number),
        };
      })
      .catch(e => {
        console.log(e);
        generateToast('Error getting quote, try again', e, 'error');
        return { amount0: '0', amount1: '0' };
      });
    return {
      amount0,
      amount1,
    };
  };

  // REMOVE LP ACTION
  const removeLP = async (newPair?: Pair): Promise<void> => {
    setIsLoadingRemove(true);
    if (!pair && !newPair) return;
    const currentPair = newPair ? newPair : pair;
    const currentToken0 = newPair ? newPair.token0 : token0;
    const currentToken1 = newPair ? newPair.token1 : token1;
    const amount = await readPair({
      address: currentPair?.address!,
      functionName: 'balanceOf',
      args: [address!],
    }).then(r => {
      return formatUnits(r, currentPair?.decimals as number);
    });
    if (!amount || amount === '0' || amount === '' || isNaN(Number(amount))) {
      setIsLoadingRemove(false);
      setIsSuccess(false);
      return;
    }
    const amountBI = getBalanceInWei(
      amount,
      currentPair?.decimals as number
    ).toBigInt();
    // Check Allowance
    if (!isConnected) return;
    const allowance = await readErc20({
      address: currentPair?.address!,
      functionName: 'allowance',
      args: [address!, CONTRACTS.ROUTER_ADDRESS],
    }).then(r => {
      return formatUnits(r, currentPair?.decimals as number);
    });
    // Approve
    if (BigNumber(allowance).lt(amount!)) {
      const txObj = {
        address: currentPair?.address!,
        abi: CONTRACTS.ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.ROUTER_ADDRESS, amountBI],
      };
      const toastObj = {
        title: 'Approve',
        description: `Pair ${currentPair?.symbol.substring(5)} approved`,
      };
      await callContractWait(txObj, toastObj).catch(e => {
        setIsLoadingRemove(false);
        setIsSuccess(false);
        return;
      });
    }

    // Remove Liquidity
    const { amount0, amount1 } = await _quoteRemoveLiquidity(amountBI);
    const sendSlippage = BigNumber(100).minus(slippage).div(100);
    const minAmount0 = BigInt(
      BigNumber(amount0)
        .times(sendSlippage)
        .times(10 ** (currentToken0?.decimals! as number))
        .toFixed(0)
    );

    const minAmount1 = BigInt(
      BigNumber(amount1)
        .times(sendSlippage)
        .times(10 ** (currentToken1?.decimals! as number))
        .toFixed(0)
    );

    const deadline = BigInt(
      getUnixTime(add(Date.now(), { seconds: Number(txDeadline) }))
    );

    let asset0 = currentToken0;
    let asset1 = currentToken1;
    let minSendAmount0 = minAmount0;
    let minSendAmount1 = minAmount1;
    //Check if the pair is inverted
    if (
      currentPair &&
      currentPair?.token0.address === currentToken1?.address &&
      currentPair?.token1.address === currentToken0?.address
    ) {
      asset0 = currentToken1;
      asset1 = currentToken0;
      minSendAmount0 = minAmount1;
      minSendAmount1 = minAmount0;
    }
    const { request } = await prepareWriteRouter({
      functionName: 'removeLiquidity',
      args: [
        asset0?.address!,
        asset1?.address!,
        currentPair?.stable!,
        amountBI,
        minSendAmount0,
        minSendAmount1,
        address!,
        deadline,
      ],
      account: address!,
    }).catch(e => {
      setIsLoadingRemove(false);
      setIsSuccess(false);
      return e;
    });
    const toastObj = {
      title: 'Remove LP',
      description: `${currentToken0?.symbol} and ${
        currentToken1?.symbol
      } removed successfully from pair ${currentPair?.symbol.substring(5)}`,
    };
    await callContractWait(request, toastObj)
      .then(async x => {
        await initPairs();
        const localPair = getPair(currentPair?.address!);
        if (localPair) {
          const newBalance = await readPair({
            address: currentPair?.address!,
            functionName: 'balanceOf',
            args: [address!],
          }).then(r => {
            return formatUnits(r, currentPair?.decimals as number);
          });

          localPair.balanceDeposited = newBalance;
          setPair(localPair);
        }
        setIsLoadingRemove(false);
        setIsSuccess(true);
      })
      .catch(e => {
        console.log(e);
        setIsLoadingRemove(false);
        setIsSuccess(false);
        return;
      });
  };

  // STAKE LP ACTION
  const unstakeLP = async (): Promise<void> => {
    if (!pair) return;
    setIsLoadingUnstake(true);

    //* We need to get the amount of LP tokens deposited in the pair
    const amountStaked = getBalanceInWei(
      inputPairBalance,
      pair?.decimals as number
    ).toBigInt();
    if (!isConnected) return;

    // Unstake LP in Gauge
    const { request } = await prepareWriteGauge({
      functionName: 'withdraw',
      args: [amountStaked],
      address: pair?.gauge?.address!,
      account: address!,
    }).catch(e => {
      setIsLoadingUnstake(false);
      setIsSuccess(false);
      return e;
    });
    const toastObj = {
      title: 'Unstake LP',
      description: `Pair ${pair?.symbol.substring(5)} unstaked successfully`,
    };
    await callContractWait(request, toastObj)
      .then(async x => {
        await initPairs();
        const localPair = getPair(pair?.address!);

        if (localPair) {
          setPair(localPair);
        }
        setIsLoadingUnstake(false);
        setIsSuccess(true);
      })
      .catch(e => {
        setIsLoadingUnstake(false);
        setIsSuccess(false);
        return;
      });
  };

  // UNSTAKE AND REMOVE LP ACTION
  const unstakeAndRemoveLP = async (): Promise<void> => {
    setIsLoadingUnstake(true);
    unstakeLP().then(async () => {
      await removeLP();
    });
  };

  return {
    isLoadingRemove,
    isLoadingUnstake,
    isSuccess,
    removeLP,
    unstakeLP,
    unstakeAndRemoveLP,
  };
};

export default useUnstakeWithdrawActions;
