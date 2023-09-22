import {
  Box,
  Button,
  Text,
  Flex,
  VStack,
} from '@chakra-ui/react';
import SingleSelectToken from '@/components/core/SingleSelectToken';
import useBVaraVestCard from '@/hooks/dashboard/useBVaraVestCard';


const BVaraVestCard = () => {
  const {
    token,
    lockAmount,
    router,
    isVestLoading,

    setLockAmount,
    onStartVest,
  } = useBVaraVestCard();
  return (
    <Box
      background={
        'linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box'
      }
      border={'1px solid transparent'}
      w={['298px', '444px']}
      // minW={'298px'}
      maxW={'528px'}
      padding={{ base: 0, sm: 6 }}
      borderRadius={[20, 30]}
      letterSpacing={'1.95px'}>
      {/*  body  */}
      <Box padding={['1rem 1.25rem', 0]}>
        {/* value input section */}
        <SingleSelectToken
          showPercentages={true}
          showTokenSelector={false}
          token={token}
          handleTokenOnClick={() => { }}
          inputBalance={lockAmount}
          setInputBalance={setLockAmount}
          showBackButton={true}
          onBack={() => router.push('/dashboard')}
        />
        {/* your bVara info */}
        <Flex
          fontSize={[10, 15]}
          pt={[4, 6]}
          pb={[4, 6]}
          flexDirection={'column'}
          gap={2}>
          <Flex
            flex={1}
            justifyContent={'space-between'}>
            <Text fontFamily={'Arista'}>
              Vesting Time
            </Text>
            <Text color={'green.500'}>
              {`90 days`}
            </Text>
          </Flex>
          <Flex
            flex={1}
            justifyContent={'space-between'}>
            <Text fontFamily={'Arista'}>
              Start Ratio
            </Text>
            <Text color={'green.500'}>
              {`1 bVARA/0.1 VARA`}
            </Text>
          </Flex>
          <Flex
            flex={1}
            height={"100%"}
            justifyContent={'space-between'}>
            <Text fontFamily={'Arista'}>
              {/* {" \n "} */}
            </Text>
            {/* <Text color={'green.500'}>
              {`1 bVARA/0.1 VARA`}
            </Text> */}
          </Flex>
        </Flex>
        {/* start vest button */}
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          pt={['31px', '22.5px']}
          gap={5}
        >
          <Button
            colorScheme="yellow"
            w={'100%'}
            fontSize={'sm'}
            fontWeight={400}
            py={3}
            onClick={onStartVest}
            isLoading={isVestLoading}
            borderRadius={'lg'}>
            Start Vesting
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
export default BVaraVestCard;
