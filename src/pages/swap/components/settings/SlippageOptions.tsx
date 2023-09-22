import { useSwapStore } from '@/store/features/swap/swapStore';
import { displayNumber } from '@/utils/formatNumbers';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

const SlippageOptions = () => {
  const { slippage } = useSwapStore();
  const { setSlippage } = useSwapStore().actions;
  const slippageOptions = ['0.5', '1', '2'];
  console.log(slippage);
  console.log(slippageOptions.includes(slippage));

  const handleSlippageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setSlippage('2');
      return;
    }
    if (Number(e.target.value) > 50) {
      setSlippage('50');
      return;
    }
    setSlippage(e.target.value);
  };

  return (
    <Stack spacing={2} mb={8}>
      <Text>
        Slippage tolerance{' '}
        <Tooltip
          label="Your transaction will revert if the price change unfavourably by more than this percentage."
          fontSize="sm"
          placement="right"
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

      <Stack direction="row" alignItems={'center'}>
        {slippageOptions.map(option => {
          return (
            <Button
              flex="1"
              size="sm"
              rounded="lg"
              fontWeight="normal"
              colorScheme="yellow"
              variant={slippage === option ? 'outlineSelected' : 'outline'}
              onClick={() => {
                setSlippage(option);
              }}>
              {option}%
            </Button>
          );
        })}
        <InputGroup flex={'5'}>
          <NumberInput
            size={'sm'}
            variant={'outline'}
            precision={2}
            step={0.1}
            max={50}
            min={0}
            clampValueOnBlur={true}
            borderColor={
              slippageOptions.includes(slippage) ? 'gray.500' : 'yellow.500'
            }>
            <InputRightElement
              top={'-3px'}
              pointerEvents="none"
              color="gray.300"
              fontSize="sm"
              children="%"
            />
            <NumberInputField
              placeholder={displayNumber(slippage)}
              _placeholder={{
                color: slippageOptions.includes(slippage)
                  ? 'gray.500'
                  : 'gray.300',
              }}
              _focus={{
                color: 'yellow.500',
              }}
              onChange={handleSlippageInput}
            />
          </NumberInput>
        </InputGroup>
      </Stack>
    </Stack>
  );
};

export default SlippageOptions;
