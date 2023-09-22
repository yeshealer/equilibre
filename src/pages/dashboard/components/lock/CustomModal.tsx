import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
} from '@chakra-ui/react';

interface CustomModalProps {
  children: React.ReactNode;
  buttonString: string;
}
const CustomModal: React.FC<CustomModalProps> = ({ children, buttonString }) => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclosure();
  return (
    <>
      <Button
        borderRadius={'xl'}
        onClick={onOpen}
        fontSize={'xs'}>
        {buttonString}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent background={'transparent'}>
          {children}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
