import { CONTRACTS } from '@/config/company';
import { useOnChainSwap } from '@/hooks/swap';
import { Button, Flex, IconButton, Stack, keyframes } from '@chakra-ui/react';
import { FiArrowDown, FiSettings } from 'react-icons/fi';
import InputSelector from './InputSwap';
import RouteDetails from './routing/RouteDetails';
import SwapOptions from './settings/SwapOptions';

const OnChainSwap = () => {
  const {
    inputAsset,
    outputAsset,
    handleOnClickSwitchAssets,
    handleOnClickSwap,
    isDisconnected,
    swapQuote,
    priceImpact,
  } = useOnChainSwap();

  const countDecimals = (value: string) => {
    if (Math.floor(Number(value)) === Number(value)) return 0;
    return value.split('.')[1]?.length || 0;
  };

  const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;
  return (
    <>
      <Stack direction={'row'}>
        <SwapOptions>
          <IconButton
            size={'md'}
            rounded={'full'}
            aria-label={'Swap Settings'}
            transition="transform .5s ease-in-out"
            _hover={{
              animation: `${rotate} 2s linear infinite`,
            }}
            icon={<FiSettings />}
          />
        </SwapOptions>
      </Stack>
      <Stack mb={4}>
        <InputSelector type="input" token={inputAsset} />
        <Flex justifyContent={'center'}>
          <IconButton
            zIndex={10}
            my={'-5 !important'}
            maxW={'15'}
            rounded="lg"
            bg="linear-gradient(#15204c 0 0) padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box;"
            border="1px solid transparent"
            color="white"
            size="md"
            fontSize="lg"
            transition="transform .5s ease-in-out"
            _hover={{
              transform: 'scale(1.02, 1.02) rotate(180deg)',
            }}
            aria-label="Switch currency"
            _focus={{ boxShadow: 'none' }}
            icon={<FiArrowDown size={'25px'} />}
            onClick={handleOnClickSwitchAssets}
          />
        </Flex>
        <InputSelector type="output" token={outputAsset} />
      </Stack>
      <RouteDetails />

      <Button
        onClick={handleOnClickSwap}
        isDisabled={
          isDisconnected ||
          !swapQuote ||
          !swapQuote?.routes ||
          countDecimals(swapQuote?.inAmount!) >
            (inputAsset?.decimals as number) ||
          Number(priceImpact) > 40
        }
        w={'100%'}>
        {inputAsset?.address === CONTRACTS.KAVA_ADDRESS &&
        outputAsset?.address === CONTRACTS.WKAVA_ADDRESS.toLowerCase()
          ? 'Wrap'
          : inputAsset?.address === CONTRACTS.WKAVA_ADDRESS.toLowerCase() &&
            outputAsset?.address === CONTRACTS.KAVA_ADDRESS
          ? 'Unwrap'
          : 'Swap'}
      </Button>
    </>
  );
};

export default OnChainSwap;
