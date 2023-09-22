import { HStack, Spinner, Stack, Text, Image, Button } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type HomeProps = {
  children?: React.ReactNode;
};

const Home: React.FC<HomeProps> = ({ children }) => {
  const router = useRouter();
  // useEffect(() => {
  //   router.push('/swap');
  // }, []);

  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      h={'50vh'}
      spacing={10}>
      {/* <Image objectFit="contain" src="images/equilibre-logo.png" /> */}
      <Text fontSize={'5xl'} fontWeight={'bold'}>
        Welcome to Équilibre V2
      </Text>
      <Button onClick={() => router.push('/swap')}>
        Click here to open app
      </Button>
    </Stack>
  );
};
export default Home;
