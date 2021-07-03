export interface BaseMessage {
  type: string;
  sender: string;
  respondTo?: string;
}
export interface CommandMessage extends BaseMessage {
  type: "command";
  command: string;
}

export type Message = CommandMessage;
