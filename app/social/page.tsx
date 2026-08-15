"use client";
import React, { useState, useEffect } from 'react';
import { MOCK_ROOMS, MOCK_USERS } from '@/components/cafe/data/mockData';
import { Room, User } from '@/components/cafe/types';
import LandingHero from '@/components/cafe/LandingHero';
import RoomsGrid from '@/components/cafe/RoomsGrid';
import SafeSecure from '@/components/cafe/SafeSecure';
import PremiumBenefits from '@/components/cafe/PremiumBenefits';
import ChatRoom from '@/components/cafe/ChatRoom';
import CreationToolsDemo from '@/components/cafe/CreationToolsDemo';
import LearnTab from '@/components/cafe/LearnTab';
import TeachTab from '@/components/cafe/TeachTab';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';

const ClassroomTable = dynamic(() => import('@/components/cafe/ClassroomTable'), { ssr: false });

import { 
  Menu, 
  Users, 
  X, 
  Check, 
  Sparkles, 
  Coffee, 
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Heart,
  Briefcase,
  Home,
  MessageSquare,
  Compass,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isOnlineListOpen, setIsOnlineListOpen] = useState<boolean>(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState<boolean>(false);
  
  // Custom states for the custom room creation mockup
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomCat, setNewRoomCat] = useState<'study' | 'course' | 'mixer' | 'night' | 'onboarding' | 'classroom'>('study');
  const [newRoomTags, setNewRoomTags] = useState('');
  const [allRooms, setAllRooms] = useState<Room[]>([]); // Initialize empty for realtime rooms
  const supabase = createClient();
  const { profile, user } = useAuth();

  // Current logged in user info (mocked)
  const currentUser = {
    name: 'Dheeraj Kushwaha',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', // high quality portrait
    skill: 'Fullstack Development & UI',
    college: 'IIT Bombay',
    isOnline: true,
    isVerified: true
  };

  // Find the currently joined room details
  const joinedRoom = allRooms.find(r => r.id === joinedRoomId);

  // Scroll to top on page or tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, joinedRoomId]);

  // Fetch rooms and subscribe to realtime updates
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('cafe_classrooms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Fetch profiles for the hosts manually to avoid FK relationship error
        const hostIds = data.map((r: any) => r.host_id).filter(Boolean);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', hostIds);

        const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);

        const mappedRooms: Room[] = data.map((r: any) => {
          const host: any = profileMap.get(r.host_id) || {};
          return {
            id: r.id,
            name: r.name,
            description: r.description || '',
            category: r.category as any,
            onlineCount: 1, // Assume 1 for host initially
            status: 'Live',
            tags: r.tags || [],
            host: {
              id: r.host_id,
              name: host.full_name || 'Host',
              avatar: host.avatar_url || '',
              role: 'Host'
            },
            participants: [
              {
                id: r.host_id,
                name: host.full_name || 'Host',
                avatar: host.avatar_url || '',
                skill: '',
                isOnline: true
              }
            ]
          };
        });
        setAllRooms(mappedRooms);
      }
    };

    fetchRooms();

    const channel = supabase.channel('public:cafe_classrooms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cafe_classrooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    setJoinedRoomId(roomId);
    setActiveTab('cafe'); // force switch to cafe tab to show active session
  };

  const handleCreateRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomDesc.trim()) return;

    if (newRoomCat === 'classroom') {
      const credits = profile?.wallet_balance || 0;
      if (credits < 500) {
        alert("You need at least 500 credits to host a Classroom Table. Please upgrade or earn more credits.");
        return;
      }
    }

    const tagsArray = newRoomTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const { data, error } = await supabase
      .from('cafe_classrooms')
      .insert({
        name: newRoomName,
        description: newRoomDesc,
        category: newRoomCat,
        tags: tagsArray,
        host_id: user?.id,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Failed to create room.");
      return;
    }

    setNewRoomName('');
    setNewRoomDesc('');
    setNewRoomTags('');
    setCreateRoomModalOpen(false);
    
    // Auto-join the newly created room
    setJoinedRoomId(data.id);
    setActiveTab('cafe');
  };

  const loadTemplate = (template: Room) => {
    setNewRoomName(template.name);
    setNewRoomDesc(template.description);
    setNewRoomCat(template.category);
    setNewRoomTags(template.tags.join(', '));
  };

  const inviteUserToTable = (userName: string) => {
    alert(`Invitation sent to ${userName} to sit down at your active learning table. They've received a prompt inside their lobby dashboard!`);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!user) return;
    const confirmed = window.confirm('Are you sure you want to delete this room? This cannot be undone.');
    if (!confirmed) return;

    const { error } = await supabase
      .from('cafe_classrooms')
      .update({ is_active: false })
      .eq('id', roomId)
      .eq('host_id', user.id); // safety: only owner can delete

    if (error) {
      console.error('Delete error:', error);
      alert('Failed to delete room.');
    } else {
      setAllRooms(prev => prev.filter(r => r.id !== roomId));
      if (joinedRoomId === roomId) setJoinedRoomId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-gray-200 font-sans flex flex-col selection:bg-emerald-500 selection:text-[#0a0a0a]">
      {/* Decorative radial body bg blur */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.04)_0%,_transparent_65%)] pointer-events-none -z-10"></div>



      {/* DOCK LAYOUT: CENTRAL CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main central container for views */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 custom-scrollbar">
          
          {/* Active room session header callout if viewing another tab */}
          {joinedRoomId && joinedRoom && activeTab !== 'cafe' && (
            <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-[#0d1e18] to-[#071410] border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-400 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>You are currently seated at <strong className="text-white">"{joinedRoom.name}"</strong> table.</span>
              </div>
              <button 
                onClick={() => setActiveTab('cafe')}
                className="font-bold underline text-emerald-400 hover:text-emerald-300"
              >
                Return to Table Space
              </button>
            </div>
          )}

          {/* DYNAMIC TAB SWITCHER CONTROLLER */}
          {activeTab === 'home' && (
            <div className="space-y-16">
              {/* Landing Hero */}
              <LandingHero 
                onEnterCafe={() => { setActiveTab('cafe'); setJoinedRoomId(null); }}
                onSeeOnline={() => setIsOnlineListOpen(true)}
                activeRooms={allRooms}
                onJoinRoom={handleJoinRoom}
              />

              {/* Safe & Secure - placed high for trust reinforcement */}
              <SafeSecure />

              {/* Home Grid Section: Featured Rooms & Lounge Categories */}
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block mb-1">Discover Celoris</span>
                  <h2 className="text-2xl md:text-3xl font-display font-black italic text-white tracking-wide uppercase">
                    CHOOSE YOUR HANGOUT SPACE
                  </h2>
                  <p className="text-xs text-gray-400 max-w-xl mt-1">
                    Select a curated study table or course lounge. Jump right in, say hello, or sit down silently to code.
                  </p>
                </div>

                <RoomsGrid 
                  rooms={allRooms} 
                  onJoinRoom={handleJoinRoom}
                  onCreateRoom={() => setCreateRoomModalOpen(true)}
                  currentUser={user}
                  onDeleteRoom={handleDeleteRoom}
                />
              </div>

              {/* Premium Perks Grid */}
              <PremiumBenefits onUpgrade={() => setUpgradeModalOpen(true)} />

              {/* Bottom CTA banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-8 md:p-12 text-center text-[#0a0a0a] shadow-2xl group border border-emerald-400/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-1">
                    <Coffee className="w-4 h-4 text-[#0a0a0a] fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">CHAI WITH COHORTS</span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-display font-black italic tracking-tight leading-none uppercase">
                    Pull Up a Chair
                  </h3>
                  
                  <p className="text-xs md:text-sm text-[#0a0a0a]/80 leading-relaxed font-medium">
                    Join thousands of skill-learners from India's top colleges. Exchange resources, clear doubts, get mentored, and hang out in our dark-mode community.
                  </p>

                  <button
                    onClick={() => { setActiveTab('cafe'); setJoinedRoomId(null); }}
                    className="mt-4 px-8 py-4 rounded-2xl bg-[#0a0a0a] text-emerald-400 font-bold text-sm transition-all duration-300 hover:scale-[1.03] shadow-xl hover:bg-zinc-900 cursor-pointer flex items-center justify-center gap-2 mx-auto group-hover:shadow-2xl"
                  >
                    <span>Enter the Café Now</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cafe' && (
            <div className="space-y-6">
              {joinedRoomId && joinedRoom ? (
                // Seated Chat / Virtual Table View
                joinedRoom.category === 'classroom' ? (
                  <ClassroomTable 
                    roomId={joinedRoom.id}
                    roomName={joinedRoom.name}
                    isHost={joinedRoom.host?.id === user?.id}
                    onLeave={() => setJoinedRoomId(null)}
                  />
                ) : (
                  <ChatRoom 
                    room={joinedRoom} 
                    onLeave={() => setJoinedRoomId(null)} 
                    currentUser={currentUser}
                  />
                )
              ) : (
                // Cafe Lobby Roster View
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-950/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Active Lobby
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-display font-black italic text-white tracking-wide mt-1 uppercase">
                        CELORIS CAFÉ TABLES
                      </h2>
                    </div>

                    <button 
                      onClick={() => setCreateRoomModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] font-bold text-xs transition-all shadow-[0_4px_12px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Host Custom Table</span>
                    </button>
                  </div>

                  <RoomsGrid 
                    rooms={allRooms} 
                    onJoinRoom={handleJoinRoom}
                    onCreateRoom={() => setCreateRoomModalOpen(true)}
                    currentUser={user}
                    onDeleteRoom={handleDeleteRoom}
                  />
                  
                  {/* Safe secure reminder within lobby list */}
                  <div className="mt-8">
                    <SafeSecure />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'learn' && (
            <LearnTab onUpgradeClick={() => setUpgradeModalOpen(true)} />
          )}

          {activeTab === 'teach' && (
            <TeachTab />
          )}

          {(activeTab === 'video' || activeTab === 'image' || activeTab === '3d') && (
            <CreationToolsDemo toolId={activeTab as 'video' | 'image' | '3d'} />
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM FLOATING NAVIGATION BAR */}
      <div className="sticky bottom-0 z-40 bg-[#0d0d0d] border-t border-emerald-950/40 px-6 py-2.5 flex items-center justify-between lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => { setActiveTab('home'); setJoinedRoomId(null); }}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3.5 rounded-xl transition-colors ${activeTab === 'home' ? 'text-emerald-400' : 'text-gray-500'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button 
          onClick={() => { setActiveTab('cafe'); }}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3.5 rounded-xl transition-colors ${activeTab === 'cafe' && !joinedRoomId ? 'text-emerald-400' : 'text-gray-500'}`}
        >
          <Coffee className="w-5 h-5" />
          <span className="text-[10px] font-bold">Lobby</span>
        </button>

        {joinedRoomId && (
          <button 
            onClick={() => { setActiveTab('cafe'); }}
            className="flex flex-col items-center justify-center gap-1 py-1.5 px-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-pulse"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-black">Chat</span>
          </button>
        )}

        <button 
          onClick={() => { setActiveTab('learn'); setJoinedRoomId(null); }}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3.5 rounded-xl transition-colors ${activeTab === 'learn' ? 'text-emerald-400' : 'text-gray-500'}`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-bold">Learn</span>
        </button>

        <button 
          onClick={() => { setIsOnlineListOpen(true); }}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3.5 rounded-xl text-gray-500"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">Online</span>
        </button>
      </div>

      {/* SIDE DRAWER: "WHO'S ONLINE" INDIAN STUDENTS LIST */}
      <div className={`
        fixed inset-y-0 right-0 z-50 flex flex-col w-80 bg-[#0d0d0d] border-l border-emerald-950/40 text-gray-300
        transform transition-transform duration-300 ease-in-out
        ${isOnlineListOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 border-b border-emerald-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="font-display font-black italic tracking-wide text-white">WHO'S ONLINE</span>
          </div>
          <button 
            onClick={() => setIsOnlineListOpen(false)}
            className="p-1.5 rounded-lg hover:bg-emerald-950/30 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indian students listing */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <span className="px-2 text-[10px] font-bold tracking-[0.15em] text-emerald-600/80 uppercase block mb-1">
            Indian Colleges Active
          </span>

          <div className="space-y-3">
            {MOCK_USERS.map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#121212]/50 border border-emerald-950/10 hover:border-emerald-500/20 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-10 h-10 rounded-full object-cover border border-emerald-950/20"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#121212]"></span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="block text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{student.name}</span>
                      {student.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <span className="block text-[10px] text-gray-500">{student.college || 'Celoris Member'}</span>
                    <span className="block text-[10px] text-emerald-400/80 font-semibold mt-0.5">{student.skill}</span>
                  </div>
                </div>

                <button 
                  onClick={() => inviteUserToTable(student.name)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-500 text-emerald-400 hover:text-[#0a0a0a] text-[10px] font-bold transition-all"
                  title={`Invite ${student.name} to join your current room`}
                >
                  Invite
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-t from-emerald-950/10 to-transparent border-t border-emerald-950/20 text-center">
          <span className="text-[10px] text-gray-500">Every single user verified with official student ID badges</span>
        </div>
      </div>

      {/* OVERLAY BACKGROUNDS */}
      {isOnlineListOpen && (
        <div 
          onClick={() => setIsOnlineListOpen(false)}
          className="fixed inset-0 bg-[#000]/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#000]/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* MODAL: PREMIUM UPGRADE MEMBERSHIP CHECKOUT */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setUpgradeModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <div className="relative bg-[#0d0d0d] border border-emerald-500/30 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(16,185,129,0.15)] animate-fade-in text-center">
            
            <button 
              onClick={() => setUpgradeModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-emerald-950/30 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner mb-2">
                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-display font-black italic tracking-wide text-white uppercase">UPGRADE MEMBERSHIP</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                Secure unlimited HD video screen shares, host premium private study tables, and unlock elite creator suites.
              </p>
            </div>

            <div className="bg-[#121212] border border-emerald-950/30 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-950/20 pb-2.5">
                <span className="text-xs text-gray-400 font-semibold">Celoris Premium Plan</span>
                <span className="text-xs text-emerald-400 font-mono font-bold">₹199 / month</span>
              </div>
              <ul className="space-y-2 text-[11px] text-gray-400">
                <li className="flex items-center gap-2">✓ <span className="text-white">Unlimited 1080p Screen Streams</span></li>
                <li className="flex items-center gap-2">✓ <span className="text-white">Full Video, Image, and 3D Studio suites</span></li>
                <li className="flex items-center gap-2">✓ <span className="text-white">Priority seating with Community Mentors</span></li>
                <li className="flex items-center gap-2">✓ <span className="text-white">Verified Custom Skill Badge styling</span></li>
              </ul>
            </div>

            <button 
              onClick={() => {
                alert("Upgrade Complete: Welcome to Celoris VIP tier! Your premium badges will populate in your profile within a few minutes.");
                setUpgradeModalOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-[#0a0a0a] font-bold text-xs transition-all shadow-[0_4px_15px_rgba(16,185,129,0.25)]"
            >
              Confirm Student Payment (₹199/mo)
            </button>
            <span className="block text-[10px] text-gray-500 leading-none">Pause, cancel, or switch plans anytime from settings dashboard.</span>
          </div>
        </div>
      )}

      {/* MODAL: HOST CUSTOM THEMED ROOM */}
      {createRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setCreateRoomModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative bg-[#0d0d0d] border border-emerald-950/40 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in">
            <button 
              onClick={() => setCreateRoomModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-emerald-950/30 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                <Coffee className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide font-display italic">Host Custom Table</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                Invite friends or open it up to the entire Indian campus roster to sit and study with you.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block text-center">Quick Templates</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {MOCK_ROOMS.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => loadTemplate(template)}
                    className="flex-none w-32 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 hover:border-emerald-500/50 hover:bg-emerald-900/40 text-left transition-all snap-start"
                  >
                    <div className="text-xs font-bold text-emerald-400 truncate">{template.name}</div>
                    <div className="text-[9px] text-gray-500 truncate mt-1">{template.category}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Table Name</label>
                <input 
                  type="text"
                  placeholder="e.g. SRCC Economics Board Room"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Category Focus</label>
                <select 
                  value={newRoomCat}
                  onChange={(e) => setNewRoomCat(e.target.value as any)}
                  className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-gray-300 focus:outline-none"
                >
                  <option value="study">Silent Study Table (Mics Off)</option>
                  <option value="course">Course Lounge (Excel, Figma, Trading)</option>
                  <option value="mixer">Open Mixer (Chai Chat / Social)</option>
                  <option value="night">Night Owl (Past midnight study)</option>
                  <option value="classroom">Classroom Table (Requires 500 Credits)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Short description / Vibe</label>
                <input 
                  type="text"
                  placeholder="e.g. Solving past papers, everyone welcome to screenshare!"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Room tags (comma separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. Economics, Nifty, Figma, Lofi"
                  value={newRoomTags}
                  onChange={(e) => setNewRoomTags(e.target.value)}
                  className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] font-bold text-xs transition-all shadow-[0_4px_12px_rgba(16,185,129,0.15)] cursor-pointer"
              >
                Launch Live Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER PLATFORM */}
      <footer className="bg-[#0b0b0b] border-t border-emerald-950/40 py-10 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-display font-black italic tracking-widest text-white block">CELORIS CAFÉ</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-widest block mt-1">THE VIRTUAL THIRD-PLACE FOR INDIAN STUDENTS</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <a href="#about" className="hover:text-emerald-400 transition-colors">Honor Code</a>
            <a href="#rules" className="hover:text-emerald-400 transition-colors">Safe Space Guidelines</a>
            <a href="#parent" className="hover:text-emerald-400 transition-colors">Parents Information</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Moderation Hotline</a>
          </div>

          <div className="text-center md:text-right text-[11px] text-zinc-600">
            <span>© 2026 Celoris Inc. Verified and secured for Indian college campuses.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
