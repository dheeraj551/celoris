import { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Calendar, MoreVertical, CheckCircle, XCircle, Clock, RefreshCw, Loader2, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
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
  
  const supabase = createClient();
  const { profile } = useAuth();
  const { toast } = useToast();
  const credits = profile?.wallet_balance || 0;
  const hasMinCredits = credits >= 1000;


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

  return (
    <div className="p-8">
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
                        <button 
                          className={`p-2 transition-colors ${hasMinCredits ? 'text-gray-400 hover:text-emerald-600' : 'text-gray-300 cursor-not-allowed'}`}
                          title={hasMinCredits ? "Apply to Lead" : "Upgrade to Premium to Unlock"}
                          onClick={() => {
                            if (!hasMinCredits) {
                              toast({
                                title: "Premium Access Required",
                                description: "You need to upgrade to a premium plan to perform this action.",
                                variant: "destructive"
                              });
                              return;
                            }
                            // Apply logic here
                          }}
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </button>
                        <button 
                          className={`p-2 transition-colors ${hasMinCredits ? 'text-gray-400 hover:text-emerald-600' : 'text-gray-300 cursor-not-allowed'}`}
                          title={hasMinCredits ? "Mark Contacted" : "Upgrade to Premium to Unlock"}
                          onClick={() => {
                            if (!hasMinCredits) {
                              toast({
                                title: "Premium Access Required",
                                description: "You need to upgrade to a premium plan to perform this action.",
                                variant: "destructive"
                              });
                              return;
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button 
                          className={`p-2 transition-colors ${hasMinCredits ? 'text-gray-400 hover:text-emerald-600' : 'text-gray-300 cursor-not-allowed'}`}
                          title={hasMinCredits ? "Schedule Demo" : "Upgrade to Premium to Unlock"}
                          onClick={() => {
                            if (!hasMinCredits) {
                              toast({
                                title: "Premium Access Required",
                                description: "You need to upgrade to a premium plan to perform this action.",
                                variant: "destructive"
                              });
                              return;
                            }
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
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
