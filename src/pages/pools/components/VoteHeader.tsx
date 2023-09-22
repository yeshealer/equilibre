import NftRadioGroup from '@/components/core/NftRadioGroup';
import useCountdown from '@/hooks/pools/useCountdown';
import useVeNFTs from '@/hooks/pools/useVeNFTs';
import useVoteGlobalData from '@/hooks/pools/useVoteGlobalData';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import {
  Flex,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

const VoteHeader = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { epochFinishes } = useVeNFTs();
  const [days, hours, minutes, seconds] = useCountdown(epochFinishes);
  const { avgApr, emissionsPerVote, totalVotes } = useVoteGlobalData();

  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      justifyContent={'space-between'}
      h={{
        base: 'max-content',
        lg: '192px',
      }}>
      {/* Global Data */}
      <Flex
        py={{ base: 4, lg: 8 }}
        flex={1}
        justifyContent={'space-evenly'}
        // alignItems={{ base: 'center', lg: 'start' }}
        direction={{ base: 'column', lg: 'column' }}
        gap={4}
        borderRight={isDesktop ? '1px solid' : 'none'}
        borderColor={'gray.600'}>
        <HStack
          justifyContent={'space-between'}
          px={4}
          pb={5}
          borderBottom={'1px solid'}
          borderColor={'gray.600'}>
          <Text fontFamily={'Arista'}>Average Voting APR</Text>
          {avgApr > 0 ? <Text>{displayNumber(avgApr)}%</Text> : <Text>-</Text>}
        </HStack>
        <HStack
          justifyContent={'space-between'}
          px={4}
          pb={5}
          borderBottom={'1px solid'}
          borderColor={'gray.600'}>
          <Text fontFamily={'Arista'}>Emissions / % of Vote</Text>
          {emissionsPerVote > 0 ? (
            <Text>{displayCurrency(emissionsPerVote)}</Text>
          ) : (
            <Text>-</Text>
          )}
        </HStack>
        <HStack justifyContent={'space-between'} px={4}>
          <Text fontFamily={'Arista'}>Total Votes</Text>
          {totalVotes > 0 ? (
            <Text>{displayNumber(totalVotes)}</Text>
          ) : (
            <Text>-</Text>
          )}
        </HStack>
      </Flex>
      {/* Epoch Timer */}
      <Flex
        flex={2}
        direction={'column'}
        alignItems={'center'}
        justifyContent={'start'}
        py={{ base: 2, lg: 10 }}>
        <Text fontSize={'2xl'} fontFamily={'Arista'}>
          Next Flip in:
        </Text>
        <Text color={'green.500'} fontSize={'2.75rem'}>
          {days < 1
            ? `${hours}h ${minutes}m ${seconds}s`
            : `${days}d ${hours}h ${minutes}m`}
        </Text>
      </Flex>
      {/* NFTs list */}
      <Flex
        flex={1}
        direction={'column'}
        alignItems={'center'}
        justifyContent={'start'}
        gap={1}
        py={3}
        borderLeft={isDesktop ? '1px solid' : 'none'}
        borderColor={isDesktop ? 'gray.600' : 'none'}>
        <NftRadioGroup padding={6} />
      </Flex>
    </Stack>
  );
};

export default VoteHeader;
