import { InMessage } from '@/models/message/in_message';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

interface Props {
  uid: string;
  displayName: string;
  isOwner: boolean;
  item: InMessage;
}

const MessageItem = function ({ item }: Props) {
  return (
    <Box borderRadius="md" width="full" bg="white" boxShadow="md">
      <Box>
        <Flex pl="2" pt="2" alignItems="center">
          <Avatar
            size="xs"
            src={item.author ? item.author.photoURL ?? 'https://bit.ly/broken-link' : 'https://bit.ly/broken-link'}
          />
          <Text fontSize="xx-small" ml="1">
            {item.author ? item.author.displayName : 'anonymous'}
          </Text>
          <Text whiteSpace="pre-line" fontSize="xx-small" color="gray.500" ml="1">
            1일
          </Text>
        </Flex>
      </Box>
      <Box p="2">
        <Box borderRadius="md" borderWidth="1px" p="2">
          <Text whiteSpace="pre-line" fontSize="sm">
            {item.message}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItem;
