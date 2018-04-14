import React, { Component } from 'react';
import './App.css';
import WebsocketProvider from './WebsocketProvider';

class App extends Component {
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
          websocketUrl={"ws://localhost:8080/events"}
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
                    'We',
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
            this.addMesssage(
              Date.now(),
              'Them',
              e.data
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
