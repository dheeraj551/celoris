import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Mail, Phone, Calendar, MoreVertical, CheckCircle, XCircle, Clock, RefreshCw, Loader2, ChevronLeft, ChevronRight, ClipboardCheck, X, PartyPopper, MessageSquare, Lock, Sparkles, Send, Shield, AlertCircle, PhoneCall, Video, Radio, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { scanContactShield, maskContactInfo } from '@/lib/contact-shield';
import { StudentAvatar } from '@/components/teach-app/StudentAvatar';

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const tableContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};


export function TrainerEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  // Success popup state
  const [successPopup, setSuccessPopup] = useState<{ show: boolean; action: string; studentName: string; detail?: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // leadId of loading action

  // Modals state for PRO gating, Internal Chat, and In-App Calls
  const [proModal, setProModal] = useState<{ show: boolean; feature: string; enquiry?: any } | null>(null);
  const [chatModal, setChatModal] = useState<{ show: boolean; enquiry: any } | null>(null);
  const [callModal, setCallModal] = useState<{ show: boolean; mode: 'audio' | 'video'; enquiry: any } | null>(null);
  const [chatSubject, setChatSubject] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [chatShieldError, setChatShieldError] = useState<string | null>(null);

  const supabase = createClient();
  const { profile } = useAuth();
  const { toast } = useToast();
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

  const openInternalChat = (enquiry: any) => {
    setChatSubject('');
    setChatMessage('');
    setChatShieldError(null);
    setChatModal({ show: true, enquiry });
  };

  const handleSendInternalChat = async () => {
    if (!chatModal?.enquiry || !chatMessage.trim()) return;

    // Enforce Contact Shield & Anti-Disintermediation Policy
    const shield = scanContactShield(chatMessage);
    if (!shield.isClean) {
      setChatShieldError(
        '⚠️ Action Blocked: Sharing personal phone numbers, emails, WhatsApp links, or external links is strictly prohibited. All communication must remain on Celoris to protect your 0% commission status.'
      );
      return;
    }
    setChatShieldError(null);

    const enquiry = chatModal.enquiry;
    setChatSending(true);

    try {
      const defaultSubject = chatSubject.trim() || `Discussion regarding ${enquiry.course || 'Training Requirements'}`;
      
      // 1. Insert message into inbox_messages (never store raw PII)
      await supabase.from('inbox_messages').insert({
        trainer_id: profile?.id,
        sender_name: enquiry.name || 'Student Lead',
        sender_email: enquiry.email || (enquiry.contact_info?.includes('@') ? enquiry.contact_info : null),
        sender_phone: null,
        subject: defaultSubject,
        body: shield.sanitizedText,
        message_type: 'student_lead',
        status: 'sent',
      });

      // 2. Dispatch internal notification to notify student and admin
      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Internal Message Sent',
          trainerName: profile?.full_name || profile?.username || 'Celoris Trainer',
          trainerEmail: profile?.email || '',
          studentName: enquiry.name || 'Student',
          studentEmail: enquiry.email || (enquiry.contact_info?.includes('@') ? enquiry.contact_info : '') || '',
          studentPhone: enquiry.phone || enquiry.contact_info || '',
          course: enquiry.course || 'General Training',
          leadId: enquiry.id,
          messageText: chatMessage.trim(),
        }),
      });

      // 3. Mark status as contacted in leads table
      await supabase
        .from('leads')
        .update({ status: 'contacted' })
        .eq('id', enquiry.id);

      // 4. Update local state
      setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, status: 'contacted' } : e));

      // Close modal and show celebration
      setChatModal(null);
      setChatMessage('');
      setSuccessPopup({
        show: true,
        action: 'Internal Message Sent',
        studentName: enquiry.name || 'Student',
        detail: "✉️ Message delivered to student's email inbox! When they reply, it lands directly in your Celoris Inbox.",
      });
      setTimeout(() => setSuccessPopup(null), 4000);
    } catch (err: any) {
      console.error('Failed to send internal chat message:', err);
      toast({
        title: 'Error sending message',
        description: err.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setChatSending(false);
    }
  };

  const handleStartCall = (mode: 'audio' | 'video', enquiry: any) => {
    if (!isProTrainer) {
      setProModal({
        show: true,
        feature: mode === 'audio' ? '1-on-1 Audio Calling via Celoris' : '1-on-1 Video Calling via Celoris',
      });
      return;
    }
    setCallModal({ show: true, mode, enquiry });
  };

  const handleLaunchCallRoom = (roomUrl: string) => {
    window.open(roomUrl, '_blank');
  };

  const handleSendCallInvite = async (enquiry: any, mode: 'audio' | 'video', roomUrl: string) => {
    setChatSending(true);
    try {
      const inviteText = `Hi ${enquiry.name || 'there'}, your trainer has initiated a 1-on-1 live ${mode === 'audio' ? 'Audio' : 'Video'} Call session on Celoris! Please join the session here: ${window.location.origin}${roomUrl}`;

      await supabase.from('inbox_messages').insert({
        trainer_id: profile?.id,
        sender_name: enquiry.name || 'Student Lead',
        sender_email: enquiry.email || (enquiry.contact_info?.includes('@') ? enquiry.contact_info : null),
        sender_phone: null,
        subject: `Live ${mode === 'audio' ? 'Audio' : 'Video'} Call Invitation`,
        body: inviteText,
        message_type: 'student_lead',
        status: 'sent',
      });

      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Internal Message Sent',
          trainerName: profile?.full_name || profile?.username || 'Celoris Trainer',
          trainerEmail: profile?.email || '',
          studentName: enquiry.name || 'Student',
          studentEmail: enquiry.email || (enquiry.contact_info?.includes('@') ? enquiry.contact_info : '') || '',
          studentPhone: enquiry.phone || enquiry.contact_info || '',
          course: enquiry.course || 'Live Session',
          leadId: enquiry.id,
          messageText: inviteText,
        }),
      });

      await supabase.from('leads').update({ status: 'contacted' }).eq('id', enquiry.id);
      setEnquiries((prev) => prev.map((e) => (e.id === enquiry.id ? { ...e, status: 'contacted' } : e)));

      setCallModal(null);
      setSuccessPopup({
        show: true,
        action: 'Call Invite Sent',
        studentName: enquiry.name || 'Student',
      });
      setTimeout(() => setSuccessPopup(null), 4000);
    } catch (err: any) {
      console.error('Error sending call invite:', err);
      toast({
        title: 'Error sending call invite',
        description: err.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setChatSending(false);
    }
  };

  const fetchLeads = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setEnquiries(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage);

    // Subscribe to realtime lead updates so student requests appear immediately
    const channel = supabase
      .channel('public:leads:enquiries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          fetchLeads(currentPage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'new':
        return 'bg-emerald-100 text-emerald-700';
      case 'contacted':
        return 'bg-amber-100 text-amber-700';
      case 'converted':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAction = async (actionName: string, enquiry: any) => {
    const studentName = enquiry.name || 'Anonymous';
    const course = enquiry.course || 'General Inquiry';

    setActionLoading(enquiry.id);
    try {
      if (actionName === 'Mark Contacted') {
        const { error: updateError } = await supabase
          .from('leads')
          .update({ status: 'contacted' })
          .eq('id', enquiry.id);
        
        if (updateError) throw updateError;
        
        // Update local state to reflect the change immediately
        setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, status: 'contacted' } : e));

        // Create message in inbox_messages so student sees it immediately in Student Mailbox
        const targetStudentEmail = enquiry.email || (enquiry.contact_info?.includes('@') ? enquiry.contact_info : null);
        if (targetStudentEmail) {
          const trainerDisplayName = profile?.full_name || profile?.username || 'Celoris Verified Trainer';
          await supabase.from('inbox_messages').insert({
            trainer_id: profile?.id || null,
            sender_name: trainerDisplayName,
            sender_email: targetStudentEmail,
            sender_phone: null,
            subject: `Inquiry: ${course}`,
            body: `Hi ${studentName}! I have reviewed your learning goals for ${course} and accepted your inquiry. Please reply here with your preferred class timings or any questions about the syllabus!`,
            message_type: 'student_lead',
            status: 'sent',
          });
        }
      }

      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionName,
          trainerId: profile?.id || '',
          trainerName: profile?.full_name || profile?.username || 'Trainer',
          trainerEmail: profile?.email || '',
          studentName,
          studentEmail: enquiry.email || (enquiry.contact_info?.includes('@') ? enquiry.contact_info : '') || '',
          studentPhone: enquiry.phone || enquiry.contact_info || '',
          course,
          leadId: enquiry.id,
        }),
      });
    } catch (err) {
      console.error('Notification failed:', err);
    } finally {
      setActionLoading(null);
    }

    // Show success popup regardless of notification result
    setSuccessPopup({ show: true, action: actionName, studentName });
    setTimeout(() => setSuccessPopup(null), 4000);
  };

  return (
    <div className="p-8 relative">
      {/* Success Popup */}
      <AnimatePresence>
        {successPopup?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <button
                onClick={() => setSuccessPopup(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Action Applied!</h2>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-semibold text-emerald-600">{successPopup.action}</span> was successfully applied
              </p>
              <p className="text-gray-700 font-medium mb-5">for <span className="text-gray-900">{successPopup.studentName}</span></p>
              <div className="bg-emerald-50 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium leading-relaxed">
                {successPopup.detail || (successPopup.action === 'Internal Message Sent'
                  ? '✉️ Message delivered to student’s email! Replies route directly back to your Celoris Inbox.'
                  : '✉️ Our support team and systems have been notified')}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PRO Feature Upgrade Modal */}
        {proModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}
            onClick={() => setProModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl shadow-2xl p-7 max-w-md w-full border border-amber-100 overflow-hidden"
            >
              {/* Background amber glow */}
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
                <Lock className="w-3.5 h-3.5" /> PRO Trainer Feature
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Unlock {proModal.feature}
              </h2>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                Direct phone and email exchange is disabled across Celoris to maintain student safety. Upgrade to <strong className="text-gray-900">Celoris PRO Trainer</strong> to host live 1-on-1 Audio and Video Calls directly with your students on Celoris!
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

              <div className="space-y-2.5">
                {proModal.enquiry && (
                  <button
                    onClick={() => {
                      const enq = proModal.enquiry;
                      setProModal(null);
                      openInternalChat(enq);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <MessageSquare className="h-4 w-4" /> Message via Celoris Chat (Free)
                  </button>
                )}

                <button
                  onClick={() => {
                    setProModal(null);
                    navigate('/teach/pricing');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="h-4 w-4" /> Upgrade to Pro Trainer
                </button>

                <button
                  onClick={() => setProModal(null)}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 font-medium py-1.5 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Celoris In-App Call Modal */}
        {callModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
            onClick={() => setCallModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
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
                      With <strong className="text-gray-900">{callModal.enquiry?.name || 'Student'}</strong>
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
                const roomUrl = `/classrooms?room=call-${callModal.enquiry?.id || 'session'}&type=${callModal.mode}`;
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
                      onClick={() => handleSendCallInvite(callModal.enquiry, callModal.mode, roomUrl)}
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

        {/* Celoris Internal Chat Modal */}
        {chatModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}
            onClick={() => !chatSending && setChatModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-w-lg w-full border border-emerald-100"
            >
              <button
                onClick={() => setChatModal(null)}
                disabled={chatSending}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <StudentAvatar
                  student={chatModal.enquiry}
                  size="lg"
                  shape="rounded-2xl"
                  showStatusIndicator
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{chatModal.enquiry?.name || 'Student Lead'}</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      Celoris Chat
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Interest: <span className="text-emerald-700 font-semibold">{chatModal.enquiry?.course || 'General Training'}</span>
                  </p>
                </div>
              </div>

              {/* Delivery destination explainer */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-50/20 border border-emerald-200/90 rounded-2xl p-3.5 mb-4 text-xs shadow-sm">
                <div className="flex items-center gap-2 font-bold text-emerald-950 mb-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Where does the student receive this message?</span>
                </div>
                <div className="space-y-1.5 text-emerald-900/90 leading-relaxed pl-1 text-[11px] sm:text-xs">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700 shrink-0">1.</span>
                    <span><strong>Direct Email Inbox:</strong> Delivered immediately to the student's email inbox ({chatModal.enquiry?.email ? maskContactInfo(chatModal.enquiry.email) : 'their registered inquiry email'}) with your trainer profile, course subject, and message.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700 shrink-0">2.</span>
                    <span><strong>1-Click Reply:</strong> The email has a secure <em>"Connect on Celoris Teach"</em> button. When the student replies, their message lands directly in your <strong>Celoris Trainer Inbox</strong>.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700 shrink-0">3.</span>
                    <span><strong>Contact Privacy Shield:</strong> Personal phone numbers and private email addresses are never exposed to leads, keeping your account 100% compliant.</span>
                  </div>
                </div>
              </div>

              {/* Quick Template Chips */}
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Quick Templates</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    `Hi! I saw your requirement for ${chatModal.enquiry?.course || 'the course'}. I'd love to schedule a free demo session.`,
                    `Hello! I offer weekend & evening batches with 1-on-1 practical mentorship. Let me know what timing suits you best.`,
                    `Hi! I can customize a complete learning curriculum based on your career goals. Let's discuss your timeline!`
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChatMessage(tmpl)}
                      className="text-left text-xs bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 rounded-lg px-2.5 py-1.5 transition-colors line-clamp-1 max-w-full font-medium"
                    >
                      💡 {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    value={chatSubject}
                    onChange={(e) => setChatSubject(e.target.value)}
                    placeholder={`e.g. Discussion regarding ${chatModal.enquiry?.course || 'Training Requirements'}`}
                    className="w-full px-3.5 py-2 text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-normal shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Write a message to the student (e.g. details about your experience, course outline, demo availability)..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-normal shadow-sm"
                  />
                </div>
              </div>

              {chatShieldError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{chatShieldError}</span>
                </div>
              )}

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
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500 mt-1">Manage your student leads and follow-ups ({totalCount} total)</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => fetchLeads(currentPage)}
            disabled={loading}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
      >
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or course..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow bg-white text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            href="https://wa.me/919084718101" // Updated with the correct number
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white rounded-xl px-4 py-2 hover:bg-[#20bd5a] transition-colors text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Support
          </motion.a>
          <select className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm">
            <option>All Status</option>
            <option>Open</option>
            <option>Contacted</option>
            <option>Converted</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors text-sm"
          >
            <Filter className="h-4 w-4" /> Filter
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium overflow-hidden"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Enquiries List */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' as const }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">Student</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Course Interest</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Mode</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Received</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            {loading && enquiries.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
                    <p>Loading enquiries...</p>
                  </td>
                </tr>
              </tbody>
            ) : enquiries.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    No enquiries found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <motion.tbody
                key={currentPage}
                className="divide-y divide-gray-100"
                variants={tableContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {enquiries.map((enquiry) => (
                  <motion.tr key={enquiry.id} variants={rowVariants} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <StudentAvatar
                          student={enquiry}
                          size="md"
                          shape="circle"
                          showStatusIndicator
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-sm truncate">{enquiry.name || 'Anonymous'}</p>
                            {enquiry.source === 'website_learn_page' && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Learn Page
                              </span>
                            )}
                          </div>
                          {(enquiry.requirement || enquiry.message) && (
                            <p className="text-xs text-gray-500 truncate max-w-[280px] mt-1" title={maskContactInfo(enquiry.requirement || enquiry.message)}>
                              {maskContactInfo(enquiry.requirement || enquiry.message)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700 font-medium">{enquiry.course || 'General Inquiry'}</td>
                    <td className="p-4 text-sm text-gray-700">
                      <div>
                        <span>{enquiry.mode || '—'}</span>
                        {enquiry.location && (
                          <p className="text-xs text-gray-400 font-normal">{enquiry.location}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={enquiry.status || 'open'}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(enquiry.status)}`}
                        >
                          {enquiry.status?.toLowerCase() === 'open' || enquiry.status?.toLowerCase() === 'new' ? <Clock className="h-3 w-3" /> : null}
                          {enquiry.status?.toLowerCase() === 'converted' ? <CheckCircle className="h-3 w-3" /> : null}
                          {enquiry.status || 'Open'}
                        </motion.span>
                      </AnimatePresence>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {enquiry.created_at ? formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true }) : 'Unknown'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {actionLoading === enquiry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                        ) : (
                          <>
                            {/* Celoris Internal Messaging (Safe, direct, non-leaking) */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openInternalChat(enquiry)}
                              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                              title="Send Message via Celoris Chat (No Contact Sharing Needed)"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Celoris</span> Chat
                            </motion.button>

                            {/* Audio Call via Celoris */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStartCall('audio', enquiry)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                            </motion.button>

                            {/* Video Call via Celoris */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStartCall('video', enquiry)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                              title="Apply to Lead"
                              onClick={() => handleAction('Apply to Lead', enquiry)}
                            >
                              <ClipboardCheck className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                              title="Mark Contacted"
                              onClick={() => handleAction('Mark Contacted', enquiry)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                              title="Schedule Demo"
                              onClick={() => navigate('/teach/dashboard/trainer/calendar')}
                            >
                              <Calendar className="h-4 w-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            )}
          </table>
        </div>
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' as const }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200"
        >
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
          </p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <div className="flex items-center">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Only show a limited number of page buttons
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className="relative w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium"
                    >
                      {currentPage === pageNum && (
                        <motion.span
                          layoutId="activePageHighlight"
                          className="absolute inset-0 bg-emerald-600 rounded-lg"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors ${currentPage === pageNum ? 'text-white' : 'text-gray-600 hover:bg-gray-50 rounded-lg'}`}>
                        {pageNum}
                      </span>
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
