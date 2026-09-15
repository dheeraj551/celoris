import React from 'react';
import { motion } from 'motion/react';
import { Coupon, UserProfile } from '../types';
import {
  Box,
  Zap,
  Tag,
  Upload,
  User,
  Sparkles,
  ShieldCheck,
  RotateCw,
  LogOut,
  BookOpen,
  GraduationCap,
  Tv,
  Briefcase,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  activeCoupon: Coupon | null;
  currentUser: UserProfile;
  onOpenCouponModal: () => void;
  onOpenUploadModal: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCoupon,
  currentUser,
  onOpenCouponModal,
  onOpenUploadModal,
  onOpenProfileModal,
}) => {
  const { user, profile, loading: authLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/90 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-emerald-600" />
            </div>
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-lg text-zinc-950">POLYVAULT</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                3D Store
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 hidden sm:block">Next-Gen 3D Assets & Fast Speed CDN</p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Turbo Speed & Coupon Pill */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="btn-navbar-coupon"
            onClick={onOpenCouponModal}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeCoupon
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeCoupon ? 'text-emerald-600 animate-pulse' : 'text-emerald-500'}`} />
            <div className="text-left hidden xs:block">
              <div className="text-[11px] font-bold leading-tight">
                {activeCoupon ? `${activeCoupon.code} Active` : 'Speed Coupons'}
              </div>
              <div className="text-[9px] text-zinc-500 leading-tight">
                {activeCoupon ? '120 MB/s Gigabit CDN' : 'Unlock Turbo Speed'}
              </div>
            </div>
          </motion.button>

          {/* Upload 3D Asset CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="btn-navbar-upload"
            onClick={onOpenUploadModal}
            className="hidden md:flex px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 hover:text-zinc-950 text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Publish Model</span>
          </motion.button>

          {/* Real Account Menu */}
          {authLoading ? (
            <div className="w-9 h-9 rounded-xl bg-zinc-100 animate-pulse border border-zinc-200" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="btn-navbar-profile"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 transition-colors cursor-pointer shadow-xs"
                >
                  <div className="relative">
                    <Avatar className="w-7 h-7 rounded-lg border border-emerald-500/40">
                      <AvatarImage
                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                        alt={profile?.full_name || 'User'}
                        className="rounded-lg object-cover"
                      />
                      <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-zinc-900 leading-none">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-[10px] text-zinc-500 leading-none mt-0.5 font-mono truncate max-w-[110px]">
                      {user.email}
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-zinc-200 text-zinc-900">
                <DropdownMenuLabel className="text-zinc-900">
                  <div className="font-semibold truncate">{profile?.full_name || user.email?.split('@')[0]}</div>
                  <div className="text-[11px] font-normal text-zinc-500 truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-200" />
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer">
                  <Link href="/learn"><BookOpen className="w-4 h-4 mr-2 text-emerald-600" /> Learn</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer">
                  <Link href="/teach"><GraduationCap className="w-4 h-4 mr-2 text-emerald-600" /> Teach</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer">
                  <Link href="/celoris-tv"><Tv className="w-4 h-4 mr-2 text-emerald-600" /> Celoris TV</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer">
                  <Link href="/job-center"><Briefcase className="w-4 h-4 mr-2 text-emerald-600" /> Job Center</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-200" />
                <DropdownMenuItem disabled className="text-zinc-500 opacity-100">
                  <Wallet className="w-4 h-4 mr-2 text-emerald-600" /> Credits: {profile?.wallet_balance ?? '0'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-200" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};
