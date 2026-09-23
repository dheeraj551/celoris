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
  Compass,
  ArrowLeft,
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Celoris Brand & Back to Main + PolyVault Brand */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Back to Celoris Main Website */}
          <Link
            href="/"
            id="btn-back-to-celoris"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200/90 hover:border-emerald-300 text-zinc-700 hover:text-emerald-700 transition-all cursor-pointer shadow-xs"
            title="Back to Celoris Main Website"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:-translate-x-0.5 transition-transform" />
            <img
              src="/celoris-logo-dark.png"
              alt="Celoris Logo"
              className="h-5 sm:h-6 w-auto object-contain"
            />
            <span className="text-[11px] font-bold tracking-tight hidden md:inline text-zinc-600 group-hover:text-emerald-700">
              Home
            </span>
          </Link>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-zinc-200 hidden sm:block" />

          {/* PolyVault Brand */}
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Box className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black tracking-tight text-base sm:text-lg text-zinc-950">POLYVAULT</span>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                  3D Store
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 hidden lg:block font-medium">
                Next-Gen 3D Assets, WebGL Studio & Edge CDN
              </p>
            </div>
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
            className={`px-3 sm:px-3.5 py-1.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-xs ${
              activeCoupon
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900 shadow-emerald-500/10'
                : 'bg-white/90 border-zinc-200/90 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            <div className="relative">
              <Zap className={`w-4 h-4 ${activeCoupon ? 'text-emerald-600 animate-pulse' : 'text-emerald-500'}`} />
              {activeCoupon && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
              )}
            </div>
            <div className="text-left hidden xs:block">
              <div className="text-[11px] font-bold leading-tight flex items-center gap-1">
                <span>{activeCoupon ? `${activeCoupon.code} Active` : 'Speed Coupons'}</span>
                {activeCoupon && (
                  <span className="bg-emerald-600 text-white text-[9px] px-1 rounded font-mono">120 MB/s</span>
                )}
              </div>
              <div className="text-[9px] text-zinc-500 leading-tight">
                {activeCoupon ? 'Direct Gigabit Pipeline' : 'Unlock Turbo Download'}
              </div>
            </div>
          </motion.button>

          {/* Upload 3D Asset CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="btn-navbar-upload"
            onClick={onOpenUploadModal}
            className="hidden md:flex px-4 py-2 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 hover:text-zinc-950 text-xs font-bold items-center gap-2 transition-all cursor-pointer shadow-xs hover:border-zinc-300"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Publish Model</span>
          </motion.button>

          {/* Real Account Menu */}
          {authLoading ? (
            <div className="w-9 h-9 rounded-2xl bg-zinc-100 animate-pulse border border-zinc-200" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="btn-navbar-profile"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white/90 hover:bg-white border border-zinc-200/90 transition-all cursor-pointer shadow-xs hover:border-zinc-300"
                >
                  <div className="relative">
                    <Avatar className="w-7 h-7 rounded-xl border border-emerald-500/40">
                      <AvatarImage
                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                        alt={profile?.full_name || 'User'}
                        className="rounded-xl object-cover"
                      />
                      <AvatarFallback className="rounded-xl bg-emerald-100 text-emerald-700 text-xs font-bold">
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
              <DropdownMenuContent align="end" className="w-56 bg-white border-zinc-200 text-zinc-900 rounded-2xl shadow-xl p-1.5">
                <DropdownMenuLabel className="text-zinc-900 px-2 py-1.5">
                  <div className="font-bold truncate">{profile?.full_name || user.email?.split('@')[0]}</div>
                  <div className="text-[11px] font-normal text-zinc-500 truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer rounded-xl">
                  <Link href="/"><ArrowLeft className="w-4 h-4 mr-2 text-emerald-600" /> Back to Main Website</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer rounded-xl">
                  <Link href="/learn"><BookOpen className="w-4 h-4 mr-2 text-emerald-600" /> Learn</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer rounded-xl">
                  <Link href="/teach"><GraduationCap className="w-4 h-4 mr-2 text-emerald-600" /> Teach</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer rounded-xl">
                  <Link href="/celoris-tv"><Tv className="w-4 h-4 mr-2 text-emerald-600" /> Celoris TV</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 cursor-pointer rounded-xl">
                  <Link href="/job-center"><Briefcase className="w-4 h-4 mr-2 text-emerald-600" /> Job Center</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuItem disabled className="text-zinc-500 opacity-100 px-2">
                  <Wallet className="w-4 h-4 mr-2 text-emerald-600" /> Credits: {profile?.wallet_balance ?? '0'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs shadow-emerald-600/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};
