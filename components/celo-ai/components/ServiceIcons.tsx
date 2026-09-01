import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const AndroidIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#3DDC84"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.62 1.23 12.83 1 12 1s-1.62.23-2.64.63L7.88.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.54 3.32 5.09 5.47 5 8h14c-.09-2.53-1.54-4.68-3.47-5.84zM9 5.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z" />
  </svg>
);

export const GoogleDriveIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8.07 14.55L4.05 21.5h7.95l4.02-6.95H8.07z" fill="#0066DA" />
    <path d="M15.93 14.55l4.02 6.95c.5-.87.5-1.95 0-2.82L15.97 11.7l-4.02 6.95 3.98-4.1z" fill="#00AC47" />
    <path d="M12 4.5l-4.02 6.95 4.02 6.95 3.98-6.95L12 4.5z" fill="#EA4335" />
    <path d="M16.02 11.45L12 4.5H4.05c-.5.87-.5 1.95 0 2.82l3.97 6.93 8-2.8z" fill="#FFBA00" />
    <path d="M12 4.5L8.03 11.45h7.99L12 4.5z" fill="#00832D" />
    <path d="M4.05 7.32L8.03 14.27 12 7.32 8.03.37 4.05 7.32z" fill="#2684FC" />
  </svg>
);

export const GoogleSheetsIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="18" height="20" rx="3" fill="#0F9D58" />
    <rect x="7" y="7" width="10" height="10" rx="1" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M7 10.5h10M7 13.5h10M12 7v10" stroke="#0F9D58" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const GmailIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335" />
    <path d="M4 6l8 5 8-5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const GoogleCalendarIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#1A73E8" />
    <text x="12" y="16" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
      31
    </text>
    <rect x="6" y="6" width="12" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

export const GoogleDocsIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#4285F4" />
    <line x1="8" y1="8" x2="16" y2="8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="16" x2="13" y2="16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
