import { ServiceLayout } from '@/components/service_layout';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { NextPage } from 'next';

const userInfo = {
  uid: 'test',
  email: 'spelar7@gmail.com',
  displayName: 'sungsu kim',
  photoURL: 'https://lh3.googleusercontent.com/a/AAcHTte6fqTrE5fwoH-QsCXZ0_cQPE4w4VnfeReJrJQ3=s96-c',
};

const UserHomePage: NextPage = function () {
  return (
    <ServiceLayout title="user home" minH="100vh" backgroundColor="gray.200">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </ServiceLayout>
  );
};

export default UserHomePage;
