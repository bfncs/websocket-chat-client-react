import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import WebsocketProvider from './WebsocketProvider';

const getWebsocketUrl = userId => `ws://localhost:8080/events?user=${userId}`

class App extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  state = {
    messageInput: '',
    messages: [],
  };

  addMesssage = (id, sender, text) => {
    this.setState(state => ({ messages: [...state.messages, {
      id, sender, text
    }]}));
  };

  render() {
    return (
      <div className="App">
        <WebsocketProvider
          websocketUrl={getWebsocketUrl(this.props.userId)}
          render={sendMessage => (
            <input
              type="text"
              className={"messageInput"}
              value={this.state.messageInput}
              placeholder={"Type message…"}
              onChange={e => this.setState( { messageInput: e.target.value })}
              onKeyPress={e => {
                const text = e.target.value;
                if (e.key === 'Enter' && text) {
                  sendMessage(text);
                  this.addMesssage(
                    Date.now(),
                    this.props.userId,
                    text
                  );
                  this.setState( { messageInput: '' })
                }
              }}
              autoFocus
            />
          )}
          onMessage={e => {
            console.log('Got message', e);
            const textParticles = e.data.split(":");
            if (!textParticles.length >= 2) {
              return;
            }
            const sender = textParticles[0];
            const message = textParticles.slice(1);
            this.addMesssage(
              Date.now(),
              sender,
              message
            );
          }}
        />
        <div className="messages">
          {this.state.messages.map(m => (
            <div key={m.id} className='message'>
              <span key={m.id} className='message_sender'>
                {m.sender}
              </span>
              <span className="message_text">
                {m.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
