export interface CommandMessage {
  type: "command";
  command: string;
} 

export type Message = CommandMessage;
