import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { useVeNFTs } from '@/hooks/pools';
import { Pair, VeNFT, Vote } from '@/interfaces';
import { usePairStore } from '@/store/pairsStore';
import { useVeTokenStore } from '@/store/veTokenStore';
import { displayNumber, formatCurrency } from '@/utils/formatNumbers';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Icon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import {
  CellContext,
  ColumnDef,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Dispatch,
  SetStateAction,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IoIosEye } from 'react-icons/io';
import { shallow } from 'zustand/shallow';
import CustomTooltip from '../components/liquidity/CustomTooltip';
import { debounce, set } from 'lodash';
import AddBribe from '../components/vote/AddBribe';
import { getBalanceInEther } from '@/utils/formatBalance';
import { CONTRACTS } from '@/config/company';

const TableCell = (
  info: CellContext<Vote, any>,
  setGauges: Dispatch<SetStateAction<Vote[]>>,
  gauges: Vote[],
  meta?: any
) => {
  // const { setPercentChangedPairAddress } = useVeTokenStore(state => (state.actions));
  const { selectedVeNFT, setNewVote, newVotes, setSelectedVeNFT } =
    useVeTokenStore(
      state => ({
        selectedVeNFT: state.selectedVeNFT,
        setNewVote: state.actions.setNewVote,
        newVotes: state.newVotes,
        setSelectedVeNFT: state.actions.setSelectedVeNFT,
      }),
      shallow
    );

  const initialValue: Vote = selectedVeNFT?.votes.find(
    vote => vote.pair.address === info.row.original.pair.address
  ) || {
    pair: info.row.original.pair,
    percent: 0,
    votes: 0,
  };
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    // setPercentChangedPairAddress(info.row.original.pair.address);
    //@ts-ignore
    info.table?.options.meta?.updateData(
      info.row.index,
      info.column.id,
      value.percent
    );
    let pristine = true;
    const existingVote = selectedVeNFT?.votes.map(v => {
      if (v.pair.address === info.row.original.pair.address) {
        if (isNaN(value.percent)) {
          v.percent = 0;
        } else {
          v.percent = value.percent > 100 ? 100 : value.percent;
        }
        pristine = false;
      }
      return v;
    });

    if (!pristine && existingVote) {
      setSelectedVeNFT({
        id: selectedVeNFT?.id!,
        lockAmount: selectedVeNFT?.lockAmount!,
        lockEnds: selectedVeNFT?.lockEnds!,
        lockValue: selectedVeNFT?.lockValue!,
        votes: existingVote,
      });
    } else {
      setSelectedVeNFT({
        id: selectedVeNFT?.id!,
        lockAmount: selectedVeNFT?.lockAmount!,
        lockEnds: selectedVeNFT?.lockEnds!,
        lockValue: selectedVeNFT?.lockValue!,
        votes: [...selectedVeNFT?.votes!, value],
      });
    }
  };
  return (
    <NumberInput
      size={'sm'}
      w={'20'}
      display={'inline-block'}
      min={0}
      max={100}
      step={5}
      color={'yellow.500'}
      value={value?.percent && value.percent !== 0 ? value?.percent : ''}
      onChange={(valueAsString, valueAsNumber) => {
        if (isNaN(valueAsNumber)) {
          setValue({ ...value, percent: 0 });
        }
        setValue({
          ...value,
          percent: valueAsNumber > 100 ? 100 : valueAsNumber,
        });
      }}
      onBlur={onBlur}>
      <NumberInputField fontSize={'xs'} />
      <NumberInputStepper>
        <NumberIncrementStepper
          children={<ChevronUpIcon boxSize={3} color={'yellow.500'} />}
        />
        <NumberDecrementStepper
          children={<ChevronDownIcon boxSize={3} color={'yellow.500'} />}
        />
      </NumberInputStepper>
    </NumberInput>
  );
};

