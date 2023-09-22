import generateToast from '@/components/toast/generateToast';
import { CONTRACTS } from '@/config/company';
import { Pair, Route, SubRoute, SwapQuote, Token } from '@/interfaces';
import { readLibrary } from '@/lib/equilibre';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { usePairStore } from '@/store/pairsStore';
import {
  fetchBalance,
  fetchFeeData,
  fetchToken,
  getAccount,
  readContracts,
} from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { parseUnits } from 'viem';
import { fetchQuote, fetchSwapQuote } from './services/fetchRoute';
import { useSwapStore } from './swapStore';

const GAS_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/*********************************************************************************************/
// Functions to quote KAVA to WKAVA and viceversa
const quoteForWETH = (from: Token, to: Token, amount: string) => {
  return {
    from: from,
    to: to,
    inAmount: amount,
    outAmount: amount,
    routes: [
      {
        percentage: 100,
        subRoutes: [
          {
            from: from,
            to: to,
            pairAddress: '',
            pairIsStable: true,
            percentage: 100,
          },
        ],
      },
    ],
    priceImpact: '0',
    type: 'internal',
  } as SwapQuote;
};

const isWETHSwap = (from: Token, to: Token) => {
  const addresses = [CONTRACTS.WKAVA_ADDRESS, CONTRACTS.KAVA_ADDRESS].map(
    addr => addr.toLowerCase()
  );

  return (
    addresses.includes(to.address.toLowerCase()) &&
    addresses.includes(from.address.toLowerCase())
  );
};
/*********************************************************************************************/

/*********************************************************************************************/

// Function to get the amounts out
const _getAmountsOut = async (
  inAmount: string,
  paths: Route[],
  internalRouting: boolean
) => {
  const routerContract = {
    address: CONTRACTS.ROUTER_ADDRESS as `0x${string}`,
    abi: CONTRACTS.ROUTER_ABI,
    functionName: 'getAmountsOut',
  };

  let getAmountsOutMulticall = [];
  for (let path of paths) {
    const partialAmount = internalRouting
      ? parseUnits(
          `${Number(inAmount)}`,
          path.subRoutes[0].from.decimals as number
        )
      : parseUnits(
          `${(Number(inAmount) * path.percentage) / 100}`,
          path.subRoutes[0].from.decimals as number
        );

    const routes: {
      from: `0x${string}`;
      to: `0x${string}`;
      stable: boolean;
    }[] = path.subRoutes.map((subRoute: SubRoute) => {
      return {
        from: subRoute.from.address,
        to: subRoute.to.address,
        stable: subRoute.pairIsStable,
      };
    });
    const argsFromSubRoutes = [partialAmount, routes];

    getAmountsOutMulticall.push({
      ...routerContract,
      args: argsFromSubRoutes,
    });
  }
  if (getAmountsOutMulticall.length === 0) return '0';
  let amountsOut: any = await readContracts({
    contracts: getAmountsOutMulticall,
  })
    .then(res => {
      return res.map((amounts: any) => ({
        amounts: amounts.result as number,
      }));
    })
    .catch(err => {
      console.log(err);
      return [];
    });
  return amountsOut;
};

// Gets the best route and calcs the price impact
const _calcBestAmountOutAndPriceImpact = async (
  inAmount: string,
  paths: Route[]
) => {
  const amountsOut = await _getAmountsOut(inAmount, paths, true);

  const to = useSwapStore.getState().outputAsset as Token;
  let newAmountsOut = [];
  for (let i = 0; i < amountsOut.length; i++) {
    if (amountsOut[i].amounts === undefined) {
      continue;
    }
    newAmountsOut.push({
      receiveAmounts: amountsOut[i],
      finalValue: BigNumber(
        amountsOut[i].amounts[amountsOut[i].amounts.length - 1]
      )
        .div(10 ** Number(to.decimals))
        .toFixed(Number(to.decimals)),
      route: paths[i],
    });
  }
  const bestAmountOut = newAmountsOut
    .filter((ret: any) => {
      return ret != null;
    })
    .reduce((best: any, current) => {
      if (!best) {
        return current;
      }
      return BigNumber(best.finalValue).gt(current.finalValue) ? best : current;
    }, 0);

  let totalRatio = '1';

  for (let j = 0; j < bestAmountOut.route.subRoutes.length; j++) {
    const amount: bigint = bestAmountOut.receiveAmounts.amounts[j] as bigint;
    const res = await readLibrary({
      functionName: 'getTradeDiff',
      args: [
        amount,
        bestAmountOut.route.subRoutes[j].from.address,
        bestAmountOut.route.subRoutes[j].to.address,
        bestAmountOut.route.subRoutes[j].pairIsStable,
      ],
    });

    const ratio = BigNumber(res[1].toString()).div(res[0].toString());
    totalRatio = BigNumber(totalRatio).times(ratio).toFixed(18);
  }

  const priceImpact = BigNumber(1).minus(totalRatio).times(100).toFixed(18);

  return {
    route: bestAmountOut.route,
    outAmount: bestAmountOut.finalValue,
    priceImpact,
  };
};

