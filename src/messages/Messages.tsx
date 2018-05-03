import * as React from "react";
import { IMessage } from "./models";

interface IProps {
  messages: IMessage[];
}

export class Messages extends React.PureComponent<IProps> {
  render(): JSX.Element {
    const { messages } = this.props;
    return (
      <div>
        {messages.map((m: IMessage) => {
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
    );
  }
}
