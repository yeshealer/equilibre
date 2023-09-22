import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FaEllipsisH } from 'react-icons/fa';
import { IoAnalyticsOutline, IoStorefrontOutline } from 'react-icons/io5';
import { SiLinktree } from 'react-icons/si';
import { EquilibreConnect } from '../core/ConnectButton';
import MobileNavigation from './MobileNavigation';
import Navigation from './Navigation';
import useLayout from '@/hooks/useLayout';

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { mounted, isDesktop, isLoading } = useLayout();
  return mounted ? (
    <>
      <Box as="section" pb={{ base: '2', md: '4' }}>
        <Box as="nav" pt={6}>
          <HStack mx={['0', '0', '12']} justify="space-around">
            <Image
              w="3xs"
              // htmlWidth={'20%'}
              py={'6'}
              objectFit="contain"
              src="/images/equilibre-logo.png"></Image>

            <Navigation />
            {isDesktop && <EquilibreConnect mobile={false} />}
            <Menu>
              <MenuButton as={Button} py={1} px={2} borderRadius={'2xl'}>
                {/* <EllipsisIcon color={'white'} boxSize={'8'}/> */}
                <Icon as={FaEllipsisH} color={'white'} mt={2} boxSize={6} />
              </MenuButton>
              <MenuList bg={'blue.500'} borderRadius={'xl'}>
                <MenuItem
                  bg={'blue.500'}
                  _hover={{ color: 'yellow.500', textDecoration: 'none' }}
                  icon={<SiLinktree />}
                  as={Link}
                  isExternal
                  href="https://linktr.ee/equilibrefinance">
                  Linktree
                </MenuItem>
                <MenuItem
                  bg={'blue.500'}
                  _hover={{ color: 'yellow.500', textDecoration: 'none' }}
                  icon={<IoAnalyticsOutline />}
                  as={Link}
                  isExternal
                  href="https://analytics.equilibrefinance.com/home">
                  Analytics
                </MenuItem>
                <MenuItem
                  bg={'blue.500'}
                  _hover={{ color: 'yellow.500', textDecoration: 'none' }}
                  icon={<IoStorefrontOutline />}
                  as={Link}
                  isExternal
                  href="https://paintswap.finance/marketplace/kava/financial/collections/equilibre">
                  Paintswap
                </MenuItem>
              </MenuList>
            </Menu>
            <MobileNavigation />
          </HStack>
        </Box>
      </Box>
      <Container
        maxW={'container.xl'}
        // h={'80vh'}
        py={'20'}
        justifyContent={'center'}
        alignItems={'center'}
        display={'flex'}>
        {isLoading ? (
          <Box h={'100vh'}>
            <Spinner />
          </Box>
        ) : (
          children
        )}
      </Container>
      <Box as="footer" marginTop={'auto'} w={'100%'} h={'2rem'}>
        <Text fontSize="sm" textAlign="right" mr={6}>
          Version 2.3.0 © 2023 Équilibre Finance
        </Text>
      </Box>
    </>
  ) : (
    <></>
  );
};

export default Layout;
