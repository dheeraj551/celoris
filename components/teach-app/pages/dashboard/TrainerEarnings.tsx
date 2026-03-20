import { useState } from 'react';
import { DollarSign, TrendingUp, Download, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Calendar, Filter, Users } from 'lucide-react';

export function TrainerEarnings() {
  const [earningsData] = useState({
    totalRevenue: '₹0',
    pendingPayout: '₹0',
    avgMonthly: '₹0',
    salesCount: '0',
  });

  const [transactions] = useState([
    {
      id: 'TXN-001',
      student: 'Rahul Sharma',
      course: 'Advanced Excel Mastery',
      amount: '₹2,999',
      date: 'Mar 20, 2026',
      status: 'completed',
    },
    {
      id: 'TXN-002',
      student: 'Priya Singh',
      course: 'Python for Data Science',
      amount: '₹4,999',
      date: 'Mar 18, 2026',
      status: 'pending',
    },
    {
      id: 'TXN-003',
      student: 'Amit Patel',
      course: 'Digital Marketing Crash Course',
      amount: '₹1,499',
      date: 'Mar 15, 2026',
      status: 'completed',
    }
  ]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500 mt-1">Track your revenue, sales, and payouts</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" /> Download Report
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><Wallet className="h-6 w-6 text-emerald-600" /></div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900">{earningsData.totalRevenue}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><Clock className="h-6 w-6 text-amber-600" /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Pending Payout</p>
          <h3 className="text-2xl font-bold text-gray-900">{earningsData.pendingPayout}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><TrendingUp className="h-6 w-6 text-blue-600" /></div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 5%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Avg. Monthly</p>
          <h3 className="text-2xl font-bold text-gray-900">{earningsData.avgMonthly}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg"><Users className="h-6 w-6 text-purple-600" /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Sales</p>
          <h3 className="text-2xl font-bold text-gray-900">{earningsData.salesCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                <Filter className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student / ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{txn.student}</p>
                        <p className="text-xs text-gray-500">{txn.id} • {txn.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{txn.course}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{txn.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        txn.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Method */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Payout Method</h2>
            <div className="space-y-4">
              <div className="p-4 border-2 border-emerald-500 bg-emerald-50 rounded-xl relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm"><CreditCard className="h-5 w-5 text-emerald-600" /></div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Bank Transfer</p>
                      <p className="text-xs text-emerald-700 font-medium">HDFC Bank • •••• 1234</p>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full bg-emerald-600 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-end relative z-10">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Primary Method</span>
                  <button className="text-xs font-bold text-emerald-700 hover:underline">Edit</button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-24 w-24 text-emerald-900" />
                </div>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 text-sm font-bold hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Add New Method
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
            <h3 className="text-lg font-bold mb-2 relative z-10">Tax Information</h3>
            <p className="text-sm text-gray-400 mb-6 relative z-10">Ensure your tax documents are up to date for smooth payouts.</p>
            <button className="w-full py-2.5 bg-white text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors relative z-10">
              Review Documents
            </button>
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Clock = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)

const Plus = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
)
