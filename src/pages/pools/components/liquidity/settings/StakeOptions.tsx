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
import SlippageOptions from './SlippageOptions';
import AdvancedOptions from './AdvancedOptions';
const StakeOptions = ({ children }: any) => {
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
              <AdvancedOptions />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StakeOptions;
