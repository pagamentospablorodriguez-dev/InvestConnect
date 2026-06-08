import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  MessageSquare, Send, Search, ArrowLeft,
  Paperclip,
} from 'lucide-react';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface ChatMessage {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  participant1: any;
  participant2: any;
}

export default function MessagesPage() {
  const { profile: currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser?.id) return;
    fetchConversations();
    const interval = setInterval(fetchConversations, 2000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    if (!currentUser?.id) return;
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id, participant1_id, participant2_id,
        participant1:profiles!conversations_participant1_id_fk(id, full_name, user_type),
        participant2:profiles!conversations_participant2_id_fk(id, full_name, user_type)
      `)
      .or(`participant1_id.eq.${currentUser.id},participant2_id.eq.${currentUser.id}`);

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    setConversations(data || []);
    setLoading(false);
  };

  const fetchMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);

    // Mark as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', convId)
      .neq('sender_id', currentUser?.id);
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConvId(convId);
    fetchMessages(convId);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConvId || !currentUser?.id) return;

    setSending(true);
    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedConvId,
      sender_id: currentUser.id,
      text: messageInput,
      read: false,
    });

    if (error) {
      toast.error('Erro ao enviar mensagem');
      setSending(false);
      return;
    }

    setMessageInput('');
    fetchMessages(selectedConvId);
    fetchConversations();
    setSending(false);
  };

  const selectedConv = conversations.find(c => c.id === selectedConvId);
  const otherParticipant = selectedConv
    ? currentUser?.id === selectedConv.participant1_id
      ? selectedConv.participant2
      : selectedConv.participant1
    : null;

  const filteredConversations = conversations.filter(conv => {
    const other = currentUser?.id === conv.participant1_id ? conv.participant2 : conv.participant1;
    return !search || other.full_name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-7xl mx-auto">
      {/* Contact List */}
      <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900">Mensagens</h2>
            </div>
            <span className="text-xs text-gray-400">{conversations.length} conversas</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversas..."
              className="input pl-9 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = currentUser?.id === conv.participant1_id ? conv.participant2 : conv.participant1;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                    selectedConvId === conv.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(other.full_name)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-900 text-sm truncate">{other.full_name}</p>
                        {other.user_type === 'investor' ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">Investidor</span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Empreendedor</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Clique para conversar</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedConvId ? 'hidden md:flex' : 'flex'}`}>
        {selectedConv && otherParticipant ? (
          <>
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <button onClick={() => setSelectedConvId(null)} className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                {getInitials(otherParticipant.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{otherParticipant.full_name}</p>
                <p className="text-xs text-gray-500">
                  {otherParticipant.user_type === 'investor' ? 'Investidor' : 'Empreendedor'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">Comece a conversa</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-br-md shadow-sm'
                            : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                          {formatRelativeTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="input py-2.5 text-sm flex-1"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending}
                  className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/50">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <p className="text-lg font-medium text-gray-500">Selecione uma conversa</p>
              <p className="text-sm text-gray-400 mt-1">Converse com investidores ou empreendedores</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
