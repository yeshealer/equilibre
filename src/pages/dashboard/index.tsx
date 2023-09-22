import {
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';

import LockBody from './components/lock/LockBody';
import LockHeader from './components/lock/LockHeader';
import RewardHeader from './components/reward/RewardHeader';
import RewardBody from './components/reward/RewardBody';

const Dashboard = () => {
  const [tabsIndex, setTabsIndex] = useState<number>(0);

  const handleTabsChange = (index: number): void => {
    if (index === tabsIndex) return;
    setTabsIndex(index);
  };

  return (
    <Stack spacing={10} w={'-webkit-fill-available'}>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing={6}
        justifyContent={'center'}
      // hideBelow={'lg'}
      >
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
              <Tab>Locks</Tab>
              <Tab>Rewards</Tab>
            </TabList>
            <TabPanels>
              <TabPanel
                padding={0}
                border={'1px solid transparent'}
                borderRadius={30}
                background={{
                  base: "none",
                  lg: 'linear-gradient(0deg, rgba(25, 41, 89), rgba(20, 31, 69)) padding-box, linear-gradient(180deg, #CD74CC 0%, #FFBD59 50.31%, #70DD88 100%) border-box;'
                }}>
                <LockHeader />
              </TabPanel>
              <TabPanel
                padding={0}
                border={'1px solid transparent'}
                borderRadius={30}
                background={{
                  base: "none",
                  lg: 'linear-gradient(0deg, rgba(25, 41, 89), rgba(20, 31, 69)) padding-box, linear-gradient(180deg, #CD74CC 0%, #FFBD59 50.31%, #70DD88 100%) border-box;'
                }}>
                <RewardHeader />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
      {/* <Stack hideFrom={'lg'}> */}
      {/* {tabsIndex === 0 && <LockHeader />} */}
      {/* {tabsIndex === 1 && <RewardHeader />} */}
      {/* </Stack> */}

      {tabsIndex === 0 && <LockBody />}
      {tabsIndex === 1 && <RewardBody />}
    </Stack>
  );
};

export default Dashboard;
