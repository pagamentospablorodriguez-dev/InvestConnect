import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  MessageSquare, Send, Search, ArrowLeft,
  CheckCircle, Paperclip, Phone, Video, MoreVertical,
} from 'lucide-react';
import {
  getInitials, formatRelativeTime,
} from '../lib/utils';

interface ChatContact {
  id: string;
  name: string;
  role: string;
  roleType: string;
  project?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  avatar?: string;
  verified: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  type: 'text' | 'system';
}

const FAKE_CONTACTS: ChatContact[] = [
  { id: 'c1', name: 'Roberto Almeida', role: 'Investidor-Anjo', roleType: 'angel', project: 'Cafe Organico Sustentavel', lastMessage: 'Estou pensando em algo entre R$ 60.000 e R$ 80.000. Podemos agendar uma call?', lastTime: new Date(Date.now() - 900000).toISOString(), unread: 2, online: true, verified: true },
  { id: 'c2', name: 'Mariana Costa', role: 'Costa Capital', roleType: 'fund', project: 'EdTech para Escolas Publicas', lastMessage: 'Gostaria de entender melhor o modelo de receita. Temos interesse em participar.', lastTime: new Date(Date.now() - 7200000).toISOString(), unread: 1, online: true, verified: true },
  { id: 'c3', name: 'Carlos Eduardo Silva', role: 'Olheiro Shark Tank', roleType: 'shark_talent_scout', project: 'App de Delivery Rural', lastMessage: 'Seu projeto tem potencial para o programa! Vamos agendar uma call?', lastTime: new Date(Date.now() - 86400000).toISOString(), unread: 0, online: false, verified: true },
  { id: 'c4', name: 'James Peterson', role: 'Global Partners VC', roleType: 'international', project: 'AgriTech Sensor', lastMessage: 'We are very interested in your business model. Can we schedule a meeting?', lastTime: new Date(Date.now() - 172800000).toISOString(), unread: 0, online: false, verified: true },
  { id: 'c5', name: 'Patricia Mendes', role: 'Investidora-Anjo', roleType: 'angel', project: 'Clinica Veterinaria 24h', lastMessage: 'Acho que posso ajudar com network na area de saude animal. Vamos conversar?', lastTime: new Date(Date.now() - 259200000).toISOString(), unread: 0, online: true, verified: true },
  { id: 'c6', name: 'Andre Souza', role: 'SaaS Ventures', roleType: 'fund', project: 'EdTech para Escolas Publicas', lastMessage: 'Vi que voce tem SaaS B2B. Nosso fundo e especializado nesse modelo. Podemos conversar?', lastTime: new Date(Date.now() - 345600000).toISOString(), unread: 0, online: false, verified: true },
  { id: 'c7', name: 'Juliana Santos', role: 'Shark Tank Casting', roleType: 'shark_talent_scout', project: 'Cafe Organico Sustentavel', lastMessage: 'Sua historia e incrivel! Quero te colocar no casting da proxima temporada.', lastTime: new Date(Date.now() - 432000000).toISOString(), unread: 0, online: true, verified: true },
  { id: 'c8', name: 'Michael Chen', role: 'Asia Ventures', roleType: 'international', project: 'App de Delivery Rural', lastMessage: 'We see potential for cross-border expansion. Let us discuss terms.', lastTime: new Date(Date.now() - 518400000).toISOString(), unread: 0, online: false, verified: true },
  { id: 'c9', name: 'Suporte InvestConnectBR', role: 'Atendimento', roleType: 'support', lastMessage: 'Bem-vindo a plataforma! Estamos aqui para ajudar voce a receber investimento.', lastTime: new Date(Date.now() - 600000000).toISOString(), unread: 1, online: true, verified: true },
];

