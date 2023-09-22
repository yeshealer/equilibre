import EquilibreCard from '@/components/core/Card';
import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import { Reward } from '@/interfaces';
import {
  Box,
  Button,
  Flex,
  VStack,
  Text,
  Icon,
  Image,
  HStack,
} from '@chakra-ui/react';
import { IoIosEye } from 'react-icons/io';
import ImageTooltip, { ImageTooltipData } from './ImageTooltip';
import { getBalanceInEther } from '@/utils/formatBalance';
import { CONTRACTS } from '@/config/company';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useRewardsStore } from '@/store/rewardsStore';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import useRewards from '@/hooks/dashboard/useRewards';
import { useState } from 'react';
import { useVeTokenStore } from '@/store/veTokenStore';
import useRewardActions from '@/hooks/dashboard/useRewardActions';
import EmissionTooltip, { EmissionTooltipData } from './EmissionTooltip';

interface RewardCardProps {
  type: 'Emissions' | 'Fees' | 'Bribes' | 'Rebase';
}

const RewardCard: React.FC<RewardCardProps> = ({ type }) => {
  const [isClaiming, setClaiming] = useState<boolean>(false);
  const [isLocking, setLocking] = useState<boolean>(false);
  const { selectedNFT } = useVeTokenStore(state => ({
    selectedNFT: state.selectedVeNFT,
  }));
  const {
    claimRebase,
    claimEmissions,
    claimFees,
    claimBribes,
    claimAndAddVaraToLock,
  } = useRewardActions();

  const { getTotalRewards, getEmissionReward } = useRewards(selectedNFT?.id ?? 0);
  const { getBaseAsset } = useBaseAssetStore(state => ({
    getBaseAsset: state.actions.getBaseAsset,
  }));

  const govToken = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS);
  let data: Reward | undefined;
  let tooltipData;
  switch (type) {
    case 'Emissions':
      data = useRewardsStore(state => state.emissions);
      tooltipData =
        !!data && data?.info.length
          ? data?.info.map(
            item =>
            ({
              images: [
                { logoURI: item.pair?.token0.logoURI },
                { logoURI: item.pair?.token1.logoURI },
              ],
              description: `${displayNumber(getBalanceInEther(BigInt(item.userGaugeBalance!), Number(item.pair?.gauge?.decimals)))}`,
              rewardTokens: [{
                logoURI: item.rewardToken.logoURI,
                amount: Number(getBalanceInEther(BigInt(item.earned), Number(item.rewardToken.decimals)))
              }]
              ,
            } as EmissionTooltipData)
          )
          : undefined;
      break;
    case 'Fees':
      data = useRewardsStore(state => state.fees);
      tooltipData =
        !!data && data?.showInfo?.length
          ? data?.showInfo.map(
            item =>
            ({
              images: [{ logoURI: item.rewardToken.logoURI }],
              description: `${displayNumber(
                getBalanceInEther(
                  BigInt(item.earned),
                  Number(item.rewardToken.decimals)
                )
              )}`,
            } as ImageTooltipData)
          )
          : undefined;
      break;
    case 'Bribes':
      data = useRewardsStore(state => state.bribes);
      tooltipData =
        !!data && data?.showInfo?.length
          ? data?.showInfo.map(
            item =>
            ({
              images: [{ logoURI: item.rewardToken.logoURI }],
              description: `${displayNumber(
                getBalanceInEther(
                  BigInt(item.earned),
                  Number(item.rewardToken.decimals)
                )
              )
                } `,
            } as ImageTooltipData)
          )
          : undefined;
      break;
    case 'Rebase':
      data = useRewardsStore(state => state.rebase);
      tooltipData =
        !!data && data.showInfo?.length
          ? [
            {
              images: [{ logoURI: data.showInfo[0].rewardToken.logoURI }],
              description: `${displayNumber(getBalanceInEther(
                BigInt(data.showInfo[0].earned),
                Number(data.showInfo[0].rewardToken.decimals)
              ))
                } `,
            } as ImageTooltipData,
          ]
          : undefined;
      break;
  }
  const firstLine =
    type === 'Emissions'
      ? 'LP Position'
      : 'Tokens Earned';
  const totalEarnedValue = data?.totalEarnedValue
    ? displayCurrency(data?.totalEarnedValue.toFixed(2))
    : '--';
  const tooltipDisplaySection = (
    <Flex alignItems={'center'} role={'group'} color={totalEarnedValue === '--' ? 'pink.500' : ""}>
      <Text
        transition="all 300ms ease-out"
        _groupHover={totalEarnedValue === '--' ? {} : { color: 'green.500' }}>
        View
      </Text>
      <Icon
        as={IoIosEye}
        color={totalEarnedValue === '--' ? 'pink.500' : 'gray.500'}
        boxSize={4}
        transition="all 300ms ease-out"
        _groupHover={totalEarnedValue === '--' ? {} : { color: 'green.500' }}
      />
    </Flex>
  );


  const onClaimReward = async (reward: Reward) => {
    setClaiming(true);
    let result;
    switch (reward.rewardType) {
      case 'Rebase':
        result = await claimRebase(reward);
        break;
      case 'Emission':
        result = await claimEmissions(reward);
        break;
      case 'Fee':
        result = await claimFees(reward);
        break;
      case 'Bribe':
        result = await claimBribes(reward);
        break;
    }
    setClaiming(false);

    if (result) {
      if (type === 'Emissions') await getEmissionReward();
      else await getTotalRewards();
    }
  };
  const onLock = async (reward: Reward) => {
    setLocking(true);
    let result =
      reward.rewardType === 'Rebase'
        ? await claimRebase(reward)
        : await claimAndAddVaraToLock(reward);
    setLocking(false);
    if (result) {
      if (type === 'Emissions') await getEmissionReward();
      else await getTotalRewards();
    }
  };

  return (
    <EquilibreCard
      //@ts-ignore
      w={'100%'}
      height={'max-content'}
      padding={0}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      borderRadius={{ base: 20, lg: 30 }}
      fontSize={{ base: 11, lg: 12 }}
      letterSpacing={'1.3px'}>
      {/* title */}
      <Box
        height={{ base: '52px', lg: '60px' }}
        padding={6}
        paddingTop={{ base: 3, lg: 5 }}
        paddingBottom={4}
        width={'100%'}
        borderBottom={'1px solid rgba(255,255,255,0.25)'}>
        <Flex justifyContent={'space-between'} alignItems={'center'} height={8}>
          <Text fontSize={{ base: 13, lg: 15 }}>{type}</Text>
          <Flex>
            {data?.showInfo &&
              data?.showInfo.length > 0 &&
              data.showInfo.map((info: any, index: number) => {
                return (
                  <EquilibreAvatar
                    key={index}
                    src={info.rewardToken.logoURI}
                    size={'sm'}
                    marginLeft="-0.75rem"
                  />
                );
              })}
          </Flex>
        </Flex>
      </Box>
      {/* info */}
      <VStack
        gap={{ base: 6, lg: 14 }}
        padding={6}
        height={'100%'}
        width={'100%'}
        borderBottom={'1px solid rgba(255,255,255,0.25)'}>
        <Flex
          width={'100%'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <Text fontFamily={'Arista'}>{firstLine}</Text>
          {tooltipData ?
            (type === 'Emissions' ?
              (<EmissionTooltip data={tooltipData as EmissionTooltipData[]}>{tooltipDisplaySection}</EmissionTooltip>)
              : (
                <ImageTooltip data={tooltipData}>
                  {tooltipDisplaySection}
                </ImageTooltip>
              ))
            : (
              <>{tooltipDisplaySection}</>
            )}
        </Flex>
        <Flex
          width={'100%'}
          justifyContent={'space-between'}
          color={totalEarnedValue === '--' ? 'pink.500' : 'green.500'}>
          <Text fontFamily={'Arista'}>Value Earned</Text>
          <Text>{totalEarnedValue}</Text>
        </Flex>
      </VStack>
      {/* actions */}
      <Flex
        height={{ base: 16, lg: '70px' }}
        width={'100%'}
        justifyContent={type != 'Rebase' ? 'space-between' : 'center'}
        paddingInline={5}
        paddingTop={4}>
        {type != 'Rebase' && (
          <Button
            height={{ base: 8, lg: 9 }}
            minWidth={{ base: 24, lg: 20 }}
            borderRadius={{ base: 'xl', lg: 'xl' }}
            fontSize={{ base: 'xs', lg: 'sm' }}
            onClick={() => {
              onClaimReward(data!);
            }}
            isDisabled={!data || !data?.totalEarned}
            isLoading={isClaiming}>
            Claim
          </Button>
        )}
        <Button
          height={{ base: 8, lg: 9 }}
          minWidth={{ base: 24, lg: 20 }}
          borderRadius={{ base: 'xl', lg: 'xl' }}
          fontSize={{ base: 'xs', lg: 'sm' }}
          onClick={() => {
            onLock(data!);
          }}
          isDisabled={!data || !data?.varaEarned}
          isLoading={isLocking}>
          {type === 'Rebase' ? 'Add to Lock' : 'Lock'}
        </Button>
      </Flex>
    </EquilibreCard>
  );
};

export default RewardCard;
