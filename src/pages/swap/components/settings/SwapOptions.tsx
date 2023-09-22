import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import DeadlineOptions from './DeadlineOptions';
import RouteOptions from './RouteOptions';
import SlippageOptions from './SlippageOptions';
const SwapOptions = ({ children }: any) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent py={'4'} px={3}>
          {/* <ModalHeader>Settings</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <SlippageOptions />
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <DeadlineOptions />
              <RouteOptions />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SwapOptions;