const CONVERSATION_HISTORY: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1-1', sender: 'c1', text: 'Oi! Vi seu projeto na plataforma e achei muito interessante. Tenho experiencia no setor de alimentacao.', time: new Date(Date.now() - 7200000).toISOString(), type: 'text' },
    { id: 'm1-2', sender: 'me', text: 'Ola Roberto! Muito obrigado pelo interesse! Fico feliz que tenha gostado do projeto.', time: new Date(Date.now() - 6600000).toISOString(), type: 'text' },
    { id: 'm1-3', sender: 'c1', text: 'Ja tive uma rede de cafeterias com 12 unidades. Posso agregar alem do capital com experiencia operacional.', time: new Date(Date.now() - 6000000).toISOString(), type: 'text' },
    { id: 'm1-4', sender: 'me', text: 'Isso seria incrivel! A mentoria e tao importante quanto o capital. Qual seria o valor do investimento?', time: new Date(Date.now() - 5400000).toISOString(), type: 'text' },
    { id: 'm1-5', sender: 'c1', text: 'Estou pensando em algo entre R$ 60.000 e R$ 80.000. Podemos agendar uma call para discutir os termos?', time: new Date(Date.now() - 900000).toISOString(), type: 'text' },
  ],
  c2: [
    { id: 'm2-1', sender: 'c2', text: 'Bom dia! Sou a Mariana, da Costa Capital. Vi seu projeto de EdTech e fiquei impressionada com os numeros.', time: new Date(Date.now() - 14400000).toISOString(), type: 'text' },
    { id: 'm2-2', sender: 'me', text: 'Bom dia Mariana! Obrigado pelo interesse. Os resultados do piloto foram muito positivos.', time: new Date(Date.now() - 13800000).toISOString(), type: 'text' },
    { id: 'm2-3', sender: 'c2', text: 'Com certeza. 35% de melhoria nas notas e impressionante. Gostaria de entender melhor o modelo de receita. Temos interesse em participar.', time: new Date(Date.now() - 7200000).toISOString(), type: 'text' },
  ],
  c3: [
    { id: 'm3-1', sender: 'c3', text: 'Ola! Sou olheiro do Shark Tank Brasil. Seu projeto de delivery rural chamou minha atencao.', time: new Date(Date.now() - 172800000).toISOString(), type: 'text' },
    { id: 'm3-2', sender: 'me', text: 'Carlos! Que honra. O Shark Tank e um sonho para nos!', time: new Date(Date.now() - 170000000).toISOString(), type: 'text' },
    { id: 'm3-3', sender: 'c3', text: 'A historia do delivery rural e unica. Os Sharks vao amar. Seu projeto tem potencial para o programa! Vamos agendar uma call?', time: new Date(Date.now() - 86400000).toISOString(), type: 'text' },
  ],
  c4: [
    { id: 'm4-1', sender: 'c4', text: 'Hi! I represent Global Partners VC, a NY-based fund focused on Latin American startups. Your AgriTech project caught our eye.', time: new Date(Date.now() - 345600000).toISOString(), type: 'text' },
    { id: 'm4-2', sender: 'me', text: 'Hello James! Thank you for reaching out. We are looking for international partners who understand the LatAm market.', time: new Date(Date.now() - 338000000).toISOString(), type: 'text' },
    { id: 'm4-3', sender: 'c4', text: 'We are very interested in your business model. Can we schedule a meeting?', time: new Date(Date.now() - 172800000).toISOString(), type: 'text' },
  ],
  c5: [
    { id: 'm5-1', sender: 'c5', text: 'Ola! Investidora de impacto social com foco em saude. Seu projeto de clinica veterinaria 24h e muito alinhado com meu portfolio.', time: new Date(Date.now() - 518400000).toISOString(), type: 'text' },
    { id: 'm5-2', sender: 'me', text: 'Patricia, obrigado pela mensagem! A telemedicina e o grande diferencial do nosso modelo.', time: new Date(Date.now() - 500000000).toISOString(), type: 'text' },
    { id: 'm5-3', sender: 'c5', text: 'Acho que posso ajudar com network na area de saude animal. Vamos conversar?', time: new Date(Date.now() - 259200000).toISOString(), type: 'text' },
  ],
  c6: [
    { id: 'm6-1', sender: 'c6', text: 'Ola! Andre aqui, da SaaS Ventures. Vi que seu modelo e SaaS B2B com vendas para prefeituras. Esse e exatamente nosso sweet spot.', time: new Date(Date.now() - 691200000).toISOString(), type: 'text' },
    { id: 'm6-2', sender: 'me', text: 'Andre, otimo saber! Nosso ticket medio por prefeitura e R$ 5.000/mes e temos 12 escolas no piloto.', time: new Date(Date.now() - 680000000).toISOString(), type: 'text' },
    { id: 'm6-3', sender: 'c6', text: 'Vi que voce tem SaaS B2B. Nosso fundo e especializado nesse modelo. Podemos conversar?', time: new Date(Date.now() - 345600000).toISOString(), type: 'text' },
  ],
  c7: [
    { id: 'm7-1', sender: 'c7', text: 'Ola! Sou a Juliana, diretora de casting do Shark Tank Brasil. Seu cafe organico tem uma historia incrivel!', time: new Date(Date.now() - 864000000).toISOString(), type: 'text' },
    { id: 'm7-2', sender: 'me', text: 'Juliana! Nunca pensei que seria contatada pelo Shark Tank!', time: new Date(Date.now() - 850000000).toISOString(), type: 'text' },
    { id: 'm7-3', sender: 'c7', text: 'Sua historia e incrivel! Quero te colocar no casting da proxima temporada.', time: new Date(Date.now() - 432000000).toISOString(), type: 'text' },
  ],
  c8: [
    { id: 'm8-1', sender: 'c8', text: 'Hello! Michael Chen from Asia Ventures here. We are a Hong Kong-based fund looking at Brazilian logistics startups.', time: new Date(Date.now() - 1036800000).toISOString(), type: 'text' },
    { id: 'm8-2', sender: 'me', text: 'Hi Michael! Great to hear from you. Our rural delivery model is unique in Brazil.', time: new Date(Date.now() - 1020000000).toISOString(), type: 'text' },
    { id: 'm8-3', sender: 'c8', text: 'We see potential for cross-border expansion. Let us discuss terms.', time: new Date(Date.now() - 518400000).toISOString(), type: 'text' },
  ],
  c9: [
    { id: 'm9-1', sender: 'c9', text: 'Bem-vindo a InvestConnectBR! Estamos felizes em te ter na plataforma.', time: new Date(Date.now() - 610000000).toISOString(), type: 'text' },
    { id: 'm9-2', sender: 'c9', text: 'Aqui estao algumas dicas para comecar:\n1. Complete seu perfil — investidores confiam mais em perfis completos\n2. Crie seu primeiro projeto com detalhes\n3. Envie mensagens para investidores do seu setor\n4. Acompanhe os lances que receber', time: new Date(Date.now() - 605000000).toISOString(), type: 'text' },
    { id: 'm9-3', sender: 'c9', text: 'Bem-vindo a plataforma! Estamos aqui para ajudar voce a receber investimento.', time: new Date(Date.now() - 600000000).toISOString(), type: 'text' },
  ],
};

