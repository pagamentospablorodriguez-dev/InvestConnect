export type UserType = 'entrepreneur' | 'investor';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  user_type: UserType;
  avatar_url?: string;
  city?: string;
  state?: string;
  created_at: string;
}

export interface Project {
  id: string;
  entrepreneur_id: string;
  title: string;
  category: string;
  asking_amount: number;
  equity_offered?: number;
  short_description: string;
  full_description: string;
  status: string;
  views: number;
  featured: boolean;
  created_at: string;
  entrepreneur?: Profile;
}

export interface InvestmentBid {
  id: string;
  project_id: string;
  investor_id: string;
  amount: number;
  equity_requested?: number;
  message?: string;
  status: string;
  created_at: string;
  investor?: Profile;
  project?: Project;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  otherParticipant?: Profile;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at?: string;
  created_at: string;
}
