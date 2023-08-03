import { Avatar, Box, Flex, Text, Button } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { ServiceLayout } from '@/components/service_layout';
import { InAuthUser } from '@/models/in_auth_user';
import { useAuth } from '@/context/auth_user.context';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';

interface Props {
  userInfo: InAuthUser | null;
  messageData: InMessage | null;
  screenName: string;
}

const MessagePage: NextPage<Props> = function ({ userInfo, messageData: initMessageData, screenName }) {
  const [messageData, setMessageData] = useState<null | InMessage>(initMessageData);
  const { authUser } = useAuth();

  async function fetchMessageInfo({ uid, messageId }: { uid: string; messageId: string }) {
    try {
      const resp = await fetch(`/api/messages.info?uid=${uid}&messageId=${messageId}`);
      if (resp.status === 200) {
        const data: InMessage = await resp.json();
        setMessageData(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  if (messageData === null) {
    return <p>메시지 정보가 없습니다.</p>;
  }

  const isOwner = authUser !== null && authUser.uid === userInfo.uid;

  return (
    <ServiceLayout title={`${userInfo.displayName}의 홈`} minH="100vh" backgroundColor="gray.200">
      <Box maxW="md" mx="auto" pt="6">
        <Link href={`/${screenName}`}>
          <a>
            <Button mb="2" fontSize="sm">
              {screenName} 홈으로
            </Button>
          </a>
        </Link>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <MessageItem
          item={messageData}
          uid={userInfo.uid}
          displayName={userInfo.displayName ?? ''}
          screenName={screenName}
          photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
          isOwner={isOwner}
          onSendComplete={() => {
            fetchMessageInfo({ uid: userInfo.uid, messageId: messageData.id });
          }}
        />
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName, messageId } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
      },
    };
  }
  if (messageId === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
      },
    };
  }
  try {
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.info/${screenName}`);
    const screenNameToStr = Array.isArray(screenName) ? screenName[0] : screenName;
    if (userInfoResp.status !== 200 || userInfoResp.data === undefined || userInfoResp.data.uid === undefined) {
      return {
        props: {
          userInfo: null,
          messageData: null,
          screenName: screenNameToStr,
        },
      };
    }
    const messageInfoResp: AxiosResponse<InMessage> = await axios(
      `${baseUrl}/api/messages.info?uid=${userInfoResp.data.uid}&messageId=${messageId}`,
    );
    return {
      props: {
        userInfo: userInfoResp.data,
        messageData: userInfoResp.status !== 200 || messageInfoResp.data === undefined ? null : messageInfoResp.data,
        screenName: screenNameToStr,
      },
    };
  } catch (err) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
      },
    };
  }
};

export default MessagePage;