const votesDefinition = () => {
  const pairs = usePairStore(state => state.pairs);
  const [totalVotes, setTotalVotes] = useState(0);
  const [gauges, setGauges] = useState(Array<Vote>);
  const { veNFTs } = useVeNFTs();
  const { veToken, selectedVeNFT, setSelectedVeNFT, setNewVotes } =
    useVeTokenStore(
      state => ({
        veToken: state.veToken,
        selectedVeNFT: state.selectedVeNFT,
        setSelectedVeNFT: state.actions.setSelectedVeNFT,
        setNewVotes: state.actions.setNewVotes,
      }),
      shallow
    );

  // const { setPercentChangedPairAddress } = useVeTokenStore(state => state.actions);
  // const didMountRef = useRef(false);
  // useEffect(() => {
  //   if (didMountRef.current) {
  //     setPercentChangedPairAddress('');
  //   }
  //   didMountRef.current = true;
  // }, [selectedVeNFT?.id])

  useEffect(() => {
    let pairsWithGauge = pairs.filter(pair => pair.gauge);
    const currentVotes = pairsWithGauge.reduce(
      (acc, pair) => acc + pair.gauge?.votes!,
      0
    );

    const votes = selectedVeNFT?.votes!;
    let gauges = [];
    if (!votes) {
      gauges = pairsWithGauge.map(pair => {
        return {
          pair,
          votes: 0,
          percent: 0,
        };
      });
    } else {
      gauges = pairsWithGauge.map(pair => {
        const vote = votes.find(vote => vote.pair.address === pair.address);
        if (vote) {
          return {
            pair,
            votes: vote.votes,
            percent: vote.percent,
          };
        }
        return {
          pair,
          votes: 0,
          percent: 0,
        };
      });
    }

    setTotalVotes(currentVotes);
    setGauges(gauges);
  }, [selectedVeNFT]);

  const columnHelper = createColumnHelper<Vote>();

  const columns: ColumnDef<Vote, any>[] = [
    columnHelper.accessor('pair.symbol', {
      cell: info => (
        <Grid
          templateColumns={'repeat(2, min-content)'}
          templateRows={'repeat(2, 1fr)'}
          alignItems={'center'}
          minW={'4'}>
          <GridItem rowSpan={2} colSpan={1}>
            <EquilibreAvatar
              src={info.row.original.pair.token0.logoURI}
              size={'sm'}
            />
            <EquilibreAvatar
              position={'relative'}
              left={'-2'}
              src={info.row.original.pair.token1.logoURI}
              size={'sm'}
            />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Text>{info.getValue().substring(5)}</Text>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Text fontFamily={'Arista'}>
              {info.row.original.pair.stable ? 'Stable' : 'Volatile'} pool
            </Text>
          </GridItem>
        </Grid>
      ),
      header: 'Gauge',
      id: 'FirstColumn',
    }),
    columnHelper.display({
      id: 'SecondColumn',
      header: 'Action',
      cell: info => (
        <AddBribe pair={info.row.original.pair}>
          <Button size={'sm'} borderRadius={'xl'} px={4}>
            <Text fontSize={'xs'}>Add Bribe</Text>
          </Button>
        </AddBribe>
      ),
    }),
    columnHelper.accessor('pair.gauge.tbv', {
      cell: info => (
        <CustomTooltip
          tokens={
            info.row.original.pair.gauge?.bribes
              ?.filter(b => b.rewardAmount > 0)
              .map(b => b.token)!
          }
          values={
            info.row.original.pair.gauge?.bribes
              ?.filter(b => b.rewardAmount > 0)
              .map(b => b.rewardAmount)!
          }>
          <HStack role="group" justifyContent={'end'}>
            <Text
              transition="all 300ms ease-out"
              _groupHover={{
                color: 'green.500',
              }}>
              $ {formatCurrency(info.getValue())}
            </Text>
            <Icon
              as={IoIosEye}
              color={'gray.500'}
              boxSize={4}
              transition="all 300ms ease-out"
              _groupHover={{
                color: 'green.500',
              }}
            />
          </HStack>
        </CustomTooltip>
      ),
      header: 'Rewards',
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('pair.gauge.apr', {
      cell: info => (
        <Stack alignItems={'end'}>
          <Text>{displayNumber(info.getValue())} %</Text>
          <Text color={'gray.500'}>
            ${' '}
            {formatCurrency(
              (info.row.original.pair.gauge?.tbv! /
                info.row.original?.pair.gauge?.votes!) *
                1000
            )}{' '}
            per 1000 votes
          </Text>
        </Stack>
      ),
      header: 'Vote APR / E. Rewards',
      meta: {
        isNumeric: true,
      },
    }),
    // columnHelper.accessor('pair.gauge.apr', {
    //   cell: info => `{displayNumber(info.getValue())} %`,
    //   header: 'Vote APR',
    //   meta: {
    //     isNumeric: true,
    //   },
    // }),
    // columnHelper.accessor('pair.gauge.tbv', {
    //   cell: info => (
    //     <Text>
    //       ${' '}
    //       {formatCurrency(
    //         (info.getValue() / info.row.original?.pair.gauge?.votes!) * 1000
    //       )}
    //     </Text>
    //   ),
    //   header: () => (
    //     <Text>
    //       E. Rewards{' '}
    //       <Tooltip
    //         label="Estimated rewards per 1000 votes"
    //         fontSize="sm"
    //         placement="right"
    //         px={3}
    //         py={2}
    //         rounded="xl"
    //         maxW="240px"
    //         fontWeight="normal"
    //         color={'whiteAlpha.900'}
    //         borderColor={'pink.500'}
    //         bg={'darkblue.500'}>
    //         <QuestionOutlineIcon ml="2px" mt="-2px" />
    //       </Tooltip>
    //     </Text>
    //   ),
    //   id: 'estimatedRewards',
    //   meta: {
    //     isNumeric: true,
    //   },
    //   sortingFn: (a, b) => {
    //     const valueA =
    //       (a.original.pair.gauge?.tbv! / a.original.pair.gauge?.votes!) * 1000;
    //     const valueB =
    //       (b.original.pair.gauge?.tbv! / b.original.pair.gauge?.votes!) * 1000;

    //     return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    //   },
    //   sortDescFirst: true,
    // }),

    columnHelper.accessor('pair.gauge.votes', {
      cell: info => {
        // const { percentChangedPairAddress } = useVeTokenStore(state => state);
        const vote = selectedVeNFT?.votes.find(
          nft =>
            nft.pair.address.toLowerCase() ===
            info.row.original.pair.address.toLowerCase()
        );
        const votePower =
          ((selectedVeNFT?.lockValue ?? 0) * (vote?.percent ?? 0)) / 100;
        return (
          <Flex justifyContent={'end'}>
            <VStack width={'fit-content'} justifySelf={'end'}>
              <HStack
                mb={1}
                mt={1}
                width={'fit-content'}
                justifyContent={'space-between'}>
                <Text color={'gray.500'} fontSize={'xs'}>
                  {formatCurrency(info.getValue() as number)}
                </Text>
                <Text color={'gray.500'} fontSize={'xs'}>
                  {' '}
                  /{' '}
                </Text>
                <Text
                  color={votePower > 0 ? 'yellow.500' : 'gray.500'}
                  fontSize={'xs'}>
                  {formatCurrency(votePower)}
                </Text>
              </HStack>
              <HStack width={'100%'} justifyContent={'space-between'}>
                <Text color={'gray.500'}>
                  {formatCurrency(
                    ((info.getValue() as number) / totalVotes) * 100
                  )}
                  %
                </Text>
                <Text color={votePower > 0 ? 'yellow.500' : 'gray.500'}>
                  {formatCurrency((votePower / totalVotes) * 100)}%
                </Text>
              </HStack>
            </VStack>
          </Flex>
        );
      },
      header: 'Total Votes / My Votes',
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('pair.address', {
      id: 'myVote',
      header: 'My Vote %',
      cell: info => TableCell(info, setGauges, gauges),
      sortingFn: (a, b) => {
        const percentA = a.original.percent;
        const percentB = b.original.percent;
        return percentA < percentB ? -1 : percentA > percentB ? 1 : 0;
      },
      sortDescFirst: true,
    }),
  ];
  const sortingDefault = [{ id: 'myVote', desc: true }];

  return {
    columns,
    data: gauges,
    sortingDefault,
  };
};

export default votesDefinition;
