import { CONTRACTS } from '@/config/company';
import { useVeNFTs } from '@/hooks/pools';
import callContractWait from '@/lib/callContractWait';
import { prepareWriteVoter } from '@/lib/equilibre';
import { useVeTokenStore } from '@/store/veTokenStore';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import {
  Box,
  Button,
  ChakraProps,
  HStack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useEffect, useState, MouseEvent } from 'react';
import { useAccount } from 'wagmi';

const CastVotes = (props: ChakraProps) => {
  const selectedVeNFT = useVeTokenStore(state => state.selectedVeNFT);
  const [totalVotes, setTotalVotes] = useState(0);
  const { isDisconnected, status, address } = useAccount();
  useEffect(() => {
    const totalVotes = selectedVeNFT?.votes.reduce(
      (acc, vote) => acc + vote.percent,
      0
    )!;
    setTotalVotes(totalVotes);
  }, [selectedVeNFT]);
  const handleCastVote = async (
    event: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    if (isDisconnected) return;
    const veNFTId = selectedVeNFT?.id;
    const pairsAddresses = selectedVeNFT?.votes
      .filter(x => x.percent > 0)
      .map(vote => vote.pair.address);
    const pairs = selectedVeNFT?.votes.map(vote => {
      if (vote.percent > 0) return vote.pair;
    });
    const votes = selectedVeNFT?.votes
      .filter(x => x.percent > 0)
      .map(vote => BigInt(vote.percent));
    const { request } = await prepareWriteVoter({
      functionName: 'vote',
      args: [BigInt(veNFTId!), pairsAddresses!, votes!],
      account: address,
    });
    const toastObj = {
      title: 'Vote has been successful!',
      description: `You have voted for ${pairs?.map(
        x => `${x?.symbol} `
      )} of your voting power`,
    };
    callContractWait(request, toastObj);
  };
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Box
      bg="linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box"
      border={'1px solid transparent'}
      borderRadius={'3xl'}
      justifyContent={'center'}
      alignItems={'center'}
      px={'4'}
      boxShadow={'lg'}>
      <HStack justifyContent={'space-between'} spacing={4}>
        {isDesktop && (
          <>
            <Text
              fontFamily={'Arista'}
              letterSpacing={'widest'}
              fontSize={'sm'}
              mt={1}
              py={'5'}>
              Voting Power Used:
            </Text>
            <Text color={totalVotes == 100 ? 'green.500' : 'pink.500'}>
              {displayNumber(totalVotes)}%
            </Text>
          </>
        )}
        <Button
          variant={isDesktop ? 'primary' : 'unstyled'}
          colorScheme="green"
          rounded={'xl'}
          my={isDesktop ? 0 : 3}
          py={isDesktop ? 6 : 0}
          w={isDesktop ? '3xs' : 'auto'}
          isDisabled={totalVotes < 100 || totalVotes > 100}
          onClick={handleCastVote}>
          Cast Votes
        </Button>
      </HStack>
    </Box>
  );
};

export default CastVotes;
