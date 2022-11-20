import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput} from '@chatscope/chat-ui-kit-react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'

function App(): JSX.Element {
  return (
    <div style={{ position: 'relative', height: '800px', width: '1280px' }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            <Message
              model={{
                message: 'Hello my friend',
                direction: 'incoming',
                sender: 'Joe',
                sentTime: 'just now',
                position: 'single'
              }}
            >
              <Message.Footer sender="Emily" sentTime="just now" />
            </Message>
            <Message
              model={{
                message: 'Hello my friend',
                direction: 'incoming',
                sender: 'Joe',
                sentTime: 'just now',
                position: 'single'
              }}
            >
              <Message.Footer sender="Emily" sentTime="just now" />
            </Message>
          </MessageList>
          <MessageInput
            style={{ textAlign: 'left' }}
            placeholder="Type message here"
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

export default App
