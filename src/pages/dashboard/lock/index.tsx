import {
  Box,
  Button,
  Input,
  SimpleGrid,
  Text,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { getColor } from '@chakra-ui/theme-tools';
import { theme as defaultTheme } from '@chakra-ui/theme';
import { useRouter } from 'next/navigation';

import { CONSTANTS_VEVARA } from '@/config/constants';
import { ILockDuration, IInputPercentage } from '@/interfaces';
import { useVeVaraMint } from '@/hooks/dashboard';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import SingleSelectToken from '@/components/core/SingleSelectToken';
import ExpiryDateInputSection from '@/components/lock/ExpiryDateInputSection';

const { VALUE_PRECENTAGES, LOCK_DURATIONS } = CONSTANTS_VEVARA;

const VeVaraMint = () => {
  const router = useRouter();

  const {
    // states
    lockAmount,
    unlockDate,
    varaPrice,
    isLoading,
    amountError,

    userVaraBalance,
    lockDays,
    votingPower,
    lockAmountInWei,
    userVaraBalanceInWei,
    allowance,
    token,

    // actions
    onSelectLockDuration,
    setLockAmount,
    setUnlockDate,
    onLockVara,
  } = useVeVaraMint();

  return (
    <Box
      background={
        'linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box'
      }
      w={['298px', '444px']}
      // minW={'298px'}
      maxW={'528px'}
      padding={{ base: 0, sm: 6 }}
      borderRadius={[20, 30]}
      border={'1px solid transparent'}
      letterSpacing={'1.95px'}>
      {/* title for mobile */}
      <Box
        hideFrom="sm"
        borderBottom={'1px solid rgba(255, 255, 255, 0.25)'}
        padding={5}>
        <Text fontSize={15} letterSpacing="1.3px">
          Lock VARA to get veVARA
        </Text>
      </Box>

      {/*  body  */}
      <Box padding={['1rem 1.25rem', 0]}>
        {/* value input section */}
        <SingleSelectToken
          showPercentages={true}
          showTokenSelector={false}
          token={token}
          handleTokenOnClick={() => { }}
          inputBalance={lockAmount}
          setInputBalance={setLockAmount}
          showBackButton={true}
          onBack={() => router.push('/dashboard')}
        />
        {/* lock duration input section */}
        <Box paddingY={6}>
          <ExpiryDateInputSection unlockDate={unlockDate} handleChangeUnlockDate={setUnlockDate} />
        </Box>

        {/* your veVara info */}
        <Flex
          fontSize={[10, 15]}
          pt={[4, 6]}
          pb={[4, 6]}
          borderTop={[
            '1px solid rgba(255, 255, 255, 0.25)',
            '1px solid rgba(255, 255, 255, 0.50)',
          ]}
          flexDirection={'column'}
          gap={4}
          borderBottom={['1px solid rgba(255, 255, 255, 0.25)', '0px']}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            flexDirection={'row'}>
            <Text
              fontFamily={'Arista'}
              fontWeight={300}
              color={['#FFFFFF80', '#F5F5F5']}>
              Your voting power will be
            </Text>
            <Text color={['#F5F5F5', 'green.500']} textAlign={'end'}>
              {`${displayNumber(votingPower)} veVARA`}
            </Text>
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            flexDirection={'row'}
            color={['#FFFFFF80', '#F5F5F5']}>
            <Text fontFamily={'Arista'} fontWeight={300}>
              Amount of days locked
            </Text>
            <Text color="green.500" textAlign={'end'}>
              {lockDays}
            </Text>
          </Flex>
        </Flex>
        {/* veVera mint button */}
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          pt={[4, 0]}
          gap={5}>
          <Button
            colorScheme="yellow"
            w={'100%'}
            // h={[34, 58]}
            fontSize={'sm'}
            fontWeight={400}
            py={3}
            onClick={onLockVara}
            isLoading={isLoading}
            // loadingText={allowance.lt(lockAmountInWei) ? 'Approve' : 'Mint'}
            isDisabled={!!amountError}
            borderRadius={'lg'}>
            Create New veNFT
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
export default VeVaraMint;
