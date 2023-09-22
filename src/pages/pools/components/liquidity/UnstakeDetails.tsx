import useStakeData from '@/hooks/pools/useStakeData';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import { HStack, Stack, Text } from '@chakra-ui/react';

const UnstakeDetails = () => {
  const { stakedValue, depositedLp, currentStake } = useStakeData();

  return (
    <Stack fontSize={'md'} letterSpacing={'wider'} w={'-webkit-fill-available'}>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">Staked Value</Text>
        <Text color="green.500">{displayCurrency(stakedValue)}</Text>
      </HStack>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">Deposited LP</Text>
        <Text color="green.500">{displayNumber(depositedLp)} LP</Text>
      </HStack>
      <HStack justifyContent={'space-between'}>
        <Text fontFamily="Arista">Current Stake</Text>
        <Text color="green.500">{displayNumber(currentStake)} LP</Text>
      </HStack>
    </Stack>
  );
};

export default UnstakeDetails;
