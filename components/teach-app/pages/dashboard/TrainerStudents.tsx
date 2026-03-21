import { useState } from 'react';
import { Search, Filter, Mail, MessageSquare, Calendar, MoreVertical, CheckCircle, Clock, User, Phone, Download, LayoutGrid, List } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_STUDENTS = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 43210',
    course: 'Advanced Excel Mastery',
    joinDate: '2024-02-15',
    status: 'active',
    progress: 75,
    avatar: null
  },
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91 87654 32109',
    course: 'Python for Data Science',
    joinDate: '2024-03-01',
    status: 'active',
    progress: 45,
    avatar: null
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    phone: '+91 76543 21098',
    course: 'Digital Marketing Crash Course',
    joinDate: '2024-01-20',
    status: 'completed',
    progress: 100,
    avatar: null
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.r@example.com',
    phone: '+91 65432 10987',
    course: 'Advanced Excel Mastery',
    joinDate: '2024-02-28',
    status: 'paused',
    progress: 30,
    avatar: null
  },
  {
    id: '5',
    name: 'Vikram Malhotra',
    email: 'v.malhotra@example.com',
    phone: '+91 99887 76655',
    course: 'UI/UX Design Fundamentals',
    joinDate: '2024-03-05',
    status: 'active',
    progress: 12,
    avatar: null
  }
];

export function TrainerStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage all students enrolled in your courses ({filteredStudents.length})</p>
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
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Filters and Search */}
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
            className="flex-1 md:flex-none border border-gray-200 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-sm font-medium shadow-sm transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          <button className="flex items-center gap-2 border border-gray-200 rounded-2xl px-6 py-3 hover:bg-gray-50 transition-all text-sm font-medium bg-white shadow-sm whitespace-nowrap">
            <Filter className="h-4 w-4" /> Advanced Filters
          </button>
        </div>
      </div>

      {/* Students List Display */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Student Info</th>
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Course & Enrollment</th>
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Status & Progress</th>
                  <th className="p-6 font-bold text-gray-600 text-[10px] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-500">
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
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{student.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-800 text-sm">{student.course}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                          <Clock size={12} />
                          <span className="text-[11px] font-bold uppercase tracking-tight">Joined {format(new Date(student.joinDate), 'MMM d, yyyy')}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit ${getStatusStyle(student.status)}`}>
                            {student.status}
                          </span>
                          <div className="flex items-center gap-3 w-40">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                                style={{ width: `${student.progress}%` }} 
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-600 italic">{student.progress}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all" title="Message Student">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all" title="View Progress">
                            <Calendar className="h-4 w-4" />
                          </button>
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-emerald-200/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
              
              <div className="flex items-center justify-between mb-6 relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
                  {student.name.charAt(0)}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(student.status)}`}>
                  {student.status}
                </div>
              </div>

              <div className="mb-6 relative">
                <h3 className="font-black text-lg text-gray-900 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{student.name}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{student.course}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={14} className="text-emerald-500" />
                  <span className="text-xs font-medium line-clamp-1">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Phone size={14} className="text-emerald-500" />
                  <span className="text-xs font-medium">{student.phone}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">{student.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 shadow-inner" 
                      style={{ width: `${student.progress}%` }} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 relative">
                <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Chat
                </button>
                <button className="w-12 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 flex items-center justify-center rounded-xl transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
