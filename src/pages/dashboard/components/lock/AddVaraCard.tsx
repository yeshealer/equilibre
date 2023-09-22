import { CONTRACTS } from '@/config/company';
import { Token, VeNFT } from '@/interfaces';
import callContractWait from '@/lib/callContractWait';
import { getBalanceInEther, getBalanceInWei } from '@/utils/formatBalance';
import { displayNumber, getVotingPower } from '@/utils/formatNumbers';
import { getDurationDays } from '@/utils/manageTime';
import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import LockAmountInputSection from '../../../../components/lock/LockAmountInputSection';
import SingleSelectToken from '@/components/core/SingleSelectToken';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useVaraTokenStore } from '@/store/varaTokenStore';

interface AddVaraCardProps {
  Nft: VeNFT;
  userVaraBalanceInWei: BigNumber;
  allowance: BigNumber;
  fetBalanceAndAllowance: (address?: string | undefined) => void;
  getNfts: () => Promise<void>;
}
const AddVaraCard: React.FC<AddVaraCardProps> = ({
  Nft,
  userVaraBalanceInWei,
  allowance,
  fetBalanceAndAllowance,
  getNfts,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [lockAmount, setLockAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  const { address } = useAccount();
  const getBaseAsset = useBaseAssetStore(state => state.actions.getBaseAsset);

  const lockAmountInWei = getBalanceInWei(lockAmount || '0');

  const lockDays = getDurationDays(Number(Nft.lockEnds));
  const votingPower = getVotingPower(Number(lockAmount), lockDays);

  const userVaraBalance = getBalanceInEther(userVaraBalanceInWei);
  const token = { ...getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS), balance: userVaraBalance } as Token;

  useEffect(() => {
    setAmountError(
      lockAmountInWei.gt(userVaraBalanceInWei)
        ? 'Greater than your available balance'
        : ''
    );
  }, [lockAmount, userVaraBalanceInWei]);

  const onAddVara = async () => {
    setLoading(true);
    let isAllowanceLtAmount: undefined | boolean =
      allowance.lt(lockAmountInWei);
    let result: boolean | undefined = false;
    if (isAllowanceLtAmount) {
      // 1. implement approve logic
      const txObj = {
        address: CONTRACTS.GOV_TOKEN_ADDRESS,
        abi: CONTRACTS.GOV_TOKEN_ABI,
        functionName: 'approve',
        args: [CONTRACTS.VE_TOKEN_ADDRESS, lockAmountInWei],
      };
      const toastObj = {
        title: 'Approve',
        description: `${lockAmount} Vara Token approved`,
      };
      result = await callContractWait(txObj, toastObj);
      if (result) isAllowanceLtAmount = false;
    }
    // 2. implement 'increase_amount' logic
    if (!isAllowanceLtAmount) {
      const txObj = {
        address: CONTRACTS.VE_TOKEN_ADDRESS,
        abi: CONTRACTS.VE_TOKEN_ABI,
        functionName: 'increase_amount',
        args: [Nft.id, lockAmountInWei],
      };
      const toastObj = {
        title: 'Vara Added',
        description: `${lockAmount} Vara added to ID #${Nft.id}`,
      };
      result = await callContractWait(txObj, toastObj);
    }

    setLoading(false);
    if (result) {
      setLockAmount('');
      await Promise.all([getNfts(), fetBalanceAndAllowance(address)]);
    }
  };
  return (
    <Stack
      background={
        'linear-gradient(0deg, rgb(21,32,76), rgb(21,32,76)) padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box;'
      }
      w={"100%"}
      minW={'298px'}
      maxW={'528px'}
      padding={0}
      borderRadius={30}
      border={'1px solid transparent'}
      letterSpacing={'1.95px'}>
      <Flex
        borderBottom={'1px solid rgba(255, 255, 255, 0.5)'}
        paddingY={5}
        paddingX={7}
        justifyContent={'space-between'}>
        <Text fontSize={'md'} letterSpacing={'wider'}>
          Add VARA to your lock:
        </Text>
        <Text fontSize={'md'} color={'pink.500'} letterSpacing={'wider'}>
          ID #{Nft.id}
        </Text>
      </Flex>

      <Box padding={'1.5rem 1rem'} pt={2}>
        {/* value input section */}

        <SingleSelectToken
          showPercentages={true}
          showTokenSelector={false}
          token={token}
          handleTokenOnClick={() => { }}
          inputBalance={lockAmount}
          setInputBalance={setLockAmount}
        />

        {/* your veVara info */}
        <Flex
          fontSize={15}
          pt={9}
          pb={9}
          flexDirection={'column'}
          gap={4}
          borderBottom={'0px'}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            flexDirection={'row'}>
            <Text fontFamily={'Arista'} fontWeight={300} color={'#F5F5F5'}>
              Your current voting power is
            </Text>
            <Text textAlign={'end'}>
              {`${displayNumber(Nft.lockValue)} veVARA`}
            </Text>
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            flexDirection={'row'}
            color={'#F5F5F5'}>
            <Text fontFamily={'Arista'} fontWeight={300}>
              Your voting power will be
            </Text>
            <Text color="green.500" textAlign={'end'}>
              {`${displayNumber(votingPower + Nft.lockValue)} veVara`}
            </Text>
          </Flex>
        </Flex>
        {/* Add VARA */}
        <Flex alignItems={'center'} justifyContent={'space-between'} pt={0}>
          <Button
            colorScheme="yellow"
            w={'100%'}
            onClick={onAddVara}
            isLoading={isLoading}
            isDisabled={!!amountError}
            borderRadius={'md'}>
            <Text fontSize={'lg'}>Add VARA</Text>
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
};

export default AddVaraCard;
