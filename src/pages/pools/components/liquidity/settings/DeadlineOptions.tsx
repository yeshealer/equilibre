import { useLiquidityStore } from '@/store/features/liquidity/liquidityStore';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

const DeadlineOptions = () => {
  const { txDeadline } = useLiquidityStore();
  const { setTxDeadline } = useLiquidityStore().actions;
  const handleTxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTxDeadline((Number(e.target.value) * 60).toFixed(2));
  };

  return (
    <Stack spacing={2}>
      <Text>
        Transaction deadline{' '}
        <Tooltip
          label="Your transaction will revert if it is pending for more than this long. Only works for internal Équilibre swaps."
          fontSize="sm"
          placement="auto-start"
          px={3}
          py={2}
          rounded="xl"
          maxW="240px"
          fontWeight="normal"
          color={'whiteAlpha.900'}
          borderColor={'pink.500'}
          bg={'darkblue.500'}>
          <QuestionOutlineIcon ml="2px" mt="-2px" />
        </Tooltip>
      </Text>
      <InputGroup flex={'4'}>
        <NumberInput
          size={'sm'}
          variant={'outline'}
          precision={1}
          step={0.1}
          max={50}
          min={0}
          clampValueOnBlur={true}>
          <InputRightElement
            top={'-4px'}
            pointerEvents="none"
            color="gray.300"
            fontSize="sm"
            children="min"
          />
          <NumberInputField
            pr={10}
            placeholder={(Number(txDeadline) / 60).toString()}
            value={Number(txDeadline) / 60}
            onChange={handleTxInput}
          />
        </NumberInput>
      </InputGroup>
    </Stack>
  );
};

export default DeadlineOptions;
