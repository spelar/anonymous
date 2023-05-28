import { GoogleLoginButton } from '@/components/google_login_button';
import { ServiceLayout } from '@/components/service_layout';
import { useAuth } from '@/context/auth_user.context';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import { NextPage } from 'next';

const IndexPage: NextPage = () => {
  const { signInWithGoogle, authUser } = useAuth();
  console.log(authUser);
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
