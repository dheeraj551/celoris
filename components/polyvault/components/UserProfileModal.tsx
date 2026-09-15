import React, { useState } from 'react';
import { UserProfile, ModelAsset, Coupon, DownloadItem } from '../types';
import {
  X,
  User,
  Download,
  UploadCloud,
  Zap,
  Tag,
  Star,
  Award,
  MapPin,
  Calendar,
  CheckCircle2,
  HardDrive,
  ExternalLink,
  Edit3,
  Sparkles,
} from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile;
  activeCoupon: Coupon | null;
  userUploads: ModelAsset[];
  downloadHistory: DownloadItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: ModelAsset) => void;
  onOpenCouponModal: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onReDownload: (item: DownloadItem) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  activeCoupon,
  userUploads,
  downloadHistory,
  isOpen,
  onClose,
  onSelectAsset,
  onOpenCouponModal,
  onUpdateProfile,
  onReDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'storefront' | 'coupons' | 'edit'>('downloads');
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      bio: editBio,
      location: editLocation,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div
      id="user-profile-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="user-profile-modal"
        className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Profile Banner */}
        <div className="relative p-6 bg-white border-b border-zinc-200">
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-zinc-950">{user.name}</h2>
                <span className="text-xs text-emerald-700 font-mono font-medium">{user.handle}</span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" /> {user.role}
                </span>
                {activeCoupon && (
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" /> TURBO MEMBER
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 max-w-xl">{user.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-zinc-900 font-bold">{user.rating}</span>
                  <span>rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-zinc-100 text-xs">
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <span className="text-zinc-500 text-[10px] uppercase font-bold">Total Downloads</span>
              <div className="text-base font-bold text-zinc-900 mt-0.5">{user.totalDownloads}</div>
            </div>
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <span className="text-zinc-500 text-[10px] uppercase font-bold">Storefront Sales</span>
              <div className="text-base font-bold text-zinc-900 mt-0.5">{user.salesCount}</div>
            </div>
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <span className="text-zinc-500 text-[10px] uppercase font-bold">Download CDN Speed</span>
              <div className="text-base font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{activeCoupon ? '120 MB/s Gigabit' : '350 KB/s Standard'}</span>
              </div>
            </div>
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <span className="text-zinc-500 text-[10px] uppercase font-bold">Active Coupon</span>
              <div className="text-base font-mono font-bold text-emerald-700 mt-0.5">
                {activeCoupon ? activeCoupon.code : 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 px-6 bg-zinc-50 text-xs">
          <button
            id="tab-profile-downloads"
            onClick={() => setActiveTab('downloads')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'downloads'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> My Downloads ({downloadHistory.length})
          </button>

          <button
            id="tab-profile-storefront"
            onClick={() => setActiveTab('storefront')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'storefront'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" /> My 3D Storefront ({userUploads.length})
          </button>

          <button
            id="tab-profile-coupons"
            onClick={() => setActiveTab('coupons')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'coupons'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" /> Coupons & Turbo Pass
          </button>

          <button
            id="tab-profile-edit"
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'edit'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-zinc-800">
          {/* 1. My Downloads Tab */}
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              {downloadHistory.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900">No Downloads Yet</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Any 3D assets or texture packages you download from the marketplace will appear here with unlimited re-download support.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {downloadHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between text-xs hover:border-zinc-300 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <HardDrive className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 text-sm">{item.assetTitle}</div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span className="font-mono font-medium text-emerald-700">.{item.format}</span>
                            <span>•</span>
                            <span>{item.textureRes} PBR</span>
                            <span>•</span>
                            <span>{item.fileSizeMb} MB</span>
                            {item.turboApplied && (
                              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                <Zap className="w-3 h-3 text-emerald-600" /> Gigabit Turbo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onReDownload(item)}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Re-Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. My 3D Storefront */}
          {activeTab === 'storefront' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Assets published under your creator profile:</span>
                <span className="text-xs text-emerald-700 font-bold">{userUploads.length} Models Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {userUploads.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => {
                      onClose();
                      onSelectAsset(model);
                    }}
                    className="p-3 rounded-xl bg-white border border-zinc-200 hover:border-emerald-400 cursor-pointer transition-all space-y-2 group shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-zinc-900 text-xs group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {model.title}
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        {model.price === 0 ? 'FREE' : `$${model.price}`}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                      <span>{model.polyCount.toLocaleString()} Polys</span>
                      <span>{model.downloadsCount} DLs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Coupons & Turbo Pass */}
          {activeTab === 'coupons' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <h3 className="font-bold text-zinc-900 text-sm">Turbo Speed Membership</h3>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    Your account has unthrottled gigabit access when any promo coupon code is active.
                  </p>
                </div>

                <button
                  onClick={onOpenCouponModal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  Manage Coupons
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
                  Active Coupons in Wallet
                </h4>
                {activeCoupon ? (
                  <div className="p-3.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">{activeCoupon.code}</span>
                      <p className="text-xs text-zinc-700 mt-0.5">{activeCoupon.title}</p>
                      <span className="text-[11px] text-emerald-700 font-semibold">{activeCoupon.speedBoost}</span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                      ACTIVATED
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500">
                    No coupon currently active. Use code <strong className="text-emerald-700">TURBO100</strong> for free Gigabit speed!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Edit Profile Tab */}
          {activeTab === 'edit' && (
            <div className="max-w-md space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-save-profile"
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
                {savedSuccess && (
                  <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile updated successfully!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
