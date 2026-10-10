import React, { useState } from 'react';
import { getStudentDisplayPicture } from '@/lib/student-avatars';

export interface StudentAvatarProps {
  student?: {
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'circle' | 'rounded-2xl';
  showStatusIndicator?: boolean;
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg',
};

export function StudentAvatar({
  student,
  size = 'md',
  className = '',
  shape = 'circle',
  showStatusIndicator = false,
}: StudentAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const name = student?.name || 'Student';
  const initial = name.trim().charAt(0).toUpperCase() || 'S';
  const avatarUrl = getStudentDisplayPicture(student);

  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center font-bold overflow-hidden select-none bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/80 border border-emerald-400/40 shadow-sm ${SIZE_CLASSES[size]} ${roundedClass} ${className}`}
      title={name}
    >
      {/* Underlying fallback initial letter */}
      <span className="font-extrabold uppercase tracking-tight">{initial}</span>

      {/* Photorealistic Student Display Picture */}
      {!imgError && avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          className={`w-full h-full object-cover absolute inset-0 ${roundedClass}`}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}

      {/* Optional Active Green Dot Indicator */}
      {showStatusIndicator && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-600/30"
          title="Online / Active Student"
        />
      )}
    </div>
  );
}

export default StudentAvatar;
