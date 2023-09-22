import { useLiquidityStore } from '@/store/features/liquidity/liquidityStore';
import {
  Button,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import StakeV2 from '../components/liquidity/StakeV2';
import UnstakeV2 from '../components/liquidity/UnstakeV2';
import { Pair } from '@/interfaces';

const ManagePools = () => {
  const router = useRouter();
  const { setActiveTab } = useLiquidityStore(state => ({
    setActiveTab: state.actions.setActiveTab,
  }));
  return (
    <Stack>
      <Tabs
        variant={'enclosed'}
        w={{ base: '100vw', md: 'inherit' }}
        onChange={index =>
          setActiveTab(index, (router.query.id as string) ?? '')
        }>
        <TabList display={'flex'} justifyContent={'space-between'}>
          <Button
            size={'sm'}
            fontSize={'xl'}
            ml={1}
            mb={2}
            colorScheme="pink"
            variant={'outlineSelected'}
            onClick={() => router.push('/pools')}>
            {`<`}
          </Button>
          <HStack mt={2} mr={10} spacing={6}>
            <Tab>Stake</Tab>
            <Tab>Unstake</Tab>
          </HStack>
        </TabList>
        <TabPanels>
          <TabPanel>
            <StakeV2 />
          </TabPanel>
          <TabPanel>
            <UnstakeV2 />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default ManagePools;
