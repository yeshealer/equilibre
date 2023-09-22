import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import VoteHeader from './components/VoteHeader';
import LiquidityBody from './components/liquidity/LiquidityBody';
import LiquidityHeader from './components/liquidity/LiquidityHeader';
import ActionsNeeded from './components/liquidity/ActionsNeeded';
import VoteBody from './components/vote/VoteBody';
import { usePairStore } from '@/store/pairsStore';

const Pools = () => {
  const [tabsIndex, setTabsIndex] = useState(0);
  const [isStuckedValue, setIsStuckedValue] = useState(false);
  const handleTabsChange = (index: number): void => {
    setTabsIndex(index);
  };
  const pairs = usePairStore(s => s.pairs);
  useEffect(() => {
    const filteredPairs = pairs.filter(pair => {
      return (pair?.balanceDeposited as number) > 0;
    });
    setIsStuckedValue(filteredPairs.length !== 0);
  }, [pairs]);
  return (
    <Stack spacing={10} w={'-webkit-fill-available'}>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing={6}
        justifyContent={'center'}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          alignItems={{ base: 'center' }}
          spacing={{ base: '10' }}
          flexWrap={'wrap'}
          w={'-webkit-fill-available'}>
          <Tabs
            variant={'enclosed'}
            w={'-webkit-fill-available'}
            onChange={handleTabsChange}>
            <TabList>
              <Tab>Liquidity</Tab>
              <Tab>Vote</Tab>
            </TabList>
            <TabPanels>
              <TabPanel py={0}>
                <LiquidityHeader isStucked={isStuckedValue} />
              </TabPanel>
              <TabPanel py={0} px={0}>
                <VoteHeader />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
        {tabsIndex === 0 && isStuckedValue && (
          <Stack justifyContent={'center'} alignItems={'center'}>
            <Box h={{ base: '0px', lg: '27px' }} />
            <ActionsNeeded w={'xs'} h={'48'} />
          </Stack>
        )}
      </Stack>

      {tabsIndex === 0 ? <LiquidityBody /> : <VoteBody />}
      {/* {tabsIndex === 1 && <VoteBody />} */}
    </Stack>
  );
};

export default Pools;
