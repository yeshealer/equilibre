import React from 'react';
import { Box, Button, Input, Flex, Text, SimpleGrid } from '@chakra-ui/react';
import { ILockDuration } from '@/interfaces';
import { CONSTANTS_VEVARA } from '@/config/constants';
import moment from 'moment';
import { getDurationDays } from '@/utils/manageTime';
const { LOCK_DURATIONS } = CONSTANTS_VEVARA;

interface ExpiryDateInputSectionProps {
  unlockDate: string;
  handleChangeUnlockDate: (unlockDate: string) => void;
}

const ExpiryDateInputSection: React.FC<ExpiryDateInputSectionProps> = ({
  unlockDate,
  handleChangeUnlockDate,
}) => {
  const lockDays = getDurationDays(moment(unlockDate).unix());

  // select lock duration
  const onSelectLockDuration = (newLockDuration: ILockDuration) => {
    const newUnlockDate = moment()
      .add(newLockDuration.value, 'days')
      .format('YYYY-MM-DD');

    if (newUnlockDate !== unlockDate) {
      handleChangeUnlockDate(newUnlockDate);
    }
  };

  const onChangeUnlockDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    handleChangeUnlockDate(selectedDate);
  };

  return (
    <Box>
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        columnGap={7}>
        <Text
          fontSize={'sm'}
          lineHeight={'normal'}
          fontWeight={300}
          whiteSpace={'pre-wrap'}
          fontFamily={'Righteous'}>
          Select Expiry Date:
        </Text>
        <Input
          variant={'primary'}
          paddingY={3}
          type="date"
          placeholder="DD/MM/YYYY"
          fontSize={'lg'}
          // height={'58px'}
          borderRadius={10}
          borderColor={'#FFFFFF80'}
          width={'fit-content'}
          minW={'111px'}
          value={unlockDate}
          onChange={onChangeUnlockDate}
          flex={1}
        />
      </Flex>
      <SimpleGrid columns={[2, 4]} mt={8} spacingY={6} spacingX={4}>
        {LOCK_DURATIONS.map((row: ILockDuration) => {
          return (
            <Button
              key={row.value}
              isActive={row.value === lockDays + 1}
              colorScheme="yellow"
              variant={'outline'}
              borderRadius={'lg'}
              w={'100%'}
              fontSize={'sm'}
              px={1}
              height={'fit-content'}
              minWidth={'fit-content'}
              onClick={() => {
                onSelectLockDuration(row);
              }}>
              {row.label}
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default ExpiryDateInputSection;