const REPLY_MESSAGES: Record<string, string[]> = {
  c1: [
    'Claro! Vou preparar uma proposta formal. Voce prefere via email ou call?',
    'Otimo! Vamos alinhar os detalhes. Qual horario funciona para voce?',
    'Perfeito. Vou mandar o term sheet para revisao. Fico no aguardo!',
    'Entendi seu ponto. Acho que podemos chegar a um acordo que funcione para os dois.',
  ],
  c2: [
    'Compreendo. Nosso time financeiro pode fazer uma analise detalhada. Vamos agendar?',
    'O modelo SaaS B2B e muito atrativo para nosso portfolio. Qual o CAC atual?',
    'Perfeito! Vamos formalizar o interesse. Mando o NDA para voce assinar.',
  ],
  c3: [
    'Excelente! Vou te enviar o formulario de inscricao. A temporada comeca em marco!',
    'Sua historia e perfeita para o programa. Os Sharks vao brigar pelo seu negocio!',
    'Vou te colocar em contato com a equipe de producao. Prepare-se!',
  ],
  default: [
    'Interessante! Vou analisar isso com cuidado.',
    'Obrigado pela mensagem. Vou responder em detalhes logo.',
    'Combinado! Vamos agendar uma call para discutir melhor.',
    'Entendo seu ponto. Acho que podemos chegar a um acordo.',
    'Vou verificar isso e te retorno em breve.',
  ],
};

