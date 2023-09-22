import {
  Box,
  Button,
  ChakraProps,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { usePairStore } from '@/store/pairsStore';
import useStakeDepositActions from '@/hooks/pools/useStakeDepositActions';
import useUnstakeWithdrawActions from '@/hooks/pools/useUnstakeWithdrawActions';
import { displayNumber } from '@/utils/formatNumbers';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Arrow, AutoPlay } from '@egjs/flicking-plugins';
import '@egjs/flicking-plugins/dist/arrow.css';
import Flicking, { ViewportSlot } from '@egjs/react-flicking';
import '@egjs/react-flicking/dist/flicking.css';

const ActionsNeeded = (props: ChakraProps) => {
  const { pairs } = usePairStore(state => ({
    pairs: state.pairs,
  }));
  const [currentPoolIndex, setCurrentPoolIndex] = useState(1);
  const [totalPools, setTotalPools] = useState(0);
  const [filteredPairs, setFilteredPairs] = useState(pairs);
  const [actionSuccess, setActionSuccess] = useState(false);
  useEffect(() => {
    const filtered = pairs.filter(pair => {
      return (
        pair.gauge &&
        pair.balanceDeposited &&
        (pair.balanceDeposited as number) > 0
      );
    });
    setFilteredPairs(filtered);
    setTotalPools(filtered.length);
  }, [pairs]);

  const { stakeLP, isLoadingStake, isLoadingDeposit } =
    useStakeDepositActions();
  const { removeLP, isLoadingRemove } = useUnstakeWithdrawActions();
  const [, updateState] = useState({});
  const autoplay = new AutoPlay({
    duration: 5000,
    direction: 'NEXT',
  });
  const arrow = new Arrow({});
  return (
    <Box
      bg="linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box"
      border={'1px solid transparent'}
      borderRadius={'30px'}
      justifyContent={'center'}
      alignItems={'center'}
      py={'5'}
      boxShadow={'lg'}
      {...props}>
      <HStack justifyContent={'space-between'} px={'5'}>
        <Heading fontFamily={'Arista'} fontSize={'xl'} color={'pink.500'}>
          Action Needed
        </Heading>
        <Text color={'yellow.500'}>{currentPoolIndex + '/' + totalPools}</Text>
      </HStack>
      <Flicking
        circular={true}
        onChanged={e => {
          setCurrentPoolIndex(e.index + 1);
        }}
        align={'center'}
        plugins={[autoplay, arrow]}
        panelsPerView={1}>
        {filteredPairs &&
          filteredPairs.map(pair => (
            <div>
              <Stack gap={2}>
                <HStack mt={'4'} px={8}>
                  <EquilibreAvatar src={pair.token0.logoURI} size={'sm'} />
                  <EquilibreAvatar
                    position={'relative'}
                    left={'-4'}
                    src={pair.token1.logoURI}
                    size={'sm'}
                  />
                  <Stack w={'-webkit-fill-available'}>
                    <Text fontSize={'xs'}>{pair.symbol.substring(5)}</Text>
                    <HStack justifyContent={'space-between'}>
                      <Text fontSize={'xs'} fontFamily={'Arista'}>
                        Pooled balance
                      </Text>
                      <Text fontSize={'xs'} color={'green.500'}>
                        {displayNumber(pair.balanceDeposited)} LP
                      </Text>
                    </HStack>
                  </Stack>
                </HStack>
                <HStack mt={'20'} justifyContent={'center'}>
                  <Button
                    isDisabled={isLoadingStake}
                    isLoading={isLoadingRemove}
                    onClick={() => {
                      removeLP(pair).then(() => {
                        setActionSuccess(true);
                        setCurrentPoolIndex(1);
                        // forceUpdate();
                      });
                    }}>
                    Withdraw
                  </Button>
                  <Text fontSize={'xs'} color={'pink.500'}>
                    or
                  </Text>
                  <Button
                    isDisabled={isLoadingRemove}
                    isLoading={isLoadingStake}
                    onClick={() =>
                      stakeLP(pair).then(() => {
                        setActionSuccess(true);
                        setCurrentPoolIndex(1);
                        // forceUpdate();
                      })
                    }>
                    Stake LP
                  </Button>
                </HStack>
              </Stack>
            </div>
          ))}
        <ViewportSlot>
          <ChevronLeftIcon
            left={'0'}
            boxSize={'8'}
            color={'yellow.300'}
            _hover={{ color: 'yellow.500', transition: 'all 0.2s ease-in-out' }}
            _active={{
              color: 'yellow.700',
              transition: 'all 0.2s ease-in-out',
            }}
            className="flicking-arrow-prev"
          />
          <ChevronRightIcon
            right={'0'}
            boxSize={'8'}
            // color={'yellow.300'}
            _hover={{ color: 'yellow.500', transition: 'all 0.2s ease-in-out' }}
            _active={{
              color: 'yellow.700',
              transition: 'all 0.2s ease-in-out',
            }}
            className="flicking-arrow-next"
          />
        </ViewportSlot>
      </Flicking>
    </Box>
  );
};

export default ActionsNeeded;
