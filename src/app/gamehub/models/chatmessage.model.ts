export interface ChatMessage {
  senderId: string;
  receiverId: string;
  senderName: string;
  body: string;
  timeSent: Date;
}