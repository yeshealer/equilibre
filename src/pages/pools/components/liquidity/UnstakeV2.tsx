import SingleSelectToken from '@/components/core/SingleSelectToken';
import useStakeData from '@/hooks/pools/useStakeData';
import { Pair } from '@/interfaces';
import {
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  InputGroup,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  keyframes,
} from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';
import StakeDetails from './StakeDetails';
import StakeOptions from './settings/StakeOptions';
import useStakeDepositActions from '@/hooks/pools/useStakeDepositActions';
import UnstakeDetails from './UnstakeDetails';
import SelectPair from '@/components/core/SelectPair';
import useUnstakeData from '@/hooks/pools/useUnstakeData';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import PairTokenInfo from './PairTokenInfo';
import useUnstakeWithdrawActions from '@/hooks/pools/useUnstakeWithdrawActions';
import { useRouter } from 'next/router';

interface StakeV2Props {
  inputPair?: Pair;
}

const UnstakeV2 = ({ inputPair }: StakeV2Props) => {
  const {
    token0,
    token1,
    pair,
    handlePairOnClick,
    inputPairBalance,
    setInputPairBalance,
    advancedMode,
    token0CurrentInput,
    token1CurrentInput,
    token0CurrentValue,
    token1CurrentValue,
    depositedLp,
  } = useUnstakeData(inputPair);
  const {
    removeLP,
    unstakeLP,
    unstakeAndRemoveLP,
    isLoadingUnstake,
    isLoadingRemove,
  } = useUnstakeWithdrawActions();
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
      <SelectPair
        key={'pair'}
        pair={pair!}
        handlePairOnClick={handlePairOnClick}
        inputBalance={inputPairBalance}
        setInputBalance={setInputPairBalance}
        showPercentages
        isDisabled={router.query.id ? true : false}
      />
      <HStack justifyContent={'space-between'} w={'-webkit-fill-available'}>
        <PairTokenInfo
          token={token0!}
          amount={token0CurrentInput}
          value={token0CurrentValue}
        />
        <Text fontFamily={'Arista'} fontSize={'3xl'} color={'green.500'}>
          +
        </Text>
        <PairTokenInfo
          token={token1!}
          amount={token1CurrentInput}
          value={token1CurrentValue}
        />
      </HStack>
      <UnstakeDetails />

      <Button
        w={'-webkit-fill-available'}
        onClick={unstakeAndRemoveLP}
        isLoading={isLoadingUnstake}
        isDisabled={isLoadingRemove || inputPairBalance === ''}>
        Unstake LP
      </Button>

      {advancedMode && (
        <Button
          w={'-webkit-fill-available'}
          onClick={() => removeLP()}
          isLoading={isLoadingRemove}
          isDisabled={isLoadingUnstake || Number(depositedLp) <= 0}>
          Withdraw All LP
        </Button>
      )}
    </Stack>
  );
};

export default UnstakeV2;
