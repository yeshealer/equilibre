import {
  Box,
  Button,
  ChakraProps,
  HStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Switch,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
interface VoteFiltersProps {
  props?: ChakraProps;
  handleOnChangeSwitch: (event: ChangeEvent<HTMLInputElement>) => void;
  minRewards: string;
  maxRewards: string;
  setMinRewards: (value: string) => void;
  setMaxRewards: (value: string) => void;
}
interface VoteRangeProps {
  minRewards: string;
  maxRewards: string;
  setMinRewards: (value: string) => void;
  setMaxRewards: (value: string) => void;
}
interface BribedOnlySwitchProps {
  handleOnChangeSwitch: (event: ChangeEvent<HTMLInputElement>) => void;
}
const BribedOnlySwitch = ({ handleOnChangeSwitch }: BribedOnlySwitchProps) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <HStack
      justifyContent={isDesktop ? 'space-evenly' : 'start'}
      w={'-webkit-fill-available'}>
      <Text
        sx={{
          textWrap: 'nowrap',
        }}
        letterSpacing={'wider'}>
        Rewards Only
      </Text>
      <Switch
        name="bribed"
        onChange={handleOnChangeSwitch}
        defaultChecked={true}
      />
    </HStack>
  );
};
const VoteRange = ({
  minRewards,
  maxRewards,
  setMinRewards,
  setMaxRewards,
}: VoteRangeProps) => {
  return (
    <HStack justifyContent={'space-between'} w={'-webkit-fill-available'}>
      <Text
        sx={{
          textWrap: 'nowrap',
        }}
        letterSpacing={'wider'}>
        Minimum Rewards per
      </Text>
      <Text
        fontFamily={'Righteous'}
        sx={{
          textWrap: 'nowrap',
        }}
        letterSpacing={'wider'}>
        1000
      </Text>
      <Text
        sx={{
          textWrap: 'nowrap',
        }}
        letterSpacing={'wider'}>
        votes
      </Text>
      <InputGroup flexDirection={'column'} w={'20'}>
        <NumberInput
          step={0.1}
          min={0}
          colorScheme="yellow"
          value={minRewards === '0' ? '' : minRewards}
          onChange={value => setMinRewards(value)}>
          <InputLeftElement
            mt={0.35}
            pointerEvents="none"
            color={minRewards !== '' ? 'yellow.500' : 'gray.300'}
            fontSize="sm"
            fontFamily={'Righteous'}
            children="$"
          />
          <NumberInputField
            paddingInlineEnd={'3'}
            color={'yellow.500'}
            fontSize={'sm'}
            placeholder="0"
            textAlign={'right'}
            fontFamily={'Righteous'}
          />
        </NumberInput>
      </InputGroup>
      {/* <Text>to </Text>
      <InputGroup flexDirection={'column'} w={'20'}>
        <NumberInput
          step={0.1}
          min={minRewards ? Number(minRewards) : 0}
          colorScheme="yellow"
          value={maxRewards === '' ? '' : maxRewards}
          onChange={value => setMaxRewards(value)}>
          <InputRightElement
            mt={0.35}
            pointerEvents="none"
            color="gray.300"
            fontSize="sm"
            fontFamily={'Righteous'}
            children="$"
          />
          <NumberInputField
            color={'yellow.500'}
            fontSize={'sm'}
            placeholder="-"
            textAlign={'left'}
            fontFamily={'Righteous'}
          />
        </NumberInput>
      </InputGroup> */}
    </HStack>
  );
};
const VoteFiltersContent = ({
  handleOnChangeSwitch,
  minRewards,
  maxRewards,
  setMinRewards,
  setMaxRewards,
}: VoteFiltersProps) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      // justifyContent={{ base: 'center', md: 'space-between' }}
      justifyContent={'space-between'}
      alignItems={'center'}
      fontSize={'sm'}
      fontFamily={'Arista'}
      spacing={3}>
      <>
        <VoteRange
          minRewards={minRewards}
          maxRewards={maxRewards}
          setMinRewards={setMinRewards}
          setMaxRewards={setMaxRewards}
        />
        <BribedOnlySwitch handleOnChangeSwitch={handleOnChangeSwitch} />
      </>
    </Stack>
  );
};

const VoteFilters = ({
  props,
  handleOnChangeSwitch,
  minRewards,
  maxRewards,
  setMinRewards,
  setMaxRewards,
}: VoteFiltersProps) => {
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
                <VoteFiltersContent
                  handleOnChangeSwitch={handleOnChangeSwitch}
                  minRewards={minRewards}
                  maxRewards={maxRewards}
                  setMinRewards={setMinRewards}
                  setMaxRewards={setMaxRewards}
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
          py={'3'}
          px={'8'}
          boxShadow={'lg'}
          {...props}>
          <VoteFiltersContent
            handleOnChangeSwitch={handleOnChangeSwitch}
            minRewards={minRewards}
            maxRewards={maxRewards}
            setMinRewards={setMinRewards}
            setMaxRewards={setMaxRewards}
          />
        </Box>
      )}
    </>
  );
};

export default VoteFilters;
