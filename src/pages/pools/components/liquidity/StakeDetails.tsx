import useStakeData from '@/hooks/pools/useStakeData';
import { displayNumber } from '@/utils/formatNumbers';
import { HStack, Stack, Text } from '@chakra-ui/react';

const StakeDetails = () => {
  const { poolType, slippage, depositedLp, newStake, currentStake } =
    useStakeData();

  return (
    <Stack fontSize={'md'} letterSpacing={'wider'} w={'-webkit-fill-available'}>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">Pool Type</Text>
        <Text color="green.500">{poolType}</Text>
      </HStack>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">New Stake</Text>
        <Text color="green.500">{displayNumber(newStake)} LP</Text>
      </HStack>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">Deposited LP</Text>
        <Text color="green.500">{displayNumber(depositedLp)} LP</Text>
      </HStack>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">Current Stake</Text>
        <Text color="green.500">{displayNumber(currentStake)} LP</Text>
      </HStack>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">Slippage Tolerance</Text>
        <Text color="green.500">{slippage}%</Text>
      </HStack>
    </Stack>
  );
};

export default StakeDetails;
