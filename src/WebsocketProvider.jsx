import { Component } from "react";
import PropTypes from "prop-types";

class WebsocketProvider extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    websocketUrl: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired
  };

  socket = null;

  componentWillMount() {
    this.socket = new WebSocket(this.props.websocketUrl);

    this.socket.onopen = event => {
      console.log("Websocket open", event);
      this.sendMessage({
        type: "Login",
        user: this.props.userId
      });
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
    if (!this.socket) {
      console.warn(
        "Unable to send message because socket is not open!",
        payload
      );
      return;
    }

    console.log("Sending message", payload);
    this.socket.send(JSON.stringify(payload));
  };

  render() {
    return this.props.render(this.sendMessage);
  }
}

export default WebsocketProvider;
