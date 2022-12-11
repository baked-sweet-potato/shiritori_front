import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  BasicStorage,
  ChatMessage,
  ChatProvider,
  Conversation,
  ConversationId,
  ConversationRole,
  IStorage,
  MessageContentType,
  Participant,
  Presence,
  TypingUsersList,
  UpdateState,
  User,
  UserStatus
} from '@chatscope/use-chat'
import { ExampleChatService } from '@chatscope/use-chat/dist/examples'
import { Chat } from './components/Chat'
import { nanoid } from 'nanoid'
import { Col, Container, Row } from 'react-bootstrap'
import { myselfModel, partnerModel } from './data/data'
import { AutoDraft } from '@chatscope/use-chat/dist/enums/AutoDraft'

const messageIdGenerator = (message: ChatMessage<MessageContentType>): string =>
  nanoid()
const groupIdGenerator = (): string => nanoid()

const myselfStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator })

// serviceFactory作成
const serviceFactory = (
  storage: IStorage,
  updateState: UpdateState
): ExampleChatService => {
  return new ExampleChatService(storage, updateState)
}

// ユーザー
const myself = new User({
  id: myselfModel.name,
  presence: new Presence({ status: UserStatus.Available, description: '' }),
  firstName: '',
  lastName: '',
  username: myselfModel.name,
  email: '',
  avatar: '',
  bio: ''
})

// 会話スペース作成関数
function createConversation(id: ConversationId, name: string): Conversation {
  return new Conversation({
    id,
    participants: [
      new Participant({
        id: name,
        role: new ConversationRole([])
      })
    ],
    unreadCounter: 0,
    typingUsers: new TypingUsersList({ items: [] }),
    draft: ''
  })
}

// ストレージにパートナーを追加
myselfStorage.addUser(
  new User({
    id: partnerModel.name,
    presence: new Presence({
      status: UserStatus.Available,
      description: ''
    }),
    firstName: '',
    lastName: '',
    username: partnerModel.name,
    email: '',
    avatar: '',
    bio: ''
  })
)

const conversationId = nanoid()

const myConversation = myselfStorage
  .getState()
  .conversations.find(
    (cv) =>
      typeof cv.participants.find((p) => p.id === partnerModel.name) !== 'undefined'
  )
if (myConversation == null) {
  myselfStorage.addConversation(createConversation(conversationId, partnerModel.name))

    const hisConversation = myselfStorage
      .getState()
      .conversations.find(
        (cv) =>
          typeof cv.participants.find((p) => p.id === partnerModel.name) !==
          'undefined'
      )
    if (hisConversation == null) {
      myselfStorage.addConversation(
        createConversation(conversationId, partnerModel.name)
      )
    }
}

export const App = (): JSX.Element => {
  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <Container
        fluid
        className="p-4 flex-grow-1 position-relative overflow-hidden"
      >
        <Row style={{ width: '1200px', height: '650px' }}>
          <Col>
            <ChatProvider
              serviceFactory={serviceFactory}
              storage={myselfStorage}
              config={{
                typingThrottleTime: 250,
                typingDebounceTime: 900,
                debounceTyping: true,
                autoDraft: AutoDraft.Save | AutoDraft.Restore
              }}
            >
              <Chat user={myself} />
            </ChatProvider>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
