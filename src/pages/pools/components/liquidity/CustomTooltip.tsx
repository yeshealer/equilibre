import EquilibreCard from '@/components/core/Card';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Pair, Token } from '@/interfaces';
import { formatCurrency } from '@/utils/formatNumbers';
import { HStack, Tooltip, Text } from '@chakra-ui/react';
import React from 'react';

interface CustomTooltipProps {
  tokens: Array<Token>;
  values: Array<number>;
  children: React.ReactNode;
}
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  tokens,
  values,
  children,
}) => {
  return (
    <Tooltip
      label={
        <>
          {tokens.map((token, index) => (
            <HStack justifyContent={'space-between'} mb={1} mt={1}>
              <HStack>
                <EquilibreAvatar src={token.logoURI} size={'xs'} />
                <Text color={'gray.50'} fontSize={'xs'}>
                  {token.symbol}
                </Text>
              </HStack>
              <Text color={'green.500'} fontSize={'xs'}>
                {formatCurrency(values[index])}
              </Text>
            </HStack>
          ))}
        </>
      }>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
