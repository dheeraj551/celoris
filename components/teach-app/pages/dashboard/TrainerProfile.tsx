import { useState, useRef } from 'react';
import { User, Mail, Globe, MapPin, Camera, Save, Pencil, Trash2, Plus, ExternalLink, Linkedin, Twitter, Youtube, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';

export function TrainerProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.description || '',
    expertise: profile?.specialty || '',
    experience: '8+ Years',
    location: 'Mumbai, India',
    website: 'https://celoris.in',
    linkedin: '',
    twitter: '',
  });

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          description: formData.bio,
          specialty: formData.expertise,
        })
        .eq('id', user?.id);

      if (error) throw error;
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Trainer Profile</h1>
          <p className="text-gray-500 mt-1 font-medium">Customize your public presence on the Celoris Teach platform</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
          )}
          {success ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photo & Basics */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-50 to-teal-50 -z-0" />
            
            <div className="relative mt-4">
              <div className="w-32 h-32 rounded-[2rem] bg-emerald-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {profile?.avatar_url || profile?.profile_pic_url ? (
                  <img src={profile.avatar_url || profile.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-emerald-500" />
                )}
              </div>
              <button 
                onClick={handleAvatarUpload}
                className="absolute -bottom-2 -right-2 bg-emerald-600 p-3 rounded-2xl text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            </div>

            <div className="mt-8 relative w-full">
              <h3 className="text-xl font-black text-gray-900 leading-tight">{formData.full_name || 'Sonia M'}</h3>
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mt-1 italic">Verified Instructor</p>
              
              <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold line-clamp-1">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold">{formData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Globe size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold truncate">{formData.website}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <h4 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-6 italic">Profile Strength</h4>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-black tracking-tighter italic">85%</span>
              <span className="text-xs font-bold text-emerald-300">Great!</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-emerald-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                <CheckCircle size={12} /> Add Bio
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                <CheckCircle size={12} /> Specialization
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                <Plus size={12} className="animate-pulse" /> Add Socials
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 italic">
              <Pencil className="text-emerald-600" size={24} /> Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Display Name</label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. Sonia M"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Years of Experience</label>
                <input 
                  type="text" 
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. 5+ Years"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Specialties (Expertise)</label>
                <input 
                  type="text" 
                  value={formData.expertise}
                  onChange={e => setFormData({...formData, expertise: e.target.value})}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. Creative Direction, UI/UX Design"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Professional Bio</label>
                <textarea 
                  rows={6}
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-8 py-6 rounded-[2rem] outline-none transition-all font-bold text-gray-900 shadow-inner leading-relaxed"
                  placeholder="Tell students about your background, teaching style, and passion..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic">
                <ExternalLink className="text-emerald-600" size={24} /> Social Connectivity
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect with Students</span>
            </div>

            <div className="space-y-6">
              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Linkedin size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="LinkedIn URL"
                  className="w-full bg-gray-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-blue-500/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>

              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-xl">
                  <Twitter size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Twitter URL"
                  className="w-full bg-gray-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-slate-900/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>

              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-red-50 text-red-600 rounded-xl">
                  <Youtube size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="YouTube Channel"
                  className="w-full bg-gray-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-red-500/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-[1.25rem] group-hover:bg-red-600 group-hover:text-white transition-all">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="font-black text-red-900 uppercase tracking-tight italic">Deactivate Profile</h4>
                <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest opacity-80">This will hide your profile from learners</p>
              </div>
            </div>
            <button className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
              Request Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
