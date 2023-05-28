import { useAuth } from '@/context/auth_user.context';
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';

const GNB = function () {
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();

  const loginBtn = (
    <Button
      fontSize="sm"
      fontWeight={600}
      color="white"
      bg="pink.400"
      _hover={{
        bg: 'pink.300',
      }}
      onClick={signInWithGoogle}
    >
      로그인
    </Button>
  );
  const logoutBtn = (
    <Button as="a" fontSize="sm" fontWeight={400} variant="link" onClick={signOut}>
      로그아웃
    </Button>
  );

  const authInitialized = loading || authUser === null;

  return (
    <Box>
      <Flex minH="60px" py={{ base: 2 }} px={{ base: 2 }} align="center" maxW="md" mx="auto">
        <Spacer />
        <Box flex="1">
          <img style={{ height: '40px' }} src="/logo.svg" alt="logo" />
        </Box>
        <Box justifyContent="flex-end">
          <Button>{authInitialized ? loginBtn : logoutBtn}</Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default GNB;