// Calculates the price impact (external routing)
const _calcPriceImpact = async (inAmount: string, paths: Route[]) => {
  const amountsOut = await _getAmountsOut(inAmount, paths, false);
  let totalRatio = '1';

  for (let i = 0; i < paths.length; i++) {
    for (let j = 0; j < paths[i].subRoutes.length; j++) {
      const amount: bigint = amountsOut[i].amounts[j] as bigint;
      const res = await readLibrary({
        functionName: 'getTradeDiff',
        args: [
          amount,
          paths[i].subRoutes[j].from.address.toLowerCase() ===
          CONTRACTS.KAVA_ADDRESS.toLowerCase()
            ? CONTRACTS.WKAVA_ADDRESS
            : paths[i].subRoutes[j].from.address,
          paths[i].subRoutes[j].to.address.toLowerCase() ===
          CONTRACTS.KAVA_ADDRESS.toLowerCase()
            ? CONTRACTS.WKAVA_ADDRESS
            : paths[i].subRoutes[j].to.address,
          paths[i].subRoutes[j].pairIsStable,
        ],
      });

      const ratio = BigNumber(res[1].toString()).div(res[0].toString());
      totalRatio = BigNumber(totalRatio).times(ratio).toFixed(18);
    }
  }

  const priceImpact = BigNumber(1).minus(totalRatio).times(100).toFixed(18);

  return priceImpact;
};

// Searches all possible routes given from and to tokens (internal routing)
const _computeRoutesForToken = (
  fromAddress: string,
  toAddress: string,
  pairs: Pair[],
  maxLength: number,
  currentPath: Array<Pair>,
  allPaths: Array<Array<Pair>>
) => {
  for (let pair of pairs) {
    if (
      currentPath.indexOf(pair) !== -1 ||
      !(
        pair.token0?.address === fromAddress ||
        pair.token1?.address === fromAddress
      ) ||
      pair.tvl === 0 ||
      pair.reserve0 < 0.005 ||
      pair.reserve1 < 0.005
    )
      continue;

    const newFromAddress =
      pair.token0.address === fromAddress
        ? pair.token1.address
        : pair.token0.address;

    if (newFromAddress === toAddress) {
      allPaths.push([...currentPath, pair]);
    } else if (maxLength > 1) {
      _computeRoutesForToken(
        newFromAddress,
        toAddress,
        pairs,
        maxLength - 1,
        [...currentPath, pair],
        allPaths
      );
    }
  }
};

// Prepares routes objects (internal routing)
const discoverRoutesForTokens = (pairs: Pair[], from: Token, to: Token) => {
  const paths: Array<Array<Pair>> = [];
  // TODO: MOVE TO ENV
  const ROUTE_MAX_LENGTH = 3;
  _computeRoutesForToken(
    from.address,
    to.address,
    pairs,
    ROUTE_MAX_LENGTH,
    [],
    paths
  );
  const routes: Route[] = [];
  let fromAsset: Token, toAsset: Token, subRoutes: SubRoute[];

  for (let path of paths) {
    fromAsset = from;
    subRoutes = [];
    for (let subRoute of path) {
      toAsset =
        subRoute.token0.address === fromAsset.address
          ? subRoute.token1
          : subRoute.token0;
      subRoutes.push({
        from: fromAsset,
        to: toAsset,
        pairAddress: subRoute.address,
        pairIsStable: subRoute.stable,
        percentage: 100,
      });

      fromAsset = toAsset;
    }
    routes.push({ percentage: 100, subRoutes: subRoutes });
  }
  return routes;
};

const _internalRouting = async () => {
  try {
    const { inputAsset, outputAsset, amountRaw, slippage } =
      useSwapStore.getState();
    if (Number(amountRaw) > 0) {
      const { getBaseAsset } = useBaseAssetStore.getState().actions;
      const { pairs } = usePairStore.getState();

      // If we swap from WKAVA to KAVA or KAVA to WKAVA
      if (isWETHSwap(inputAsset as Token, outputAsset as Token)) {
        return quoteForWETH(
          inputAsset as Token,
          outputAsset as Token,
          amountRaw
        );
      }
      let inputAux = inputAsset as Token;
      let outputAux = outputAsset as Token;

      // Check if routing is from KAVA in order to use WKAVA
      if (inputAux.address === CONTRACTS.KAVA_ADDRESS) {
        inputAux = getBaseAsset(CONTRACTS.WKAVA_ADDRESS) as Token;
      } else if (outputAux.address === CONTRACTS.KAVA_ADDRESS) {
        outputAux = getBaseAsset(CONTRACTS.WKAVA_ADDRESS) as Token;
      }
      const routes: Route[] = discoverRoutesForTokens(
        pairs,
        inputAux,
        outputAux
      );

      const from = inputAsset as Token;
      const to = outputAsset as Token;
      const inAmount = amountRaw;
      const { route, outAmount, priceImpact } =
        await _calcBestAmountOutAndPriceImpact(inAmount, routes);

      const swapQuote: SwapQuote = {
        from: from,
        to: to,
        inAmount: inAmount,
        outAmount: outAmount,
        routes: [route],
        priceImpact: priceImpact,
        type: 'internal',
      };

      return swapQuote;
    }
  } catch (error) {
    console.log(error);
    generateToast(
      'Valid route not found',
      'Cannot find a valid route for the given tokens',
      'error'
    );
    return {} as SwapQuote;
  }
};
/*********************************************************************************************/

