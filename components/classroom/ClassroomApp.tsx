import React, { useState } from 'react';
import { Icons } from './components/Icons';
import { CURRENT_USER } from './constants';
import { ViewState } from './types';
import Dashboard from './views/Dashboard';
import LiveClassroom from './views/LiveClassroom';
import CourseManager from './views/CourseManager';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch(currentView) {
      case ViewState.DASHBOARD: return <Dashboard />;
      case ViewState.CLASSROOM: return <LiveClassroom />;
      case ViewState.PLANNER: return <CourseManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-slate-800 overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Icons.Classroom size={18} />
            </div>
            {isSidebarOpen && <span>EduStream</span>}
          </div>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2">
          <NavItem 
            icon={<Icons.Dashboard size={20} />} 
            label="Dashboard" 
            active={currentView === ViewState.DASHBOARD} 
            collapsed={!isSidebarOpen} 
            onClick={() => setCurrentView(ViewState.DASHBOARD)}
          />
          <NavItem 
            icon={<Icons.Classroom size={20} />} 
            label="Live Classroom" 
            active={currentView === ViewState.CLASSROOM} 
            collapsed={!isSidebarOpen} 
            onClick={() => setCurrentView(ViewState.CLASSROOM)}
          />
          <NavItem 
            icon={<Icons.Planner size={20} />} 
            label="Course Manager" 
            active={currentView === ViewState.PLANNER} 
            collapsed={!isSidebarOpen} 
            onClick={() => setCurrentView(ViewState.PLANNER)}
          />
           <NavItem 
            icon={<Icons.Settings size={20} />} 
            label="Settings" 
            active={currentView === ViewState.SETTINGS} 
            collapsed={!isSidebarOpen} 
            onClick={() => setCurrentView(ViewState.SETTINGS)}
          />
        </div>

        <div className="p-4 border-t border-slate-100">
           <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
             <img src={CURRENT_USER.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
             {isSidebarOpen && (
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-slate-800 truncate">{CURRENT_USER.name}</p>
                 <p className="text-xs text-slate-500 truncate">{CURRENT_USER.role}</p>
               </div>
             )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg">
             <Icons.Settings className="transform rotate-90" size={20} />
          </button>

          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                <Icons.Plus size={16} />
                New Class
             </button>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

// Helper Component for Nav Items
const NavItem = ({ icon, label, active, collapsed, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-indigo-50 text-primary font-medium' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    } ${collapsed ? 'justify-center' : ''}`}
    title={collapsed ? label : ''}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </button>
);

export default App;