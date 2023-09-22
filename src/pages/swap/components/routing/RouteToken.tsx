import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Token } from '@/interfaces';
import { Box, HStack, Text } from '@chakra-ui/react';

type RouteTokenProps = {
  token?: Token;
  percentage?: string | number;
  borderColor: string;
};

const RouteToken = ({ token, percentage, borderColor }: RouteTokenProps) => {
  return (
    <Box
      // boxSize={'5rem'}
      w={'max-content'}
      h={'fit-content'}
      px={4}
      py={2}
      bg="blue.600"
      border={'1px solid'}
      borderColor={borderColor}
      borderRadius={'xl'}
      fontSize={'xs'}
      alignItems={'center'}
      textAlign={'center'}>
      <HStack spacing={0}>
        <EquilibreAvatar src={token?.logoURI!} size={'xs'} mr={2} />
        <Text>{token?.symbol}</Text>
      </HStack>
      <Text color={borderColor}>100%</Text>
    </Box>
  );
};

export default RouteToken;
