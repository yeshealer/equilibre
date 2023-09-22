import { useSwapStore } from '@/store/features/swap/swapStore';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Box, HStack, Stack, Switch, Tooltip, Text } from '@chakra-ui/react';

const RouteOptions = () => {
  const { displayRoute, changeDisplayRoute } = useSwapStore(state => ({
    displayRoute: state.displayRoute,
    changeDisplayRoute: state.actions.changeDisplayRoute,
  }));
  return (
    <Stack>
      <HStack mt={'-2'}>
        <Text>Route Chart</Text>
        <Tooltip
          label="Enable this option to show the current routing."
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
          isChecked={displayRoute}
          onChange={() => changeDisplayRoute(!displayRoute)}
        />
      </Box>
    </Stack>
  );
};

export default RouteOptions;
