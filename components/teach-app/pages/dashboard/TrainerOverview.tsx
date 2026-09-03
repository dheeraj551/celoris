import { useState, useEffect } from 'react';
import { MessageSquare, Users, Calendar, DollarSign, Clock, Loader2, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';

const MotionLink = motion.create(Link);

const statCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const statGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function TrainerOverview() {
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeadsThisMonth: 0,
    totalStudents: 0,
    upcomingSessions: 0,
    monthlyEarnings: 0,
    todayEvents: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { profile } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // --- Leads ---
        const { data: allLeads, count: totalLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });

        // New leads this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newThisMonth = (allLeads || []).filter(
          (l: any) => new Date(l.created_at) >= startOfMonth
        ).length;

        // Recent 3 leads
        const recent = (allLeads || []).slice(0, 3);

        // --- Unique students from leads ---
        const uniqueEmails = new Set((allLeads || []).map((l: any) => l.email).filter(Boolean));
        const totalStudents = uniqueEmails.size || (allLeads?.length ?? 0);

        // --- Calendar events for today ---
        let todayEvents: any[] = [];
        let upcomingSessions = 0;
        try {
          const today = new Date();
          const todayStr = today.toISOString().split('T')[0];
          const { data: events } = await supabase
            .from('calendar_events')
            .select('*')
            .gte('event_date', todayStr)
            .order('event_date', { ascending: true })
            .limit(20);

          if (events) {
            todayEvents = events.filter((e: any) => e.event_date?.startsWith(todayStr));
            upcomingSessions = events.length;
          }
        } catch (_) {
          // Table may not exist yet — silently ignore
        }

        // --- Earnings from wallet balance ---
        const walletBalance = profile?.wallet_balance || 0;

        setRecentLeads(recent);
        setStats({
          totalLeads: totalLeads || 0,
          newLeadsThisMonth: newThisMonth,
          totalStudents,
          upcomingSessions,
          monthlyEarnings: walletBalance,
          todayEvents,
        });
      } catch (err) {
        console.error('Error fetching overview data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [profile]);

  const formatINR = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="p-8">
      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={statGridVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {/* New Enquiries */}
        <MotionLink
          variants={statCardVariants}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          to="/teach/dashboard/trainer/enquiries"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
            </div>
            {stats.newLeadsThisMonth > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1"
              >
                <TrendingUp className="h-3 w-3" />
                {stats.newLeadsThisMonth} new
              </motion.span>
            )}
          </div>
          <p className="text-gray-500 text-sm font-medium">New Enquiries</p>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" exit={{ opacity: 0 }}>
                <Loader2 className="h-5 w-5 animate-spin text-emerald-500 mt-1" />
              </motion.div>
            ) : (
              <motion.h3
                key="value"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                {stats.totalLeads}
              </motion.h3>
            )}
          </AnimatePresence>
        </MotionLink>

        {/* Active Students */}
        <MotionLink
          variants={statCardVariants}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          to="/teach/dashboard/trainer/students"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Students Reached</p>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" exit={{ opacity: 0 }}>
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mt-1" />
              </motion.div>
            ) : (
              <motion.h3
                key="value"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                {stats.totalStudents}
              </motion.h3>
            )}
          </AnimatePresence>
        </MotionLink>

        {/* Upcoming Sessions */}
        <MotionLink
          variants={statCardVariants}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          to="/teach/dashboard/trainer/calendar"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-amber-400 hover:shadow-lg transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Upcoming Sessions</p>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" exit={{ opacity: 0 }}>
                <Loader2 className="h-5 w-5 animate-spin text-amber-500 mt-1" />
              </motion.div>
            ) : (
              <motion.h3
                key="value"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                {stats.upcomingSessions}
              </motion.h3>
            )}
          </AnimatePresence>
        </MotionLink>

        {/* Wallet / Earnings */}
        <MotionLink
          variants={statCardVariants}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          to="/teach/dashboard/trainer/earnings"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Wallet Balance</p>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" exit={{ opacity: 0 }}>
                <Loader2 className="h-5 w-5 animate-spin text-emerald-500 mt-1" />
              </motion.div>
            ) : (
              <motion.h3
                key="value"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                {formatINR(stats.monthlyEarnings)}
              </motion.h3>
            )}
          </AnimatePresence>
        </MotionLink>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
            <Link
              to="/teach/dashboard/trainer/enquiries"
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100 min-h-[220px]">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center gap-3 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p>Fetching latest leads...</p>
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                <p className="font-medium">No enquiries yet</p>
                <p className="text-sm mt-1">When students reach out, they'll appear here</p>
              </div>
            ) : (
              recentLeads.map((lead, idx) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                      {lead.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {lead.name || 'Anonymous Student'}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {lead.course || lead.requirement || 'General Inquiry'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {lead.created_at
                        ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })
                        : 'Recently'}
                    </span>
                    <Link
                      to="/teach/dashboard/trainer/enquiries"
                      className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-100"
                    >
                      Reply
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
            <Link
              to="/teach/dashboard/trainer/calendar"
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              View calendar
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <p className="text-sm">Loading schedule...</p>
              </div>
            ) : stats.todayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                <Calendar className="h-10 w-10 text-gray-200" />
                <p className="font-medium text-sm">No sessions today</p>
                <Link
                  to="/teach/dashboard/trainer/calendar"
                  className="text-xs text-emerald-600 font-medium hover:underline"
                >
                  + Schedule a session
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.todayEvents.map((event: any, idx: number) => {
                  const timeStr = event.start_time || event.time || '';
                  const [hour, min] = timeStr.split(':');
                  const h = parseInt(hour || '0');
                  const ampm = h >= 12 ? 'PM' : 'AM';
                  const displayHour = h > 12 ? h - 12 : h || 12;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center text-sm min-w-[40px]">
                        <span className="font-bold text-gray-900">
                          {String(displayHour).padStart(2, '0')}:{min || '00'}
                        </span>
                        <span className="text-gray-500 text-xs">{ampm}</span>
                      </div>
                      <div className="flex-1 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <h4 className="text-sm font-bold text-emerald-900">
                          {event.title || 'Session'}
                        </h4>
                        {event.description && (
                          <p className="text-xs text-emerald-700 mt-1 line-clamp-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
