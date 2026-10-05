import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  User,
  LayoutGrid,
  List,
  Loader2,
  Lock,
  Sparkles,
  Send,
  Shield,
  X,
  PartyPopper,
  PhoneCall,
  Video,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/providers/AuthProvider';
import { scanContactShield, maskContactInfo } from '@/lib/contact-shield';

export function TrainerStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state for PRO gating, Internal Chat, and In-App Calls
  const [proModal, setProModal] = useState<{ show: boolean; feature: string } | null>(null);
  const [chatModal, setChatModal] = useState<{ show: boolean; student: any } | null>(null);
  const [callModal, setCallModal] = useState<{ show: boolean; mode: 'audio' | 'video'; student: any } | null>(null);
  const [chatSubject, setChatSubject] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [chatShieldError, setChatShieldError] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<{ show: boolean; message: string } | null>(null);

  const supabase = createClient();
  const { profile } = useAuth();
  const navigate = useNavigate();

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

  const openInternalChat = (student: any) => {
    setChatSubject(`Discussion regarding ${student.course || 'Training Requirements'}`);
    setChatMessage('');
    setChatShieldError(null);
    setChatModal({ show: true, student });
  };

  const handleSendInternalChat = async () => {
    if (!chatModal?.student || !chatMessage.trim()) return;

    // Enforce Contact Shield & Anti-Disintermediation Policy
    const shield = scanContactShield(chatMessage);
    if (!shield.isClean) {
      setChatShieldError(
        '⚠️ Action Blocked: Sharing personal phone numbers, emails, WhatsApp links, or external links is strictly prohibited. All communication must remain on Celoris to protect your 0% commission status.'
      );
      return;
    }
    setChatShieldError(null);

    const student = chatModal.student;
    setChatSending(true);

    try {
      const defaultSubject = chatSubject.trim() || `Course Discussion: ${student.course || 'Training Inquiry'}`;

      // 1. Insert message into inbox_messages (never store unmasked PII)
      await supabase.from('inbox_messages').insert({
        trainer_id: profile?.id,
        sender_name: student.name || 'Student Lead',
        sender_email: null,
        sender_phone: null,
        subject: defaultSubject,
        body: shield.sanitizedText,
        message_type: 'student_lead',
        status: 'sent',
      });

      // 2. Dispatch internal notification to student email safely from server
      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Internal Message Sent',
          trainerName: profile?.full_name || profile?.username || 'Celoris Trainer',
          trainerEmail: profile?.email || '',
          studentName: student.name || 'Student',
          studentEmail: student.email || (student.contact_info?.includes('@') ? student.contact_info : '') || '',
          studentPhone: student.phone || student.contact_info || '',
          course: student.course || 'General Training',
          leadId: student.id,
          messageText: chatMessage.trim(),
        }),
      });

      // 3. Mark status as contacted in leads table
      await supabase
        .from('leads')
        .update({ status: 'contacted' })
        .eq('id', student.id);

      // 4. Update local state
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, status: 'contacted' } : s)));

      setChatModal(null);
      setChatMessage('');
      setSuccessPopup({
        show: true,
        message: `Your message to ${student.name || 'Student'} was sent securely via Celoris.`,
      });
      setTimeout(() => setSuccessPopup(null), 4000);
    } catch (err) {
      console.error('Error sending internal chat:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setChatSending(false);
    }
  };

  const handleStartCall = (mode: 'audio' | 'video', student: any) => {
    if (!isProTrainer) {
      setProModal({
        show: true,
        feature: mode === 'audio' ? '1-on-1 Audio Calling via Celoris' : '1-on-1 Video Calling via Celoris',
      });
      return;
    }
    setCallModal({ show: true, mode, student });
  };

  const handleLaunchCallRoom = (roomUrl: string) => {
    window.open(roomUrl, '_blank');
  };

  const handleSendCallInvite = async (student: any, mode: 'audio' | 'video', roomUrl: string) => {
    setChatSending(true);
    try {
      const inviteText = `Hi ${student.name || 'there'}, your trainer has initiated a 1-on-1 live ${mode === 'audio' ? 'Audio' : 'Video'} Call session on Celoris! Please join the session here: ${window.location.origin}${roomUrl}`;

      // 1. Insert message
      await supabase.from('inbox_messages').insert({
        trainer_id: profile?.id,
        sender_name: student.name || 'Student Lead',
        sender_email: null,
        sender_phone: null,
        subject: `Live ${mode === 'audio' ? 'Audio' : 'Video'} Call Invitation`,
        body: inviteText,
        message_type: 'student_lead',
        status: 'sent',
      });

      // 2. Notify student
      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Internal Message Sent',
          trainerName: profile?.full_name || profile?.username || 'Celoris Trainer',
          trainerEmail: profile?.email || '',
          studentName: student.name || 'Student',
          studentEmail: student.email || (student.contact_info?.includes('@') ? student.contact_info : '') || '',
          studentPhone: student.phone || student.contact_info || '',
          course: student.course || 'Live Session',
          leadId: student.id,
          messageText: inviteText,
        }),
      });

      await supabase.from('leads').update({ status: 'contacted' }).eq('id', student.id);
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, status: 'contacted' } : s)));

      setCallModal(null);
      setSuccessPopup({
        show: true,
        message: `Call invite sent to ${student.name || 'Student'} via Celoris Chat!`,
      });
      setTimeout(() => setSuccessPopup(null), 4000);
    } catch (err) {
      console.error('Error sending call invite:', err);
      alert('Failed to send call invite.');
    } finally {
      setChatSending(false);
    }
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStudents(data || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();

    const channel = supabase
      .channel('public:leads:students')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          fetchStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (s.name || '').toLowerCase().includes(term) ||
      (s.course || '').toLowerCase().includes(term) ||
      (s.requirement || '').toLowerCase().includes(term);
    const matchesStatus =
      statusFilter === 'all' || (s.status || 'open').toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch ((status || 'open').toLowerCase()) {
      case 'open':
      case 'new':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'contacted':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'converted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8">
      {/* Celoris In-App Call Modal */}
      <AnimatePresence>
        {callModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-indigo-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                    callModal.mode === 'audio'
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
                  }`}>
                    {callModal.mode === 'audio' ? <PhoneCall className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      Celoris 1-on-1 {callModal.mode === 'audio' ? 'Audio' : 'Video'} Call
                    </h3>
                    <p className="text-xs text-gray-500">
                      With <strong className="text-gray-900">{callModal.student?.name || 'Student'}</strong>
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
                const roomUrl = `/classrooms?room=call-${callModal.student?.id || 'session'}&type=${callModal.mode}`;
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
                      disabled={chatSending}
                      onClick={() => handleSendCallInvite(callModal.student, callModal.mode, roomUrl)}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3 px-4 rounded-xl text-sm transition-colors border border-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {chatSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Send Call Link via Celoris Chat</span>
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRO Upgrade Modal */}
      <AnimatePresence>
        {proModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <button
                  onClick={() => setProModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3" /> PRO Feature
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2">
                Unlock {proModal.feature}
              </h3>

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Direct phone and email exchange is disabled across Celoris to maintain student safety. Upgrade to <strong>Celoris PRO Trainer</strong> to host live 1-on-1 Audio and Video Calls directly with your students on Celoris!
              </p>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 mb-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited 1-on-1 Audio Calls via Celoris Chat</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High-Definition 1-on-1 Video Calling & Screen Share</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified PRO Badge on Celoris Course Pages</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProModal(null);
                    navigate('/teach/pricing');
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Upgrade to PRO Trainer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internal Chat Modal */}
      <AnimatePresence>
        {chatModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 relative"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Celoris In-App Chat</h3>
                    <p className="text-xs text-gray-500">
                      Message to <strong className="text-emerald-700">{chatModal.student?.name || 'Student'}</strong> (stays within Celoris)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatModal(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    value={chatSubject}
                    onChange={(e) => setChatSubject(e.target.value)}
                    placeholder="Enter subject..."
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Hi! I saw your inquiry for our course. I'd be happy to guide you on syllabus, batch timings, and answers to any questions you have..."
                    className="w-full text-sm border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Your message is delivered directly through Celoris Chat. Personal phone numbers and emails remain strictly protected.</span>
                </div>

                {chatShieldError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{chatShieldError}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setChatModal(null)}
                  disabled={chatSending}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInternalChat}
                  disabled={chatSending || !chatMessage.trim()}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {chatSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send on Celoris Chat
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification Popup */}
      <AnimatePresence>
        {successPopup?.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Delivered on Celoris!</p>
              <p className="text-xs text-gray-500">{successPopup.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">
            Student enquiries and leads ({filteredStudents.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
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
              Student contact details are strictly shielded. You can connect with students via <strong className="text-emerald-700">Celoris Chat</strong> or host live 1-on-1 <strong className="text-indigo-700">Audio & Video Calls</strong> directly inside Celoris.
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-sm font-medium shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="font-medium">Loading students...</p>
        </div>
      )}

      {/* Table View */}
      {!loading && viewMode === 'table' && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Student Info</th>
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Course Interest</th>
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Status</th>
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Enquired</th>
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest text-right">In-App Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="font-medium">No students found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center font-bold text-emerald-700 shadow-sm border border-emerald-200">
                            {(student.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                {student.name || 'Anonymous'}
                              </p>
                              {student.source === 'website_learn_page' && (
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Learn Page
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-800 text-sm">
                          {student.course || 'General Inquiry'}
                        </p>
                        {student.requirement && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{maskContactInfo(student.requirement)}</p>
                        )}
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit inline-block ${getStatusStyle(student.status)}`}>
                          {student.status || 'open'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock size={12} />
                          <span className="text-[11px] font-bold">
                            {student.created_at
                              ? formatDistanceToNow(new Date(student.created_at), { addSuffix: true })
                              : 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Safe Internal Celoris Messaging */}
                          <button
                            onClick={() => openInternalChat(student)}
                            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                            title="Send Message via Celoris Chat"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Celoris Chat</span>
                          </button>

                          {/* 2. Audio Call via Celoris */}
                          <button
                            onClick={() => handleStartCall('audio', student)}
                            className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              isProTrainer
                                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                : 'bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-700 border border-gray-200'
                            }`}
                            title={isProTrainer ? "Start Celoris Audio Call" : "Audio Call (PRO Feature)"}
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Audio</span>
                            {!isProTrainer && (
                              <span className="text-[8px] bg-amber-200 text-amber-900 font-extrabold px-1 rounded">
                                PRO
                              </span>
                            )}
                          </button>

                          {/* 3. Video Call via Celoris */}
                          <button
                            onClick={() => handleStartCall('video', student)}
                            className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              isProTrainer
                                ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-700 border border-gray-200'
                            }`}
                            title={isProTrainer ? "Start Celoris Video Call" : "Video Call (PRO Feature)"}
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Video</span>
                            {!isProTrainer && (
                              <span className="text-[8px] bg-amber-200 text-amber-900 font-extrabold px-1 rounded">
                                PRO
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-3 py-20 text-center text-gray-400">
              <User className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">No students found</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-emerald-200/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between mb-6 relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
                    {(student.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(student.status)}`}>
                    {student.status || 'open'}
                  </div>
                </div>
                <div className="mb-4 relative">
                  <h3 className="font-black text-lg text-gray-900 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                    {student.name || 'Anonymous'}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {student.course || 'General Inquiry'}
                  </p>
                </div>
                <div className="space-y-2 mb-6">
                  {student.requirement && (
                    <p className="text-xs text-gray-400 italic line-clamp-2 pt-1">{maskContactInfo(student.requirement)}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 relative text-xs text-gray-400 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="shrink-0" />
                    <span className="text-[11px] font-medium">
                      {student.created_at
                        ? formatDistanceToNow(new Date(student.created_at), { addSuffix: true })
                        : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openInternalChat(student)}
                      className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                      title="Celoris Chat"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => handleStartCall('audio', student)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      title="Audio Call via Celoris"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartCall('video', student)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      title="Video Call via Celoris"
                    >
                      <Video className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
