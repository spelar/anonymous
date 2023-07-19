import { ServiceLayout } from '@/components/service_layout';
import { InAuthUser } from '@/models/in_auth_user';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import axios, { AxiosResponse } from 'axios';
import { useAuth } from '@/context/auth_user.context';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';

interface Props {
  userInfo: InAuthUser | null;
}

async function postMessage({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }
  try {
    await fetch('/api/messages.add', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '메시지 등록 실패',
    };
  }
}

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const toast = useToast();
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [messageListFetchTrigger, setMessageListFetchTrigger] = useState(false);
  const [isAnonymous, setAnonymous] = useState(true);
  const { authUser } = useAuth();

  async function fetchMessageList(uid: string) {
    try {
      const resp = await fetch(`/api/messages.list?uid=${uid}&page=${page}&size=10`);
      if (resp.status === 200) {
        const data: {
          totalElements: number;
          totalPages: number;
          page: number;
          size: number;
          content: InMessage[];
        } = await resp.json();
        setTotalPages(data.totalPages);
        setMessageList((prev) => {
          return [...prev, ...data.content];
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMessageInfo({ uid, messageId }: { uid: string; messageId: string }) {
    try {
      const resp = await fetch(`/api/messages.info?uid=${uid}&messageId=${messageId}`);
      if (resp.status === 200) {
        const data: InMessage = await resp.json();
        setMessageList((prev) => {
          const findIndex = prev.findIndex((fv) => fv.id === data.id);
          if (findIndex >= 0) {
            const updateArr = [...prev];
            updateArr[findIndex] = data;
            return updateArr;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (userInfo === null) {
      return;
    }
    fetchMessageList(userInfo.uid);
  }, [userInfo, messageListFetchTrigger, page]);

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  const isOwner = authUser !== null && authUser.uid === userInfo.uid;

  return (
    <ServiceLayout title={`${userInfo.displayName}의 홈`} minH="100vh" backgroundColor="gray.200">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex align="center" p="2">
            <Avatar
              size="xs"
              src={isAnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
              mr="2"
            />
            <Textarea
              bg="gray.100"
              border="none"
              boxShadow="none !important"
              placeholder="익명으로 질문할 내용을 입력해주세요"
              borderRadius="md"
              resize="none"
              minH="unset"
              minRows={1}
              maxRows={7}
              overflow="hidden"
              fontSize="xs"
              mr="2"
              as={ResizeTextarea}
              value={message}
              onChange={(e) => {
                if (e.target.value) {
                  const lineCount = (e.target.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1) + 1;
                  if (lineCount > 7) {
                    toast({
                      title: '최대 7줄까지만 입력가능합니다',
                      position: 'top-right',
                    });
                    return;
                  }
                }
                setMessage(e.target.value);
              }}
            />
            <Button
              disabled={message.length === 0}
              bgColor="#FFb86c"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              onClick={async () => {
                const postData: {
                  message: string;
                  uid: string;
                  author?: {
                    displayName: string;
                    photoURL?: string;
                  };
                } = {
                  message,
                  uid: userInfo.uid,
                };
                if (isAnonymous === false) {
                  postData.author = {
                    photoURL: authUser?.photoURL ?? 'https://bit.ly/broken-link',
                    displayName: authUser?.displayName ?? 'anonymous',
                  };
                }
                const messageResp = await postMessage(postData);
                if (messageResp.result === false) {
                  toast({ title: '메시지 등록 실패', position: 'top-right' });
                }
                setMessage('');
                setMessageListFetchTrigger((prev) => !prev);
              }}
            >
              등록
            </Button>
          </Flex>
          <FormControl display="flex" alignItems="center" mt="1" mx="2" pb="2">
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
                  toast({ title: '로그인이 필요합니다', position: 'top-right' });
                  return;
                }
                setAnonymous((prev) => !prev);
              }}
            />
            <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
              Anonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          {messageList.map((messageData) => {
            return (
              <MessageItem
                key={`message-item-${userInfo.uid}-${messageData.id}`}
                item={messageData}
                uid={userInfo.uid}
                displayName={userInfo.displayName ?? ''}
                photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
                isOwner={isOwner}
                onSendComplete={() => {
                  fetchMessageInfo({ uid: userInfo.uid, messageId: messageData.id });
                }}
              />
            );
          })}
        </VStack>
        {totalPages > page && (
          <Button
            width="full"
            mt="2"
            fontSize="sm"
            onClick={() => {
              setPage((p) => p + 1);
            }}
          >
            더보기
          </Button>
        )}
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  try {
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.info/${screenName}`);
    console.info(userInfoResp.data);
    return {
      props: {
        userInfo: userInfoResp.data ?? null,
      },
    };
  } catch (err) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
