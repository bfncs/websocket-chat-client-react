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
		this.initWebsocket();
	}

	initWebsocket = () => {
		const socket = new WebSocket(this.props.websocketUrl);

		socket.onopen = event => {
			console.log('Websocket open', event);
		};

		socket.onmessage = event => {
			try {
				const message = JSON.parse(event.data);
				this.props.onMessage(message);
			} catch (e) {
				console.error(e);
			}
		};

		socket.onclose = () => {
		  // TODO: Implement exponential backoff reconnect
			this.socket = null;
			this.initWebsocket();
		};

		this.socket = socket;
	};

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