export default function MessagesPage() {
  const { profile: _profile } = useAuth();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(CONVERSATION_HISTORY);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  const filteredContacts = FAKE_CONTACTS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.project?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = FAKE_CONTACTS.reduce((sum, c) => sum + c.unread, 0);

  const handleSend = () => {
    if (!messageInput.trim() || !selectedContact) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: messageInput,
      time: new Date().toISOString(),
      type: 'text',
    };
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));
    setMessageInput('');

    // Simulate auto-reply
    const contactId = selectedContact.id;
    const replies = REPLY_MESSAGES[contactId] || REPLY_MESSAGES.default;
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        sender: contactId,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toISOString(),
        type: 'text',
      };
      setMessages(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), reply],
      }));
    }, 2000 + Math.random() * 4000);
  };

  const contactMessages = selectedContact
    ? messages[selectedContact.id] || []
    : [];

  // Select first contact with unread by default on desktop
  useEffect(() => {
    if (!selectedContact && filteredContacts.length > 0) {
      const withUnread = filteredContacts.find(c => c.unread > 0);
      if (withUnread) setSelectedContact(withUnread);
    }
  }, []);

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-7xl mx-auto">
      {/* Contact List */}
      <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900">Mensagens</h2>
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalUnread}</span>
              )}
            </div>
            <span className="text-xs text-gray-400">{FAKE_CONTACTS.length} conversas</span>
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
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                  selectedContact?.id === contact.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-11 h-11 rounded-xl ${
                    contact.roleType === 'support'
                      ? 'bg-gradient-to-br from-primary-600 to-emerald-500'
                      : 'bg-gradient-to-br from-primary-500 to-emerald-500'
                  } flex items-center justify-center text-white text-sm font-bold`}>
                    {contact.roleType === 'support' ? <MessageSquare className="w-5 h-5" /> : getInitials(contact.name)}
                  </div>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900 text-sm truncate">{contact.name}</p>
                      {contact.verified && <CheckCircle className="w-3 h-3 text-primary-500 flex-shrink-0" />}
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{formatRelativeTime(contact.lastTime)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.role}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="bg-primary-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">{contact.unread}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <button onClick={() => setSelectedContact(null)} className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl ${
                  selectedContact.roleType === 'support'
                    ? 'bg-gradient-to-br from-primary-600 to-emerald-500'
                    : 'bg-gradient-to-br from-primary-500 to-emerald-500'
                } flex items-center justify-center text-white text-sm font-bold`}>
                  {selectedContact.roleType === 'support' ? <MessageSquare className="w-5 h-5" /> : getInitials(selectedContact.name)}
                </div>
                {selectedContact.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-gray-900 text-sm">{selectedContact.name}</p>
                  {selectedContact.verified && <CheckCircle className="w-3.5 h-3.5 text-primary-500" />}
                </div>
                <p className="text-xs text-gray-500">{selectedContact.role}{selectedContact.online ? ' · Online agora' : ''}</p>
              </div>
              {selectedContact.project && (
                <span className="hidden sm:inline text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg truncate max-w-[200px]">{selectedContact.project}</span>
              )}
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/50">
              {/* System message */}
              <div className="flex justify-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Conversa iniciada {formatRelativeTime(contactMessages[0]?.time || new Date().toISOString())}
                </span>
              </div>
              {contactMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-primary-600 text-white rounded-br-md shadow-sm'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                        {formatRelativeTime(msg.time)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite sua mensagem..."
                  className="input py-2.5 text-sm flex-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
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
              <p className="text-sm text-gray-400 mt-1">Suas mensagens com investidores e empreendedores</p>
              <p className="text-xs text-gray-300 mt-3">{FAKE_CONTACTS.length} conversas ativas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
