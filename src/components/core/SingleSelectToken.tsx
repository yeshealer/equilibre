import { Token } from '@/interfaces';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import {
  Avatar,
  Button,
  Flex,
  HStack,
  InputGroup,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MouseEvent, useEffect, useState } from 'react';
import SingleTokenSelector from './tokenSelector/SingleTokenSelector';
import EquilibreAvatar from './EquilibreAvatar';
type InputSelectorProps = {
  showPercentages: boolean;
  showTokenSelector?: boolean;
  dropGasToken?: boolean;
  token?: Token;
  handleTokenOnClick: (token: Token) => void;
  inputBalance: string;
  setInputBalance: (value: string) => void;
  priorityAsset?: number;
  setPriorityAsset?: (value: number) => void;
  isDisabled?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
};

const SingleSelectToken = ({
  showPercentages,
  showTokenSelector = true,
  dropGasToken,
  token,
  handleTokenOnClick,
  inputBalance,
  setInputBalance,
  priorityAsset,
  setPriorityAsset,
  isDisabled,
  showBackButton = false,
  onBack,
}: InputSelectorProps) => {
  const percentageInputs = [100, 75, 50, 25];
  const [percentage, setPercentage] = useState(0);
  const [inputFiat, setInputFiat] = useState('$0.00');

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>): void => {
    const newInputBalance =
      e.currentTarget.value === '100'
        ? (token?.balance as number)
        : (Number(token?.balance) * Number(e.currentTarget.value)) / 100;
    setInputBalance(newInputBalance.toString());
    setInputFiat(displayCurrency(newInputBalance * Number(token?.price)));
    setPercentage(Number(e.currentTarget.value));
    if (priorityAsset && setPriorityAsset) setPriorityAsset(priorityAsset);
  };
  const handleOnClickText = (): void => {
    const newInputBalance = token?.balance as number;
    setInputBalance(newInputBalance.toString());
    setInputFiat(displayCurrency(newInputBalance * Number(token?.price)));
    setPercentage(100);
    if (priorityAsset && setPriorityAsset) setPriorityAsset(priorityAsset);
  };
  const handleChange = (valueAsString: string, valueAsNumber: number): void => {
    setInputBalance(valueAsString);
    if (valueAsString === '') {
      setInputFiat('$0.00');
    } else {
      setInputFiat(displayCurrency(valueAsNumber * Number(token?.price)));
    }
    setPercentage(0);
    if (priorityAsset && setPriorityAsset) setPriorityAsset(priorityAsset);
  };
  useEffect(() => {
    if (inputBalance === '') {
      setInputFiat('$0.00');
      setPercentage(0);
    } else {
      setInputFiat(
        displayCurrency(Number(inputBalance) * Number(token?.price))
      );
    }
  }, [inputBalance, token]);

  return (
    <Stack w={'-webkit-fill-available'}>
      <HStack justifyContent={'space-between'}>
        {showBackButton && (
          <Stack justifySelf={'start'}>
            <Button
              maxH={6}
              minW={6}
              colorScheme="pink"
              variant={'outlineSelected'}
              fontSize={15}
              padding={0}
              onClick={onBack}>
              {`<`}
            </Button>
          </Stack>
        )}
        {showPercentages && (
          <Stack width={'100%'} direction={'row-reverse'} justifySelf={'end'}>
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
      </HStack>
      <Flex
        bg={'blue.500'}
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
              min={0}
              max={Number(token?.balance)}
              colorScheme="white"
              variant={'unstyled'}
              value={inputBalance}
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
          {showTokenSelector ? (
            <SingleTokenSelector
              handleTokenOnClick={handleTokenOnClick}
              dropGasToken={dropGasToken}>
              <Button
                isDisabled={isDisabled}
                borderRadius={'full'}
                variant={'outline'}
                colorScheme="yellow"
                display={'inline-flex'}
                justifyContent={'space-evenly'}>
                <EquilibreAvatar src={token?.logoURI!} size={'xs'} ml={1} />
                <Text ml={1} mr={1}>
                  {token?.symbol}
                </Text>
              </Button>
            </SingleTokenSelector>
          ) : (
            <Button
              borderRadius={'full'}
              variant={'outline'}
              colorScheme="yellow"
              display={'inline-flex'}
              isActive={true}
              justifyContent={'space-evenly'}>
              <EquilibreAvatar src={token?.logoURI!} size={'xs'} ml={1} />
              <Text ml={1} mr={1}>
                {token?.symbol}
              </Text>
            </Button>
          )}
        </Stack>
      </Flex>
    </Stack>
  );
};

export default SingleSelectToken;
