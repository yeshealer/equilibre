import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import LocalTokenSupport from '@/components/core/tokenSelector/LocalTokenSupport';
import { useGetBalances, useSearchToken } from '@/hooks/swap';
import { Token } from '@/interfaces';
import { useSwapStore } from '@/store/features/swap/swapStore';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import TokenEntry from './TokenEntry';

type TokenSelectorProps = {
  children: any;
  type: 'input' | 'output';
};

const TokenSelector = ({ children, type }: TokenSelectorProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { tokenList, fixedTokens } = useGetBalances();

  const { filteredTokens, search, setSearch } = useSearchToken();

  const {
    actions: { setAsset },
  } = useSwapStore(state => state);

  const handleOnClick = (token: Token): void => {
    setAsset(token.address, type);
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
      <Modal isOpen={isOpen} onClose={onClose}>
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
            <Stack direction={'row'} justifyContent={'space-around'} py={'8'}>
              {fixedTokens?.map((token: Token, index) => {
                return (
                  <Button
                    key={index}
                    px={'3'}
                    py={'7'}
                    borderRadius={'xl'}
                    _hover={{
                      bg: 'blue.500',
                      borderColor: 'yellow.500',
                      color: 'yellow.500',
                    }}
                    value={token.address}
                    onClick={() => handleOnClick(token)}>
                    <EquilibreAvatar
                      size={'sm'}
                      name={token.name}
                      src={token.logoURI}
                      mr={'3'}
                    />
                    <Text>{token.symbol}</Text>
                  </Button>
                );
              })}
            </Stack>
            <Divider />
          </ModalHeader>
          <ModalBody>
            <Stack
              h={'40vh'}
              scrollBehavior={'smooth'}
              overflowY={'scroll'}
              spacing={5}
              sx={{
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}>
              {(search && search != '' ? filteredTokens : tokenList)?.map(
                (token: Token, index) => {
                  return (
                    <TokenEntry
                      key={index}
                      token={token}
                      type={type}
                      onClose={onClose}
                    />
                  );
                }
              )}
            </Stack>
          </ModalBody>

          <ModalFooter justifyContent={'center'}>
            <Stack w={'-webkit-fill-available'}>
              <Divider />
              <LocalTokenSupport handleTokenOnClick={handleOnClick}>
                <Button variant={'unstyled'}>Manage Local Assets</Button>
              </LocalTokenSupport>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TokenSelector;
