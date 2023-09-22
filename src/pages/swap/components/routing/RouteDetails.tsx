import { displayNumber } from '@/utils/formatNumbers';
import { HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import { useRouteDetails } from '@/hooks/swap';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { WarningIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

interface PriceImpactMessageProps {
  color: string;
  text: string;
}

const PriceImpactMessage = ({ color, text }: PriceImpactMessageProps) => {
  return (
    <HStack
      border={'1px solid'}
      borderColor={`${color}.500`}
      bg={'#15204c'}
      borderRadius={'2xl'}
      p={5}
      justifyContent={'start'}>
      <WarningTwoIcon color={`${color}.500`} />
      <Text fontFamily="Arista" color={'gray.300'} pt={1}>
        {text}
      </Text>
    </HStack>
  );
};

const RouteDetails = () => {
  const {
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
  } = useRouteDetails();

  return (
    (isFetching && (
      <Stack justifyContent={'center'} alignItems={'center'} mb={4}>
        <Spinner />
      </Stack>
    )) ||
    (swapQuote?.routes && (
      <Stack mb={4} fontSize={'md'}>
        <HStack justifyContent={'space-between'}>
          <Text fontFamily="Arista">Rate</Text>
          <HStack>
            <Text color="green.500">
              {displayNumber(price, false, 4) + ' '}{' '}
              {priorityRate === 'input'
                ? outputAsset?.symbol + ' per ' + inputAsset?.symbol
                : inputAsset?.symbol + ' per ' + outputAsset?.symbol}
            </Text>
            <HiOutlineSwitchHorizontal onClick={handleRateSwitch} />
          </HStack>
        </HStack>
        <HStack justifyContent={'space-between'}>
          <Text fontFamily="Arista">Swap Fee</Text>
          <Text color="green.500">
            {displayNumber(swapFee, true, 2) + ' ' + inputAsset?.symbol}
          </Text>
        </HStack>
        <HStack justifyContent={'space-between'}>
          <Text
            fontFamily={Number(priceImpact) < 4 ? 'Arista' : 'Righteous'}
            color={
              Number(priceImpact) < 4
                ? 'gray.300'
                : Number(priceImpact) < 10
                ? 'yellow.500'
                : 'pink.500'
            }>
            {Number(priceImpact) < 4
              ? ''
              : Number(priceImpact) < 10
              ? 'Medium '
              : 'High '}
            {'Price Impact'}
          </Text>
          <Text
            color={
              Number(priceImpact) < 4
                ? 'green.500'
                : Number(priceImpact) < 10
                ? 'yellow.500'
                : 'pink.500'
            }>
            {displayNumber(priceImpact)}%
          </Text>
        </HStack>
        <HStack justifyContent={'space-between'}>
          <Text fontFamily="Arista">Minimum Receive</Text>
          <Text color="green.500">
            {displayNumber(minimumReceive) + ' ' + outputAsset?.symbol}
          </Text>
        </HStack>
        <HStack justifyContent={'space-between'}>
          <Text fontFamily="Arista">Slippage Tolerance</Text>
          <Text color="green.500">{slippage}%</Text>
        </HStack>
        {isTaxedTokenInRoute && (
          <HStack
            border={'1px solid'}
            borderColor={'pink.500'}
            bg={'#15204c'}
            borderRadius={'2xl'}
            p={5}
            justifyContent={'start'}>
            <WarningIcon color={'pink.500'} />
            <Text fontFamily="Arista" color={'gray.300'} pt={1}>
              There is a taxed token in the selected liquidity route. Consider
              increasing your slippage.
            </Text>
          </HStack>
        )}
        {(Number(priceImpact) > 4 && Number(priceImpact) < 10 && (
          <PriceImpactMessage
            color={'yellow'}
            text={
              'Price Impact is high. Consider decreasing the amount or confirm.'
            }
          />
        )) ||
          (Number(priceImpact) > 10 && Number(priceImpact) < 40 && (
            <PriceImpactMessage
              color={'pink'}
              text={
                'Price Impact is high. Consider decreasing the amount or confirm.'
              }
            />
          )) ||
          (Number(priceImpact) > 40 && (
            <PriceImpactMessage
              color={'red'}
              text={
                'Price Impact is too high to continue. Consider decreasing the amount.'
              }
            />
          ))}
      </Stack>
    )) || <></>
  );
};

export default RouteDetails;
