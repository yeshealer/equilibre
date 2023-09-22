import moment from 'moment';

import generateToast from '@/components/toast/generateToast';
import { CONTRACTS } from '@/config/company';
import { LOCK_SMALL_DURATIONS } from '@/config/constants/veVara';
import useSimpleVeNFTs from '@/hooks/dashboard/useSimpleVeNFTs';
import useVeVaraMerge from '@/hooks/dashboard/useVeVaraMerge';
import { VeNFT } from '@/interfaces';
import callContractWait from '@/lib/callContractWait';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { getBalanceInWei } from '@/utils/formatBalance';
import { displayNumber } from '@/utils/formatNumbers';
import {
  Box,
  Button,
  Flex,
  Highlight,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
interface Option {
  percent: number;
  lockDays: number;
}

const VeVaraMerge = () => {
  const {
    firstSelectedNFTId,
    secondSelectedNFTId,
    veNFTs,
    setFirstSelectedNFTId,
    onClickBack,
  } = useVeVaraMerge();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<Option>>([
    { percent: 50, lockDays: LOCK_SMALL_DURATIONS[3].value },
    { percent: 50, lockDays: LOCK_SMALL_DURATIONS[3].value },
  ]);

  const { getBaseAsset } = useBaseAssetStore(state => ({
    getBaseAsset: state.actions.getBaseAsset,
  }));
  const govToken = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS);

  const router = useRouter();

  const { getSimpleVeNfts } = useSimpleVeNFTs();

  const filteredNfts = veNFTs.filter(value => value.lockEnds < moment().unix());
  const selectedNft = filteredNfts[firstSelectedNFTId];

  const onClickMerge = () => {
    router.push('/dashboard/merge');
  };
  const onAddOption = () => {
    if (options.length >= 5) {
      generateToast(
        'Limit Exceeds',
        'The maximum number of divisions is 5.',
        'warning'
      );
      return;
    }
    let temp = new Array<Option>();
    temp = temp.concat(options);
    temp.push({ percent: 0, lockDays: LOCK_SMALL_DURATIONS[3].value });
    setOptions(temp);
  };
  const onChangePercent = (value: number, index: number) => {
    let temp = new Array<Option>();
    temp = temp.concat(options);
    temp[index].percent = value;
    setOptions(temp);
  };
  const onChangeDuration = (duration: number, index: number) => {
    let temp = new Array<Option>();
    temp = temp.concat(options);
    temp[index].lockDays = duration;
    setOptions(temp);
  };
  const onSplitVeNFT = async () => {
    let sum = 0;
    options.map(option => (sum += option.percent));
    if (sum != 100) {
      generateToast(
        'Percentage is incorrect',
        'Check that the sum of the percentage values of each item is 100%',
        'error'
      );
      return;
    }

    setLoading(true);

    const txObj = {
      address: CONTRACTS.VE_TOKEN_ADDRESS,
      abi: CONTRACTS.VE_TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS.VE_SPLITTER_ADDRESS, selectedNft.id],
    };
    const toastObj = {
      title: 'Approve',
      description: 'veToken approved to Splitter',
    };
    let result: boolean | undefined = await callContractWait(txObj, toastObj);
    if (result) {
      const txObj = {
        address: CONTRACTS.VE_SPLITTER_ADDRESS,
        abi: CONTRACTS.VE_SPLITTER_ABI,
        functionName: 'split',
        args: [
          options.map(option =>
            getBalanceInWei(
              ((option.percent * selectedNft.lockAmount) / 100).toString(),
              CONTRACTS.GOV_TOKEN_DECIMALS
            ).toBigInt()
          ),
          options.map(option => option.lockDays * 24 * 60 * 60),
          selectedNft.id,
        ],
      };
      const toastObj = {
        title: 'Splited',
        description: `veToken splited into ${options.length} veTokens`,
      };
      result = await callContractWait(txObj, toastObj);
      if (result) {
        await getSimpleVeNfts();
      }
    }
    setLoading(false);
  };

  return (
    <Box
      background={
        'linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box'
      }
      w={['298px', '553px']}
      h={'100%'}
      maxW={'553px'}
      borderRadius={20}
      border={'1px solid transparent'}
      letterSpacing={'1.95px'}>
      {/* title for mobile */}
      <Flex
        borderBottom={'1px solid rgba(255, 255, 255, 0.25)'}
        padding={[4, 3]}
        justifyContent={'space-around'}>
        <Text
          fontSize={20}
          letterSpacing="1.3px"
          color="#FFFFFF40"
          onClick={onClickMerge}>
          Merge
        </Text>
        <Text fontSize={20} letterSpacing="1.3px" color="yellow.500">
          Split
        </Text>
      </Flex>
      {/* body */}
      <Box padding={[5, 6]}>
        {/* select NFTs to split */}
        <VStack
          paddingBottom={[8, 10]}
          paddingTop={4}
          paddingRight={2}
          gap={[4, 10]}>
          {/* first select */}
          <Flex
            justifyContent={'space-between'}
            width={'100%'}
            alignItems={'center'}
            gap={3}>
            <Image
              w={['37px', '58px']}
              h={['37px', '58px']}
              src="/images/VARA.svg"
            />
            <Menu>
              <MenuButton
                as={Button}
                borderRadius={['10px', '15px']}
                width={['202px', '415px']}
                height={['30px', '61px']}
                fontSize={[10, 20]}
                textColor="yellow.500"
                padding={3}
                paddingRight={[3, 8]}
                tabIndex={firstSelectedNFTId}
                rightIcon={<Image src="/images/down-arrow-small.svg" />}>
                <Flex justifyContent={'space-between'} paddingLeft={[1, 7]}>
                  <Text>ID #{filteredNfts[firstSelectedNFTId]?.id}</Text>
                  <Text>
                    {filteredNfts[firstSelectedNFTId]?.lockAmount.toFixed(2)}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList
                bg={'blue.500'}
                borderRadius={'xl'}
                width={['202px', '415px']}
                minWidth={['202px', '415px']}
                height={['30px', '61px']}>
                {filteredNfts.map((row: VeNFT, index: number) => {
                  if (index == secondSelectedNFTId) return;
                  return (
                    <MenuItem
                      width={['202px', '415px']}
                      key={row.id}
                      bg={'blue.500'}
                      margin={0}
                      _hover={{
                        color: 'yellow.500',
                        textDecoration: 'none',
                      }}
                      onClick={() => {
                        setFirstSelectedNFTId(
                          filteredNfts.findIndex(nft => nft.id === row.id)
                        );
                      }}>
                      <Flex
                        justifyContent={'space-between'}
                        paddingInline={8}
                        width={'100%'}>
                        <Text>ID #{row.id} </Text>
                        <Text>{row.lockAmount.toFixed(2)}</Text>
                      </Flex>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </Flex>
        </VStack>

        {/* Split Option */}
        {selectedNft ? (
          <VStack gap={0}>
            {/* Header */}
            <Flex width={'100%'} alignItems={'center'}>
              <Flex
                justifyContent={'space-between'}
                width={'100%'}
                alignItems={'center'}
                borderBottom={'1px solid'}
                paddingBottom={2}
                fontSize={'sm'}
                color="#FFFFFF80">
                <Text>Splits</Text>
                <Text>Stats</Text>
                <Text>Lock For</Text>
              </Flex>
            </Flex>

            {/* Split Row */}
            {options.map((option, index) => (
              <Flex
                key={index}
                justifyContent={'space-between'}
                width={'100%'}
                alignItems={'center'}
                height={28}
                borderBottom={'1px solid rgba(255,255,255,0.5)'}
                paddingBlock={4}>
                <Flex
                  flex={1}
                  height={'100%'}
                  borderRight={'1px solid rgba(255,255,255,0.5)'}>
                  <NumberInput
                    alignSelf={'center'}
                    max={100}
                    min={0}
                    color="yellow.500"
                    value={option.percent.toFixed()}
                    onChange={value => onChangePercent(Number(value), index)}>
                    <NumberInputField
                      height={10}
                      width={16}
                      borderRadius={10}
                      paddingRight={5}
                    />
                    <NumberInputStepper height={10} width={4}>
                      <Flex height={'100%'} alignItems={'center'}>
                        %
                      </Flex>
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
                <VStack flex={3} fontSize={'sm'} height={'100%'}>
                  <Text>
                    <Highlight
                      query={`${displayNumber(
                        (selectedNft.lockAmount * option.percent) / 100
                      )}`}
                      styles={{
                        color: '#CD74CC',
                      }}>
                      {`VARA  ${displayNumber(
                        (selectedNft.lockAmount * option.percent) / 100
                      )}`}
                    </Highlight>
                  </Text>
                  <Text>
                    <Highlight
                      query={`${displayNumber(
                        (selectedNft.lockValue * option.percent) / 100
                      )}`}
                      styles={{
                        color: '#FFBD59',
                      }}>
                      {`veVARA  ${displayNumber(
                        (selectedNft.lockValue * option.percent) / 100
                      )}`}
                    </Highlight>
                  </Text>
                  <Text>
                    <Highlight
                      query={`${displayNumber(
                        (selectedNft.lockAmount *
                          option.percent *
                          Number(govToken?.price ?? 0)) /
                          100
                      )}`}
                      styles={{
                        color: '#70DD88',
                      }}>
                      {`Value ${displayNumber(
                        (selectedNft.lockAmount *
                          option.percent *
                          Number(govToken?.price ?? 0)) /
                          100
                      )}`}
                    </Highlight>
                  </Text>
                </VStack>

                <SimpleGrid columns={2} gap={3} flex={1} height={'100%'}>
                  {LOCK_SMALL_DURATIONS.map((info, i) => (
                    <Button
                      key={i}
                      colorScheme="yellow"
                      variant={'outline'}
                      width={8}
                      height={8}
                      isActive={option.lockDays == info.value}
                      onClick={() =>
                        option.lockDays != info.value
                          ? onChangeDuration(info.value, index)
                          : 0
                      }>
                      {info.label}
                    </Button>
                  ))}
                </SimpleGrid>
              </Flex>
            ))}
            <Flex width={'100%'} paddingLeft={7} paddingTop={3}>
              <Text
                justifySelf={'start'}
                color="#70DD88"
                fontSize={'2xl'}
                onClick={onAddOption}>
                +
              </Text>
            </Flex>
          </VStack>
        ) : (
          <>Expired NFT not exist</>
        )}
        {/* split and back button */}
        <Flex alignItems={'center'} justifyContent={'space-between'} pt={7}>
          <Button
            h={['23px', '42px']}
            minW={['23px', '44px']}
            colorScheme="pink"
            variant={'outlineSelected'}
            fontSize={[10, 20]}
            padding={0}
            borderRadius={[7, 10]}
            onClick={onClickBack}>
            {`<`}
          </Button>
          <Button
            colorScheme="yellow"
            w={['215px', '414px']}
            h={['34px', '61px']}
            fontSize={[15, 25]}
            fontWeight={400}
            py={3}
            borderRadius={['lg', '2xl']}
            isLoading={isLoading}
            onClick={onSplitVeNFT}>
            Split
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
export default VeVaraMerge;
