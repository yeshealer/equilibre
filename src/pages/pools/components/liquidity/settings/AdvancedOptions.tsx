import { useLiquidityStore } from '@/store/features/liquidity/liquidityStore';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Box, HStack, Stack, Switch, Tooltip, Text } from '@chakra-ui/react';

const AdvancedOptions = () => {
  const { advancedMode, setAdvancedMode } = useLiquidityStore(state => ({
    advancedMode: state.advancedMode,
    setAdvancedMode: state.actions.setAdvancedMode,
  }));
  return (
    <Stack>
      <HStack mt={'-2'}>
        <Text>Advanced Mode</Text>
        <Tooltip
          label="Enable this option to show deposit button. Keep in mind this will not stake in the gauge, just deposit in the pool."
          fontSize="sm"
          placement="auto-start"
          px={3}
          py={2}
          rounded="xl"
          maxW="240px"
          fontWeight="normal"
          color={'whiteAlpha.900'}
          borderColor={'pink.500'}
          bg={'darkblue.500'}>
          <QuestionOutlineIcon ml="2px" mt="-2px" />
        </Tooltip>
      </HStack>
      <Box>
        <Switch
          isChecked={advancedMode}
          onChange={() => setAdvancedMode(!advancedMode)}
        />
      </Box>
    </Stack>
  );
};

export default AdvancedOptions;
