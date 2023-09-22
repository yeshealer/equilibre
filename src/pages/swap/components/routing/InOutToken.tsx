import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Token } from '@/interfaces';
import { displayNumber } from '@/utils/formatNumbers';
import { Box, Text } from '@chakra-ui/react';

type InOutTokenProps = {
  balance?: string | number;
  token?: Token;
};

const InOutToken = ({ balance, token }: InOutTokenProps) => {
  return (
    <Box
      px={4}
      py={2}
      bg="blue.600"
      border={'1px solid'}
      borderColor={'blue.400'}
      borderRadius={'xl'}
      fontSize={'xs'}
      alignItems={'center'}
      display={'inline-flex'}
      flexDirection={'row'}>
      <EquilibreAvatar src={token?.logoURI!} size={'xs'} mr={2} />
      <Text>
        {balance ? displayNumber(balance) : '0.0'} {token?.symbol}
      </Text>
    </Box>
  );
};

export default InOutToken;
