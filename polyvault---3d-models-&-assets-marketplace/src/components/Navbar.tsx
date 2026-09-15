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
} from 'lucide-react';

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

          {/* User Profile Avatar */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="btn-navbar-profile"
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 transition-colors cursor-pointer shadow-xs"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-zinc-900 leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-zinc-500 leading-none mt-0.5 font-mono">{currentUser.handle}</div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
