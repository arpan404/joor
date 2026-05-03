import type { JsonObject } from '../../src/schema/json.js';

export interface User extends JsonObject {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Message extends JsonObject {
  role: 'user' | 'assistant';
  content: string;
}

export const users = new Map<string, User>([
  [
    '550e8400-e29b-41d4-a716-446655440000',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      plan: 'enterprise',
    },
  ],
  [
    '4f21d7f0-54f4-4d2f-b43c-1a8b399af91d',
    {
      id: '4f21d7f0-54f4-4d2f-b43c-1a8b399af91d',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      plan: 'pro',
    },
  ],
]);

export const searchUsers = (query: string): User[] => {
  const normalized = query.toLowerCase();
  return [...users.values()].filter(
    (user) =>
      user.name.toLowerCase().includes(normalized) ||
      user.email.toLowerCase().includes(normalized)
  );
};

export const summarizeMessages = (messages: readonly Message[]): string =>
  messages.map((message) => `${message.role}: ${message.content}`).join('\n');
