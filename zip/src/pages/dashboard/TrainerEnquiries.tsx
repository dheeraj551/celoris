import { useState } from 'react';
import { Search, Filter, Mail, Phone, Calendar, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';

export function TrainerEnquiries() {
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      phone: '+91 98765 43210',
      course: 'Advanced Excel Mastery',
      status: 'new',
      date: '2 hours ago',
      message: 'I am interested in joining the weekend batch. Do you provide recorded sessions?',
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '+91 87654 32109',
      course: 'Python for Data Science',
      status: 'contacted',
      date: '1 day ago',
      message: 'Can we schedule a demo class before I enroll?',
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.k@example.com',
      phone: '+91 76543 21098',
      course: 'Digital Marketing Crash Course',
      status: 'converted',
      date: '3 days ago',
      message: 'I want to learn SEO and Google Ads.',
    }
  ]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500 mt-1">Manage your student leads and follow-ups</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
          Export Data
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or course..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
            <option>All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Converted</option>
            <option>Lost</option>
          </select>
          <button className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">Student</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Course Interest</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Contact Info</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Received</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {enquiry.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{enquiry.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{enquiry.message}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{enquiry.course}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${enquiry.email}`} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {enquiry.email}
                      </a>
                      <a href={`tel:${enquiry.phone}`} className="text-sm text-gray-600 hover:underline flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {enquiry.phone}
                      </a>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      enquiry.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                      enquiry.status === 'converted' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {enquiry.status === 'new' && <Clock className="h-3 w-3" />}
                      {enquiry.status === 'converted' && <CheckCircle className="h-3 w-3" />}
                      {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{enquiry.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Mark Contacted">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Schedule Demo">
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
