import { apiOpenOcean } from './apiOpenOcean';

interface FetchRouteProps {
  inTokenAddress: string;
  outTokenAddress: string;
  amountRaw: string;
  slippage: string;
  gasPrice: string;
  account?: string;
}

export const fetchQuote = async ({
  inTokenAddress,
  outTokenAddress,
  amountRaw,
  slippage,
  gasPrice,
}: FetchRouteProps) => {
  return await apiOpenOcean.get('/quote', {
    params: {
      inTokenAddress: inTokenAddress,
      outTokenAddress: outTokenAddress,
      amount: amountRaw,
      slippage: slippage,
      gasPrice: gasPrice,
      disabledDexIds: '1,3',
    },
  });
};

export const fetchSwapQuote = async ({
  inTokenAddress,
  outTokenAddress,
  amountRaw,
  slippage,
  gasPrice,
  account,
}: FetchRouteProps) => {
  return await apiOpenOcean.get('/swap_quote', {
    params: {
      inTokenAddress: inTokenAddress,
      outTokenAddress: outTokenAddress,
      amount: amountRaw,
      slippage: slippage,
      gasPrice: gasPrice,
      disabledDexIds: '1,3',
      account: account,
    },
  });
};
