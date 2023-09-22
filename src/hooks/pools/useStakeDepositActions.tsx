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

const useStakeDepositActions = () => {
  const { address, isConnected } = useAccount();

  const {
    pair,
    setPair,
    token0,
    token1,
    inputToken0Balance,
    inputToken1Balance,
    setInputToken0Balance,
    setInputToken1Balance,
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
      inputToken0Balance: state.inputToken0Balance,
      inputToken1Balance: state.inputToken1Balance,
      setInputToken0Balance: state.actions.setInputToken0Balance,
      setInputToken1Balance: state.actions.setInputToken1Balance,
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
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);
  const [isLoadingStake, setIsLoadingStake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      await quoteAddLiquidity();
    }, 500);
    setTimer(newTimer);
  }, [inputToken0Balance, inputToken1Balance]);

  useEffect(() => {
    setNewStake('0');
    if (pair && isConnected) {
      setCurrentStake(pair.balanceStaked.toString());
      setDepositedLp(pair.balanceDeposited.toString());
    } else {
      setCurrentStake('0');
      setDepositedLp('0');
    }
  }, [isLoadingDeposit === false, isLoadingStake === false]);

  useEffect(() => {
    setInputToken0Balance('');
    setInputToken1Balance('');
    setIsSuccess(false);
  }, [isSuccess === true]);

  // QUOTE LP ACTION
  const quoteAddLiquidity = async () => {
    if (
      !pair ||
      inputToken0Balance === '' ||
      inputToken1Balance === '' ||
      Number(inputToken0Balance) === 0 ||
      Number(inputToken1Balance) === 0
    )
      return;
    const amount0 = parseUnits(
      inputToken0Balance as `${number}`,
      token0?.decimals as number
    );
    const amount1 = parseUnits(
      inputToken1Balance as `${number}`,
      token1?.decimals as number
    );
    const quote = await readRouter({
      functionName: 'quoteAddLiquidity',
      args: [
        token0?.address!,
        token1?.address!,
        poolType === 'Stable' ? true : false,
        amount0,
        amount1,
      ],
    })
      .then(r => {
        //Return only the amount of LP tokens, [0] and [1] are the amounts of token0 and token1 respectively
        return r[2];
      })
      .catch(e => {
        console.log(e);
        generateToast('Error getting quote, try again', e, 'error');
        return parseUnits('0', 18);
      });
    setNewStake(formatUnits(quote, pair?.decimals as number));
  };

  // DEPOSIT LP ACTION
  const depositLP = async (): Promise<void> => {
    setIsLoadingDeposit(true);
    const amount0 = parseUnits(
      inputToken0Balance as `${number}`,
      token0?.decimals as number
    );
    const amount1 = parseUnits(
      inputToken1Balance as `${number}`,
      token1?.decimals as number
    );
    // Check Allowance
    if (!isConnected) return;
    const allowance0 = await readErc20({
      address: token0?.address!,
      functionName: 'allowance',
      args: [address!, CONTRACTS.ROUTER_ADDRESS],
    }).then(r => {
      return formatUnits(r, token0?.decimals as number);
    });
    const allowance1 = await readErc20({
      address: token1?.address!,
      functionName: 'allowance',
      args: [address!, CONTRACTS.ROUTER_ADDRESS],
    }).then(r => {
      return formatUnits(r, token1?.decimals as number);
    });

    // Approve
    if (BigNumber(allowance0).lt(inputToken0Balance)) {
      const txObj = {
        address: token0?.address!,
        abi: CONTRACTS.ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.ROUTER_ADDRESS, amount0],
      };
      const toastObj = {
        title: 'Approve',
        description: `Token ${token0?.symbol} approved`,
      };
      await callContractWait(txObj, toastObj).catch(e => {
        setIsLoadingDeposit(false);
        setIsSuccess(false);
        console.log(e);
        return;
      });
    }

    if (BigNumber(allowance1).lt(inputToken1Balance)) {
      const txObj = {
        address: token1?.address!,
        abi: CONTRACTS.ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.ROUTER_ADDRESS, amount1],
      };
      const toastObj = {
        title: 'Approve',
        description: `Token ${token1?.symbol} approved`,
      };
      await callContractWait(txObj, toastObj).catch(e => {
        setIsLoadingDeposit(false);
        setIsSuccess(false);
        console.log(e);
        return;
      });
    }

    // Add Liquidity
    const sendSlippage = BigNumber(100).minus(slippage).div(100);
    const minAmount0 = BigInt(
      BigNumber(inputToken0Balance)
        .times(sendSlippage)
        .times(10 ** Number(token0?.decimals))
        .toFixed(0)
    );
    const minAmount1 = BigInt(
      BigNumber(inputToken1Balance)
        .times(sendSlippage)
        .times(10 ** Number(token1?.decimals))
        .toFixed(0)
    );
    const deadline = BigInt(
      getUnixTime(add(Date.now(), { seconds: Number(txDeadline) }))
    );

    // console.log(
    //   token0?.address,
    //   token1?.address,
    //   poolType,
    //   amount0,
    //   amount1,
    //   minAmount0,
    //   minAmount1,
    //   address,
    //   deadline
    // );

    let asset0 = token0;
    let asset1 = token1;
    let sendAmount0 = amount0;
    let sendAmount1 = amount1;
    let minSendAmount0 = minAmount0;
    let minSendAmount1 = minAmount1;

    //Check if the pair is inverted
    if (
      pair &&
      pair?.token0.address === token1?.address &&
      pair?.token1.address === token0?.address
    ) {
      asset0 = token1;
      asset1 = token0;
      sendAmount0 = amount1;
      sendAmount1 = amount0;
      minSendAmount0 = minAmount1;
      minSendAmount1 = minAmount0;
    }
    const { request } = await prepareWriteRouter({
      functionName: 'addLiquidity',
      args: [
        asset0?.address!,
        asset1?.address!,
        poolType === 'Stable' ? true : false,
        sendAmount0,
        sendAmount1,
        minSendAmount0,
        minSendAmount1,
        address!,
        deadline,
      ],
      account: address!,
    }).catch(e => {
      setIsLoadingDeposit(false);
      setIsSuccess(false);
      return e;
    });
    const toastObj = {
      title: 'Deposit LP',
      description: `${token0?.symbol} and ${token1?.symbol} deposited successfully`,
    };
    await callContractWait(request, toastObj)
      .then(async x => {
        await initPairs();
        const localPair = getPair(pair?.address!);
        if (localPair) {
          const newBalance = await readPair({
            address: pair?.address!,
            functionName: 'balanceOf',
            args: [address!],
          }).then(r => {
            return formatUnits(r, pair?.decimals as number);
          });

          localPair.balanceDeposited = newBalance;
          setPair(localPair);
        }
        setIsLoadingDeposit(false);
        setIsSuccess(true);
      })
      .catch(e => {
        setIsLoadingDeposit(false);
        setIsSuccess(false);
        return;
      });
  };

  // STAKE LP ACTION
  const stakeLP = async (newPair?: Pair): Promise<void> => {
    if (!newPair && !pair) return;
    const currentPair = newPair ? newPair : pair;
    setIsLoadingStake(true);

    //* We need to get the amount of LP tokens deposited in the pair
    const amountDepositedBI = await readPair({
      address: currentPair?.address!,
      functionName: 'balanceOf',
      args: [address!],
    });
    const amountDeposited = formatUnits(
      amountDepositedBI,
      currentPair?.decimals as number
    );
    // Check Allowance
    if (!isConnected) return;
    const allowance = await readPair({
      address: currentPair?.address!,
      functionName: 'allowance',
      args: [address!, currentPair?.gauge?.address!],
    })
      .then(r => {
        return formatUnits(r, currentPair?.decimals as number);
      })
      .catch(e => {
        setIsLoadingStake(false);
        setIsSuccess(false);
        generateToast('Error getting allowance, try again', e, 'error');
        console.error(e);
        return 'NaN';
      });

    if (allowance === 'NaN') return;
    // Approve
    if (BigNumber(allowance).lt(amountDeposited)) {
      const txObj = {
        address: currentPair?.address!,
        abi: CONTRACTS.PAIR_ABI,
        functionName: 'approve',
        args: [currentPair?.gauge?.address!, amountDepositedBI],
      };
      const toastObj = {
        title: 'Approve',
        description: `Pair ${currentPair?.symbol.substring(5)} approved`,
      };

      await callContractWait(txObj, toastObj).catch(e => {
        setIsLoadingStake(false);
        setIsSuccess(false);
        generateToast('Error approving LP, try again', e, 'error');
        return;
      });
    }

    //! This is because we don't support nft attachment 4 boosting LP APRs
    const sendToken = BigInt(0);
    // Stake LP in Gauge
    const { request } = await prepareWriteGauge({
      functionName: 'deposit',
      args: [amountDepositedBI, sendToken],
      address: currentPair?.gauge?.address!,
      account: address!,
    }).catch(e => {
      setIsLoadingStake(false);
      setIsSuccess(false);
      return e;
    });
    const toastObj = {
      title: 'Stake LP',
      description: `Pair ${currentPair?.symbol.substring(
        5
      )} staked successfully`,
    };
    const customErrorHandler = (e: any) => {
      console.log(e);
      generateToast('Error staking LP, try again', e.message, 'error');
      return false;
    };
    await callContractWait(request, toastObj, customErrorHandler)
      .then(async x => {
        await initPairs();
        const localPair = getPair(pair?.address!);

        if (localPair) {
          setPair(localPair);
        }
        setIsLoadingStake(false);
        setIsSuccess(true);
      })
      .catch(e => {
        setIsLoadingStake(false);
        setIsSuccess(false);
        return;
      });
  };

  // DEPOSIT AND STAKE LP ACTION
  const depositAndStakeLP = async (): Promise<void> => {
    setIsLoadingStake(true);
    depositLP().then(async () => {
      await stakeLP();
    });
  };

  // CREATE PAIR AND DEPOSIT LP ACTION
  const createPairAndDepositLP = async (): Promise<void> => {
    setIsLoadingDeposit(true);
    const checkIfPairExists = await readPairFactory({
      functionName: 'getPair',
      args: [
        token0?.address!,
        token1?.address!,
        poolType === 'Stable' ? true : false,
      ],
    });
    if (
      checkIfPairExists &&
      checkIfPairExists !== '0x0000000000000000000000000000000000000000'
    ) {
      await initPairs().then(() => {
        const localPair = getPair(checkIfPairExists);
        if (localPair) {
          setPair(localPair);
        }
      });
      generateToast('Pair already exists', '', 'error');
      return;
    }
    console.log(inputToken0Balance, inputToken1Balance);
    if (
      !isConnected ||
      inputToken0Balance === '' ||
      inputToken1Balance === '' ||
      Number(inputToken0Balance) === 0 ||
      Number(inputToken1Balance) === 0
    ) {
      console.log('not connected');
      setIsLoadingDeposit(false);
      setIsLoadingStake(false);
      setIsSuccess(false);
      generateToast(
        'Error when creating pair',
        'Check if your wallet is connected or if you have entered amounts to deposit',
        'error'
      );
      return;
    }
    await depositLP()
      .then(async () => {
        const newPair = await readPairFactory({
          functionName: 'getPair',
          args: [
            token0?.address!,
            token1?.address!,
            poolType === 'Stable' ? true : false,
          ],
        });
        const { request } = await prepareWriteVoter({
          functionName: 'createGauge',
          args: [newPair],
          account: address!,
        }).catch(e => {
          setIsLoadingDeposit(false);
          setIsSuccess(false);
          return e;
        });
        const toastObj = {
          title: 'Create Gauge for New Pair',
          description: `Gauge for ${token0?.symbol} and ${token1?.symbol} created successfully`,
        };
        await callContractWait(request, toastObj)
          .then(() => {
            initPairs().then(async () => {
              const localPair = getPair(newPair);
              if (localPair) {
                const newBalance = await readPair({
                  address: pair?.address!,
                  functionName: 'balanceOf',
                  args: [address!],
                }).then(r => {
                  return formatUnits(r, pair?.decimals as number);
                });
                localPair.balanceDeposited = newBalance;
                setPair(localPair);
              }
              setIsLoadingDeposit(false);
              setIsSuccess(true);
            });
          })
          .catch(e => {
            setIsLoadingDeposit(false);
            setIsSuccess(false);
            return;
          });
      })
      .catch(e => {
        setIsLoadingDeposit(false);
        setIsLoadingStake(false);
        setIsSuccess(false);
        return;
      });
  };

  // CREATE PAIR AND STAKE LP ACTION
  const createPairAndStakeLP = async (): Promise<void> => {
    setIsLoadingStake(true);
    const checkIfPairExists = await readPairFactory({
      functionName: 'getPair',
      args: [
        token0?.address!,
        token1?.address!,
        poolType === 'Stable' ? true : false,
      ],
    });
    if (
      checkIfPairExists &&
      checkIfPairExists !== '0x0000000000000000000000000000000000000000'
    ) {
      await initPairs().then(() => {
        const localPair = getPair(checkIfPairExists);
        if (localPair) {
          setPair(localPair);
        }
      });
      generateToast('Pair already exists', '', 'error');
      return;
    }
    await createPairAndDepositLP().then(async () => {
      await stakeLP();
    });
  };

  return {
    isLoadingDeposit,
    isLoadingStake,
    isSuccess,
    depositLP,
    stakeLP,
    depositAndStakeLP,
    createPairAndDepositLP,
    createPairAndStakeLP,
  };
};

export default useStakeDepositActions;
