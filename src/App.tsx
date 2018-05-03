import * as React from "react";
import "./App.css";
import WebsocketProvider, { MessageSender } from "./WebsocketProvider";

interface IChatMessage {
  type: "ChatMessage";
  id: string;
  author: string;
  message: string;
}

interface ILogin {
  type: "Login";
  id: string;
  user: string;
}

type IMessage = IChatMessage | ILogin;

interface IProps {
  userId: string;
}

interface IState {
  messageInput: string;
  messages: IMessage[];
}

const getWebsocketUrl = (userId: string) =>
  `ws://localhost:8080/events?user=${userId}`;

class App extends React.Component<IProps, IState> {
  state: IState = {
    messageInput: "",
    messages: []
  };

  addChatMessage = (msg: IChatMessage) => {
    this.setState(state => ({
      messages: [...state.messages, msg]
    }));
  };

  addLogin = (msg: ILogin) => {
    this.setState(state => ({
      messages: [...state.messages, msg]
    }));
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ messageInput: e.target.value });

  handleKeyPress = (sendMessage: MessageSender<IMessage>) => (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { messageInput } = this.state;
    if (e.key === "Enter" && messageInput) {
      sendMessage({
        type: "ChatMessage",
        id: Date.now().toString(),
        author: this.props.userId,
        message: messageInput
      });
      this.addChatMessage({
        type: "ChatMessage",
        id: Date.now().toString(),
        author: this.props.userId,
        message: messageInput
      });
      this.setState({ messageInput: "" });
    }
  };

  handleMessage = (message: IMessage) => {
    // tslint:disable-next-line no-console
    console.log("Got message", message);
    switch (message.type) {
      case "ChatMessage":
        this.addChatMessage({
          type: "ChatMessage",
          author: message.author,
          id: Date.now().toString(),
          message: message.message
        });
        return;
      case "Login":
        this.addLogin({
          type: "Login",
          id: Date.now().toString(),
          user: message.user
        });
        return;
      default:
        // tslint:disable-next-line no-console
        console.warn("Received an unexpected message", message);
    }
  };

  handleConnected = (sendMessage: MessageSender<IMessage>) => {
    sendMessage({
      type: "Login",
      id: Date.now().toString(),
      user: this.props.userId
    });
  };

  public render(): JSX.Element {
    return (
      <WebsocketProvider
        websocketUrl={getWebsocketUrl(this.props.userId)}
        onConnected={this.handleConnected}
        onMessage={this.handleMessage}
      >
        {sendMessage => (
          <div className="App">
            <input
              type="text"
              className={"messageInput"}
              value={this.state.messageInput}
              placeholder={"Type message…"}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress(sendMessage)}
              autoFocus={true}
            />
            <div className="messages">
              {this.state.messages.map(m => {
                switch (m.type) {
                  case "ChatMessage":
                    return (
                      <div key={m.id} className="message">
                        <span key={m.id} className="message_sender">
                          {m.author}
                        </span>
                        <span className="message_text">{m.message}</span>
                      </div>
                    );
                  case "Login":
                    return (
                      <div key={m.id} className="login">
                        <span key={m.id} className="login_user">
                          {m.user}
                        </span>{" "}
                        logged in!
                      </div>
                    );
                  default:
                    // tslint:disable-next-line no-console
                    console.warn("Unable to render message", m);
                    return null;
                }
              })}
            </div>
          </div>
        )}
      </WebsocketProvider>
    );
  }
}

export default App;
