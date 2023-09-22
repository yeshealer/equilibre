import { Box, ChakraProps } from '@chakra-ui/react';
import React from 'react';

type EquilibreCardProps = {
  children?: React.ReactNode;
  props?: ChakraProps;
};

const EquilibreCard: React.FC<EquilibreCardProps> = ({
  children,
  ...props
}) => {
  return (
    <>
      <Box
        bg="linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box"
        border={'1px solid transparent'}
        borderRadius={'30px'}
        justifyContent={'center'}
        alignItems={'center'}
        p={'8'}
        boxShadow={'lg'}
        {...props}>
        {children}
      </Box>
    </>
  );
};

export default EquilibreCard;
