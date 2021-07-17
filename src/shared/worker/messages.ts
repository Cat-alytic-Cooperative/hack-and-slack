export interface BaseMessage {
  type: string;
  from: string;
  to?: string;
}
export interface CommandMessage extends BaseMessage {
  type: "command";
  original: string;
  command: string;
  arguments?: string[];
}

export interface ResponseMessage extends BaseMessage {
  type: "response";
  to: string;
  text: string;
}

export type Message = CommandMessage | ResponseMessage;
