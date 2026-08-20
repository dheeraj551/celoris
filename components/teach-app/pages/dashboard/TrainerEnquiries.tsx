import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Mail, Phone, Calendar, MoreVertical, CheckCircle, XCircle, Clock, RefreshCw, Loader2, ChevronLeft, ChevronRight, ClipboardCheck, X, PartyPopper } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';


export function TrainerEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  // Success popup state
  const [successPopup, setSuccessPopup] = useState<{ show: boolean; action: string; studentName: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // leadId of loading action

  const supabase = createClient();
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();


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
      }

      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionName,
          trainerName: profile?.full_name || profile?.username || 'Trainer',
          trainerEmail: profile?.email || '',
          studentName,
          studentEmail: enquiry.email || '',
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
      {successPopup?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            style={{ animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          >
            <style>{`
              @keyframes popIn {
                from { transform: scale(0.7); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}</style>
            <button
              onClick={() => setSuccessPopup(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Action Applied!</h2>
            <p className="text-gray-500 text-sm mb-1">
              <span className="font-semibold text-emerald-600">{successPopup.action}</span> was successfully applied
            </p>
            <p className="text-gray-700 font-medium mb-5">for <span className="text-gray-900">{successPopup.studentName}</span></p>
            <div className="bg-emerald-50 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">
              ✉️ Our support team has been notified
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500 mt-1">Manage your student leads and follow-ups ({totalCount} total)</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchLeads(currentPage)}
            disabled={loading}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or course..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <a 
            href="https://wa.me/919084718101" // Updated with the correct number
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white rounded-xl px-4 py-2 hover:bg-[#20bd5a] transition-colors text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Support
          </a>
          <select className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm">
            <option>All Status</option>
            <option>Open</option>
            <option>Contacted</option>
            <option>Converted</option>
          </select>
          <button className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors text-sm">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Enquiries List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">Student</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Course Interest</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Received</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
                    <p>Loading enquiries...</p>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          {enquiry.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{enquiry.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]" title={enquiry.requirement || enquiry.message}>
                            {enquiry.requirement || enquiry.message || 'No requirements specified'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{enquiry.course || 'General Inquiry'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status?.toLowerCase() === 'open' || enquiry.status?.toLowerCase() === 'new' ? <Clock className="h-3 w-3" /> : null}
                        {enquiry.status?.toLowerCase() === 'converted' ? <CheckCircle className="h-3 w-3" /> : null}
                        {enquiry.status || 'Open'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {enquiry.created_at ? formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true }) : 'Unknown'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actionLoading === enquiry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                        ) : (
                          <>
                            <button 
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                              title="Apply to Lead"
                              onClick={() => handleAction('Apply to Lead', enquiry)}
                            >
                              <ClipboardCheck className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                              title="Mark Contacted"
                              onClick={() => handleAction('Mark Contacted', enquiry)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                              title="Schedule Demo"
                              onClick={() => navigate('/teach/dashboard/trainer/calendar')}
                            >
                              <Calendar className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
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
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-emerald-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
