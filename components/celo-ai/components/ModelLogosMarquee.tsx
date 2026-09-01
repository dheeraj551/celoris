import React from 'react';
import { Cpu, Check } from 'lucide-react';

export interface ModelInfo {
  name: string;
  provider: string;
  badgeColor: string;
  accentGlow: string;
  textColor: string;
  borderColor: string;
  tag: string;
  iconType:
    | 'deepseek'
    | 'gemini'
    | 'gemma'
    | 'openai'
    | 'grok'
    | 'llama'
    | 'qwen'
    | 'nvidia'
    | 'mistral'
    | 'tencent'
    | 'glm'
    | 'minimax'
    | 'stepfun'
    | 'mercury'
    | 'general';
}

export const ALL_POWERED_MODELS: ModelInfo[] = [
  {
    name: 'Deepseek v3.2',
    provider: 'DeepSeek',
    badgeColor: 'from-[#0066FF]/20 to-[#00D2FF]/10',
    accentGlow: 'rgba(0, 210, 255, 0.4)',
    textColor: '#38bdf8',
    borderColor: '#0284c7',
    tag: 'MoE 671B',
    iconType: 'deepseek',
  },
  {
    name: 'Deepseek V4 Flash',
    provider: 'DeepSeek',
    badgeColor: 'from-[#0052cc]/20 to-[#38bdf8]/10',
    accentGlow: 'rgba(56, 189, 248, 0.4)',
    textColor: '#7dd3fc',
    borderColor: '#0369a1',
    tag: 'Ultra Fast',
    iconType: 'deepseek',
  },
  {
    name: 'Devstral small 2',
    provider: 'Mistral AI',
    badgeColor: 'from-[#FF7000]/20 to-[#FFAE00]/10',
    accentGlow: 'rgba(255, 112, 0, 0.4)',
    textColor: '#fb923c',
    borderColor: '#ea580c',
    tag: 'Coder',
    iconType: 'mistral',
  },
  {
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    badgeColor: 'from-[#1a73e8]/20 to-[#8ab4f8]/10',
    accentGlow: 'rgba(66, 133, 244, 0.45)',
    textColor: '#93c5fd',
    borderColor: '#2563eb',
    tag: 'Multimodal',
    iconType: 'gemini',
  },
  {
    name: 'Gemma 4 26B A4B IT',
    provider: 'Google DeepMind',
    badgeColor: 'from-[#4285f4]/20 to-[#a855f7]/10',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    textColor: '#c084fc',
    borderColor: '#9333ea',
    tag: 'Open Weights',
    iconType: 'gemma',
  },
  {
    name: 'Glm 4.7 Flash',
    provider: 'Zhipu AI',
    badgeColor: 'from-[#00b4d8]/20 to-[#0077b6]/10',
    accentGlow: 'rgba(0, 180, 216, 0.4)',
    textColor: '#67e8f9',
    borderColor: '#0891b2',
    tag: 'Reasoning',
    iconType: 'glm',
  },
  {
    name: 'Glm 4.7 FlashX',
    provider: 'Zhipu AI',
    badgeColor: 'from-[#0096c7]/20 to-[#48cae4]/10',
    accentGlow: 'rgba(72, 202, 228, 0.4)',
    textColor: '#a5f3fc',
    borderColor: '#0e7490',
    tag: 'Extended Context',
    iconType: 'glm',
  },
  {
    name: 'Google Gemm 4 31B',
    provider: 'Google',
    badgeColor: 'from-[#34a853]/20 to-[#4285f4]/10',
    accentGlow: 'rgba(52, 168, 83, 0.4)',
    textColor: '#86efac',
    borderColor: '#16a34a',
    tag: 'High Capacity',
    iconType: 'gemma',
  },
  {
    name: 'Google Gemm 4 26B A4B',
    provider: 'Google',
    badgeColor: 'from-[#4285f4]/20 to-[#ea4335]/10',
    accentGlow: 'rgba(234, 67, 53, 0.4)',
    textColor: '#fca5a5',
    borderColor: '#dc2626',
    tag: 'Agentic',
    iconType: 'gemini',
  },
  {
    name: 'GPT OSS Safeguard 120B',
    provider: 'OpenAI OSS',
    badgeColor: 'from-[#10a37f]/20 to-[#14b8a6]/10',
    accentGlow: 'rgba(16, 163, 127, 0.4)',
    textColor: '#5eead4',
    borderColor: '#0d9488',
    tag: 'Safety Guard',
    iconType: 'openai',
  },
  {
    name: 'GPT-4.1 Nano',
    provider: 'OpenAI',
    badgeColor: 'from-[#10a37f]/20 to-[#22c55e]/10',
    accentGlow: 'rgba(34, 197, 94, 0.4)',
    textColor: '#86efac',
    borderColor: '#16a34a',
    tag: 'Ultra Low Latency',
    iconType: 'openai',
  },
  {
    name: 'GPT 5 nano',
    provider: 'OpenAI',
    badgeColor: 'from-[#10a37f]/25 to-[#00f0ff]/15',
    accentGlow: 'rgba(0, 240, 255, 0.4)',
    textColor: '#6ee7b7',
    borderColor: '#059669',
    tag: 'Next Gen',
    iconType: 'openai',
  },
  {
    name: 'Grok 4.1 fast reasoning',
    provider: 'xAI',
    badgeColor: 'from-[#e2e8f0]/20 to-[#64748b]/10',
    accentGlow: 'rgba(255, 255, 255, 0.35)',
    textColor: '#f8fafc',
    borderColor: '#64748b',
    tag: 'Deep Think',
    iconType: 'grok',
  },
  {
    name: 'Grok 4.1 fast  no reasoning',
    provider: 'xAI',
    badgeColor: 'from-[#cbd5e1]/15 to-[#475569]/10',
    accentGlow: 'rgba(203, 213, 225, 0.3)',
    textColor: '#e2e8f0',
    borderColor: '#475569',
    tag: 'Realtime Response',
    iconType: 'grok',
  },
  {
    name: 'Hy3',
    provider: 'Tencent',
    badgeColor: 'from-[#0052d9]/20 to-[#2ba471]/10',
    accentGlow: 'rgba(0, 82, 217, 0.4)',
    textColor: '#93c5fd',
    borderColor: '#1d4ed8',
    tag: 'Hunyuan 3',
    iconType: 'tencent',
  },
  {
    name: 'kat Coder Air V2.5',
    provider: 'Kat Tech',
    badgeColor: 'from-[#8b5cf6]/20 to-[#ec4899]/10',
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    textColor: '#f472b6',
    borderColor: '#db2777',
    tag: 'Code Synthesis',
    iconType: 'general',
  },
  {
    name: 'Laguna s 2.1',
    provider: 'Laguna AI',
    badgeColor: 'from-[#06b6d4]/20 to-[#3b82f6]/10',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    textColor: '#67e8f9',
    borderColor: '#0891b2',
    tag: 'Adaptive',
    iconType: 'general',
  },
  {
    name: 'Ling 3.0 Flash',
    provider: 'Ling AI',
    badgeColor: 'from-[#f59e0b]/20 to-[#ef4444]/10',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    textColor: '#fcd34d',
    borderColor: '#d97706',
    tag: 'Lightning Fast',
    iconType: 'general',
  },
  {
    name: 'llama 4 Maverick 17B',
    provider: 'Meta',
    badgeColor: 'from-[#0081fb]/20 to-[#7c3aed]/10',
    accentGlow: 'rgba(0, 129, 251, 0.45)',
    textColor: '#60a5fa',
    borderColor: '#2563eb',
    tag: 'Llama 4 Frontier',
    iconType: 'llama',
  },
  {
    name: 'llama 4 Scout 17B',
    provider: 'Meta',
    badgeColor: 'from-[#0668e1]/20 to-[#9333ea]/10',
    accentGlow: 'rgba(147, 51, 234, 0.4)',
    textColor: '#a78bfa',
    borderColor: '#7c3aed',
    tag: 'High Efficiency',
    iconType: 'llama',
  },
  {
    name: 'Mercury 2',
    provider: 'Mercury AI',
    badgeColor: 'from-[#ef4444]/20 to-[#ec4899]/10',
    accentGlow: 'rgba(239, 68, 68, 0.4)',
    textColor: '#f87171',
    borderColor: '#dc2626',
    tag: 'Next Gen Core',
    iconType: 'mercury',
  },
  {
    name: 'Mercury Coder',
    provider: 'Mercury AI',
    badgeColor: 'from-[#f43f5e]/20 to-[#8b5cf6]/10',
    accentGlow: 'rgba(244, 63, 94, 0.4)',
    textColor: '#fb7185',
    borderColor: '#e11d48',
    tag: 'Fullstack Pro',
    iconType: 'mercury',
  },
  {
    name: 'Minimax m2.7',
    provider: 'MiniMax',
    badgeColor: 'from-[#ff3366]/20 to-[#ff9933]/10',
    accentGlow: 'rgba(255, 51, 102, 0.4)',
    textColor: '#fda4af',
    borderColor: '#e11d48',
    tag: 'Conversational',
    iconType: 'minimax',
  },
  {
    name: 'Ministral 14B',
    provider: 'Mistral AI',
    badgeColor: 'from-[#ff7000]/20 to-[#ff0055]/10',
    accentGlow: 'rgba(255, 112, 0, 0.4)',
    textColor: '#fdba74',
    borderColor: '#ea580c',
    tag: 'Edge Ready',
    iconType: 'mistral',
  },
  {
    name: 'Nemotron 3 Nano 30B',
    provider: 'NVIDIA',
    badgeColor: 'from-[#76b900]/20 to-[#00e599]/10',
    accentGlow: 'rgba(118, 185, 0, 0.45)',
    textColor: '#a3e635',
    borderColor: '#65a30d',
    tag: 'Enterprise Math',
    iconType: 'nvidia',
  },
  {
    name: 'nvideo nemotron 3 super',
    provider: 'NVIDIA',
    badgeColor: 'from-[#76b900]/25 to-[#10b981]/15',
    accentGlow: 'rgba(118, 185, 0, 0.5)',
    textColor: '#bef264',
    borderColor: '#4d7c0f',
    tag: 'Flagship Super',
    iconType: 'nvidia',
  },
  {
    name: 'Qwen 3 coder 30 B',
    provider: 'Alibaba Cloud',
    badgeColor: 'from-[#ff6a00]/20 to-[#ff9000]/10',
    accentGlow: 'rgba(255, 106, 0, 0.4)',
    textColor: '#fed7aa',
    borderColor: '#c2410c',
    tag: 'Polyglot Coding',
    iconType: 'qwen',
  },
  {
    name: 'Qwen 3.5 flash',
    provider: 'Alibaba Cloud',
    badgeColor: 'from-[#6366f1]/20 to-[#8b5cf6]/10',
    accentGlow: 'rgba(99, 102, 241, 0.4)',
    textColor: '#c7d2fe',
    borderColor: '#4f46e5',
    tag: 'Sub-second',
    iconType: 'qwen',
  },
  {
    name: 'Qwen 3.7 flash',
    provider: 'Alibaba Cloud',
    badgeColor: 'from-[#4f46e5]/20 to-[#06b6d4]/10',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    textColor: '#a5b4fc',
    borderColor: '#4338ca',
    tag: 'Turbo Stream',
    iconType: 'qwen',
  },
  {
    name: 'Qwen 3 235B a22b instruction',
    provider: 'Alibaba Cloud',
    badgeColor: 'from-[#d946ef]/20 to-[#6366f1]/10',
    accentGlow: 'rgba(217, 70, 239, 0.4)',
    textColor: '#f0abfc',
    borderColor: '#c026d3',
    tag: 'MoE 235B',
    iconType: 'qwen',
  },
  {
    name: 'Qwen 3 14 B',
    provider: 'Alibaba Cloud',
    badgeColor: 'from-[#8b5cf6]/20 to-[#ec4899]/10',
    accentGlow: 'rgba(139, 92, 246, 0.4)',
    textColor: '#ddd6fe',
    borderColor: '#7c3aed',
    tag: 'Instruction Tuned',
    iconType: 'qwen',
  },
  {
    name: 'Qwen 3 30 B',
    provider: 'Alibaba Cloud',
    badgeColor: 'from-[#a855f7]/20 to-[#3b82f6]/10',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    textColor: '#e9d5ff',
    borderColor: '#9333ea',
    tag: 'Reasoning Master',
    iconType: 'qwen',
  },
  {
    name: 'stepfun 3.5 Flash',
    provider: 'StepFun',
    badgeColor: 'from-[#ec4899]/20 to-[#8b5cf6]/10',
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    textColor: '#fbcfe8',
    borderColor: '#db2777',
    tag: 'Visual AI',
    iconType: 'stepfun',
  },
  {
    name: 'Tencent HY-MT2-pro',
    provider: 'Tencent',
    badgeColor: 'from-[#0052d9]/20 to-[#00a870]/10',
    accentGlow: 'rgba(0, 82, 217, 0.4)',
    textColor: '#93c5fd',
    borderColor: '#1d4ed8',
    tag: 'Multilingual Pro',
    iconType: 'tencent',
  },
  {
    name: 'Tencent Hy3',
    provider: 'Tencent',
    badgeColor: 'from-[#0052d9]/25 to-[#00b4d8]/15',
    accentGlow: 'rgba(0, 180, 216, 0.4)',
    textColor: '#bae6fd',
    borderColor: '#0284c7',
    tag: 'Hunyuan 3.0',
    iconType: 'tencent',
  },
  {
    name: 'Trinity Large thinking',
    provider: 'Trinity AI',
    badgeColor: 'from-[#14b8a6]/20 to-[#6366f1]/10',
    accentGlow: 'rgba(20, 184, 166, 0.45)',
    textColor: '#99f6e4',
    borderColor: '#0d9488',
    tag: 'Chain of Thought',
    iconType: 'general',
  },
];

