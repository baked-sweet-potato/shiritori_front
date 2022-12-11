import { useCallback, useEffect } from 'react'

import {
  MainContainer,
  ChatContainer,
  MessageGroup,
  Message,
  MessageList,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react'

import {
  useChat,
  ChatMessage,
  MessageContentType,
  MessageDirection,
  MessageStatus
, MessageContent, TextContent, User } from '@chatscope/use-chat'
import { chats } from '../data/data'

export const Chat = ({ user }: { user: User }) : JSX.Element =>  {
  const {
    currentMessages,
    conversations,
    activeConversation,
    setActiveConversation,
    addMessage,
    sendMessage,
    getUser,
    currentMessage,
    setCurrentMessage,
    sendTyping,
  } = useChat()

  // 初期表示
  useEffect(() => {
    setActiveConversation(conversations[0].id)

    chats.forEach((chat) => {
      const chatMessage = new ChatMessage({
        id: '',
        content: chat.content as unknown as MessageContent<TextContent>,
        contentType: MessageContentType.TextHtml,
        senderId: chat.sender,
        direction:
          chat.sender === user.id
            ? MessageDirection.Outgoing
            : MessageDirection.Incoming,
        status: MessageStatus.Sent
      })

      addMessage(chatMessage, activeConversation?.id, true)
    })
  }, [])

  const handleChange = (value: string) : void => {
    setCurrentMessage(value)
    if (activeConversation != null) {
      sendTyping({
        conversationId: activeConversation?.id,
        isTyping: true,
        userId: user.id,
        content: value,
        throttle: true
      })
    }
  }

  const handleSend = (text: string) : void => {
    const message = new ChatMessage({
      id: '', // storage generatorで生成されるため空文字
      content: text as unknown as MessageContent<TextContent>,
      contentType: MessageContentType.TextHtml,
      senderId: user.id,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent
    })

    if (activeConversation != null) {
      sendMessage({
        message,
        conversationId: activeConversation.id,
        senderId: user.id
      })
    }
  }

  const getTypingIndicator = useCallback(() => {
    if (activeConversation != null) {
      const typingUsers = activeConversation.typingUsers

      if (typingUsers.length > 0) {
        const typingUserId = typingUsers.items[0].userId

        if (activeConversation.participantExists(typingUserId)) {
          const typingUser = getUser(typingUserId)

          if (typingUser != null) {
            return (
              <TypingIndicator content={'other playears is typing'} />
            )
          }
        }
      }
    }

    return undefined
  }, [activeConversation, getUser])

  return (
    <MainContainer responsive>
      <ChatContainer>
        <MessageList typingIndicator={getTypingIndicator()}>
          {(activeConversation != null) &&
            currentMessages.map((group) => (
              <MessageGroup key={group.id} direction={group.direction}>
                <MessageGroup.Messages>
                  {group.messages.map((message: ChatMessage<MessageContentType>) => (
                    <Message
                      key={message.id}
                      model={{
                        type: 'html',
                        payload: message.content,
                        direction: user.id === message.senderId ? MessageDirection.Outgoing : MessageDirection.Incoming,
                        position: 'normal'
                      }}
                    />
                  ))}
                </MessageGroup.Messages>
              </MessageGroup>
            ))}
        </MessageList>
        <MessageInput
          value={currentMessage}
          onChange={handleChange}
          onSend={handleSend}
          disabled={activeConversation == null}
          attachButton={false}
          placeholder="Type here..."
        />
      </ChatContainer>
    </MainContainer>
  )
}
