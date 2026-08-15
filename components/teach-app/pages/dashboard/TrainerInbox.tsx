import { useState, useEffect } from 'react';
import {
  Mail, MessageSquare, Search, Loader2, RefreshCw, ChevronRight,
  X, Send, Trash2, Archive, Plus, CheckCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/components/providers/AuthProvider';

export function TrainerInbox() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ sender_name: '', sender_email: '', sender_phone: '', subject: '', body: '', message_type: 'student' });
  const [composeSaving, setComposeSaving] = useState(false);

  const supabase = createClient();
  const { profile } = useAuth();

  const fetchMessages = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inbox_messages')
        .select('*')
        .eq('trainer_id', profile.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Inbox fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + real-time subscription
  useEffect(() => {
    if (!profile?.id) return;
    fetchMessages();

    const channel = supabase
      .channel('inbox-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inbox_messages', filter: `trainer_id=eq.${profile.id}` },
        () => fetchMessages()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile?.id]);

  // Mark a message as read in DB
  const markRead = async (id: string) => {
    await supabase
      .from('inbox_messages')
      .update({ status: 'read', updated_at: new Date().toISOString() })
      .eq('id', id);
  };

  // Mark as replied
  const markReplied = async (id: string) => {
    await supabase
      .from('inbox_messages')
      .update({ status: 'replied', updated_at: new Date().toISOString() })
      .eq('id', id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: 'replied' } : m));
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status: 'replied' }));
  };

  // Archive
  const archiveMessage = async (id: string) => {
    await supabase
      .from('inbox_messages')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: 'archived' } : m));
    if (selected?.id === id) setSelected(null);
  };

  // Delete
  const deleteMessage = async (id: string) => {
    await supabase.from('inbox_messages').delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleOpen = (msg: any) => {
    setSelected(msg);
    setReplyText('');
    if (msg.status === 'unread') {
      markRead(msg.id);
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: 'read' } : m));
    }
  };

  const handleReplyWhatsApp = async () => {
    if (!selected?.sender_phone) return;
    const text = replyText || `Hi ${selected.sender_name}, thank you for your message!`;
    window.open(`https://wa.me/${selected.sender_phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
    await markReplied(selected.id);
  };

  const handleReplyEmail = async () => {
    if (!selected?.sender_email) return;
    const subject = encodeURIComponent(`Re: ${selected.subject}`);
    const body = encodeURIComponent(replyText || `Hi ${selected.sender_name},\n\n`);
    window.open(`mailto:${selected.sender_email}?subject=${subject}&body=${body}`);
    await markReplied(selected.id);
  };

  // Compose new message (manual entry / test)
  const handleComposeSave = async () => {
    if (!compose.sender_name || !compose.subject || !profile?.id) return;
    setComposeSaving(true);
    try {
      await supabase.from('inbox_messages').insert({
        trainer_id: profile.id,
        sender_name: compose.sender_name,
        sender_email: compose.sender_email || null,
        sender_phone: compose.sender_phone || null,
        subject: compose.subject,
        body: compose.body || null,
        message_type: compose.message_type,
        status: 'unread',
      });
      setShowCompose(false);
      setCompose({ sender_name: '', sender_email: '', sender_phone: '', subject: '', body: '', message_type: 'student' });
    } catch (err) {
      console.error('Compose error:', err);
    } finally {
      setComposeSaving(false);
    }
  };

  const filtered = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (m.sender_name || '').toLowerCase().includes(term) ||
      (m.subject || '').toLowerCase().includes(term) ||
      (m.body || '').toLowerCase().includes(term) ||
      (m.sender_email || '').toLowerCase().includes(term);

    if (activeTab === 'unread') return matchSearch && m.status === 'unread';
    if (activeTab === 'replied') return matchSearch && m.status === 'replied';
    if (activeTab === 'archived') return matchSearch && m.status === 'archived';
    return matchSearch && m.status !== 'archived';
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':  return <Mail className="h-5 w-5" />;
      case 'enquiry': return <MessageSquare className="h-5 w-5" />;
      default:        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':  return 'bg-gray-100 text-gray-500';
      case 'enquiry': return 'bg-blue-100 text-blue-600';
      default:        return 'bg-emerald-100 text-emerald-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'replied':  return <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Replied</span>;
      case 'read':     return null;
      case 'unread':   return <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />;
      default:         return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-500 text-sm mt-1">
            Your student messages and communications — {messages.length} total
            {unreadCount > 0 && (
              <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-full md:w-60"
            />
          </div>
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: 'all',      label: 'All Messages' },
          { key: 'unread',   label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
          { key: 'replied',  label: 'Replied' },
          { key: 'archived', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
          <span className="font-medium">Loading inbox...</span>
        </div>
      )}

      {/* Message List */}
      {!loading && (
        filtered.length === 0 ? (
          <div className="text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-16">
            <Mail className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {searchTerm ? 'No results found' : 'No messages yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {searchTerm ? 'Try a different search term.' : 'Messages from students will appear here.'}
            </p>

          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {filtered.map((msg, idx) => (
              <div
                key={msg.id}
                onClick={() => handleOpen(msg)}
                className={`p-5 flex items-start gap-4 cursor-pointer transition-colors ${
                  idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''
                } ${msg.status === 'unread' ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-gray-50'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getTypeColor(msg.message_type)}`}>
                  {getTypeIcon(msg.message_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 gap-2">
                    <h3 className={`text-sm truncate ${msg.status === 'unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {msg.sender_name}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">
                        {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : ''}
                      </span>
                      {getStatusBadge(msg.status)}
                    </div>
                  </div>
                  <p className={`text-sm truncate mb-0.5 ${msg.status === 'unread' ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {msg.subject}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {msg.body || 'No message body'}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-3" />
              </div>
            ))}
          </div>
        )
      )}

      {/* — Detail Drawer — */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            style={{ animation: 'slideIn 0.22s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getTypeColor(selected.message_type)}`}>
                  {getTypeIcon(selected.message_type)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{selected.sender_name}</p>
                  <p className="text-xs text-gray-400">
                    {selected.created_at ? formatDistanceToNow(new Date(selected.created_at), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => archiveMessage(selected.id)}
                  title="Archive"
                  className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteMessage(selected.id)}
                  title="Delete"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button onClick={() => setSelected(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Subject</p>
                  <p className="text-sm font-semibold text-gray-800">{selected.subject}</p>
                </div>
                {selected.body && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Message</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
                  </div>
                )}
                {selected.sender_email && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</p>
                    <p className="text-sm text-emerald-600 font-medium">{selected.sender_email}</p>
                  </div>
                )}
                {selected.sender_phone && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                    <p className="text-sm text-gray-700">{selected.sender_phone}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selected.status === 'replied' ? 'bg-blue-100 text-blue-600' :
                    selected.status === 'unread' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{selected.status}</span>
                </div>
              </div>

              {/* Reply composer */}
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Quick Reply</p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder={`Hi ${selected.sender_name?.split(' ')[0] || 'there'}, thank you for your message...`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-gray-100 space-y-2">
              {selected.status !== 'replied' && (
                <button
                  onClick={() => markReplied(selected.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <CheckCircle className="h-4 w-4" /> Mark as Replied
                </button>
              )}
              {selected.sender_phone && (
                <button
                  onClick={handleReplyWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl text-sm font-bold transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Reply on WhatsApp
                </button>
              )}
              {selected.sender_email && (
                <button
                  onClick={handleReplyEmail}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-sm font-bold transition-colors"
                >
                  <Send className="h-4 w-4" /> Reply via Email
                </button>
              )}
              {!selected.sender_email && !selected.sender_phone && (
                <p className="text-center text-sm text-gray-400 py-2">No contact details available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* — Compose Modal — */}
      {showCompose && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowCompose(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            style={{ animation: 'popIn 0.25s cubic-bezier(0.175,0.885,0.32,1.275)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`@keyframes popIn{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">New Message</h3>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Name *</label>
                  <input
                    type="text"
                    placeholder="Student name"
                    value={compose.sender_name}
                    onChange={(e) => setCompose((p) => ({ ...p, sender_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Type</label>
                  <select
                    value={compose.message_type}
                    onChange={(e) => setCompose((p) => ({ ...p, message_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="student">Student</option>
                    <option value="enquiry">Enquiry</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  placeholder="student@email.com"
                  value={compose.sender_email}
                  onChange={(e) => setCompose((p) => ({ ...p, sender_email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={compose.sender_phone}
                  onChange={(e) => setCompose((p) => ({ ...p, sender_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Query about Excel Course"
                  value={compose.subject}
                  onChange={(e) => setCompose((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Message</label>
                <textarea
                  rows={3}
                  placeholder="Message body..."
                  value={compose.body}
                  onChange={(e) => setCompose((p) => ({ ...p, body: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCompose(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleComposeSave}
                disabled={composeSaving || !compose.sender_name || !compose.subject}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {composeSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
