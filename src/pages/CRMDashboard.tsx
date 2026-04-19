import { useState, useEffect } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import type { Client, Message, MessageChannel } from '../types';

const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'Juan García',
    phone: '+1 809 555-0001',
    vehicle: 'Toyota Corolla 2020',
    status: 'en_progreso',
    channel: 'whatsapp',
    lastMessage: 'Interesado en spoilers deportivos',
    lastMessageTime: new Date(Date.now() - 2 * 60000),
  },
  {
    id: 2,
    name: 'María López',
    phone: '+1 809 555-0002',
    vehicle: 'Honda Civic 2018',
    status: 'nuevo',
    channel: 'facebook',
    lastMessage: '¿Tienen kits de suspensión?',
    lastMessageTime: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    phone: '+1 809 555-0003',
    vehicle: 'Nissan Sentra 2019',
    status: 'respondido',
    channel: 'instagram',
    lastMessage: 'Gracias por la cotización',
    lastMessageTime: new Date(Date.now() - 60 * 60000),
  },
];

const MOCK_MESSAGES: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      clientId: 1,
      content: '¿Tienen spoilers deportivos para Toyota?',
      direction: 'inbound',
      channel: 'whatsapp',
      timestamp: new Date(Date.now() - 10 * 60000),
      read: true,
    },
    {
      id: 2,
      clientId: 1,
      content: 'Sí, tenemos varios modelos. Te envío opciones.',
      direction: 'outbound',
      channel: 'whatsapp',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: true,
    },
    {
      id: 3,
      clientId: 1,
      content: 'Interesado en spoilers deportivos',
      direction: 'inbound',
      channel: 'whatsapp',
      timestamp: new Date(Date.now() - 2 * 60000),
      read: true,
    },
  ],
};

const statusColors = {
  nuevo: 'bg-blue-100 text-blue-800',
  en_progreso: 'bg-yellow-100 text-yellow-800',
  respondido: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800',
};

const statusLabels = {
  nuevo: 'Nuevo',
  en_progreso: 'En Progreso',
  respondido: 'Respondido',
  perdido: 'Perdido',
};

const channelIcons = {
  whatsapp: '💬',
  facebook: '📘',
  instagram: '📷',
  tiktok: '🎵',
};

export default function CRMDashboard() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<MessageChannel | null>(null);

  useEffect(() => {
    if (selectedClient) {
      setMessages(MOCK_MESSAGES[selectedClient.id] || []);
      setShowRightPanel(true);
    }
  }, [selectedClient]);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedClient) return;

    const msg: Message = {
      id: Math.max(...messages.map(m => m.id), 0) + 1,
      clientId: selectedClient.id,
      content: newMessage,
      direction: 'outbound',
      channel: selectedClient.channel,
      timestamp: new Date(),
      read: true,
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const filteredClients = activeChannel
    ? clients.filter(c => c.channel === activeChannel)
    : clients;

  return (
    <div className="flex w-full h-full overflow-hidden bg-[#0B1120]">
      {/* Left Panel - Clients List */}
      <div className={`${showRightPanel && window.innerWidth < 768 ? 'hidden' : 'w-full md:w-96'} flex-shrink-0 border-r border-slate-800 bg-[#0F172A] flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0F172A]/50 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-white">Inbox Unificado</h2>
          <p className="text-xs text-slate-400">{filteredClients.length} clientes</p>
        </div>

        {/* Channel Filter */}
        <div className="flex gap-2 p-3 border-b border-slate-800 overflow-x-auto bg-[#0F172A]/30">
          <button
            onClick={() => setActiveChannel(null)}
            className={`px-3 py-1.5 rounded text-sm whitespace-nowrap transition-all ${
              activeChannel === null
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Todos
          </button>
          {(['whatsapp', 'facebook', 'instagram', 'tiktok'] as MessageChannel[]).map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1.5 rounded text-sm whitespace-nowrap transition-all ${
                activeChannel === ch
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {channelIcons[ch]}
            </button>
          ))}
        </div>

        {/* Clients List */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          {filteredClients.map(client => (
            <button
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className={`w-full text-left p-4 border-b border-slate-800 transition-all ${
                selectedClient?.id === client.id
                  ? 'bg-slate-800/50 border-l-4 border-l-blue-500'
                  : 'hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{channelIcons[client.channel]}</span>
                    <p className="font-semibold text-white text-base truncate">
                      {client.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {client.vehicle}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {client.lastMessage}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${statusColors[client.status]}`}>
                  {statusLabels[client.status]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      {selectedClient && (
        <div className={`${!showRightPanel && window.innerWidth < 768 ? 'hidden' : 'flex-1'} flex flex-col overflow-hidden bg-[#0B1120]`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0F172A]/50">
            <div className="flex items-center gap-3">
              {window.innerWidth < 768 && (
                <button
                  onClick={() => setShowRightPanel(false)}
                  className="p-1 hover:bg-slate-800/50 rounded"
                >
                  <ChevronLeft size={20} className="text-slate-400" />
                </button>
              )}
              <div>
                <p className="font-semibold text-white">{selectedClient.name}</p>
                <p className="text-xs text-slate-400">{selectedClient.phone}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded ${statusColors[selectedClient.status]}`}>
              {statusLabels[selectedClient.status]}
            </span>
          </div>

          {/* Client Info */}
          <div className="p-4 bg-[#0F172A]/30 border-b border-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Vehículo</p>
                <p className="text-sm text-white mt-1">{selectedClient.vehicle || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Canal</p>
                <p className="text-sm text-white mt-1">{channelIcons[selectedClient.channel]} {selectedClient.channel.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.direction === 'outbound'
                    ? 'bg-blue-600/80 text-white'
                    : 'bg-slate-800/60 text-slate-200'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800 bg-[#0F172A]/50 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-slate-800/50 text-white px-4 py-2 rounded border border-slate-800 focus:border-blue-500 focus:outline-none text-sm placeholder:text-slate-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors flex items-center gap-2 font-semibold"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
