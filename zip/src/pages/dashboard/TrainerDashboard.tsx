import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, MessageSquare, Settings, LogOut, Users, DollarSign, LayoutDashboard } from 'lucide-react';

export function TrainerDashboard() {
  const location = useLocation();
  
  // Helper to get page title based on route
  const getPageTitle = () => {
    if (location.pathname.includes('/courses')) return 'My Courses';
    if (location.pathname.includes('/enquiries')) return 'Enquiries';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Celoris</span>
          </Link>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 p-2">
            <img src="https://picsum.photos/seed/dheeraj/100/100" alt="Profile" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-bold text-gray-900">Dheeraj K.</p>
              <p className="text-xs text-gray-500">Trainer Account</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavLink 
              to="/dashboard/trainer/overview" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="h-5 w-5" /> Overview
            </NavLink>
            <NavLink 
              to="/dashboard/trainer/enquiries" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <MessageSquare className="h-5 w-5" /> Enquiries <span className="ml-auto bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">3</span>
            </NavLink>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <Users className="h-5 w-5" /> Students
            </a>
            <NavLink 
              to="/dashboard/trainer/courses" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <BookOpen className="h-5 w-5" /> My Courses
            </NavLink>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <Calendar className="h-5 w-5" /> Calendar
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <DollarSign className="h-5 w-5" /> Earnings
            </a>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-200">
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <Settings className="h-5 w-5" /> Settings
            </a>
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium">
              <LogOut className="h-5 w-5" /> Sign out
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard/trainer/courses/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Create Course
            </Link>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
