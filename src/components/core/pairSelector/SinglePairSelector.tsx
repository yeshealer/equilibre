import { useGetPairBalances } from '@/hooks/pools';
import { Pair } from '@/interfaces';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import PairEntry from './SinglePairEntry';
import useSearchPair from './useSearchPair';

type PairSelectorProps = {
  children: any;
  handlePairOnClick: (pair: Pair) => void;
};

const PairSelector = ({ children, handlePairOnClick }: PairSelectorProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { pairList } = useGetPairBalances();
  const pairs = pairList
    .sort((a, b) => {
      if (a.token0.logoURI !== null && a.token1.logoURI !== null) return -1;
      if (a.token0.logoURI === null || a.token1.logoURI === null) return 1;
      return -1;
    })
    .sort((a, b) => {
      return Number(b.balanceStaked) - Number(a.balanceStaked);
    })
    .sort((a, b) => {
      if (!a.gauge && b.gauge) return 1;
      if (a.gauge && !b.gauge) return -1;
      return 0;
    });
  const { filteredPairs, search, setSearch } = useSearchPair();

  const handleOnClick = (pair: Pair): void => {
    handlePairOnClick(pair);
    onClose();
  };
  const onSearchChanged = async (event: any) => {
    setSearch(event.target.value);
  };
  useEffect(() => {
    setSearch('');
  }, [isOpen]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent py={'3'} maxW={'496px'}>
          <ModalHeader>
            <InputGroup>
              <Input
                placeholder="VARA, KAVA, USDC..."
                py={'6'}
                pl={'12'}
                borderRadius={'2xl'}
                textAlign={'left'}
                colorScheme="white"
                onChange={onSearchChanged}
              />
              <InputLeftElement
                py={'6'}
                pl={'4'}
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
                children=<SearchIcon boxSize={4} color={'gray.500'} />
              />
            </InputGroup>
            <Divider mt={8} />
          </ModalHeader>
          <ModalBody>
            <Stack
              h={'54vh'}
              scrollBehavior={'smooth'}
              overflowY={'scroll'}
              spacing={5}
              sx={{
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}>
              {(search && search != '' ? filteredPairs : pairs)?.map(
                (pair: Pair, index) => {
                  return (
                    <PairEntry
                      key={index}
                      pair={pair}
                      handlePairOnClick={handleOnClick}
                    />
                  );
                }
              )}
            </Stack>
          </ModalBody>

          {/* <ModalFooter justifyContent={'center'}>
            <Stack w={'-webkit-fill-available'}>
              <Divider />
              <Button variant={'unstyled'}>Manage Local Assets</Button>
            </Stack>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PairSelector;
