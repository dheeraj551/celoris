"use client"
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Tag,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Maximize2,
} from 'lucide-react';
import { Post, User } from '../types';
import { soundManager } from '../utils/sound';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onPostCreated: (newPost: Post) => void;
}

const SAMPLE_PRESETS = [
  {
    title: 'Tokyo Neon Alley',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Nordic Coast Sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Alpine Peak Dawn',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  },
];

const FILTERS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'clarendon', name: 'Clarendon', css: 'contrast-125 saturate-125' },
  { id: 'juno', name: 'Juno', css: 'saturate-150 contrast-110 hue-rotate-15' },
  { id: 'valencia', name: 'Valencia', css: 'sepia-25 brightness-105' },
  { id: 'vintage', name: 'B&W Film', css: 'grayscale contrast-125' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onPostCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_PRESETS[0].url);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape'>('square');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          setStep(2);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    setIsUploading(true);
    setUploadProgress(10);

    // Simulate direct-to-S3 pre-signed upload with chunking & edge processing
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          finishPublish();
          return 100;
        }
        return prev + 25;
      });
    }, 140);
  };

  const finishPublish = () => {
    const extractedTags = caption
      .split(' ')
      .filter((w) => w.startsWith('#'))
      .map((w) => w.replace('#', '').toLowerCase());

    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      images: [selectedImage],
      caption: caption || 'Moments framed in light ✨',
      location: location || 'Tokyo, Japan',
      filter: selectedFilter,
      aspectRatio,
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      tags: extractedTags.length ? extractedTags : ['photography', 'art', 'lumigram'],
    };

    setTimeout(() => {
      soundManager.playSendSound();
      onPostCreated(newPost);
      setIsUploading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && !isUploading && (
              <button
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                aria-label="Go back step"
                className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              {step === 1 && 'Select Photo'}
              {step === 2 && 'Filter & Aspect Ratio'}
              {step === 3 && 'New Post Details'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {step < 3 && (
              <button
                onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 flex items-center gap-1 cursor-pointer"
              >
                Next
                <ArrowRight size={14} />
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleShare}
                disabled={isUploading}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Share
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Choose or drop image */}
          {step === 1 && (
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-pink-500 dark:hover:border-pink-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-neutral-50 dark:bg-neutral-950/50"
              >
                <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center mb-3">
                  <Upload size={32} />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Upload high-resolution photo
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
                  Drag and drop files here or click to browse. Supports JPG, PNG, WEBP with direct cloud edge ingest.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Instant Studio Presets */}
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  Or choose a sample photo
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_PRESETS.map((preset) => (
                    <div
                      key={preset.title}
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setStep(2);
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:ring-2 hover:ring-pink-500 transition-all"
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-[11px] font-medium text-white truncate">
                        {preset.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Filter & Crop */}
          {step === 2 && (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Preview */}
              <div className="md:col-span-2 flex flex-col items-center justify-center bg-neutral-950 rounded-2xl overflow-hidden p-2">
                <div
                  className={`w-full max-w-[380px] overflow-hidden rounded-xl bg-black transition-all ${
                    aspectRatio === 'square'
                      ? 'aspect-square'
                      : aspectRatio === 'portrait'
                      ? 'aspect-[4/5]'
                      : 'aspect-[16/9]'
                  }`}
                >
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className={`w-full h-full object-cover transition-all ${
                      FILTERS.find((f) => f.id === selectedFilter)?.css || ''
                    }`}
                  />
                </div>
              </div>

              {/* Aspect Ratio & Filter Selector */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['square', 'portrait', 'landscape'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                          aspectRatio === ratio
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                            : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {ratio === 'square' ? '1:1' : ratio === 'portrait' ? '4:5' : '16:9'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                    Photo Filter
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFilter(f.id)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedFilter === f.id
                            ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Caption, Location, Tags */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
                    {currentUser.username}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Posting to public feed
                  </span>
                </div>
              </div>

              {/* Caption input */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Write a caption...
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share the story behind this shot... Use #hashtags and @mentions"
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              {/* Location Tag */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1 flex items-center gap-1">
                  <MapPin size={13} className="text-rose-500" />
                  Add Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Shibuya, Tokyo or Dolomites, Italy"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Upload Progress Indicator */}
              {isUploading && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1.5">
                    <span>Direct Object Ingest & WebP Transcoding...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

