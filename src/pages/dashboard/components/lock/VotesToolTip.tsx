import EquilibreCard from '@/components/core/Card';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Vote } from '@/interfaces/Vote';
import { displayNumber, formatCurrency } from '@/utils/formatNumbers';
import { HStack, Tooltip, Text } from '@chakra-ui/react';
import React from 'react';

interface VotesTooltipProps {
  votes: Array<Vote>;
  children: React.ReactNode;
}
const VotesTooltip: React.FC<VotesTooltipProps> = ({ votes, children }) => {
  return (
    <>
      <Tooltip
        borderRadius={25}
        label={
          <>
            {votes.map((vote, index) => (
              <HStack
                key={index}
                justifyContent={'space-between'}
                mb={1}
                mt={1}>
                <HStack>
                  <HStack>
                    <EquilibreAvatar
                      src={vote.pair.token0.logoURI}
                      size={'xs'}
                    />
                    <EquilibreAvatar
                      src={vote.pair.token1.logoURI}
                      size={'xs'}
                      marginLeft={'-1rem'}
                    />
                  </HStack>
                  <Text color={'green.500'} fontSize={'md'}>
                    {`${displayNumber(vote.percent)}%`}
                  </Text>
                </HStack>
              </HStack>
            ))}
          </>
        }>
        {children}
      </Tooltip>
    </>
  );
};

export default VotesTooltip;
