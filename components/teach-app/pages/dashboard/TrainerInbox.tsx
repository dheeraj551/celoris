import { useState, useEffect } from 'react';
import {
  Mail, MessageSquare, Search, Loader2, RefreshCw, ChevronRight,
  X, Send, Trash2, Archive, Plus, CheckCircle, Lock, Sparkles, Shield,
  PhoneCall, Video, Radio, ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/components/providers/AuthProvider';
import { scanContactShield, maskContactInfo } from '@/lib/contact-shield';

export function TrainerInbox() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [shieldError, setShieldError] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [proModal, setProModal] = useState<{ show: boolean; feature: string } | null>(null);
  const [callModal, setCallModal] = useState<{ show: boolean; mode: 'audio' | 'video'; message: any } | null>(null);
  const [compose, setCompose] = useState({ sender_name: '', sender_email: '', sender_phone: '', subject: '', body: '', message_type: 'student' });
  const [composeSaving, setComposeSaving] = useState(false);

  const supabase = createClient();
  const { profile } = useAuth();

  // PRO Status check: checks subscription_status, is_pro, plan, admin roles
  const isProTrainer = Boolean(
    profile?.subscription_status === 'premium' ||
    profile?.subscription_status === 'enterprise' ||
    profile?.is_pro === true ||
    profile?.is_premium === true ||
    profile?.plan === 'pro' ||
    profile?.role === 'admin' ||
    profile?.role === 'superadmin' ||
    profile?.is_trainer_pro === true
  );

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

  const handleStartCall = (mode: 'audio' | 'video', msg: any) => {
    if (!isProTrainer) {
      setProModal({
        show: true,
        feature: mode === 'audio' ? '1-on-1 Audio Calling via Celoris' : '1-on-1 Video Calling via Celoris',
      });
      return;
    }
    setCallModal({ show: true, mode, message: msg });
  };

  const handleLaunchCallRoom = (roomUrl: string) => {
    window.open(roomUrl, '_blank');
  };

  const handleSendCallInvite = async (msg: any, mode: 'audio' | 'video', roomUrl: string) => {
    setReplySending(true);
    try {
      const inviteText = `Hi ${msg.sender_name || 'there'}, your trainer has initiated a 1-on-1 live ${mode === 'audio' ? 'Audio' : 'Video'} Call session on Celoris! Please join the session here: ${window.location.origin}${roomUrl}`;

      await supabase.from('inbox_messages').insert({
        trainer_id: profile?.id,
        sender_name: msg.sender_name || 'Student',
        sender_email: msg.sender_email || null,
        sender_phone: null,
        subject: `Live ${mode === 'audio' ? 'Audio' : 'Video'} Call Invitation`,
        body: inviteText,
        message_type: 'trainer_reply',
        status: 'replied',
      });

      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Internal Message Sent',
          trainerName: profile?.full_name || profile?.username || 'Celoris Trainer',
          trainerEmail: profile?.email || '',
          studentName: msg.sender_name || 'Student',
          studentEmail: msg.sender_email || '',
          studentPhone: msg.sender_phone || '',
          course: msg.subject || 'Live Session',
          messageText: inviteText,
        }),
      });

      await markReplied(msg.id);
      setCallModal(null);
    } catch (err: any) {
      console.error('Error sending call invite:', err);
    } finally {
      setReplySending(false);
    }
  };

  const handleInternalReply = async () => {
    if (!replyText.trim() || !selected || !profile?.id) return;
    
    // Enforce Contact Shield & Anti-Disintermediation Policy
    const shield = scanContactShield(replyText);
    if (!shield.isClean) {
      setShieldError(
        '⚠️ Action Blocked: Sharing personal phone numbers, WhatsApp, emails, or off-platform links violates Celoris community policy. All sessions must remain inside Celoris to maintain your 0% commission status.'
      );
      return;
    }
    setShieldError(null);
    setReplySending(true);
    try {
      // 1. Insert reply record into inbox_messages with shielded contacts
      await supabase.from('inbox_messages').insert({
        trainer_id: profile.id,
        sender_name: selected.sender_name,
        sender_email: selected.sender_email || null,
        sender_phone: null,
        subject: `Re: ${selected.subject}`,
        body: shield.sanitizedText,
        message_type: 'trainer_reply',
        status: 'replied',
      });

      // 2. Dispatch internal notification to student email
      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Internal Message Sent',
          trainerName: profile?.full_name || profile?.username || 'Celoris Trainer',
          trainerEmail: profile?.email || '',
          studentName: selected.sender_name || 'Student',
          studentEmail: selected.sender_email || '',
          studentPhone: selected.sender_phone || '',
          course: selected.subject || 'Course Training',
          messageText: replyText.trim(),
        }),
      });

      await markReplied(selected.id);
      setReplyText('');
    } catch (err) {
      console.error('Error sending internal reply:', err);
    } finally {
      setReplySending(false);
    }
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
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-full md:w-60 bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
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

      {/* Student Contact Protection Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>Platform Safety: In-App Communication Only</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-200">
                100% Protected
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              Student contact details are strictly shielded. You can connect with students via <strong className="text-emerald-700">Internal Celoris Reply</strong> or host live 1-on-1 <strong className="text-indigo-700">Audio & Video Calls</strong> directly inside Celoris.
            </p>
          </div>
        </div>
        {!isProTrainer && (
          <button
            onClick={() => setProModal({ show: true, feature: '1-on-1 Audio & Video Calling' })}
            className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> Unlock PRO Audio/Video Calls
          </button>
        )}
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
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{maskContactInfo(selected.body)}</p>
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
                <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Quick Reply</p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder={`Hi ${selected.sender_name?.split(' ')[0] || 'there'}, thank you for your message...`}
                  className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none font-normal shadow-sm"
                />
                <div className="mt-2.5 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>How the student receives this reply:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-900/90 pl-5">
                    Dispatched directly to the student's email inbox with your response and a 1-click button to reply back into your Celoris Trainer Inbox.
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-gray-100 space-y-2">
              {shieldError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{shieldError}</span>
                </div>
              )}

              {/* Celoris Internal Reply Button (Available to all trainers) */}
              <button
                onClick={handleInternalReply}
                disabled={replySending || !replyText.trim()}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {replySending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Internal Celoris Reply
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleStartCall('audio', selected)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                    isProTrainer
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Audio Call</span>
                  {!isProTrainer && <Lock className="w-3 h-3 text-amber-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleStartCall('video', selected)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                    isProTrainer
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Call</span>
                  {!isProTrainer && <Lock className="w-3 h-3 text-amber-500" />}
                </button>
              </div>

              {selected.status !== 'replied' && (
                <button
                  onClick={() => markReplied(selected.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-xl text-xs font-semibold transition-colors border border-gray-200"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Mark as Replied
                </button>
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
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Name *</label>
                  <input
                    type="text"
                    placeholder="Student name"
                    value={compose.sender_name}
                    onChange={(e) => setCompose((p) => ({ ...p, sender_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Type</label>
                  <select
                    value={compose.message_type}
                    onChange={(e) => setCompose((p) => ({ ...p, message_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="student">Student</option>
                    <option value="enquiry">Enquiry</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Query about Excel Course"
                  value={compose.subject}
                  onChange={(e) => setCompose((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Message</label>
                <textarea
                  rows={3}
                  placeholder="Message body..."
                  value={compose.body}
                  onChange={(e) => setCompose((p) => ({ ...p, body: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
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

      {/* 1-on-1 Call Room Modal for PRO Trainers */}
      {callModal?.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}
          onClick={() => !replySending && setCallModal(null)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-w-md w-full border border-indigo-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  {callModal.mode === 'audio' ? <PhoneCall className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Live 1-on-1 {callModal.mode === 'audio' ? 'Audio' : 'Video'} Call
                  </h3>
                  <p className="text-xs text-gray-500">
                    With <strong className="text-gray-900">{callModal.message?.sender_name || 'Student'}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCallModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mb-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>100% In-App Calling (No Phone Numbers Shared)</span>
              </div>
              <p className="text-xs text-indigo-900/80 leading-relaxed">
                Calls take place inside Celoris live rooms. Both parties stay strictly protected without revealing personal phone numbers or private email addresses.
              </p>
            </div>

            {(() => {
              const roomUrl = `/classrooms?room=call-${callModal.message?.id || 'session'}&type=${callModal.mode}`;
              return (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleLaunchCallRoom(roomUrl)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4 animate-pulse text-indigo-200" />
                    <span>Launch Call Room Now</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  <button
                    type="button"
                    disabled={replySending}
                    onClick={() => handleSendCallInvite(callModal.message, callModal.mode, roomUrl)}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3 px-4 rounded-xl text-sm transition-colors border border-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {replySending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Send Call Link via Celoris Chat</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* PRO Modal */}
      {proModal?.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}
          onClick={() => setProModal(null)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl p-7 max-w-md w-full border border-amber-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-100/70 rounded-full blur-2xl" />

            <button
              onClick={() => setProModal(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-white mb-5 shadow-lg shadow-amber-500/25">
              <Sparkles className="h-7 w-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-3">
              <Lock className="w-3.5 h-3.5" /> PRO Feature
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Unlock 1-on-1 Audio & Video Calls
            </h2>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              Conduct instant 1-on-1 live <strong className="text-gray-900">Audio and Video Calls</strong> with students directly within Celoris rooms.
            </p>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">100% In-App Safety</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Student contacts remain private. You can chat freely or initiate live calling sessions without exposing phone numbers or email addresses!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setProModal(null)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20"
              >
                Continue with Celoris Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
