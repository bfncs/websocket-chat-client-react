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
      this.props.onMessage(event);
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  sendMessage = payload => {
    this.socket && this.socket.send(payload);
  };

  render() {
    return this.props.render(this.sendMessage);
  }
}

export default WebsocketProvider;