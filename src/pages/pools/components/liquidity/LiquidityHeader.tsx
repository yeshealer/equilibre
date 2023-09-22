import { useGlobalStateStore } from '@/store/globalStore';
import { displayCurrency } from '@/utils/formatNumbers';
import {
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
interface LiquidityHeaderProps {
  isStucked: boolean;
}
const LiquidityHeader = ({ isStucked }: LiquidityHeaderProps) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { tvl } = useGlobalStateStore(state => ({ tvl: state.tvl }));
  const router = useRouter();
  return (
    <Stack
      direction={{ base: 'column-reverse', lg: 'row' }}
      justifyContent={'space-between'}
      h={{
        base: 'max-content',
        lg: '192px',
      }}>
      <Flex
        py={{ base: 6, lg: 0 }}
        flex={1}
        justifyContent={'center'}
        alignItems={{ base: 'center', lg: 'start' }}
        direction={{ base: 'row', lg: 'column' }}
        ml={{ base: 0, lg: 4 }}
        gap={4}
        borderRight={isDesktop ? '1px solid' : 'none'}
        borderTop={isDesktop ? 'none' : '1px solid'}
        borderColor={'gray.600'}>
        <Button
          // variant={'secondary'}
          borderRadius={'xl'}
          fontSize={'xl'}
          h={'14'}
          w={'64'}
          onClick={() => router.push('/pools/manage')}>
          {isDesktop ? 'V2 Liquidity' : 'V2'}
        </Button>
        {/* <Button borderRadius={'xl'} fontSize={'xl'} h={'14'} w={'64'}>
          {isDesktop ? 'V3 Liquidity' : 'V3'}
        </Button> */}
      </Flex>

      {/* <Divider orientation={isDesktop ? 'vertical' : 'horizontal'} /> */}
      <Flex
        flex={isStucked ? 2 : 3}
        direction={'column'}
        alignItems={'center'}
        justifyContent={'start'}
        py={{ base: 2, lg: 8 }}>
        <Text fontSize={'3xl'} fontFamily={'Arista'}>
          TVL
        </Text>
        <Text color={'green.500'} fontSize={'4xl'}>
          {displayCurrency(tvl)}
        </Text>
      </Flex>
    </Stack>
  );
};

export default LiquidityHeader;