export const ProviderIcon: React.FC<{ type: ModelInfo['iconType']; className?: string }> = ({
  type,
  className = 'w-4 h-4',
}) => {
  switch (type) {
    case 'deepseek':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12c0 3.5 1.8 6.58 4.55 8.37l.45.29v-2.82c-1.84-1.42-3-3.66-3-6.17 0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.51-1.16 4.75-3 6.17v2.82l.45-.29C19.2 18.58 21 15.5 21 12c0-5.52-4.48-10-9-10z"
            fill="#00D2FF"
          />
          <circle cx="12" cy="12" r="3.5" fill="#0066FF" />
          <path d="M12 6.5v2M12 15.5v2M6.5 12h2M15.5 12h2" stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'gemini':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
            fill="url(#gemini-icon-grad)"
          />
          <defs>
            <linearGradient id="gemini-icon-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4285F4" />
              <stop offset="0.33" stopColor="#9B72CB" />
              <stop offset="0.66" stopColor="#D96570" />
              <stop offset="1" stopColor="#FBBC04" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'gemma':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 21,8 21,16 12,22 3,16 3,8" stroke="#A855F7" strokeWidth="2" fill="#A855F7" fillOpacity="0.25" />
          <polygon points="12,6 18,10 18,14 12,18 6,14 6,10" fill="#38BDF8" />
        </svg>
      );
    case 'openai':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#10A37F" strokeWidth="1.75" />
          <path
            d="M12 7.5c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5S7.5 14.485 7.5 12 9.515 7.5 12 7.5z"
            stroke="#10A37F"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="1.5" fill="#10A37F" />
        </svg>
      );
    case 'grok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M4 4L20 20M20 4L4 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 4v16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 'llama':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 16c-2.21 0-4-1.79-4-4s1.79-4 4-4c2.5 0 3.5 3 5 4 1.5-1 2.5-4 5-4 2.21 0 4 1.79 4 4s-1.79 4-4 4c-2.5 0-3.5-3-5-4-1.5 1-2.5 4-5 4z"
            stroke="#0081FB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="12" r="1.2" fill="#A855F7" />
          <circle cx="16" cy="12" r="1.2" fill="#0081FB" />
        </svg>
      );
    case 'nvidia':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 8c0 4.42 3.58 8 8 8 2.3 0 4.38-.97 5.84-2.52C17.5 15.82 14.97 17.5 12 17.5 8.41 17.5 5.5 14.59 5.5 11c0-2.3.97-4.38 2.52-5.84C6.68 6.5 5 9.03 5 12z"
            fill="#76B900"
          />
          <path
            d="M12 5.5c3.59 0 6.5 2.91 6.5 6.5 0 2.3-.97 4.38-2.52 5.84C17.32 16.5 19 13.97 19 11c0-4.42-3.58-8-8-8-2.3 0-4.38.97-5.84 2.52C6.5 6.82 9.03 5.5 12 5.5z"
            fill="#76B900"
          />
        </svg>
      );
    case 'mistral':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="4.5" height="4.5" rx="1" fill="#FF7000" />
          <rect x="15.5" y="4" width="4.5" height="4.5" rx="1" fill="#FF7000" />
          <rect x="4" y="15.5" width="4.5" height="4.5" rx="1" fill="#FF7000" />
          <rect x="15.5" y="15.5" width="4.5" height="4.5" rx="1" fill="#FF7000" />
          <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" fill="#FFAE00" />
        </svg>
      );
    case 'qwen':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L20 8V16L12 21L4 16V8L12 3Z"
            stroke="#FF6A00"
            strokeWidth="1.75"
            fill="#FF6A00"
            fillOpacity="0.15"
          />
          <path d="M12 7L16 10V14L12 17L8 14V10L12 7Z" fill="#FFAE00" />
        </svg>
      );
    case 'tencent':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="#0052D9" strokeWidth="1.75" />
          <path d="M12 6L14 10L18 12L14 14L12 18L10 14L6 12L10 10L12 6Z" fill="#00A870" />
        </svg>
      );
    case 'glm':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#00B4D8" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="4" fill="#0077B6" />
          <circle cx="12" cy="12" r="1.5" fill="#90E0EF" />
        </svg>
      );
    case 'minimax':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M4 14V10M8 17V7M12 19V5M16 17V7M20 14V10" stroke="#FF3366" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'stepfun':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M4 18L9 13L14 16L20 6" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="6" r="2" fill="#EC4899" />
        </svg>
      );
    case 'mercury':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" stroke="#EF4444" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3.5" fill="#F43F5E" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#8B5CF6" strokeWidth="2" />
          <path d="M12 7v10M7 12h10" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};

