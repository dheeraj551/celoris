import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, MessageSquare, Mail, Settings, LogOut, Users, DollarSign, LayoutDashboard, User as UserIcon, Radio, Send } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';

import { motion, AnimatePresence } from 'framer-motion';

function LiveBoothManager({ trainerId, trainerName }: { trainerId: string, trainerName: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const channelId = `chat:${trainerId}`;
    const channel = supabase.channel(channelId);

    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages((prev) => [...prev, payload]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [trainerId]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender_id: trainerId,
      sender_name: trainerName,
      text: input,
      timestamp: new Date().toISOString()
    };

    const supabase = createClient();
    const channelId = `chat:${trainerId}`;
    
    await supabase.channel(channelId).send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage,
    });

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col z-[100] overflow-hidden"
    >
      <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-bold text-sm tracking-tight uppercase">Live Booth Chat</span>
        </div>
        <div className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">Recording</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <MessageSquare className="text-emerald-100 mb-3" size={40} />
            <p className="text-gray-400 text-xs font-medium">No students in the booth yet.<br/>Your status is public on the Learn page.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender_id === trainerId ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                m.sender_id === trainerId 
                  ? 'bg-emerald-500 text-white rounded-tr-none shadow-md shadow-emerald-500/10' 
                  : 'bg-gray-100 text-gray-700 rounded-tl-none'
              }`}>
                {m.text}
              </div>
              <span className="text-[8px] text-gray-400 font-bold uppercase mt-1 px-1">
                {m.sender_id === trainerId ? 'You' : m.sender_name} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2">
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
             placeholder="Reply to student..."
             className="flex-1 bg-white border border-gray-200 rounded-xl px-4 h-11 text-xs text-gray-700 focus:outline-none focus:border-emerald-500 transition-all"
           />
           <button onClick={sendMessage} className="h-11 w-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <Send size={16} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}

export function TrainerDashboard() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [boothTitle, setBoothTitle] = useState('');

  // Sync profile title to boothTitle state when profile loads
  useEffect(() => {
    if (profile && !boothTitle) {
      const initialTitle = profile.profession || profile.title || (profile.role !== 'user' ? profile.role : null) || 'Celoris Trainer';
      setBoothTitle(initialTitle);
    }
  }, [profile, boothTitle]);
  
  // Broadcast presence when "Go Live" is active
  useEffect(() => {
    if (!profile || !isLive) return;

    const supabase = createClient();
    const channel = supabase.channel('booth:online_trainers', {
      config: {
        presence: {
          key: profile.id,
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: profile.id,
          name: profile.full_name || 'Expert Trainer',
          avatar: profile.profile_pic_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.id}&backgroundColor=10b981`,
          role: boothTitle || 'Celoris Trainer', 
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [isLive, profile, boothTitle]);
  
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
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${isLive ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-200 focus-within:border-emerald-500'}`}>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Booth Title:</span>
               <input 
                 type="text" 
                 value={boothTitle} 
                 onChange={(e) => setBoothTitle(e.target.value)}
                 disabled={isLive}
                 placeholder="e.g. Master Yoga Trainer"
                 className="bg-transparent border-none text-sm font-bold text-gray-700 focus:outline-none min-w-[150px]"
               />
            </div>

            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
               <div className="flex items-center gap-2">
                   {isLive ? (
                      <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                   ) : (
                      <Radio className="w-4 h-4 text-gray-400" />
                   )}
                   <span className={`text-sm font-bold uppercase tracking-wider ${isLive ? 'text-emerald-600' : 'text-gray-500'}`}>
                     {isLive ? 'Booth Live' : 'Open Booth'}
                   </span>
               </div>
               
               <div className="h-4 w-px bg-gray-300 mx-1" />
               
               <button
                 onClick={() => setIsLive(!isLive)}
                 className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${isLive ? 'bg-emerald-500' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${isLive ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
          </div>
        </header>

        <Outlet />
      </main>

      <AnimatePresence>
        {isLive && profile && (
          <LiveBoothManager 
            trainerId={profile.id} 
            trainerName={profile.full_name || 'Trainer'} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
