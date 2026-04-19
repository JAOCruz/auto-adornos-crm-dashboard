export type MessageChannel = 'whatsapp' | 'facebook' | 'instagram' | 'tiktok';
export type ClientStatus = 'nuevo' | 'en_progreso' | 'respondido' | 'perdido';

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  vehicle?: string;
  status: ClientStatus;
  lastMessage?: string;
  lastMessageTime?: Date;
  channel: MessageChannel;
  avatar?: string;
}

export interface Message {
  id: number;
  clientId: number;
  content: string;
  direction: 'inbound' | 'outbound';
  channel: MessageChannel;
  timestamp: Date;
  read: boolean;
}

export interface DashboardStats {
  totalMessages: number;
  avgResponseTime: number;
  responseRate: number;
  clientsByStatus: Record<ClientStatus, number>;
  messagesByChannel: Record<MessageChannel, number>;
  messagesPerDay: Array<{ date: string; count: number }>;
}
