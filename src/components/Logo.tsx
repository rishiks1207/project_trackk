import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
  showText?: boolean;
  roleBadge?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showText = true,
  roleBadge,
  className = ''
}) => {
  // Dimension mapping
  const iconDimensions = {
    sm: { box: 'w-8 h-8 rounded-xl p-1', svg: 'w-6 h-6', text: 'text-base', subText: 'text-[9px]' },
    md: { box: 'w-10 h-10 rounded-xl p-1.5', svg: 'w-7 h-7', text: 'text-lg', subText: 'text-[10px]' },
    lg: { box: 'w-12 h-12 rounded-2xl p-2', svg: 'w-8 h-8', text: 'text-2xl', subText: 'text-[11px]' },
    xl: { box: 'w-16 h-16 rounded-2xl p-2.5', svg: 'w-10 h-10', text: 'text-3xl', subText: 'text-xs' },
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 inline-flex select-none group ${className}`}>
      {/* High-Contrast, Ultra-Visible Neon-Lime Emblem Container */}
      <div className="relative shrink-0">
        {/* Ambient Glow */}
        <div className="absolute -inset-1 rounded-xl bg-[#D4F938] blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
        
        {/* Vivid Neon-Lime Badge with Deep Charcoal Inset Mark */}
        <div className={`${iconDimensions.box} relative bg-gradient-to-tr from-[#D4F938] via-[#ebff75] to-[#a6ee18] text-slate-950 flex items-center justify-center shadow-lg shadow-[#D4F938]/25 border border-white/40 overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
          {/* Dual-Tone Cybernetic Stage-Gate Emblem */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${iconDimensions.svg} shrink-0 drop-shadow-xs`}
          >
            {/* Outer Obsidian Shield */}
            <path 
              d="M12 2L20.5 6.9V17.1L12 22L3.5 17.1V6.9L12 2Z" 
              fill="#0F1117" 
            />
            {/* Inner Neon Gate Channel */}
            <path 
              d="M12 5.6L17.2 8.6V15.4L12 18.4L6.8 15.4V8.6L12 5.6Z" 
              fill="#D4F938" 
            />
            {/* Obsidian Core Velocity Vector (Milestone Progress) */}
            <path 
              d="M12 8L15 11.2H13.2V16H10.8V11.2H9L12 8Z" 
              fill="#0F1117" 
            />
          </svg>
        </div>
      </div>

      {/* Brand Name Text Block */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${iconDimensions.text} font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} font-sans`}>
              DBIT
            </span>
            <span className={`${iconDimensions.text} font-black tracking-tight text-[#D4F938] font-sans drop-shadow-[0_0_12px_rgba(212,249,56,0.35)]`}>
              ProjectTrack
            </span>
          </div>

          {roleBadge ? (
            <span className={`${iconDimensions.subText} text-[#D4F938] font-bold tracking-widest uppercase mt-0.5 flex items-center gap-1.5`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4F938] inline-block shadow-xs shadow-[#D4F938]" />
              {roleBadge}
            </span>
          ) : (
            <span className={`${iconDimensions.subText} ${isLight ? 'text-slate-500' : 'text-slate-400'} font-medium tracking-wider uppercase mt-0.5`}>
              Stage-Gate &amp; Similarity Portal
            </span>
          )}
        </div>
      )}
    </div>
  );
};
