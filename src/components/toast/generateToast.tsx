import {
  CheckIcon,
  ExternalLinkIcon,
  InfoIcon,
  WarningIcon,
  WarningTwoIcon,
} from '@chakra-ui/icons';
import {
  Box,
  CloseButton,
  HStack,
  Icon,
  Link,
  Spinner,
  Text,
  createStandaloneToast,
} from '@chakra-ui/react';

type statusToast =
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'loading'
  | undefined;

const generateToast = (
  title: string,
  description: string,
  status: statusToast,
  txHash?: string
) => {
  const { toast } = createStandaloneToast();
  const color =
    status === 'info'
      ? 'pink'
      : status === 'loading'
      ? 'yellow'
      : status === 'success'
      ? 'green'
      : 'red';

  const id = Math.random().toString(36).substring(2, 9);
  return toast({
    isClosable: true,
    position: 'bottom-left',
    duration: 10000,
    id,
    render: () => {
      const onClose = () => toast.close(id);
      const icon =
        status === 'info'
          ? InfoIcon
          : status === 'success'
          ? CheckIcon
          : status === 'warning'
          ? WarningTwoIcon
          : WarningIcon;
      return (
        <Box
          mt={{ base: 0, md: -10 }}
          ml={{ base: 0, md: 10 }}
          mb={{ base: 0, md: 10 }}
          bg={'darkblue.500'}
          border={'1px solid'}
          borderColor={`${color}.500`}
          borderRadius={'2xl'}
          p={4}
          width={{ base: '75vw', md: '25vw' }}
          maxH={'20vh'}
          color={'whiteAlpha.900'}>
          <CloseButton
            float={'right'}
            position={'relative'}
            top={-3}
            right={-3}
            zIndex={10}
            onClick={onClose}
          />
          <HStack>
            {status === 'loading' ? (
              <Spinner size={'sm'} color={`${color}.500`} />
            ) : (
              <Icon as={icon} color={`${color}.500`} />
            )}

            <Text fontSize={'md'}>{title}</Text>
          </HStack>
          <Box
            maxH={'8vh'}
            scrollBehavior={'smooth'}
            overflowY={'scroll'}
            sx={{
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}>
            <Text mt={2} fontSize={'sm'}>
              {description}
            </Text>
            {txHash && (
              <Link
                href={`${process.env.NEXT_PUBLIC_EXPLORER}/tx/${txHash}`}
                isExternal
                display={'inline-flex'}
                mt={2}
                color={`${color}.500`}>
                <ExternalLinkIcon mr={2} />
                <Text fontSize={'sm'}>View transaction in explorer</Text>
              </Link>
            )}
          </Box>
        </Box>
      );
    },
  });
};
export default generateToast;
