import React from 'react';
import { Mail, MessageSquare, Search, Filter } from 'lucide-react';

export function TrainerInbox() {
  const [activeTab, setActiveTab] = React.useState('all');

  const messages = [
    {
      id: 1,
      sender: "Satyam Kumar",
      subject: "Query about Digital Marketing Course",
      preview: "Hello, I wanted to know if the course includes live projects...",
      time: "2 hours ago",
      read: false,
      status: "enquiry"
    },
    {
      id: 2,
      sender: "Neha Singh",
      subject: "Class Reschedule Request",
      preview: "Hi Sonia, can we move tomorrow's session to 5 PM?",
      time: "5 hours ago",
      read: true,
      status: "student"
    },
    {
      id: 3,
      sender: "Celoris Support",
      subject: "Weekly Performance Report",
      preview: "Your weekly analytics for March 24 - March 30 are now available.",
      time: "1 day ago",
      read: true,
      status: "system"
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your student communications and system alerts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-full md:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          All Messages
        </button>
        <button 
          onClick={() => setActiveTab('unread')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'unread' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Unread
        </button>
        <button 
          onClick={() => setActiveTab('students')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'students' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Students
        </button>
      </div>

      {/* Message List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id}
            className={`p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${idx !== messages.length - 1 ? 'border-b border-gray-100' : ''} ${!msg.read ? 'bg-emerald-50/30' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.status === 'enquiry' ? 'bg-blue-100 text-blue-600' : msg.status === 'student' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
              {msg.status === 'system' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-sm font-bold truncate ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.sender}</h3>
                <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
              </div>
              <p className={`text-sm mb-1 truncate ${!msg.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{msg.subject}</p>
              <p className="text-xs text-gray-500 truncate">{msg.preview}</p>
            </div>
            
            {!msg.read && (
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12">
        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">No more messages</h3>
        <p className="text-gray-500 text-sm">Once you have more student communications, they will appear here.</p>
      </div>
    </div>
  );
}
