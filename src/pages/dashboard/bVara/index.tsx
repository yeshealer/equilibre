import {
  Box, Flex, VStack,
} from '@chakra-ui/react';
import BVaraVestCard from "../components/bVara/BVaraVestCard";
import BVaraConvertCard from '../components/bVara/BVaraConvertCard';
import BVaraTable from '../components/bVara/BVaraTable';


const VeVaraMint = () => {
  return (
    <VStack gap={10} w={'-webkit-fill-available'}>
      <Flex
        justifyContent={'center'}
        width={"100%"}
        gap={10}
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <Flex justifyContent={'center'}>
          <BVaraVestCard />
        </Flex>
        <Flex justifyContent={'center'}>
          <BVaraConvertCard />
        </Flex>
      </Flex>
      <Flex
        maxW={{ base: '298px', sm: '444px', lg: '928px' }}
        width={'100%'}
      >
        <BVaraTable></BVaraTable>
      </Flex>
    </VStack>
  );
};
export default VeVaraMint;
