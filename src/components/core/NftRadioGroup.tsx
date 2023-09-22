import { useVeNFTs } from '@/hooks/pools';
import { useVeTokenStore } from '@/store/veTokenStore';
import { displayNumber } from '@/utils/formatNumbers';
import {
  Container,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { shallow } from 'zustand/shallow';

interface NftRadioGroupProps {
  padding?: number;
  noBorder?: boolean;
}

const NftRadioGroup: React.FC<NftRadioGroupProps> = ({ padding, noBorder }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  // const { veNFTs } = useVeNFTs();

  const { selectedNFT, veNFTs, setSelectedNFT } = useVeTokenStore(
    state => ({
      selectedNFT: state.selectedVeNFT,
      veNFTs: state.veNFTs,
      setSelectedNFT: state.actions.setSelectedVeNFT,
    }),
    shallow
  );
  return (
    <>
      <HStack
        w={'-webkit-fill-available'}
        justifyContent={'space-between'}
        px={padding || 3}
        pb={1}
        borderBottom={noBorder ? 'none' : '1px solid'}
        borderColor={'gray.600'}>
        <Text textAlign={'right'} fontSize={'sm'} fontFamily={'Arista'}>
          ID #
        </Text>
        <Text textAlign={'right'} fontSize={'sm'} fontFamily={'Arista'}>
          Balance
        </Text>
        <Text textAlign={'right'} fontSize={'sm'} fontFamily={'Arista'}>
          {' '}
        </Text>
      </HStack>
      <Container
        overflowY={'scroll'}
        sx={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        p={0}
        h={isDesktop ? 'auto' : '36'}>
        <RadioGroup
          value={selectedNFT?.id.toString()}
          onChange={value =>
            setSelectedNFT(veNFTs.find(x => x.id.toString() === value)!)
          }>
          {veNFTs.map(nft => {
            return (
              <HStack
                key={nft.id}
                w={'-webkit-fill-available'}
                justifyContent={'space-between'}
                px={padding || 3}
                mb={1}>
                <Text
                  textAlign={'left'}
                  color={
                    selectedNFT?.id.toString() === nft.id.toString()
                      ? 'yellow.500'
                      : 'gray.500'
                  }
                  w={'10'}>
                  {nft.id}
                </Text>
                <Text
                  textAlign={'right'}
                  color={
                    selectedNFT?.id.toString() === nft.id.toString()
                      ? 'yellow.500'
                      : 'gray.500'
                  }>
                  {displayNumber(nft.lockValue)}
                </Text>
                <Radio value={nft.id.toString()}></Radio>
              </HStack>
            );
          })}
        </RadioGroup>
      </Container>
      {veNFTs.length === 0 && (
        <Stack justifyContent={'center'} h={'-webkit-fill-available'}>
          <Text textAlign={'left'} color={'pink.500'}>
            No veNFTs found
          </Text>
        </Stack>
      )}
    </>
  );
};

export default NftRadioGroup;