const _getRoute = async () => {
  const { inputAsset, outputAsset, amountRaw, slippage } =
    useSwapStore.getState();

  if (Number(amountRaw) > 0) {
    const gasPrice = (await fetchFeeData()).gasPrice;
    const account = getAccount().address;
    const { getBaseAsset } = useBaseAssetStore.getState().actions;
    const { getPair } = usePairStore.getState().actions;
    return await _internalRouting();
    if (
      inputAsset?.address === GAS_ADDRESS ||
      outputAsset?.address === GAS_ADDRESS
    ) {
      return await _internalRouting();
    }

    // OpenOcean routing
    return await fetchQuote({
      inTokenAddress:
        inputAsset?.symbol === 'KAVA'
          ? GAS_ADDRESS
          : (inputAsset?.address as string),
      outTokenAddress:
        outputAsset?.symbol === 'KAVA'
          ? GAS_ADDRESS
          : (outputAsset?.address as string),
      amountRaw: amountRaw,
      slippage: slippage,
      gasPrice: gasPrice?.toString() ?? '0',
      account: account as string,
    })
      .then(async res => {
        if (res.data.code !== 200 || res.data.data.outAmount === '0')
          throw new Error(JSON.stringify(res.data));
        const paths: Route[] = await Promise.all(
          res.data.data.path.routes.map(async (path: any) => ({
            percentage: path.percentage,
            subRoutes: await Promise.all(
              path.subRoutes.map(async (subRoute: any) => {
                const fromToken =
                  subRoute.from === ZERO_ADDRESS
                    ? getBaseAsset(GAS_ADDRESS)
                    : getBaseAsset(subRoute.from);
                let toToken =
                  subRoute.to === ZERO_ADDRESS
                    ? getBaseAsset(GAS_ADDRESS)
                    : getBaseAsset(subRoute.to);
                const pair = getPair(subRoute.dexes[0].id);
                //! Token is not whitelisted --> we search in chain
                if (!toToken) {
                  const tokenNotWhitelisted = await fetchToken({
                    address: subRoute.to,
                  });
                  toToken = {
                    price: 0,
                    stable: false,
                    address: tokenNotWhitelisted.address,
                    name: tokenNotWhitelisted.name,
                    symbol: tokenNotWhitelisted.symbol,
                    decimals: tokenNotWhitelisted.decimals,
                    logoURI: '',
                    liquidStakedAddress: '',
                    balance: (
                      await fetchBalance({
                        address: tokenNotWhitelisted.address,
                      })
                    ).formatted,
                  };
                }
                return {
                  from: fromToken,
                  to: toToken,
                  pairAddress: pair?.address,
                  pairIsStable: pair?.stable,
                  percentage: subRoute.dexes[0].percentage,
                } as SubRoute;
              })
            ),
          }))
        );

        const from = inputAsset as Token;
        const to = outputAsset as Token;
        const inAmount = formatUnits(res.data.data.inAmount, from.decimals);
        const outAmount = formatUnits(res.data.data.outAmount, to.decimals);
        const priceImpact = await _calcPriceImpact(inAmount, paths);
        const compiledResp = await fetchSwapQuote({
          inTokenAddress:
            inputAsset?.symbol === 'KAVA'
              ? GAS_ADDRESS
              : (inputAsset?.address as string),
          outTokenAddress:
            outputAsset?.symbol === 'KAVA'
              ? GAS_ADDRESS
              : (outputAsset?.address as string),
          amountRaw: amountRaw,
          slippage: slippage,
          gasPrice: gasPrice?.toString() ?? '0',
          account: account as string,
        });

        const swapQuote: SwapQuote = {
          from: from,
          to: to,
          inAmount: inAmount,
          outAmount: outAmount,
          routes: paths,
          priceImpact: priceImpact,
          type: 'external',
          externalData: compiledResp ? compiledResp.data.data : null,
        };

        return swapQuote;
      })
      .catch(async error => {
        console.log(error.message);
        return await _internalRouting();
      });
  }
};

export default _getRoute;