interface ModelLogosMarqueeProps {
  selectedModel?: string;
  onSelectModel?: (modelName: string) => void;
}

export const ModelLogosMarquee: React.FC<ModelLogosMarqueeProps> = ({
  selectedModel,
  onSelectModel,
}) => {
  // Split models into two distinct rows for dual marquee motion
  const half = Math.ceil(ALL_POWERED_MODELS.length / 2);
  const row1 = ALL_POWERED_MODELS.slice(0, half);
  const row2 = ALL_POWERED_MODELS.slice(half);

  const renderBadge = (model: ModelInfo, keyPrefix: string) => {
    const isSelected = selectedModel?.toLowerCase() === model.name.toLowerCase();

    return (
      <button
        key={`${keyPrefix}-${model.name}`}
        type="button"
        onClick={() => onSelectModel?.(model.name)}
        className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all duration-200 cursor-pointer flex-shrink-0 select-none ${
          isSelected
            ? 'bg-[#1f2937] border-[#00f0ff] shadow-[0_0_16px_rgba(0,240,255,0.35)] scale-105'
            : 'bg-[#18191a]/90 hover:bg-[#222427] border-[#2e3135] hover:border-[#4b5563] shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:scale-[1.02]'
        }`}
        title={`Select ${model.name} (${model.provider})`}
      >
        {/* Provider Icon */}
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <ProviderIcon type={model.iconType} className="w-4 h-4" />
        </div>

        {/* Model Name & Provider */}
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-semibold tracking-tight transition-colors ${
                isSelected ? 'text-[#00f0ff]' : 'text-[#e5e7eb] group-hover:text-white'
              }`}
            >
              {model.name}
            </span>
            {isSelected && <Check className="w-3.5 h-3.5 text-[#00f0ff] flex-shrink-0" />}
          </div>
          <span className="text-[10px] text-[#8e918f] group-hover:text-[#a1a1aa] font-medium mt-0.5">
            {model.provider}
          </span>
        </div>

        {/* Tag Pill */}
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-md font-mono font-medium tracking-wide uppercase ml-1 flex-shrink-0 border"
          style={{
            color: model.textColor,
            borderColor: `${model.borderColor}55`,
            backgroundColor: `${model.borderColor}1a`,
          }}
        >
          {model.tag}
        </span>
      </button>
    );
  };

  return (
    <section className="w-full mt-10 mb-4 pt-6 pb-4 border-t border-[#262626]/80 flex flex-col items-center overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-4 px-4">
        <p className="text-xs sm:text-sm text-[#8e918f] max-w-xl">
          Seamlessly orchestrating the world&apos;s leading LLMs, reasoning kernels, coding specialists, and lightweight vision models.
        </p>
      </div>

      {/* Marquee Wrapper with Edge Fade Gradients */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left Fade Gradient Mask */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#131314] to-transparent z-10 pointer-events-none" />

        {/* Right Fade Gradient Mask */}
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#131314] to-transparent z-10 pointer-events-none" />

        {/* Strip 1: Scrolling Left */}
        <div className="flex w-full overflow-hidden mb-3">
          <div className="animate-marquee-left flex gap-3 pr-3">
            {row1.map((m) => renderBadge(m, 'r1-a'))}
            {row1.map((m) => renderBadge(m, 'r1-b'))}
          </div>
        </div>

        {/* Strip 2: Scrolling Right */}
        <div className="flex w-full overflow-hidden">
          <div className="animate-marquee-right flex gap-3 pr-3">
            {row2.map((m) => renderBadge(m, 'r2-a'))}
            {row2.map((m) => renderBadge(m, 'r2-b'))}
          </div>
        </div>
      </div>

      {/* Subtle Hint */}
      <div className="mt-3 text-[11px] text-[#6b7280] flex items-center gap-1.5">
        <Cpu className="w-3 h-3 text-[#00f0ff]" />
        <span>Click any model badge or use the header dropdown to switch intelligence engines</span>
      </div>
    </section>
  );
};
