import { Component } from 'react';
import PropTypes from 'prop-types';

class WebsocketProvider extends Component {
  static propTypes = {
    websocketUrl: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
  };

  socket = null;

  componentWillMount() {
    this.socket = new WebSocket(this.props.websocketUrl);

    this.socket.onopen = event => {
      console.log('Websocket open', event);
    };

    this.socket.onmessage = event => {
      try {
        const message = JSON.parse(event.data);
        this.props.onMessage(message);
      } catch (e) {
        console.error(e);
      }
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  sendMessage = payload => {
    this.socket && this.socket.send(JSON.stringify(payload));
  };

  render() {
    return this.props.render(this.sendMessage);
  }
}

export default WebsocketProvider;