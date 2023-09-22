import { useGetBalances, useSearchToken } from '@/hooks/swap';
import { Token } from '@/interfaces';
import { useSwapStore } from '@/store/features/swap/swapStore';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
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
import SingleTokenEntry from './SingleTokenEntry';
import { useLocalAssetStore } from '@/store/localAssetsStore';
import { getAccount } from '@wagmi/core';

type LocalTokenSupportProps = {
  children: any;
  handleTokenOnClick: (token: Token) => void;
  dropGasToken?: boolean;
};

const LocalTokenSupport = ({
  children,
  handleTokenOnClick,
  dropGasToken,
}: LocalTokenSupportProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { tokenList } = useGetBalances(dropGasToken, true);
  const { saveLocalAsset } = useLocalAssetStore(state => state);

  const { filteredTokens, search, setSearch, getFilteredTokens } =
    useSearchToken(true);

  const handleOnClick = (token: Token): void => {
    handleTokenOnClick(token);
    onClose();
  };
  const onSearchChanged = async (event: any) => {
    const str = String(event.target.value);
    const tempFilteredTokens = getFilteredTokens(str);
    const { address: userAddress } = getAccount();

    if (
      tempFilteredTokens.length == 0 &&
      str.length == 42 &&
      str.slice(0, 2) == '0x' &&
      !!userAddress
    ) {
      await saveLocalAsset(str as `0x${string}`, userAddress);
    }
    setSearch(str);
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
                    <SingleTokenEntry
                      key={index}
                      token={token}
                      handleTokenOnClick={handleOnClick}
                      deleteAndLink={true}
                    />
                  );
                }
              )}
            </Stack>
          </ModalBody>

          <ModalFooter justifyContent={'center'}>
            <Stack w={'-webkit-fill-available'}>
              <Divider />
              <Button variant={'unstyled'} onClick={onClose}>
                Back to Assets
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LocalTokenSupport;
