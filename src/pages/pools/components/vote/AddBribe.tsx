import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import SingleSelectToken from '@/components/core/SingleSelectToken';
import useAddBribe from '@/hooks/pools/useAddBribe';
import { Pair } from '@/interfaces';
import {
  Avatar,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface AddBribeProps {
  children: any;
  pair: Pair;
}
const AddBribe = ({ children, pair }: AddBribeProps) => {
  const {
    isOpen,
    inputBalance,
    tokenSelected,
    onOpen,
    onClose,
    handleTokenOnClick,
    handleAddBribeOnClick,
    setInputBalance,
  } = useAddBribe(pair);

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent py={2}>
          <ModalHeader
            borderBottom={'1px solid'}
            borderColor={'gray.500'}
            textAlign={'center'}>
            <Text fontSize={'md'} color={'pink.500'} letterSpacing={'wider'}>
              Bribing is not staking. To stake go to Liquidity
            </Text>
          </ModalHeader>
          <ModalBody mt={2}>
            <Stack spacing={6}>
              <Box
                border={'1px solid'}
                borderColor={'yellow.500'}
                borderRadius={'xl'}
                p={4}
                bgColor={'blue.500'}>
                <HStack alignItems={'center'} justifyContent={'space-between'}>
                  <Text
                    fontSize={'sm'}
                    mt={1}
                    color={'yellow.500'}
                    letterSpacing={'widest'}
                    fontFamily={'Arista'}>
                    Selected Gauge
                  </Text>

                  <HStack
                    border={'1px solid'}
                    borderColor={'yellow.500'}
                    borderRadius={'full'}
                    spacing={0}
                    py={1}
                    px={2}>
                    <EquilibreAvatar src={pair.token0.logoURI} size={'sm'} />
                    <EquilibreAvatar
                      position={'relative'}
                      left={'-3'}
                      src={pair.token1.logoURI}
                      size={'sm'}
                    />
                    <Text letterSpacing={'wider'}>
                      {pair.symbol.substring(5)}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
              <SingleSelectToken
                showPercentages={true}
                token={tokenSelected}
                handleTokenOnClick={handleTokenOnClick}
                inputBalance={inputBalance}
                setInputBalance={setInputBalance}
              />
              <Button onClick={handleAddBribeOnClick}>
                <Text fontSize={'lg'}>Add Bribe</Text>
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddBribe;
