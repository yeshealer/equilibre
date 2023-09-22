import { CONTRACTS } from '@/config/company';
import { Pair, Token } from '@/interfaces';
import { useLiquidityStore } from '@/store/features/liquidity/liquidityStore';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useGetBalances } from '../swap';
import useGetPairBalances from './useGetPairBalances';
import { useRouter } from 'next/router';
import { usePairStore } from '@/store/pairsStore';

const useStakeData = (inputPair?: Pair) => {
  const {
    pair,
    setPair,
    token0,
    token1,
    setAsset,
    inputToken0Balance,
    inputToken1Balance,
    setInputToken0Balance,
    setInputToken1Balance,
    priorityAsset,
    setPriorityAsset,
    poolType,
    setPoolType,
    slippage,
    depositedLp,
    newStake,
    stakedValue,
    currentStake,
    advancedMode,
    setNewStake,
  } = useLiquidityStore(
    state => ({
      pair: state.pair,
      setPair: state.actions.setPair,
      token0: state.token0,
      token1: state.token1,
      setAsset: state.actions.setAsset,
      inputToken0Balance: state.inputToken0Balance,
      inputToken1Balance: state.inputToken1Balance,
      setInputToken0Balance: state.actions.setInputToken0Balance,
      setInputToken1Balance: state.actions.setInputToken1Balance,
      priorityAsset: state.priorityAsset,
      setPriorityAsset: state.actions.setPriorityAsset,
      poolType: state.poolType,
      setPoolType: state.actions.setPoolType,
      slippage: state.slippage,
      depositedLp: state.depositedLp,
      newStake: state.newStakeLp,
      stakedValue: state.stakedValue,
      setNewStake: state.actions.setNewStakeLp,
      currentStake: state.stakedLp,
      advancedMode: state.advancedMode,
    }),
    shallow
  );

  const pairsStore = usePairStore(state => ({
    pairs: state.pairs,
  }));

  const { tokenList } = useGetBalances(true);
  const { pairList: pairs } = useGetPairBalances();

  const router = useRouter();
  useEffect(() => {
    if (router.query.id) {
      const localPair = pairsStore.pairs.find(
        x => x.address.toLowerCase() === router.query.id
      );
      if (localPair) {
        setPair(localPair);
        console.log(localPair);
        setAsset(
          tokenList?.find(x => x.address === localPair.token0.address)!,
          'token0'
        );
        setAsset(
          tokenList?.find(x => x.address === localPair.token1.address)!,
          'token1'
        );
      }
    } else {
      setAsset(
        tokenList?.find(
          x => x.address === CONTRACTS.WKAVA_ADDRESS.toLowerCase()
        )!,
        'token0'
      );
      setAsset(
        tokenList?.find(
          x => x.address === CONTRACTS.GOV_TOKEN_ADDRESS.toLowerCase()
        )!,
        'token1'
      );
    }
  }, [tokenList, pairsStore.pairs, router.query.id]);

  useEffect(() => {
    if (priorityAsset === 1) {
      if (pair) {
        if (inputToken0Balance === '') return setInputToken1Balance('');
        const newAmount = BigNumber(inputToken0Balance)
          .times(pair?.reserve1!)
          .div(pair?.reserve0!)
          .toFixed(
            (pair.token1.decimals as number) > 6
              ? 6
              : (pair.token1.decimals as number)
          );
        setInputToken1Balance(newAmount);
      }
      //* This is for whether the pair is not created yet
      // else {
      //   if (inputToken0Balance === '') return setInputToken1Balance('');
      //   const newAmount = BigNumber(inputToken0Balance)
      //     .times(token0?.price!)
      //     .div(token1?.price!)
      //     .toFixed(
      //       (token1?.decimals as number) > 6 ? 6 : (token1?.decimals as number)
      //     );
      //   setInputToken1Balance(newAmount);
      // }
    }
  }, [inputToken0Balance]);

  useEffect(() => {
    if (priorityAsset === 2) {
      if (pair) {
        if (inputToken1Balance === '') return setInputToken0Balance('');
        const newAmount = BigNumber(inputToken1Balance)
          .times(pair?.reserve0!)
          .div(pair?.reserve1!)
          .toFixed(
            (pair.token0.decimals as number) > 6
              ? 6
              : (pair.token0.decimals as number)
          );
        setInputToken0Balance(newAmount);
      }
      //* This is for whether the pair is not created yet
      // else {
      //   if (inputToken1Balance === '') return setInputToken0Balance('');
      //   const newAmount = BigNumber(inputToken1Balance)
      //     .times(token1?.price!)
      //     .div(token0?.price!)
      //     .toFixed(
      //       (token0?.decimals as number) > 6 ? 6 : (token0?.decimals as number)
      //     );
      //   setInputToken0Balance(newAmount);
      // }
    }
  }, [inputToken1Balance]);

  const handleToken0OnClick = (token: Token): void => {
    setAsset(token, 'token0');
    setInputToken0Balance('');
    setInputToken1Balance('');
    const pair = pairs.find(
      x =>
        (x.token0.address.toLowerCase() === token.address.toLowerCase() &&
          x.token1.address.toLowerCase() === token1?.address.toLowerCase()) ||
        (x.token1.address.toLowerCase() === token.address.toLowerCase() &&
          x.token0.address.toLowerCase() === token1?.address.toLowerCase())
    );
    if (pair) {
      setPair(pair);
    } else {
      setPair(undefined);
    }
  };
  const handleToken1OnClick = (token: Token): void => {
    setAsset(token, 'token1');
    setInputToken0Balance('');
    setInputToken1Balance('');
    const pair = pairs.find(
      x =>
        (x.token0.address.toLowerCase() === token.address.toLowerCase() &&
          x.token1.address.toLowerCase() === token0?.address.toLowerCase()) ||
        (x.token1.address.toLowerCase() === token.address.toLowerCase() &&
          x.token0.address.toLowerCase() === token0?.address.toLowerCase())
    );
    if (pair) {
      setPair(pair);
    } else {
      setPair(undefined);
    }
  };

  // STAKE DETAILS
  useEffect(() => {
    if (pair) {
      setPoolType(pair.stable ? 'Stable' : 'Volatile');
    } else {
      if (token0?.stable && token1?.stable) {
        setPoolType('Stable');
      }
      if (!token0?.stable || !token1?.stable) {
        setPoolType('Volatile');
      }
      if (
        token0?.address.toLowerCase() ===
          token1?.liquidStakedAddress.toLowerCase() ||
        token1?.address.toLowerCase() ===
          token0?.liquidStakedAddress.toLowerCase()
      ) {
        setPoolType('Stable');
      }
    }
    setNewStake('0');
  }, [token0, token1, pair]);

  return {
    token0,
    token1,
    pair,
    handleToken0OnClick,
    handleToken1OnClick,
    inputToken0Balance,
    inputToken1Balance,
    setInputToken0Balance,
    setInputToken1Balance,
    setPriorityAsset,
    poolType,
    slippage,
    depositedLp,
    newStake,
    currentStake,
    advancedMode,
    stakedValue,
  };
};

export default useStakeData;
