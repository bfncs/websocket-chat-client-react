export interface IChatMessage {
  type: "ChatMessage";
  id: string;
  author: string;
  message: string;
}

export interface ILogin {
  type: "Login";
  id: string;
  user: string;
}

export type IMessage = IChatMessage | ILogin;
