import { Pair, Token } from '@/interfaces';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
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
import { MouseEvent, useEffect, useState } from 'react';
import SingleTokenSelector from './tokenSelector/SingleTokenSelector';
import BigNumber from 'bignumber.js';
import PairSelector from './pairSelector/SinglePairSelector';
import EquilibreAvatar from './EquilibreAvatar';
type InputSelectorProps = {
  showPercentages: boolean;
  pair: Pair;
  handlePairOnClick: (pair: Pair) => void;
  inputBalance: string;
  setInputBalance: (value: string) => void;
  isDisabled?: boolean;
};

const SelectPair = ({
  showPercentages,
  pair,
  handlePairOnClick,
  inputBalance,
  setInputBalance,
  isDisabled,
}: InputSelectorProps) => {
  const percentageInputs = [100, 75, 50, 25];
  const [percentage, setPercentage] = useState(0);
  const [inputFiat, setInputFiat] = useState('$0.00');

  const calcPriceOfPair = (balance: number | string) => {
    return BigNumber(balance)
      .div(pair.totalSupply!)
      .times(pair.reserve0)
      .times(pair.token0.price)
      .plus(
        BigNumber(balance)
          .div(pair.totalSupply!)
          .times(pair.reserve1)
          .times(pair.token1.price)
      )
      .toFixed(2);
  };

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>): void => {
    const newInputBalance =
      e.currentTarget.value === '100'
        ? Number(pair.balanceStaked)
        : (Number(pair?.balanceStaked) * Number(e.currentTarget.value)) / 100;
    setInputBalance(newInputBalance.toString());
    setInputFiat(displayCurrency(calcPriceOfPair(newInputBalance)));
    setPercentage(Number(e.currentTarget.value));
  };
  const handleChange = (valueAsString: string, valueAsNumber: number): void => {
    setInputBalance(valueAsString);
    if (valueAsString === '') {
      setInputFiat('$0.00');
    } else {
      setInputFiat(displayCurrency(calcPriceOfPair(inputBalance)));
    }
    setPercentage(0);
  };
  useEffect(() => {
    if (inputBalance === '') {
      setInputFiat('$0.00');
      setPercentage(0);
    } else {
      setInputFiat(displayCurrency(calcPriceOfPair(inputBalance)));
    }
  }, [inputBalance, pair]);

  return (
    <Stack w={'-webkit-fill-available'}>
      {showPercentages && (
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
        borderRadius={'lg'}
        border={'1px'}
        borderColor={'blue.400'}
        pt={'3'}
        pb={'5'}
        px={'3'}
        justifyContent={'space-between'}
        direction={'column'}>
        <Text textAlign={'right'} fontFamily={'Righteous'} fontSize={'sm'}>
          Balance: {displayNumber(pair?.balanceStaked as number)}
        </Text>

        <Stack direction={'row'} alignItems={'center'} spacing={6}>
          <InputGroup flexDirection={'column'}>
            <NumberInput
              step={0.1}
              min={0}
              max={Number(pair?.balanceStaked)}
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
          <PairSelector handlePairOnClick={handlePairOnClick}>
            <Button
              minW={'3xs'}
              borderRadius={'full'}
              variant={'outline'}
              colorScheme="yellow"
              display={'inline-flex'}
              justifyContent={'space-evenly'}
              isDisabled={isDisabled}>
              <EquilibreAvatar src={pair?.token0?.logoURI} size={'xs'} ml={1} />
              <EquilibreAvatar
                src={pair?.token1?.logoURI}
                size={'xs'}
                ml={-2}
              />
              <Text ml={1} mr={1}>
                {pair?.symbol.substring(5)}
              </Text>
            </Button>
          </PairSelector>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default SelectPair;
