import { useState, useEffect } from 'react';
import { MessageSquare, Users, Calendar, DollarSign, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export function TrainerOverview() {
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRecentLeads() {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setRecentLeads(data || []);
      } catch (err) {
        console.error('Error fetching recent leads:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentLeads();
  }, []);

  return (
    <div className="p-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><MessageSquare className="h-6 w-6 text-emerald-600" /></div>
            <span className="text-emerald-500 text-sm font-medium">+12%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">New Enquiries</p>
          <h3 className="text-2xl font-bold text-gray-900">0</h3>
        </div>
        
        <Link to="/teach/dashboard/trainer/students" className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-500/50 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><Users className="h-6 w-6 text-emerald-600" /></div>
            <span className="text-emerald-500 text-sm font-medium">+5%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Active Students</p>
          <h3 className="text-2xl font-bold text-gray-900">5</h3>
        </Link>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><Calendar className="h-6 w-6 text-amber-600" /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Upcoming Sessions</p>
          <h3 className="text-2xl font-bold text-gray-900">0</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><DollarSign className="h-6 w-6 text-emerald-600" /></div>
            <span className="text-emerald-500 text-sm font-medium">+18%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Monthly Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900">₹0</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
            <Link to="/teach/dashboard/trainer/enquiries" className="text-emerald-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100 min-h-[300px]">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center gap-3 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p>Fetching latest leads...</p>
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No recent enquiries found.
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                      {lead.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{lead.name || 'Anonymous Student'}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{lead.course || 'Interested in learning'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : 'Recently'}
                    </span>
                    <Link to="/teach/dashboard/trainer/enquiries" className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-100">
                      Reply
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center text-sm">
                <span className="font-bold text-gray-900">10:00</span>
                <span className="text-gray-500">AM</span>
              </div>
              <div className="flex-1 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-900">1:1 Excel Mentoring</h4>
                <p className="text-xs text-emerald-700 mt-1">with Rahul Sharma</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center text-sm">
                <span className="font-bold text-gray-900">02:30</span>
                <span className="text-gray-500">PM</span>
              </div>
              <div className="flex-1 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-900">Demo Class</h4>
                <p className="text-xs text-emerald-700 mt-1">with Priya Singh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
