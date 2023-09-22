import { Pair } from '@/interfaces';
import { useLiquidityStore } from '@/store/features/liquidity/liquidityStore';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import useGetPairBalances from './useGetPairBalances';
import BigNumber from 'bignumber.js';
import { useGetBalances } from '../swap';

const useUnstakeData = (inputPair?: Pair) => {
  const {
    pair,
    setPair,
    setAsset,
    inputPairBalance,
    setInputPairBalance,
    token0,
    token1,
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
      setAsset: state.actions.setAsset,
      inputPairBalance: state.inputPairBalance,
      setInputPairBalance: state.actions.setInputPairBalance,
      token0: state.token0,
      token1: state.token1,
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
  const [token0CurrentInput, setToken0CurrentInput] = useState('0');
  const [token1CurrentInput, setToken1CurrentInput] = useState('0');
  const [token0CurrentValue, setToken0CurrentValue] = useState('0');
  const [token1CurrentValue, setToken1CurrentValue] = useState('0');
  const { pairList } = useGetPairBalances();
  const { tokenList } = useGetBalances();

  useEffect(() => {
    if (inputPair) {
      setPair(inputPair);
      setAsset(
        tokenList?.find(x => x.address === inputPair.token0.address)!,
        'token0'
      );
      setAsset(
        tokenList?.find(x => x.address === inputPair.token1.address)!,
        'token1'
      );
    }
  }, [pairList]);

  const handlePairOnClick = (pair: Pair): void => {
    setPair(pair);
  };

  // STAKE DETAILS
  useEffect(() => {
    setToken0CurrentInput(
      BigNumber(inputPairBalance)
        .div(pair?.totalSupply!)
        .times(pair?.reserve0!)
        .toFixed(pair?.token0?.decimals! as number)
    );
    setToken1CurrentInput(
      BigNumber(inputPairBalance)
        .div(pair?.totalSupply!)
        .times(pair?.reserve1!)
        .toFixed(pair?.token1?.decimals! as number)
    );
    setToken0CurrentValue(
      BigNumber(inputPairBalance)
        .div(pair?.totalSupply!)
        .times(pair?.reserve0!)
        .times(pair?.token0?.price!)
        .toFixed(pair?.token0?.decimals! as number)
    );
    setToken1CurrentValue(
      BigNumber(inputPairBalance)
        .div(pair?.totalSupply!)
        .times(pair?.reserve1!)
        .times(pair?.token1?.price!)
        .toFixed(pair?.token1?.decimals! as number)
    );
  }, [inputPairBalance]);
  return {
    token0,
    token1,
    pair,
    handlePairOnClick,
    inputPairBalance,
    setInputPairBalance,
    slippage,
    depositedLp,
    newStake,
    currentStake,
    advancedMode,
    stakedValue,
    token0CurrentInput,
    token1CurrentInput,
    token0CurrentValue,
    token1CurrentValue,
  };
};

export default useUnstakeData;
