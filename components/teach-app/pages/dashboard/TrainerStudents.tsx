import { useState, useEffect } from 'react';
import { Search, Filter, Mail, MessageSquare, Calendar, MoreVertical, CheckCircle, Clock, User, Phone, Download, LayoutGrid, List, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase-client';

export function TrainerStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const supabase = createClient();

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
  }, []);

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (s.name || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">
            All student enquiries and leads ({filteredStudents.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or course..."
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
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest text-right">Actions</th>
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
                            <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {student.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {student.email || 'No email provided'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-800 text-sm">
                          {student.course || 'General Inquiry'}
                        </p>
                        {student.requirement && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{student.requirement}</p>
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
                        <div className="flex items-center justify-end gap-1">
                          {student.email && (
                            <a
                              href={`mailto:${student.email}`}
                              className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                          )}
                          {student.phone && (
                            <a
                              href={`https://wa.me/${student.phone?.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                              title="WhatsApp"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </a>
                          )}
                          <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
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
                <div className="space-y-3 mb-6">
                  {student.email && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Mail size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-medium line-clamp-1">{student.email}</span>
                    </div>
                  )}
                  {student.phone && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Phone size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-medium">{student.phone}</span>
                    </div>
                  )}
                  {student.requirement && (
                    <p className="text-xs text-gray-400 italic line-clamp-2 pt-1">{student.requirement}</p>
                  )}
                </div>
                <div className="flex gap-2 relative text-xs text-gray-400 pt-4 border-t border-gray-100">
                  <Clock size={12} className="shrink-0 mt-0.5" />
                  {student.created_at
                    ? formatDistanceToNow(new Date(student.created_at), { addSuffix: true })
                    : 'Unknown'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
