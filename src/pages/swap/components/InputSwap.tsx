import { Token } from '@/interfaces';
import { displayNumber } from '@/utils/formatNumbers';
import {
  Avatar,
  Button,
  Flex,
  InputGroup,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useInputSwap } from '@/hooks/swap';
import TokenSelector from './tokenSelector/TokenSelector';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';

type InputSelectorProps = {
  type: 'input' | 'output';
  token?: Token;
};

const InputSelector = ({ type, token }: InputSelectorProps) => {
  const percentageInputs = [100, 75, 50, 25];
  const {
    inputBalance,
    inputFiat,
    percentage,
    handleChange,
    handleOnClick,
    handleOnClickText,
  } = useInputSwap({ type, token });

  return (
    <Stack>
      {type === 'input' && (
        <Stack direction={'row-reverse'}>
          {percentageInputs.map(input => {
            return (
              <Button
                key={input}
                size={'xs'}
                borderRadius={'md'}
                variant={percentage === input ? 'outlineSelected' : 'outline'}
                colorScheme="yellow"
                value={input}
                onClick={handleOnClick}>
                {input}%
              </Button>
            );
          })}
        </Stack>
      )}
      <Flex
        bg={'blue.500'}
        w={'inherit'}
        borderRadius={'lg'}
        border={'1px'}
        borderColor={'blue.400'}
        pt={'3'}
        pb={'5'}
        px={'3'}
        justifyContent={'space-between'}
        direction={'column'}>
        <Text
          textAlign={'right'}
          fontFamily={'Righteous'}
          fontSize={'sm'}
          onClick={handleOnClickText}>
          Balance: {displayNumber(token?.balance as number)}
        </Text>

        <Stack direction={'row'} alignItems={'center'} spacing={6}>
          <InputGroup flexDirection={'column'}>
            <NumberInput
              step={0.1}
              precision={token?.decimals as number}
              clampValueOnBlur={false}
              min={0}
              max={
                type === 'input'
                  ? Number(
                      Number(token?.balance).toFixed(token?.decimals as number)
                    )
                  : undefined
              }
              colorScheme="white"
              variant={'unstyled'}
              value={inputBalance}
              isDisabled={type === 'output'}
              onChange={handleChange}>
              <NumberInputField
                fontSize={'3xl'}
                placeholder="0"
                textAlign={'left'}
              />
            </NumberInput>
            <Text fontFamily={'Righteous'} fontSize={'sm'}>
              {inputFiat}
            </Text>
          </InputGroup>
          <TokenSelector type={type}>
            <Button
              borderRadius={'full'}
              variant={'outline'}
              colorScheme="yellow"
              display={'inline-flex'}
              justifyContent={'space-evenly'}>
              <EquilibreAvatar
                size={'xs'}
                name={token?.name}
                src={token?.logoURI!}
                ml={1}
              />
              <Text ml={1} mr={1}>
                {token?.symbol}
              </Text>
            </Button>
          </TokenSelector>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default InputSelector;
