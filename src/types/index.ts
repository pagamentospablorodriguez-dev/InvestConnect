export type UserType = 'entrepreneur' | 'investor';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  user_type: UserType;
  avatar_url?: string;
  city?: string;
  state?: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface InvestorDetails {
  id: string;
  profile_id: string;
  investor_type: 'angel' | 'fund' | 'shark_talent_scout' | 'international';
  company_name?: string;
  investment_range_min: number;
  investment_range_max: number;
  sectors: string[];
  total_investments: number;
  total_invested: number;
  verified: boolean;
  featured: boolean;
  bio?: string;
  linkedin_url?: string;
  profile?: Profile;
}

export interface EntrepreneurDetails {
  id: string;
  profile_id: string;
  experience_level: string;
  previous_businesses: number;
  industry_interests: string[];
}

export interface Project {
  id: string;
  entrepreneur_id: string;
  title: string;
  slug: string;
  category: string;
  asking_amount: number;
  equity_offered?: number;
  short_description: string;
  full_description: string;
  business_model?: string;
  target_market?: string;
  competitive_advantage?: string;
  use_of_funds?: string;
  status: 'draft' | 'active' | 'funded' | 'closed';
  views: number;
  featured: boolean;
  created_at: string;
  updated_at?: string;
  funded_at?: string;
  funded_by?: string;
  entrepreneur?: Profile;
  bidCount?: number;
  media?: ProjectMedia[];
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  media_type: 'image' | 'document' | 'video';
  url: string;
  title?: string;
}

export interface InvestmentBid {
  id: string;
  project_id: string;
  investor_id: string;
  amount: number;
  equity_requested?: number;
  terms?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'counter';
  created_at: string;
  updated_at?: string;
  responded_at?: string;
  investor?: Profile;
  project?: Project;
}

export interface Conversation {
  id: string;
  project_id?: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  last_message_at: string;
  otherParticipant?: Profile;
  lastMessage?: Message;
  project?: Project;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read_at?: string;
  created_at: string;
}

export interface ActivityFeedItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  amount?: number;
  city?: string;
  category?: string;
  created_at: string;
}

export interface FundedDeal {
  id: string;
  project_id: string;
  investor_id: string;
  amount: number;
  equity_percentage?: number;
  deal_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  project?: Project;
  investor?: Profile;
}
