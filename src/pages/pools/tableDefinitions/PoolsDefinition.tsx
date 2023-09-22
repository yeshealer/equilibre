import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Pair } from '@/interfaces';
import { usePairStore } from '@/store/pairsStore';
import { displayNumber, formatCurrency } from '@/utils/formatNumbers';
import {
  Button,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import CustomTooltip from '../components/liquidity/CustomTooltip';
import useGetPairBalances from '@/hooks/pools/useGetPairBalances';
import { ChevronDownIcon, Icon } from '@chakra-ui/icons';
import { IoIosEye } from 'react-icons/io';
import { useRouter } from 'next/router';

const poolsDefinition = () => {
  const columnHelper = createColumnHelper<Pair>();
  const router = useRouter();
  const { pairList } = useGetPairBalances();
  const sortingDefault = [{ id: 'tvl', desc: true }];
  const columns: ColumnDef<Pair, any>[] = [
    columnHelper.accessor('symbol', {
      cell: info => (
        <Grid
          templateColumns={'repeat(2, min-content)'}
          templateRows={'repeat(2, 1fr)'}
          alignItems={'center'}
          minW={'4'}>
          <GridItem rowSpan={2} colSpan={1}>
            <EquilibreAvatar
              src={info.row.original.token0.logoURI}
              size={'sm'}
            />
            <EquilibreAvatar
              position={'relative'}
              left={'-2'}
              src={info.row.original.token1.logoURI}
              size={'sm'}
            />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Text>{info.getValue().substring(5)}</Text>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Text fontFamily={'Arista'}>
              {info.row.original.stable ? 'Stable' : 'Volatile'} pool
            </Text>
          </GridItem>
        </Grid>
      ),
      header: 'Pair',
      id: 'FirstColumn',
    }),
    columnHelper.accessor('balanceStakedUSD', {
      cell: info => (
        <CustomTooltip
          tokens={[info.row.original.token0, info.row.original.token1]}
          values={[
            info.row.original.token0.balance as number,
            info.row.original.token1.balance as number,
          ]}>
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
      header: 'My Stake',
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('tvl', {
      cell: info => (
        <CustomTooltip
          tokens={[info.row.original.token0, info.row.original.token1]}
          values={[info.row.original.reserve0, info.row.original.reserve1]}>
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
      header: 'TVL',
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('apr', {
      cell: info => `${displayNumber(info.getValue())} %`,
      header: 'APR',
      meta: {
        isNumeric: true,
      },
    }),

    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: info => (
        <Button
          size={'sm'}
          borderRadius={'xl'}
          px={4}
          onClick={() =>
            router.push(`/pools/manage/${info.row.original.address}`)
          }>
          <Text fontSize={'xs'}>Manage</Text>
        </Button>
      ),
    }),
  ];

  return {
    columns,
    data: pairList,
    sortingDefault,
  };
};

export default poolsDefinition;
