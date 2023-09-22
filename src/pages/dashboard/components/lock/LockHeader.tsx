import { CONTRACTS } from '@/config/company';
import { Token } from '@/interfaces';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useGlobalStateStore } from '@/store/globalStore';
import { useVeTokenStore } from '@/store/veTokenStore';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import {
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  HStack,
  useBreakpointValue,
  Avatar,
  Image,
  Icon,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cursorTo } from 'readline';

const LockHeader = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { totalSupply, lockedSupply } = useGlobalStateStore(state => ({
    totalSupply: state.totalSupply,
    lockedSupply: state.lockedSupply,
  }));
  const router = useRouter();

  const [varaPrice, setVaraPrice] = useState<number>(0);
  const [isShowPercent, setShowStyle] = useState<boolean>(true);
  const { veNFTs } = useVeTokenStore(state => ({ veNFTs: state.veNFTs }));
  const { baseAssets, getBaseAsset } = useBaseAssetStore(state => ({
    baseAssets: state.baseAssets,
    getBaseAsset: state.actions.getBaseAsset,
  }));

  const varaLockedPercent = !Number.isNaN((lockedSupply * 100) / totalSupply)
    ? ((lockedSupply * 100) / totalSupply).toFixed(2) + '%'
    : '--';
  let accountTvl = 0;
  let accountVotingPower = 0;
  veNFTs.map(nft => {
    accountTvl += nft.lockAmount * varaPrice;
    accountVotingPower += nft.lockValue;
  });

  useEffect(() => {
    const varaAsset: Token | undefined = getBaseAsset(
      CONTRACTS.GOV_TOKEN_ADDRESS
    );
    if (varaAsset) {
      setVaraPrice(Number(varaAsset?.price) || 0);
    }
  }, [baseAssets.length]);

  const onChangeShowStyle = () => {
    setShowStyle(!isShowPercent);
  };

  return (
    <Stack
      direction={{ base: 'column-reverse', lg: 'row' }}
      justifyContent={'space-between'}
      gap={{ base: 10, lg: 0 }}
      h={{
        base: 'max-content',
        lg: '224px',
      }}
      borderRadius={30}>
      {/* Vara actions */}
      <Flex
        py={{ base: 6, lg: 0 }}
        flex={1}
        justifyContent={{ base: 'space-between', lg: 'center' }}
        alignItems={{ base: 'center', lg: 'start' }}
        direction={{ base: 'row', lg: 'column' }}
        gap={{ base: 8, lg: 3 }}
        padding={8}
        borderTop={'none'}
        borderColor={'gray.600'}
        bg={{
          base: 'linear-gradient(0deg, rgba(25, 41, 89), rgba(20, 31, 69)) padding-box, linear-gradient(180deg, #CD74CC 0%, #FFBD59 50.31%, #70DD88 100%) border-box;',
          lg: 'none',
        }}
        // bg="none"
        border={{ base: '1px solid transparent', lg: 'none' }}
        borderRadius={20}>
        <Button
          borderRadius={{ base: 'xl' }}
          fontSize={{ base: 'md', lg: 'xl' }}
          w={{ base: '40', lg: '64' }}
          h={{ base: '12', lg: '14' }}
          onClick={() => router.push('/dashboard/lock')}>
          {'Get veVARA'}
        </Button>
        <Button
          borderRadius={{ base: 'xl' }}
          fontSize={{ base: 'md', lg: 'xl' }}
          w={{ base: '40', lg: '64' }}
          h={{ base: '12', lg: '14' }}
          onClick={() => router.push('/dashboard/bVara')}>
          {'bVARA'}
        </Button>
        <Button
          borderRadius={{ base: 'xl' }}
          fontSize={{ base: 'md', lg: 'xl' }}
          w={{ base: '40', lg: '64' }}
          h={{ base: '12', lg: '14' }}
          onClick={() => router.push('/dashboard/merge')}>
          {'Merge'}
        </Button>
      </Flex>

      <Stack
        direction={{ base: 'column', lg: 'row' }}
        flex={3}
        bg={{
          base: 'linear-gradient(0deg, rgba(25, 41, 89), rgba(20, 31, 69)) padding-box, linear-gradient(180deg, #CD74CC 0%, #FFBD59 50.31%, #70DD88 100%) border-box;',
          lg: 'none',
        }}
        border={{ base: '1px solid transparent', lg: 'none' }}
        borderRadius={20}>
        {/* VARA supply locked */}
        <Flex
          flex={2}
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          pt={{ base: 8, lg: 6 }}
          pb={{ base: 2, lg: 6 }}
          borderLeft={isDesktop ? '1px solid' : 'none'}
          borderColor={isDesktop ? 'gray.600' : 'none'}
          letterSpacing={'2px'}
          onClick={onChangeShowStyle}
          _hover={{
            cursor: 'pointer',
          }}>
          <Text fontSize={'3xl'} fontFamily={'Arista'}>
            {isDesktop ? 'VARA Supply Locked' : 'Supply Locked'}
          </Text>
          <Flex>
            <Text color={'green.500'} fontSize={'4xl'}>
              {isShowPercent ? varaLockedPercent : displayNumber(lockedSupply)}
            </Text>
            <Image
              ml={5}
              alignSelf={'center'}
              width={8}
              height={8}
              src={'/images/SWAP.png'} />
          </Flex>
        </Flex>

        {/* Total Locked and Voting Power */}
        <Flex
          flex={1}
          direction={'column'}
          alignItems={'center'}
          justifyContent={'start'}
          gap={{ base: 8, lg: 2 }}
          paddingY={{ base: 6, lg: 3 }}
          borderLeft={isDesktop ? '1px solid' : 'none'}
          borderTop={!isDesktop ? '1px solid' : 'none'}
          borderColor={'gray.600'}>
          <HStack
            justifyContent={'space-between'}
            px={{ base: 10, lg: 7 }}
            borderBottom={{ base: 'none', lg: '1px solid' }}
            borderColor={{ base: 'none', lg: 'gray.600' }}
            w={'100%'}
            h={'50%'}>
            <Text fontFamily={'Arista'}>
              {isDesktop ? 'Total Value Locked:' : 'My Locks Value'}
            </Text>
            <Text color={!isDesktop ? 'none' : 'green.500'}>{`${displayCurrency(
              accountTvl
            )}`}</Text>
          </HStack>
          <HStack
            justifyContent={'space-between'}
            px={{ base: 10, lg: 7 }}
            w={'100%'}
            h={'50%'}>
            <Text
              fontFamily={'Arista'}
              color={isDesktop ? 'none' : 'green.500'}>
              {isDesktop ? 'Total Voting Power: ' : 'My Voting Power'}
            </Text>
            <Text color={'green.500'}>{displayNumber(accountVotingPower)}</Text>
          </HStack>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default LockHeader;
