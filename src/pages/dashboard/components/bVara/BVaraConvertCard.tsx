import { Box, Button, Text, Flex, VStack } from '@chakra-ui/react';
import SingleSelectToken from '@/components/core/SingleSelectToken';
import useBVaraConvertCard from '@/hooks/dashboard/useBVaraConvertCard';
import { displayNumber } from '@/utils/formatNumbers';

const BVaraConvertCard = () => {
  const {
    token,
    lockAmount,
    isLoading,

    setLockAmount,
    onConvertToVe,
  } = useBVaraConvertCard();
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
          handleTokenOnClick={() => {}}
          inputBalance={lockAmount}
          setInputBalance={setLockAmount}
        />
        {/* your bVara info */}
        <Flex
          fontSize={[10, 15]}
          pt={[4, 6]}
          pb={[4, 6]}
          flexDirection={'column'}
          gap={2}>
          <Flex justifyContent={'space-between'}>
            <Text fontFamily={'Arista'}>Convert Ratio</Text>
            <Text color={'green.500'}>{`1 bVARA/1 veVARA`}</Text>
          </Flex>
          <Flex justifyContent={'space-between'}>
            <Text fontFamily={'Arista'}>Your voting power will be</Text>
            <Text color={'green.500'}>
              {`${displayNumber(lockAmount)} veVARA`}
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'}>
            <Text fontFamily={'Arista'}>Amount of days locked</Text>
            <Text color={'green.500'}>{'1460'}</Text>
          </Flex>
        </Flex>
        {/* veVera mint button */}
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          pt={[4, 0]}
          gap={5}>
          <Button
            colorScheme="yellow"
            w={'100%'}
            fontSize={'sm'}
            fontWeight={400}
            py={3}
            onClick={onConvertToVe}
            isLoading={isLoading}
            borderRadius={'lg'}>
            Create New veNFT
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
export default BVaraConvertCard;
