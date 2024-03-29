import { NextPage } from 'next';
import { useEffect } from 'react';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import { GoogleLoginButton } from '@/components/google_login_button';
import { ServiceLayout } from '@/components/service_layout';
import { useAuth } from '@/context/auth_user.context';

const IndexPage: NextPage = function () {
  const { signInWithGoogle, authUser } = useAuth();
  console.log(authUser);

  useEffect(() => {
    if (authUser) window.location.href = `/${authUser?.email?.replace('@gmail.com', '')}`;
  }, [authUser]);

  return (
    <ServiceLayout title="test" minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="10">
        <img src="/main_logo.svg" alt="메인 로고" />
        <Flex justify="center">
          <Heading>#BlahBlah</Heading>
        </Flex>
      </Box>
      <Center mt="20">
        <GoogleLoginButton onClick={signInWithGoogle} />
      </Center>
    </ServiceLayout>
  );
};

export default IndexPage;
