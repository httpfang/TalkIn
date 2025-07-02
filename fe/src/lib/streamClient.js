import { StreamChat } from 'stream-chat';

let client = null;

export function getStreamClient(apiKey) {
  if (!client) {
    client = StreamChat.getInstance(apiKey);
  }
  return client;
} 