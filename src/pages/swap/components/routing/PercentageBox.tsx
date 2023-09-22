import { Box, Text } from '@chakra-ui/react';

type PercentageBoxProps = {
  percentage: string | number;
  borderColor: string;
};
const PercentageBox = ({ percentage, borderColor }: PercentageBoxProps) => {
  return (
    <Box
      px={2}
      py={1}
      w={'max-content'}
      ml={'5'}
      bg="blue.600"
      border={'1px solid'}
      borderColor={borderColor}
      borderRadius={'xl'}
      zIndex={20}>
      <Text
        textAlign={'center'}
        fontSize={{ base: 'xs', lg: 'md' }}
        sx={{
          textWrap: 'nowrap',
        }}>
        {percentage} %
      </Text>
    </Box>
  );
};

export default PercentageBox;
