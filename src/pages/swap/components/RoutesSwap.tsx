import EquilibreCard from '@/components/core/Card';
import { Route, SubRoute, Token } from '@/interfaces';
import { useSwapStore } from '@/store/features/swap/swapStore';
import { Box, HStack, Text } from '@chakra-ui/react';
import { shallow } from 'zustand/shallow';
import InOutToken from './routing/InOutToken';
import PercentageBox from './routing/PercentageBox';
import RouteToken from './routing/RouteToken';

const RoutesSwap = () => {
  const { inputAsset, outputAsset, displayRoute, swapQuote, isFetching } =
    useSwapStore(
      state => ({
        inputAsset: state.inputAsset,
        outputAsset: state.outputAsset,
        displayRoute: state.displayRoute,
        swapQuote: state.swapQuote,
        isFetching: state.isFetching,
      }),
      shallow
    );

  return displayRoute && swapQuote?.routes && !isFetching ? (
    <EquilibreCard>
      {/* IN AND OUT TOKENS */}
      <HStack justifyContent={'space-between'}>
        <InOutToken balance={swapQuote?.inAmount} token={inputAsset as Token} />
        <InOutToken
          balance={swapQuote?.outAmount}
          token={outputAsset as Token}
        />
      </HStack>

      {swapQuote.routes.map((route: Route, index: number) => {
        const color = ['pink.500', 'yellow.500', 'green.500'];

        const dashedBox =
          index === 0 ? (
            <Box
              mx={5}
              h={14}
              position={'relative'}
              borderBottomRadius={'xl'}
              borderBottom={'1px dashed'}
              borderRight={'1px dashed'}
              borderLeft={'1px dashed'}
            />
          ) : (
            <Box
              mx={5}
              h={20}
              mt={-9}
              position={'relative'}
              borderBottomRadius={'xl'}
              borderBottom={'1px dashed'}
              borderRight={'1px dashed'}
              borderLeft={'1px dashed'}
            />
          );
        return (
          <>
            {dashedBox}
            <HStack
              justifyContent={'space-between'}
              mx={5}
              mt={-8}
              mb={-4}
              zIndex={20}>
              <PercentageBox
                percentage={route.percentage}
                borderColor={color[index % 3]}
              />
              <HStack zIndex={20}>
                {route.subRoutes.map((subRoute: SubRoute) => {
                  return (
                    <RouteToken
                      token={subRoute.to}
                      borderColor={color[index % 3]}
                    />
                  );
                })}
              </HStack>
              <Box w={'20'} h={'10'}></Box>
            </HStack>
          </>
        );
      })}

      {/* FOOTER */}
      <HStack justifyContent={'center'} mt={12}>
        <Text
          mt={0.5}
          fontSize={'xl'}
          fontFamily={'Arista'}
          color={'whiteAlpha.400'}>
          Powered by
        </Text>
        <Text fontSize={'xl'}>
          {swapQuote.type === 'internal' ? 'Équilibre' : 'OpenOcean'}
        </Text>
      </HStack>
    </EquilibreCard>
  ) : (
    <></>
  );
};

export default RoutesSwap;
