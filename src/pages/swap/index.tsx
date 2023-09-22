import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import CrossChainSwap from './components/CrossChainSwap';
import OnChainSwap from './components/OnChainSwap';
import RoutesSwap from './components/RoutesSwap';
import { useState } from 'react';

const Swap = () => {
  const [tabActive, setTabActive] = useState(0);
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'center' }}
      spacing={{ base: '10' }}>
      <Tabs
        variant={'enclosed'}
        w={{ base: '100vw', md: 'inherit' }}
        onChange={index => setTabActive(index)}>
        <TabList>
          <Tab>Swap</Tab>
          <Tab>Cross-Swap</Tab>
        </TabList>
        <TabPanels>
          <TabPanel w={'auto'}>
            <OnChainSwap />
          </TabPanel>
          <TabPanel>
            <CrossChainSwap />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {tabActive === 0 && (
        <Box w={{ base: '100vw', md: 'inherit' }}>
          <RoutesSwap />
        </Box>
      )}
    </Stack>
  );
};

export default Swap;
