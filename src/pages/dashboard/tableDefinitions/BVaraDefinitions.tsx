import { Highlight } from '@chakra-ui/react';
import { VeBVara } from '@/interfaces';
import { Box, Button, HStack, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  formatTimestamp,
  getDurationStringFromNow,
  getSeparatedDurationStringFromNow,
} from '@/utils/formatTime';
import { isPastTimestamp } from '@/utils/manageTime';

import AddVaraCard from '../components/lock/AddVaraCard';
import ExtendDurationCard from '../components/lock/ExtendDurationCard';
import CustomModal from '../components/lock/CustomModal';
import useLockActions from '@/hooks/dashboard/useLockActions';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import { useVeBVaraStore } from '@/store/veBVaraStore';
import { CONTRACTS } from '@/config/company';
import { getBalanceInEther } from '@/utils/formatBalance';
import useBVaraActions from '@/hooks/dashboard/useBVaraActions';
import { useBaseAssetStore } from '@/store/baseAssetsStore';

const bVaraDefinition = () => {
  const columnHelper = createColumnHelper<VeBVara>();
  const veBVaras = useVeBVaraStore(state => state).veBVaras;
  const getBaseAsset = useBaseAssetStore(state => state.actions.getBaseAsset);
  const columns: ColumnDef<VeBVara, any>[] = [
    columnHelper.accessor('vestID', {
      cell: info => <Text letterSpacing={'widest'} color={'green.500'}>{info.row.original.vestID}</Text>,
      header: 'Vest ID',
      id: 'FirstColumn',
    }),
    columnHelper.accessor('lockedBVaraAmount', {
      cell: info => {
        return (
          <Box textAlign={'end'} letterSpacing={'widest'}>
            <Text color="gray.500">
              {displayNumber(getBalanceInEther(BigInt(info.row.original.lockedBVaraAmount), CONTRACTS.BVARA_TOKEN_DECIMALS))}
            </Text>
            <Text>{displayCurrency(Number(getBalanceInEther(BigInt(info.row.original.lockedBVaraAmount), CONTRACTS.BVARA_TOKEN_DECIMALS))
              * Number(getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS)?.price ?? 0))}</Text>
          </Box>
        );
      },
      header: 'bVARA',
      id: 'SecondColumn1',
    }),
    columnHelper.accessor('maxEndTimestamp', {
      cell: info => {
        const timestamp = Number(info.row.original.maxEndTimestamp);
        const { value, unit } = getSeparatedDurationStringFromNow(timestamp, true);
        const bottomString = isPastTimestamp(timestamp)
          ? `Expired ${value + ' ' + unit} ago`
          : `Expires in ${value + ' ' + unit}`;

        return (
          <Box letterSpacing={'widest'}>
            <Text fontFamily={'Righteous'} color="gray.500">{formatTimestamp(timestamp)}</Text>
            <Text
              fontFamily={'Arista'}
              color={isPastTimestamp(timestamp) ? 'pink.500' : 'green.500'}>
              <Highlight
                query={`${value}`}
                styles={{
                  fontFamily: 'Righteous',
                  color: `${isPastTimestamp(timestamp) ? 'pink.500' : 'green.500'
                    }`,
                }}>
                {bottomString}
              </Highlight>
            </Text>
          </Box>
        );
      },
      header: 'Expiry Date',
      id: 'ThirdColumn',
    }),
    columnHelper.display({
      cell: info => {
        const { isRedeemLoading, isCancelLoading, onRedeem, onCancel } = useBVaraActions();
        return (
          <HStack
            gap={4}
            justifyContent={'center'}
            justifySelf={'center'}
            width={"100%"}
          >
            <Button
              size={'sm'}
              borderRadius={'xl'}
              fontSize={'xs'}
              flex={1}
              isLoading={isRedeemLoading}
              onClick={() => onRedeem(info.row.original.vestID)}
            >
              Redeem
            </Button>
            <Button
              size={'sm'}
              borderRadius={'xl'}
              fontSize={'xs'}
              colorScheme="pink"
              variant={'outline'}
              color={'pink.500'}
              flex={1}
              isLoading={isCancelLoading}
              onClick={() => onCancel(info.row.original.vestID)}
            >
              Cancel Vesting
            </Button>
          </HStack>
        );
      },
      header: 'Manage Actions',
      id: 'bVaraActions',
    }),
  ];

  return {
    columns,
    data: veBVaras,
  };
};

export default bVaraDefinition;
