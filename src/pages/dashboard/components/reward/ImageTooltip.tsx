import EquilibreCard from '@/components/core/Card';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Vote } from '@/interfaces/Vote';
import { formatCurrency } from '@/utils/formatNumbers';
import { HStack, Tooltip, Text, VStack, Flex } from '@chakra-ui/react';
import React from 'react';

export interface ImageTooltipData {
  images: { logoURI: string }[];
  description: string;
}

interface ImageTooltipProps {
  data: ImageTooltipData[];
  children: React.ReactNode;
}
const ImageTooltip: React.FC<ImageTooltipProps> = ({ data, children }) => {
  return (
    <>
      <Tooltip
        borderRadius={25}
        marginLeft={4}
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
              </HStack>
            ))}
          </VStack>
        }>
        {children}
      </Tooltip>
    </>
  );
};

export default ImageTooltip;
