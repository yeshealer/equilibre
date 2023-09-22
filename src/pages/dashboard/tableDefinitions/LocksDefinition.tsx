import { Highlight } from '@chakra-ui/react';
import { VeNFT } from '@/interfaces';
import { Box, Button, HStack, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Icon } from '@chakra-ui/icons';
import { IoIosEye } from 'react-icons/io';
import {
  formatTimestamp,
  getDurationStringFromNow,
  getSeparatedDurationStringFromNow,
} from '@/utils/formatTime';
import { isPastTimestamp } from '@/utils/manageTime';

import AddVaraCard from '../components/lock/AddVaraCard';
import ExtendDurationCard from '../components/lock/ExtendDurationCard';
import { useVaraTokenStore } from '@/store/varaTokenStore';
import CustomModal from '../components/lock/CustomModal';
import useLockActions from '@/hooks/dashboard/useLockActions';
import useSimpleVeNFTs from '@/hooks/dashboard/useSimpleVeNFTs';
import { displayNumber } from '@/utils/formatNumbers';
import VotesTooltip from '../components/lock/VotesToolTip';

const locksDefinition = () => {
  const columnHelper = createColumnHelper<VeNFT>();
  const { getSimpleVeNfts, veNFTs } = useSimpleVeNFTs();

  const { fetBalanceAndAllowance, userVaraBalanceInWei, allowance } =
    useVaraTokenStore(state => ({
      userVaraBalanceInWei: state.balance,
      allowance: state.veVaraAllowance,
      fetBalanceAndAllowance: state.actions.fetBalanceAndAllowance,
    }));

  const columns: ColumnDef<VeNFT, any>[] = [
    columnHelper.accessor('id', {
      cell: info => <Text color={'green.500'}>{info.row.original.id}</Text>,
      header: 'ID',
      id: 'FirstColumn',
    }),
    columnHelper.accessor('lockAmount', {
      cell: info => {
        return (
          <Box textAlign={'end'}>
            <Text>{displayNumber(info.row.original.lockAmount)}</Text>
            <Text fontFamily={'Arista'}>VARA</Text>
          </Box>
        );
      },
      header: 'Locked Amount',
      id: 'SecondColumn',
    }),
    columnHelper.accessor('lockValue', {
      cell: info => (
        <Box textAlign={'end'}>
          <Text>{displayNumber(info.row.original.lockValue)}</Text>
          <Text fontFamily={'Arista'}>veVARA</Text>
        </Box>
      ),
      header: 'Voting Power',
      id: 'ThirdColumn',
    }),
    columnHelper.accessor('id', {
      cell: info => {
        const displaySection = (
          <HStack role="group" justifyContent={'end'}>
            <Text
              fontFamily={'Arista'}
              transition="all 300ms ease-out"
              _groupHover={{
                color: 'green.500',
              }}>
              Gauges
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
        );
        return info.row.original.votes.length > 0 ? (
          <VotesTooltip votes={info.row.original.votes}>
            {displaySection}
          </VotesTooltip>
        ) : (
          <Text
            fontFamily={'Arista'}
            color={'pink.500'}>
            No Votes Found
          </Text>
        );
      },
      header: 'Voting For',
      id: 'FourthColumn',
    }),
    columnHelper.accessor('lockEnds', {
      cell: info => {
        const timestamp = Number(info.row.original.lockEnds);
        const { value } = getSeparatedDurationStringFromNow(timestamp);
        const bottomString = isPastTimestamp(timestamp)
          ? `Expired ${getDurationStringFromNow(timestamp)} ago`
          : `Expires in ${getDurationStringFromNow(timestamp)}`;

        return (
          <Box>
            <Text fontFamily={'Righteous'}>{formatTimestamp(timestamp)}</Text>
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
      id: 'FifthColumn',
    }),
    columnHelper.accessor('id', {
      cell: info => {
        const { isLoading, isExpired, onWithdraw, onReset } = useLockActions(
          info.row.original,
          getSimpleVeNfts
        );
        return (
          <>
            {!isExpired ? (
              <HStack
                maxWidth={'300px'}
                gap={5}
                justifyContent={'center'}
                justifySelf={'center'}>
                <CustomModal buttonString={'Add VARA'}>
                  <AddVaraCard
                    Nft={info.row.original}
                    userVaraBalanceInWei={userVaraBalanceInWei}
                    allowance={allowance}
                    fetBalanceAndAllowance={fetBalanceAndAllowance}
                    getNfts={getSimpleVeNfts}
                  />
                </CustomModal>

                <CustomModal buttonString={'Extend'}>
                  <ExtendDurationCard
                    Nft={info.row.original}
                    getNfts={getSimpleVeNfts}
                  />
                </CustomModal>

                <Button
                  borderRadius={'xl'}
                  fontSize={'xs'}
                  isLoading={isLoading}
                  onClick={onReset}>
                  Reset
                </Button>
              </HStack>
            ) : (
              <HStack
                maxWidth={'300px'}
                gap={5}
                justifyContent={'center'}
                justifySelf={'center'}>
                <Text
                  fontFamily={'Arista'}
                  fontSize={'xs'}
                  color={'pink.500'}
                  flex={2}>
                  Claim your rewards to withdraw
                </Text>
                <Button
                  borderRadius={'xl'}
                  colorScheme="pink"
                  variant={'outline'}
                  color={'pink.500'}
                  flex={1}
                  fontSize={'xs'}
                  isLoading={isLoading}
                  onClick={onWithdraw}>
                  Withdraw
                </Button>
              </HStack>
            )}
          </>
        );
      },
      header: 'Manage your Locks',
      id: 'LockActions',
    }),
  ];

  return {
    columns,
    data: veNFTs,
  };
};

export default locksDefinition;
