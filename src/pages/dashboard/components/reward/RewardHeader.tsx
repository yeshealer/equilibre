import EquilibreCard from '@/components/core/Card';
import NftRadioGroup from '@/components/core/NftRadioGroup';
import useRewardActions from '@/hooks/dashboard/useRewardActions';
import useRewards from '@/hooks/dashboard/useRewards';
import { useAccountStore } from '@/store/accountStore';
import { useRewardsStore } from '@/store/rewardsStore';
import { useVeTokenStore } from '@/store/veTokenStore';
import { displayCurrency } from '@/utils/formatNumbers';
import {
  Stack,
  Flex,
  useBreakpointValue,
  Button,
  Text,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';

const RewardHeader = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [isLockLoading, setLockLoading] = useState<boolean>(false);
  const [isClaimLoading, setClaimLoading] = useState<boolean>(false);

  const { selectedNFT } = useVeTokenStore(state => ({
    selectedNFT: state.selectedVeNFT,
  }));
  const { getTotalRewards, getEmissionReward } = useRewards(
    selectedNFT?.id ?? 0
  );
  const { claimAllRewards, claimAndAddVaraToLockForAll } = useRewardActions();

  const { estimatedReward, emissions, bribes, fees, rebase } = useRewardsStore(
    state => ({
      estimatedReward: state.estimatedRewardValue,
      emissions: state.emissions,
      bribes: state.bribes,
      fees: state.fees,
      rebase: state.rebase,
    })
  );

  const onLockAll = async () => {
    setLockLoading(true);
    const result = await claimAndAddVaraToLockForAll(
      selectedNFT?.id ?? 0,
      emissions,
      fees,
      bribes,
      rebase
    );
    setLockLoading(false);
    if (result) await getTotalRewards();
  };
  const onClaimAll = async () => {
    setClaimLoading(true);
    const { result } = await claimAllRewards(
      selectedNFT!.id,
      emissions,
      fees,
      bribes,
      rebase
    );
    setClaimLoading(false);
    if (result) {
      await getTotalRewards();
      await getEmissionReward();
    }
  };

  return (
    <Stack
      direction={{ base: 'column-reverse', lg: 'row' }}
      justifyContent={'space-between'}
      gap={{ base: 12, lg: 0 }}
      h={{
        base: 'max-content',
        lg: '224px',
      }}>
      {/* Vara actions */}
      <Flex
        py={{ base: 6, lg: 0 }}
        flex={1}
        justifyContent={{ base: 'space-between', lg: 'center' }}
        alignItems={{ base: 'center', lg: 'start' }}
        direction={{ base: 'row', lg: 'column' }}
        gap={{ base: 8, lg: 6 }}
        padding={8}
        borderTop={'none'}
        borderColor={'gray.600'}
        bg={{
          base: 'linear-gradient(0deg, rgba(25, 41, 89), rgba(20, 31, 69)) padding-box, linear-gradient(180deg, #CD74CC 0%, #FFBD59 50.31%, #70DD88 100%) border-box;',
          lg: 'none',
        }}
        border={{ base: '1px solid transparent', lg: 'none' }}
        borderRadius={20}>
        <Button
          borderRadius={{ base: 'xl' }}
          fontSize={{ base: 'md', lg: 'xl' }}
          w={{ base: '40', lg: '64' }}
          h={{ base: '12', lg: '14' }}
          isLoading={isLockLoading}
          isDisabled={!selectedNFT?.id}
          onClick={onLockAll}>
          Lock All VARA
        </Button>
        <Button
          borderRadius={{ base: 'xl' }}
          fontSize={{ base: 'md', lg: 'xl' }}
          w={{ base: '40', lg: '64' }}
          h={{ base: '12', lg: '14' }}
          isLoading={isClaimLoading}
          isDisabled={!selectedNFT?.id}
          onClick={onClaimAll}>
          Claim All
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
        {/* estimated rewards */}
        <Flex
          flex={2}
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          pt={{ base: 8, lg: 6 }}
          pb={{ base: 2, lg: 6 }}
          borderLeft={isDesktop ? '1px solid' : 'none'}
          borderColor={isDesktop ? 'gray.600' : 'none'}
          letterSpacing={'2px'}>
          <Text fontSize={'3xl'} fontFamily={'Arista'}>
            Total Rewards
          </Text>
          <Text color={'green.500'} fontSize={'4xl'}>
            {displayCurrency(Math.abs(estimatedReward))}
          </Text>
        </Flex>

        {/* nft selector */}
        <Flex
          flex={1}
          direction={'column'}
          alignItems={'center'}
          justifyContent={'start'}
          gap={2}
          paddingY={3}
          borderLeft={isDesktop ? '1px solid' : 'none'}
          borderTop={!isDesktop ? '1px solid' : 'none'}
          borderColor={'gray.600'}>
          <NftRadioGroup padding={6} noBorder={isDesktop ? false : true} />
        </Flex>
      </Stack>
    </Stack>
  );
};

export default RewardHeader;
