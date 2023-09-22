import { Token } from '@/interfaces';
import { useSwapStore } from '@/store/features/swap/swapStore';
import { getBalanceInEther } from '@/utils/formatBalance';
import { displayCurrency } from '@/utils/formatNumbers';
import { MouseEvent, useState, useEffect } from 'react';
type InputSelectorProps = {
  type: 'input' | 'output';
  token?: Token;
};
const useInputSwap = ({ type, token }: InputSelectorProps) => {
  const [inputBalance, setInputBalance] = useState('');
  const [inputFiat, setInputFiat] = useState('$0.00');
  const [percentage, setPercentage] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { setAmountRaw, getSwapQuote, cleanRoute, swapQuote } = useSwapStore(
    state => ({
      setAmountRaw: state.actions.setAmountRaw,
      getSwapQuote: state.actions.getSwapQuote,
      cleanRoute: state.actions.cleanRoute,
      swapQuote: state.swapQuote,
    })
  );

  const startQuoting = () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      inputBalance === '' || 0 ? cleanRoute() : getSwapQuote();
    }, 300);
    setTimer(newTimer);
  };

  //* Clean the route when unmount
  useEffect(() => {
    return () => cleanRoute();
  }, []);

  //* When change the input balance
  useEffect(() => {
    //* Get the swap quote
    if (type === 'input') {
      //* For waiting to the user to write down the input
      startQuoting();
    }
  }, [type === 'input' ? inputBalance : swapQuote?.inAmount]);

  //* When change token
  useEffect(() => {
    startQuoting();
    if (type === 'input') {
      if (swapQuote?.inAmount) {
        setInputBalance(swapQuote?.inAmount);

        setInputFiat(
          displayCurrency(Number(swapQuote?.inAmount) * Number(token?.price))
        );

        //* For waiting to the user to write down the input
      } else {
        setInputBalance('');
        setInputFiat('$0.00');
      }
    }
  }, [token]);

  //* For reflecting the output balance
  useEffect(() => {
    if (type === 'output') {
      if (swapQuote?.outAmount) {
        setInputBalance(swapQuote?.outAmount);

        setInputFiat(
          displayCurrency(Number(swapQuote?.outAmount) * Number(token?.price))
        );
      } else {
        setInputBalance('');
        setInputFiat('$0.00');
      }
    }
  }, [swapQuote?.outAmount, swapQuote?.to]);

  const handleChange = (valueAsString: string, valueAsNumber: number) => {
    setInputBalance(valueAsString);
    if (valueAsString === '') {
      setInputFiat('$0.00');
    } else {
      setInputFiat(displayCurrency(valueAsNumber * Number(token?.price)));
    }
    setPercentage(0);
    if (type === 'input') {
      setAmountRaw(valueAsNumber === 0 ? '0' : valueAsString);
    }
  };

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    const ax = getBalanceInEther(
      (BigInt(token?.balanceWei!) * BigInt(e.currentTarget.value)) /
        BigInt(100),
      token?.decimals as number
    );
    const newInputBalance =
      e.currentTarget.value !== '100'
        ? (Number(token?.balance) * Number(e.currentTarget.value)) / 100
        : Number(token?.balance);

    setInputBalance(ax.toString());
    setInputFiat(displayCurrency(newInputBalance * Number(token?.price)));
    setPercentage(Number(e.currentTarget.value));
    if (type === 'input') {
      setAmountRaw(ax as string);
      console.log(ax as string);
    }
  };
  const handleOnClickText = (): void => {
    if (type === 'output') return;
    const ax = getBalanceInEther(
      BigInt(token?.balanceWei!),
      token?.decimals as number
    );
    const newInputBalance = token?.balance as number;
    setInputBalance(ax.toString());
    setInputFiat(displayCurrency(newInputBalance * Number(token?.price)));
    setPercentage(100);
  };
  return {
    inputBalance,
    inputFiat,
    percentage,
    handleChange,
    handleOnClick,
    handleOnClickText,
  };
};

export default useInputSwap;
