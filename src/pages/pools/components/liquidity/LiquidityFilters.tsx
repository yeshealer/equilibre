import EquilibreCard from '@/components/core/Card';
import {
  Box,
  Button,
  ChakraProps,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Switch,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

interface LiquidityFiltersProps {
  props?: ChakraProps;
  handleOnChangeSwitch: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LiquidityFiltersContent = ({
  handleOnChangeSwitch,
  props,
}: LiquidityFiltersProps) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      justifyContent={'space-between'}
      alignItems={'center'}
      fontSize={'sm'}
      fontFamily={'Arista'}
      spacing={6}>
      {isDesktop ? (
        <>
          <HStack>
            <Text>Stables</Text>
            <Switch name="stable" onChange={handleOnChangeSwitch} />
          </HStack>
          <HStack>
            <Text>Volatiles</Text>
            <Switch name="volatile" onChange={handleOnChangeSwitch} />
          </HStack>

          <HStack>
            <Text>Gauges</Text>
            <Switch name="gauge" onChange={handleOnChangeSwitch} />
          </HStack>
          <HStack>
            <Text>Deposits</Text>
            <Switch name="deposit" onChange={handleOnChangeSwitch} />
          </HStack>
        </>
      ) : (
        <>
          <HStack justifyContent={'space-around'} w={'-webkit-fill-available'}>
            <HStack>
              <Text>Stables</Text>
              <Switch onChange={handleOnChangeSwitch} />
            </HStack>
            <HStack>
              <Text>Volatiles</Text>
              <Switch onChange={handleOnChangeSwitch} />
            </HStack>
          </HStack>
          <HStack justifyContent={'space-around'} w={'-webkit-fill-available'}>
            <HStack>
              <Text>Gauges</Text>
              <Switch />
            </HStack>
            <HStack>
              <Text>Deposits</Text>
              <Switch />
            </HStack>
          </HStack>
        </>
      )}
    </Stack>
  );
};

const LiquidityFilters = ({
  handleOnChangeSwitch,
  props,
}: LiquidityFiltersProps) => {
  const isDesktop = useBreakpointValue({ base: true, md: false });
  return (
    <>
      {isDesktop ? (
        <Popover>
          <PopoverTrigger>
            <Button borderRadius={'3xl'} p={'8'}>
              Filters
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody p={8}>
                <LiquidityFiltersContent
                  handleOnChangeSwitch={handleOnChangeSwitch}
                />
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      ) : (
        <Box
          bg="linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box"
          border={'1px solid transparent'}
          borderRadius={'3xl'}
          justifyContent={'center'}
          alignItems={'center'}
          py={'5'}
          px={'8'}
          boxShadow={'lg'}
          {...props}>
          <LiquidityFiltersContent
            handleOnChangeSwitch={handleOnChangeSwitch}
          />
        </Box>
      )}
    </>
  );
};

export default LiquidityFilters;
