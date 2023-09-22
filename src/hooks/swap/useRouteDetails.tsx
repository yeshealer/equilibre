import { CONTRACTS } from '@/config/company';
import { Route } from '@/interfaces';
import { useSwapStore } from '@/store/features/swap/swapStore';
import { usePairStore } from '@/store/pairsStore';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

const useRouteDetails = () => {
  const {
    inputAsset,
    outputAsset,
    slippage,
    swapQuote,
    isFetching,
    priceImpact,
    cleanRoute,
    getFeePercentage,
    setPriceImpact,
  } = useSwapStore(
    state => ({
      inputAsset: state.inputAsset,
      outputAsset: state.outputAsset,
      slippage: state.slippage,
      displayRoute: state.displayRoute,
      swapQuote: state.swapQuote,
      isFetching: state.isFetching,
      cleanRoute: state.actions.cleanRoute,
      getFeePercentage: state.actions.getFeePercentage,
      priceImpact: state.priceImpact,
      setPriceImpact: state.actions.setPriceImpact,
    }),
    shallow
  );
  const { getPair } = usePairStore(state => ({
    getPair: state.actions.getPair,
  }));
  const [swapFee, setSwapFee] = useState(0);
  const [price, setPrice] = useState(0);
  const [priorityRate, setPriorityRate] = useState('input');
  const [minimumReceive, setMinimumReceive] = useState('');
  const [stableFee, setStableFee] = useState(0);
  const [volatileFee, setVolatileFee] = useState(0);
  const [isTaxedTokenInRoute, setIsTaxedTokenInRoute] = useState(false);
  //* MOVE THIS TO TOKENLIST
  const taxedTokens = [
    '0x74ccbe53f77b08632ce0cb91d3a545bf6b8e0979'.toLowerCase(), //fBOMB
    '0x5E237e61469d1A5b85fA8fba63EB4D4498Ea8dEF'.toLowerCase(), //YFX
    '0x0Fb3E4E84FB78C93E466a2117Be7bc8BC063E430'.toLowerCase(), //CHAM
    '0x990e157fC8a492c28F5B50022F000183131b9026'.toLowerCase(), //LION
    '0x471F79616569343e8e84a66F342B7B433b958154'.toLowerCase(), //TIGER
    '0x38481Fdc1aF61E6E72E0Ff46F069315A59779C65'.toLowerCase(), //BEAR
    '0xFa4384b298084A0ef13F378853DEDbB33A857B31'.toLowerCase(), //cpVARA
    '0x308F66EBEE21861D304C8013Eb3A9a5fC78A8a6c'.toLowerCase(), //SHRAP
  ];

  useEffect(() => {
    cleanRoute();
    const feesCall = async () => {
      const fees = await getFeePercentage();
      setStableFee(fees.stableFee);
      setVolatileFee(fees.volatileFee);
    };
    feesCall();
  }, []);
  useEffect(() => {
    if (
      swapQuote?.routes &&
      swapQuote?.inAmount &&
      swapQuote?.outAmount &&
      swapQuote.priceImpact &&
      swapQuote?.from?.price
    ) {
      if (
        (inputAsset?.address.toLowerCase() ===
          CONTRACTS.KAVA_ADDRESS.toLowerCase() &&
          outputAsset?.address.toLowerCase() ===
            CONTRACTS.WKAVA_ADDRESS.toLowerCase()) ||
        (inputAsset?.address.toLowerCase() ===
          CONTRACTS.WKAVA_ADDRESS.toLowerCase() &&
          outputAsset?.address.toLowerCase() ===
            CONTRACTS.KAVA_ADDRESS.toLowerCase())
      ) {
        setSwapFee(0);
        setMinimumReceive(swapQuote?.outAmount);
        setPrice(1);
        setPriceImpact('0');
        return;
      }
      const accFee = swapQuote.routes.reduce(
        (accRoute: number, route: Route) => {
          return route.subRoutes.reduce((acc: number, subRoute: any) => {
            return subRoute.pairIsStable ? acc + stableFee : acc + volatileFee;
          }, accRoute);
        },
        0
      );
      setSwapFee((Number(swapQuote.inAmount) * accFee) / 100);
      setMinimumReceive(swapQuote?.outAmount);
      setPrice(Number(swapQuote?.outAmount) / Number(swapQuote?.inAmount));
      setPriceImpact(
        Number(swapQuote?.priceImpact) < 0 ? '0' : swapQuote?.priceImpact
      );
      if (swapQuote?.routes) {
        const isTaxedTokenInRoute = swapQuote?.routes.some(route => {
          return route.subRoutes.some(subRoute => {
            const pair = getPair(subRoute.pairAddress);
            return (
              taxedTokens.includes(pair?.token0?.address!) ||
              taxedTokens.includes(pair?.token1?.address!)
            );
          });
        });
        setIsTaxedTokenInRoute(isTaxedTokenInRoute);
      }
    }
  }, [swapQuote]);
  const handleRateSwitch = (): void => {
    setPrice(1 / price);
    setPriorityRate(priorityRate === 'input' ? 'output' : 'input');
  };
  return {
    isFetching,
    swapQuote,
    inputAsset,
    outputAsset,
    swapFee,
    priceImpact,
    minimumReceive,
    slippage,
    price,
    handleRateSwitch,
    priorityRate,
    isTaxedTokenInRoute,
  };
};

export default useRouteDetails;
