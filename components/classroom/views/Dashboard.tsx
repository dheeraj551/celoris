import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Icons } from '../components/Icons';
import { MOCK_SESSIONS, MOCK_ASSIGNMENTS } from '../constants';

const attendanceData = [
  { name: 'Mon', students: 20 },
  { name: 'Tue', students: 24 },
  { name: 'Wed', students: 22 },
  { name: 'Thu', students: 23 },
  { name: 'Fri', students: 19 },
];

const engagementData = [
  { time: '0m', level: 20 },
  { time: '10m', level: 45 },
  { time: '20m', level: 80 },
  { time: '30m', level: 65 },
  { time: '40m', level: 90 },
  { time: '50m', level: 85 },
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 45,
    avgAttendance: '88%',
    assignmentsGraded: '12/45'
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, Prof. Jenkins</h1>
        <p className="text-slate-500 mt-1">Here's what's happening in your classrooms today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Icons.Users size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">Total Students</div>
            <div className="text-2xl font-bold text-slate-800">{stats.totalStudents}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <Icons.Classroom size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">Avg. Attendance</div>
            <div className="text-2xl font-bold text-slate-800">{stats.avgAttendance}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <Icons.Planner size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">Assignments Graded</div>
            <div className="text-2xl font-bold text-slate-800">{stats.assignmentsGraded}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="students" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Live Class Engagement</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="level" stroke="#0EA5E9" strokeWidth={3} dot={{fill: '#0EA5E9', r: 4, strokeWidth: 0}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Classes List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Today's Schedule</h3>
          <button className="text-primary text-sm font-medium hover:underline">View Calendar</button>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_SESSIONS.map(session => (
             <div key={session.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{session.title}</h4>
                    <div className="text-sm text-slate-500">{session.subject} • {session.startTime}</div>
                  </div>
                </div>
                {session.isActive ? (
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-green-200 animate-pulse-slow">
                    Join Live
                  </button>
                ) : (
                   <span className="text-sm text-slate-400 font-medium">Scheduled</span>
                )}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;