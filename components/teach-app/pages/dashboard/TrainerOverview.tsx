import { MessageSquare, Users, Calendar, DollarSign, Clock } from 'lucide-react';

export function TrainerOverview() {
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
          <h3 className="text-2xl font-bold text-gray-900">24</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><Users className="h-6 w-6 text-emerald-600" /></div>
            <span className="text-emerald-500 text-sm font-medium">+5%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Active Students</p>
          <h3 className="text-2xl font-bold text-gray-900">142</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><Calendar className="h-6 w-6 text-amber-600" /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Upcoming Sessions</p>
          <h3 className="text-2xl font-bold text-gray-900">8</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><DollarSign className="h-6 w-6 text-emerald-600" /></div>
            <span className="text-emerald-500 text-sm font-medium">+18%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Monthly Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900">₹45,200</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
            <button className="text-emerald-600 text-sm font-medium">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    S{i}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Student Name {i}</h4>
                    <p className="text-xs text-gray-500">Interested in Advanced Excel Course</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500"><Clock className="h-3 w-3 inline mr-1" />2h ago</span>
                  <button className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-100">
                    Reply
                  </button>
                </div>
              </div>
            ))}
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
