import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Menu, X, Phone, MessageCircle } from 'lucide-react';
import type { Client, Message, MessageChannel } from '../types';

// Mock data
const customers: Record<string, Client> = {
  c01: { id: 1, name: 'Juan García', phone: '+1 809 555-0001', vehicle: 'Toyota Corolla 2020', status: 'en_progreso', channel: 'whatsapp', lastMessage: 'Interesado en spoilers deportivos', lastMessageTime: new Date(Date.now() - 2 * 60000) },
  c02: { id: 2, name: 'María López', phone: '+1 809 555-0002', vehicle: 'Honda Civic 2018', status: 'nuevo', channel: 'facebook', lastMessage: '¿Tienen kits de suspensión?', lastMessageTime: new Date(Date.now() - 15 * 60000) },
  c03: { id: 3, name: 'Carlos Rodríguez', phone: '+1 809 555-0003', vehicle: 'Nissan Sentra 2019', status: 'respondido', channel: 'instagram', lastMessage: 'Gracias por la cotización', lastMessageTime: new Date(Date.now() - 60 * 60000) },
};

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: 1, clientId: 1, content: '¿Tienen spoilers deportivos para Toyota?', direction: 'inbound', channel: 'whatsapp', timestamp: new Date(Date.now() - 10 * 60000), read: true },
    { id: 2, clientId: 1, content: 'Sí, tenemos varios modelos. Te envío opciones.', direction: 'outbound', channel: 'whatsapp', timestamp: new Date(Date.now() - 5 * 60000), read: true },
  ],
  '2': [
    { id: 3, clientId: 2, content: '¿Tienen kits de suspensión?', direction: 'inbound', channel: 'facebook', timestamp: new Date(Date.now() - 15 * 60000), read: true },
  ],
  '3': [
    { id: 4, clientId: 3, content: 'Gracias por la cotización', direction: 'inbound', channel: 'instagram', timestamp: new Date(Date.now() - 60 * 60000), read: true },
  ],
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<MessageChannel | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setMessages(mockMessages[selectedClient.id] || []);
    }
  }, [selectedClient]);

  const filteredClients = activeChannel
    ? Object.values(customers).filter(c => c.channel === activeChannel)
    : Object.values(customers);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    if (isMobile) setSidebarOpen(false);
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

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      nuevo: 'status-nuevo',
      en_progreso: 'status-progreso',
      respondido: 'status-respondido',
      perdido: 'status-perdido',
    };
    return colors[status] || 'status-nuevo';
  };

  const channelIcons: Record<MessageChannel, string> = {
    whatsapp: '💬',
    facebook: '📘',
    instagram: '📷',
    tiktok: '🎵',
  };

  return (
    <div style={styles.app} className={isMobile && sidebarOpen ? 'mobile-sidebar-open' : ''}>
      <style>{`
        :root {
          --bg: #0F1419;
          --bg-soft: #161B22;
          --card: #1C2128;
          --card-hover: #252B33;
          --border: #30363D;
          --border-soft: #21262D;
          --text: #E6EDF3;
          --text-mid: #8B949E;
          --text-light: #6E7681;
          --accent: #F0B429;
          --accent-dark: #C78E0B;
          --whatsapp: #25D366;
          --facebook: #1877F2;
          --instagram: #E4405F;
          --tiktok: #FF0050;
          --status-new: #3B82F6;
          --status-progress: #F59E0B;
          --status-responded: #10B981;
          --status-lost: #6B7280;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; overflow: hidden; }

        .app {
          display: grid;
          grid-template-columns: 260px 1fr;
          grid-template-rows: 60px 1fr;
          height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .app {
            grid-template-columns: 1fr;
            grid-template-rows: 60px 1fr;
          }
          .app.mobile-sidebar-open {
            grid-template-columns: 260px 1fr;
          }
          .sidebar {
            position: fixed;
            left: 0;
            top: 60px;
            height: calc(100vh - 60px);
            width: 260px;
            z-index: 40;
            transition: transform 0.3s ease;
            transform: translateX(-100%);
          }
          .app.mobile-sidebar-open .sidebar {
            transform: translateX(0);
          }
          .topbar { grid-column: 1; }
          .main { grid-column: 1; }
        }

        .topbar {
          grid-column: 1 / 3;
          background: var(--bg-soft);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .topbar {
            grid-column: 1;
            padding: 0 12px;
            gap: 12px;
          }
        }

        .menu-btn {
          display: none;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 6px;
          width: 34px;
          height: 34px;
          cursor: pointer;
          color: var(--text-mid);
          font-size: 14px;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .menu-btn { display: flex; }
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 15px;
          white-space: nowrap;
        }

        .brand-logo {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 900;
          font-size: 14px;
          flex-shrink: 0;
        }

        .search-wrap {
          flex: 1;
          max-width: 420px;
          position: relative;
        }

        @media (max-width: 768px) {
          .search-wrap { max-width: 100%; }
        }

        .search-input {
          width: 100%;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px 8px 34px;
          color: var(--text);
          font-size: 13px;
          outline: none;
        }

        .search-input:focus { border-color: var(--accent); }

        .sidebar {
          background: var(--bg-soft);
          border-right: 1px solid var(--border);
          padding: 16px 12px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-mid);
          cursor: pointer;
          margin-bottom: 4px;
          transition: all 0.15s;
        }

        .nav-item:hover { background: var(--card); color: var(--text); }

        .nav-item.active {
          background: var(--card);
          color: var(--text);
          font-weight: 600;
        }

        .main {
          display: grid;
          grid-template-columns: 380px 1fr;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .main {
            grid-template-columns: 1fr;
          }
        }

        .inbox-list {
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .inbox-list {
            border-right: none;
          }
        }

        .inbox-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid var(--border);
        }

        .inbox-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .inbox-subtitle { font-size: 12px; color: var(--text-mid); }

        .channel-tabs {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
        }

        .channel-tab {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          background: transparent;
          color: var(--text-mid);
          border: 1px solid transparent;
          white-space: nowrap;
          transition: all 0.15s;
        }

        .channel-tab:hover { background: var(--card); color: var(--text); }
        .channel-tab.active { background: var(--card); border-color: var(--border); color: var(--text); }

        .messages-list {
          flex: 1;
          overflow-y: auto;
        }

        .message-item {
          padding: 14px 20px;
          border-bottom: 1px solid var(--border-soft);
          cursor: pointer;
          transition: background 0.15s;
        }

        .message-item:hover { background: var(--bg-soft); }

        .message-item.selected {
          background: var(--card);
          border-left: 3px solid var(--accent);
          padding-left: 17px;
        }

        .msg-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }

        .msg-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .msg-name { font-weight: 600; font-size: 13px; }
        .msg-time { font-size: 11px; color: var(--text-light); margin-left: auto; }

        .msg-preview {
          font-size: 12px;
          color: var(--text-mid);
          margin-top: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .detail-panel {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .detail-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 14px;
        }

        @media (max-width: 768px) {
          .detail-header { padding: 16px; }
        }

        .detail-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .detail-name { font-size: 16px; font-weight: 700; }
        .detail-phone { font-size: 12px; color: var(--text-mid); }

        .status-nuevo { color: var(--status-new); }
        .status-progreso { color: var(--status-progress); }
        .status-respondido { color: var(--status-responded); }
        .status-perdido { color: var(--status-lost); }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .messages-area { padding: 16px; }
        }

        .msg-bubble-wrap {
          display: flex;
          gap: 8px;
          max-width: 75%;
        }

        .msg-bubble-wrap.outgoing {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        @media (max-width: 768px) {
          .msg-bubble-wrap { max-width: 90%; }
        }

        .msg-bubble {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          word-break: break-word;
        }

        .msg-bubble.incoming { background: var(--card); border: 1px solid var(--border-soft); }
        .msg-bubble.outgoing { background: var(--accent); color: #000; }

        .reply-box {
          padding: 14px 24px 20px;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 768px) {
          .reply-box { padding: 12px 16px 16px; }
        }

        .reply-wrap {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .reply-wrap:focus-within { border-color: var(--accent); }

        .reply-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text);
          font-size: 13px;
          outline: none;
          font-family: inherit;
          min-height: 36px;
          resize: none;
        }

        .send-btn {
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .send-btn:hover { opacity: 0.9; }

        .detail-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-light);
          flex-direction: column;
          gap: 12px;
        }

        .back-btn {
          display: none;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 6px;
          width: 34px;
          height: 34px;
          cursor: pointer;
          color: var(--text-mid);
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .back-btn { display: flex; }
        }
      `}</style>

      {/* TOPBAR */}
      <div style={styles.topbar}>
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen && isMobile ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="brand">
          <div className="brand-logo">AA</div>
          <div>
            <div>Auto Adornos RD</div>
            <div style={{ fontSize: '10px', color: 'var(--text-mid)', fontWeight: '500' }}>CRM</div>
          </div>
        </div>
        <div className="search-wrap">
          <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input type="text" className="search-input" placeholder="Search customers..." />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="nav-item active">
          <MessageCircle size={16} />
          Inbox
        </div>
        <div className="nav-item">
          <Phone size={16} />
          Calls
        </div>
      </div>

      {/* MAIN */}
      <div className="main" style={styles.main}>
        {/* INBOX LIST */}
        <div className="inbox-list">
          <div className="inbox-header">
            <div className="inbox-title">Inbox</div>
            <div className="inbox-subtitle">{filteredClients.length} customers</div>
          </div>

          <div className="channel-tabs">
            {['all', 'whatsapp', 'facebook', 'instagram', 'tiktok'].map(ch => (
              <button
                key={ch}
                className={`channel-tab ${!activeChannel && ch === 'all' || activeChannel === ch ? 'active' : ''}`}
                onClick={() => setActiveChannel(ch === 'all' ? null : (ch as MessageChannel))}
              >
                {ch === 'all' ? 'All' : channelIcons[ch as MessageChannel]}
              </button>
            ))}
          </div>

          <div className="messages-list">
            {filteredClients.map(client => (
              <div
                key={client.id}
                className={`message-item ${selectedClient?.id === client.id ? 'selected' : ''}`}
                onClick={() => handleSelectClient(client)}
              >
                <div className="msg-header">
                  <div className="msg-avatar">{getInitials(client.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="msg-name">{client.name}</div>
                  </div>
                  <div className="msg-time">{client.lastMessageTime?.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="msg-preview">{client.lastMessage}</div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`msg-tag ${getStatusColor(client.status)}`} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                    {client.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className="detail-panel">
          {selectedClient ? (
            <>
              <div className="detail-header">
                <button className="back-btn" onClick={() => setSelectedClient(null)}>
                  <ChevronLeft size={18} />
                </button>
                <div className="detail-avatar">{getInitials(selectedClient.name)}</div>
                <div style={{ flex: 1 }}>
                  <div className="detail-name">{selectedClient.name}</div>
                  <div className="detail-phone">{selectedClient.phone}</div>
                </div>
              </div>

              <div className="messages-area">
                {messages.map(msg => (
                  <div key={msg.id} className={`msg-bubble-wrap ${msg.direction === 'outbound' ? 'outgoing' : ''}`}>
                    <div className={`msg-bubble ${msg.direction === 'outbound' ? 'outgoing' : 'incoming'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="reply-box">
                <div className="reply-wrap">
                  <input
                    type="text"
                    className="reply-input"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                  />
                  <button className="send-btn" onClick={handleSendMessage}>
                    ➤
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="detail-empty">
              <div style={{ fontSize: '32px' }}>👈</div>
              <div>Select a customer to start</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gridTemplateRows: '60px 1fr',
    height: '100vh',
    background: '#0F1419',
    color: '#E6EDF3',
    fontSize: '14px',
  },
  topbar: {
    gridColumn: '1 / 3',
    background: '#161B22',
    borderBottom: '1px solid #30363D',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: '24px',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    overflow: 'hidden',
  },
};
