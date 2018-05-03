import { Component } from "react";

export type MessageSender<M> = (payload: M) => void;

interface IProps<M> {
	userId: string;
  websocketUrl: string;
  onMessage: (msg: M) => void;
  onConnected: (sendMessage: MessageSender<M>) => void;
  render: (sendMessage: MessageSender<M>) => JSX.Element | null;
}

class WebsocketProvider<Message> extends Component<IProps<Message>> {

	socket: WebSocket | null = null;

	componentWillMount():void {
		this.initWebsocket();
	}

	initWebsocket = (): void => {
		const socket = new WebSocket(this.props.websocketUrl);socket.onopen = event => {
      // tslint:disable-next-line no-console
      console.log("Websocket open", event);
      this.props.onConnected(this.sendMessage);
		};

		socket.onmessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data);
				this.props.onMessage(message);
			} catch (e) {
				// tslint:disable-next-line no-console
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

	componentWillUnmount(): void {
		if (this.socket) {
      this.socket.close();
		}
	}

  sendMessage = (payload: Message): void => {
    if (!this.socket ) {
      // tslint:disable-next-line no-console
      console.warn(
        "Unable to send message because socket is not open!",
        payload
      );
      return;
    }

    // tslint:disable-next-line no-console
    console.log("Sending message", payload); this.socket.send(JSON.stringify(payload));
  };

	render(): JSX.Element | null {
		return this.props.render(this.sendMessage);
	}
}

export default WebsocketProvider;
