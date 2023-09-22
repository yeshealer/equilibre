import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Token } from '@/interfaces';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import {
  Flex,
  HStack,
  Stack,
  InputGroup,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';

interface PairTokenInfoProps {
  token: Token;
  amount: string;
  value: string;
}

const PairTokenInfo = ({ token, amount, value }: PairTokenInfoProps) => {
  return (
    <Flex
      w={'44'}
      bg={'blue.500'}
      borderRadius={'lg'}
      border={'1px'}
      borderColor={'blue.400'}
      py={'3'}
      px={'6'}
      justifyContent={'space-between'}
      direction={'column'}>
      <HStack>
        <EquilibreAvatar src={token?.logoURI} size={'sm'} />
        <Text>{token?.symbol}</Text>
      </HStack>

      <Stack>
        <Text
          color={Number(amount) > 0 ? 'whiteAlpha.900' : 'whiteAlpha.400'}
          fontFamily={'Righteous'}
          fontSize={'3xl'}
          overflowX={'hidden'}
          whiteSpace={'nowrap'}
          textOverflow={'ellipsis'}>
          {displayNumber(amount)}
        </Text>
        <Text fontFamily={'Righteous'} fontSize={'sm'}>
          {displayCurrency(value)}
        </Text>
      </Stack>
    </Flex>
  );
};

export default PairTokenInfo;
