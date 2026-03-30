import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, MessageSquare, Mail, Settings, LogOut, Users, DollarSign, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export function TrainerDashboard() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  // Helper to get page title based on route
  const getPageTitle = () => {

    if (location.pathname.includes('/enquiries')) return 'Enquiries';
    if (location.pathname.includes('/students')) return 'Students';
    if (location.pathname.includes('/calendar')) return 'Calendar';
    if (location.pathname.includes('/earnings')) return 'Earnings';
    if (location.pathname.includes('/inbox')) return 'Inbox';
    if (location.pathname.includes('/profile')) return 'Trainer Profile';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/teach" className="flex items-center">
            <img
              src="/celoris-logo.png"
              alt="Celoris Logo"
              className="h-8 w-auto object-contain transition-all hover:opacity-80"
            />
          </Link>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 p-2">
            {profile?.profile_pic_url ? (
              <img src={profile.profile_pic_url} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-gray-900 line-clamp-1">{profile?.full_name || 'Trainer Account'}</p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavLink 
              to="/teach/dashboard/trainer/overview" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="h-5 w-5" /> Overview
            </NavLink>
            <NavLink 
              to="/teach/dashboard/trainer/enquiries" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <MessageSquare className="h-5 w-5" /> Enquiries <span className="ml-auto bg-emerald-100 text-emerald-600 py-0.5 px-2 rounded-full text-xs">3</span>
            </NavLink>
            <NavLink 
              to="/teach/dashboard/trainer/inbox" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Mail className="h-5 w-5" /> Inbox
            </NavLink>
            <NavLink 
              to="/teach/dashboard/trainer/students" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Users className="h-5 w-5" /> Students
            </NavLink>

            <NavLink 
              to="/teach/dashboard/trainer/calendar" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Calendar className="h-5 w-5" /> Calendar
            </NavLink>
            <NavLink 
              to="/teach/dashboard/trainer/earnings" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <DollarSign className="h-5 w-5" /> Earnings
            </NavLink>
            <NavLink 
              to="/teach/dashboard/trainer/profile" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <UserIcon className="h-5 w-5" /> Trainer Profile
            </NavLink>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-200">
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <Settings className="h-5 w-5" /> Settings
            </a>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium"
            >
              <LogOut className="h-5 w-5" /> Sign out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
