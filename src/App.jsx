import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import WebsocketProvider from "./WebsocketProvider";

const getWebsocketUrl = userId => `ws://localhost:8080/events?user=${userId}`;

class App extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired
  };

  state = {
    messageInput: "",
    messages: []
  };

  addChatMessage = (id, sender, text) => {
    this.setState(state => ({
      messages: [
        ...state.messages,
        {
          id,
          sender,
          text,
          type: "ChatMessage"
        }
      ]
    }));
  };

  addLogin = (id, user) => {
    this.setState(state => ({
      messages: [
        ...state.messages,
        {
          id,
          user,
          type: "Login"
        }
      ]
    }));
  };

  render() {
    return (
      <div className="App">
        <WebsocketProvider
          userId={this.props.userId}
          websocketUrl={getWebsocketUrl(this.props.userId)}
          render={sendMessage => (
            <input
              type="text"
              className={"messageInput"}
              value={this.state.messageInput}
              placeholder={"Type message…"}
              onChange={e => this.setState({ messageInput: e.target.value })}
              onKeyPress={e => {
                const text = e.target.value;
                if (e.key === "Enter" && text) {
                  sendMessage({
                    type: "ChatMessage",
                    author: this.props.userId,
                    message: text
                  });
                  this.addChatMessage(Date.now(), this.props.userId, text);
                  this.setState({ messageInput: "" });
                }
              }}
              autoFocus
            />
          )}
          onMessage={message => {
            console.log("Got message", message);
            switch (message.type) {
              case "ChatMessage":
                this.addChatMessage(
                  Date.now(),
                  message.author,
                  message.message
                );
                return;
              case "Login":
                this.addLogin(Date.now(), message.user, message.message);
                return;
              default:
                console.warn("Received an unexpected message", message);
            }
          }}
        />
        <div className="messages">
          {this.state.messages.map(m => {
            switch (m.type) {
              case "ChatMessage":
                return (
                  <div key={m.id} className="message">
                    <span key={m.id} className="message_sender">
                      {m.sender}
                    </span>
                    <span className="message_text">{m.text}</span>
                  </div>
                );
              case "Login":
                return (
                  <div key={m.id} className="login">
                    <span key={m.id} className="login_user">
                      {m.user}
                    </span>
                    {" "}
                    logged in!
                  </div>
                );
              default:
                console.warn("Unable to render message", m);
                return null;
            }
          })}
        </div>
      </div>
    );
  }
}

export default App;
