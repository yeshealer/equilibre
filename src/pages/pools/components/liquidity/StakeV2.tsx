import SingleSelectToken from '@/components/core/SingleSelectToken';
import useStakeData from '@/hooks/pools/useStakeData';
import { Pair } from '@/interfaces';
import { Button, IconButton, Stack, Text, keyframes } from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';
import StakeDetails from './StakeDetails';
import StakeOptions from './settings/StakeOptions';
import useStakeDepositActions from '@/hooks/pools/useStakeDepositActions';
import { useRouter } from 'next/router';

const StakeV2 = () => {
  const {
    token0,
    token1,
    pair,
    handleToken0OnClick,
    handleToken1OnClick,
    inputToken0Balance,
    inputToken1Balance,
    setInputToken0Balance,
    setInputToken1Balance,
    setPriorityAsset,
    advancedMode,
  } = useStakeData();
  const {
    depositAndStakeLP,
    createPairAndStakeLP,
    depositLP,
    createPairAndDepositLP,
    isLoadingStake,
    isLoadingDeposit,
  } = useStakeDepositActions();
  const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;
  const router = useRouter();

  return (
    <Stack alignItems={'center'} spacing={4} py={2} maxW={'md'}>
      <Stack w={'-webkit-fill-available'} direction={'row'}>
        <StakeOptions>
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
        </StakeOptions>
      </Stack>
      <SingleSelectToken
        key={'token0'}
        token={token0}
        handleTokenOnClick={handleToken0OnClick}
        inputBalance={inputToken0Balance}
        setInputBalance={setInputToken0Balance}
        showPercentages
        dropGasToken={true}
        priorityAsset={1}
        setPriorityAsset={setPriorityAsset}
        isDisabled={router.query.id ? true : false}
      />
      <Text fontFamily={'Arista'} fontSize={'3xl'} color={'green.500'}>
        +
      </Text>
      <SingleSelectToken
        key={'token1'}
        token={token1}
        handleTokenOnClick={handleToken1OnClick}
        inputBalance={inputToken1Balance}
        setInputBalance={setInputToken1Balance}
        showPercentages
        dropGasToken={true}
        priorityAsset={2}
        setPriorityAsset={setPriorityAsset}
        isDisabled={router.query.id ? true : false}
      />

      <StakeDetails />
      {pair ? (
        <Button
          w={'-webkit-fill-available'}
          onClick={depositAndStakeLP}
          isLoading={isLoadingStake}
          isDisabled={
            isLoadingDeposit ||
            inputToken0Balance === '' ||
            inputToken1Balance === '' ||
            Number(inputToken0Balance) === 0 ||
            Number(inputToken1Balance) === 0
          }>
          Stake LP
        </Button>
      ) : (
        <Button
          w={'-webkit-fill-available'}
          onClick={createPairAndStakeLP}
          isLoading={isLoadingStake}
          isDisabled={
            isLoadingDeposit ||
            inputToken0Balance === '' ||
            inputToken1Balance === '' ||
            Number(inputToken0Balance) === 0 ||
            Number(inputToken1Balance) === 0
          }>
          Create Pair & Stake LP
        </Button>
      )}
      {advancedMode && pair && (
        <Button
          w={'-webkit-fill-available'}
          onClick={depositLP}
          isLoading={isLoadingDeposit}
          isDisabled={
            isLoadingStake ||
            inputToken0Balance === '' ||
            inputToken1Balance === '' ||
            Number(inputToken0Balance) === 0 ||
            Number(inputToken1Balance) === 0
          }>
          Deposit LP
        </Button>
      )}
      {advancedMode && !pair && (
        <Button
          w={'-webkit-fill-available'}
          onClick={createPairAndDepositLP}
          isLoading={isLoadingDeposit}
          isDisabled={
            isLoadingStake ||
            inputToken0Balance === '' ||
            inputToken1Balance === '' ||
            Number(inputToken0Balance) === 0 ||
            Number(inputToken1Balance) === 0
          }>
          Create Pair & Deposit LP
        </Button>
      )}
    </Stack>
  );
};

export default StakeV2;
