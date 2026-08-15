import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, ArrowUpRight, CreditCard, Wallet, Calendar, Filter, Users, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/providers/AuthProvider';
import { formatDistanceToNow } from 'date-fns';

export function TrainerEarnings() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalLeads: 0,
    convertedLeads: 0,
    thisMonthLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  const supabase = createClient();
  const { profile } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Wallet balance from profile
        const walletBalance = profile?.wallet_balance || 0;

        // Leads stats
        const { data: leads } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        const allLeads = leads || [];
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthLeads = allLeads.filter((l) => new Date(l.created_at) >= startOfMonth).length;
        const convertedLeads = allLeads.filter((l) => l.status?.toLowerCase() === 'converted').length;

        setStats({
          walletBalance,
          totalLeads: allLeads.length,
          convertedLeads,
          thisMonthLeads,
        });
        setRecentLeads(allLeads.slice(0, 5));
      } catch (err) {
        console.error('Earnings fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [profile]);

  const formatINR = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getStatusBadge = (status: string) => {
    switch ((status || 'open').toLowerCase()) {
      case 'converted': return 'bg-emerald-100 text-emerald-700';
      case 'contacted': return 'bg-amber-100 text-amber-700';
      default:          return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500 mt-1">Track your wallet balance and lead performance</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="font-medium">Loading earnings...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Wallet Balance</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatINR(stats.walletBalance)}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Enquiries</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalLeads}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                {stats.thisMonthLeads > 0 && (
                  <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {stats.thisMonthLeads} this month
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm font-medium">This Month</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.thisMonthLeads}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Converted Leads</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.convertedLeads}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Lead Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Recent Lead Activity</h2>
              </div>
              <div className="overflow-x-auto">
                {recentLeads.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <Users className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    <p className="font-medium">No leads yet</p>
                    <p className="text-sm mt-1">Your incoming enquiries will appear here</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Course Interest</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Received</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                {(lead.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{lead.name || 'Anonymous'}</p>
                                <p className="text-xs text-gray-400">{lead.email || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700">{lead.course || 'General Inquiry'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-gray-500">
                              {lead.created_at
                                ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })
                                : '—'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(lead.status)}`}>
                              {lead.status || 'open'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Wallet Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Wallet</h2>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Available Balance</p>
                  <h3 className="text-3xl font-black">{formatINR(stats.walletBalance)}</h3>
                  <p className="text-xs opacity-70 mt-3">{profile?.full_name || profile?.username || 'Trainer'}</p>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Leads</span>
                    <span className="font-bold text-gray-900">{stats.totalLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Converted</span>
                    <span className="font-bold text-emerald-600">{stats.convertedLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-bold text-gray-900">
                      {stats.totalLeads > 0
                        ? `${Math.round((stats.convertedLeads / stats.totalLeads) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
                <h3 className="text-lg font-bold mb-2 relative z-10">Need help with earnings?</h3>
                <p className="text-sm text-gray-400 mb-5 relative z-10">
                  Contact support to set up payouts or ask about your balance.
                </p>
                <a
                  href="https://wa.me/919084718101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors relative z-10 flex items-center justify-center gap-2"
                >
                  Contact Support
                </a>
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
