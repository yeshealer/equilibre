import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Flex,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { IInputPercentage, Token } from '@/interfaces';
import { CONSTANTS_VEVARA } from '@/config/constants';
const { VALUE_PRECENTAGES, LOCK_DURATIONS } = CONSTANTS_VEVARA;
import { getBalanceInEther, getBalanceInWei } from '@/utils/formatBalance';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { CONTRACTS } from '@/config/company';
import { useVaraTokenStore } from '@/store/varaTokenStore';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';

interface LockAmountInputSectionProps {
  lockAmount: string;
  amountError: string;
  setLockAmount: React.Dispatch<React.SetStateAction<string>>;
}

const LockAmountInputSection: React.FC<LockAmountInputSectionProps> = ({
  lockAmount,
  amountError,
  setLockAmount,
}) => {
  const { balance: userVaraBalanceInWei } = useVaraTokenStore(state => ({
    balance: state.balance,
  }));
  const [varaPrice, setVaraPrice] = useState<number>(0);

  const lockAmountInWei = getBalanceInWei(lockAmount || '0');
  const userVaraBalance = getBalanceInEther(userVaraBalanceInWei);

  const { baseAssets, getBaseAsset } = useBaseAssetStore(state => ({
    baseAssets: state.baseAssets,
    getBaseAsset: state.actions.getBaseAsset,
  }));
  useEffect(() => {
    const varaAsset: Token | undefined = getBaseAsset(
      CONTRACTS.GOV_TOKEN_ADDRESS
    );
    if (varaAsset) {
      setVaraPrice(Number(varaAsset?.price) || 0);
    }
  }, [baseAssets.length]);

  // select vaule percentage
  const onSelectValuePercentage = (newValuePercentage: IInputPercentage) => {
    const newLockAmount =
      ((userVaraBalance as number) * newValuePercentage.value) / 100;
    if (Number(newLockAmount) !== Number(lockAmount)) {
      setLockAmount(String(newLockAmount));
    }
  };

  return (
    <Box>
      <Flex justifyContent={'end'} alignItems={'center'} mb={5}>
        <Flex gap={2}>
          {VALUE_PRECENTAGES.map((row: IInputPercentage) => {
            return (
              <Button
                height={'33px'}
                key={row.value}
                isActive={
                  lockAmount ===
                  String(((userVaraBalance as number) * row.value) / 100)
                }
                colorScheme="yellow"
                variant={'outline'}
                minW={12}
                px={1}
                onClick={() => {
                  onSelectValuePercentage(row);
                }}>
                {row.label}
              </Button>
            );
          })}
        </Flex>
      </Flex>
      <Flex paddingBottom={0}>
        <Box
          border={'1px solid #273977'}
          borderRadius={10}
          background={'rgba(31, 46, 100, 0.50)'}
          padding={5}
          w="100%">
          <Flex justifyContent="end">
            <Text fontSize={10} letterSpacing="1.3px">
              {`Balance: ${displayNumber(userVaraBalance)}`}
            </Text>
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            mt={2}
            gap={4}>
            <Box>
              <Input
                isInvalid={lockAmountInWei.gt(userVaraBalanceInWei)}
                type="number"
                variant={'flushed'}
                placeholder="0.00"
                textAlign="left"
                borderBottomWidth={0}
                fontSize={25}
                height={'var(--input-height)'}
                letterSpacing="3.25px"
                min={0}
                value={lockAmount}
                textColor={'#FFFFFF'}
                onChange={e => setLockAmount(e.target.value)}
              />
              <Text
                letterSpacing="1.3px"
                color="purple.300"
                fontWeight={500}
                fontSize={10}
                mt={1}>
                {amountError}
              </Text>
              <Text
                letterSpacing="1.3px"
                color="rgba(255, 255, 255, 0.50)"
                mt={1}
                textAlign={'left'}>
                {`${displayCurrency(Number(lockAmount) * varaPrice)}`}
              </Text>
            </Box>
            <Flex
              gap={3}
              borderRadius={20}
              paddingBlock={1.5}
              paddingRight={3}
              paddingLeft={2}
              alignItems="center"
              border={'1px solid #FFBD59'}>
              <Image w={'28px'} minW={'24px'} src="/images/VARA.svg" />
              <Text color="yellow.500" display={'block'}>
                VARA
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default LockAmountInputSection;
