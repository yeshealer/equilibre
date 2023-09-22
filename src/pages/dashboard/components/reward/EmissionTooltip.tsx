import EquilibreCard from '@/components/core/Card';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Vote } from '@/interfaces/Vote';
import { displayNumber, formatCurrency } from '@/utils/formatNumbers';
import { HStack, Tooltip, Text, VStack, Flex } from '@chakra-ui/react';
import React from 'react';

export interface EmissionTooltipData {
  images: { logoURI: string }[];
  description: string;
  rewardTokens: { logoURI: string, amount: number }[];
}

interface EmissionTooltipProps {
  data: EmissionTooltipData[];
  children: React.ReactNode;
}
const EmissionTooltip: React.FC<EmissionTooltipProps> = ({ data, children }) => {
  return (
    <>
      <Tooltip
        borderRadius={25}
        marginLeft={4}
        // w='1200px'
        label={
          <VStack>
            {data.map((item, index) => (
              <HStack key={index} mb={1} mt={1} gap={4} width={"100%"}>
                <Flex>
                  {item.images.map((image: any, index) => (
                    <EquilibreAvatar
                      key={index}
                      src={image.logoURI}
                      size={'xs'}
                      marginLeft={!index ? 0 : -2}
                    />
                  ))}
                </Flex>
                <Text color={'green.500'} fontSize={'md'}>
                  {item.description}
                </Text>
                <Flex>
                  {item.rewardTokens.map((token: any, index) => (
                    <Flex>
                      <EquilibreAvatar
                        key={index}
                        src={token.logoURI}
                        size={'xs'}
                      // marginLeft={!index ? 0 : -2}
                      />
                      <Text marginLeft={2} color={'green.500'} fontSize={'md'}>
                        {displayNumber(token.amount)}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </HStack>
            ))}
          </VStack>
        }>
        {children}
      </Tooltip>
    </>
  );
};

export default EmissionTooltip;
