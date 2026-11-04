import React from 'react';
import { 
  Sun, 
  Moon, 
  Type, 
  RotateCcw, 
  Eye, 
  Sliders, 
  Check, 
  Sparkles,
  ShieldCheck,
  User,
  Monitor
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface SettingsPanelProps {
  currentUser: UserAccount;
  currentRole: UserRole;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  onResetPreferences: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  currentUser,
  currentRole,
  theme,
  onThemeChange,
  fontScale,
  onFontScaleChange,
  highContrast,
  onHighContrastChange,
  onResetPreferences
}) => {
  const fontPresets = [
    { label: 'Compact', scale: 85 },
    { label: 'Normal', scale: 100 },
    { label: 'Medium', scale: 110 },
    { label: 'Large', scale: 120 },
    { label: 'Extra Large', scale: 130 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="bg-[#18191E] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D4F938]/15 via-[#C6B5FD]/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-[#D4F938] mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>Personalization &amp; Accessibility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              System Settings &amp; Appearance
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Customize your theme, adjust application-wide text scaling, and configure high-contrast readability settings for your {currentRole.toUpperCase()} account.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onResetPreferences}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Theme Selection: Dark & Light */}
      <div className="bg-white dark:bg-[#1A1C23] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500 dark:hidden" />
              <Moon className="w-5 h-5 text-[#D4F938] hidden dark:block" />
              <span>Color Theme</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Choose your preferred interface lighting. Dark mode reduces eye fatigue in low light, while Light mode offers crisp daytime contrast.
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200">
            {theme === 'dark' ? 'Dark Active' : 'Light Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          
          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#18191E] text-white border-[#D4F938] ring-2 ring-[#D4F938]/30 shadow-lg'
                : 'bg-[#18191E]/90 text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4F938]/20 text-[#D4F938] flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </div>
              {theme === 'dark' && (
                <span className="w-6 h-6 rounded-full bg-[#D4F938] text-slate-950 flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h4 className="text-sm font-black text-white">Dark Theme (Default)</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Deep obsidian palette with glowing neon-lime accents. Ideal for comfortable viewing, low glare, and high visual hierarchy.
            </p>
            <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-white/10">
              <span className="w-3 h-3 rounded-full bg-[#18191E] border border-white/20" />
              <span className="w-3 h-3 rounded-full bg-[#D4F938]" />
              <span className="w-3 h-3 rounded-full bg-[#C6B5FD]" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">Obsidian + Neon Lime</span>
            </div>
          </button>

          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-50 text-slate-900 border-blue-600 ring-2 ring-blue-500/20 shadow-lg'
                : 'bg-slate-50/70 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              {theme === 'light' && (
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h4 className="text-sm font-black text-slate-900">Light Theme</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Crisp daylight background with high-contrast obsidian typography and sharp jewel-toned status badges for maximum legibility.
            </p>
            <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-slate-200">
              <span className="w-3 h-3 rounded-full bg-white border border-slate-300" />
              <span className="w-3 h-3 rounded-full bg-[#18191E]" />
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-[10px] text-slate-500 font-mono ml-2">Pure White + Slate</span>
            </div>
          </button>

        </div>
      </div>

      {/* 2. Font Size Adjustment Bar */}
      <div className="bg-white dark:bg-[#1A1C23] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Type className="w-5 h-5 text-indigo-600 dark:text-[#C6B5FD]" />
              <span>Font Size &amp; Text Scaling</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Adjust the slider bar to enlarge or condense text throughout the entire app, including titles, tables, cards, and modal windows.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 font-mono text-xs font-black text-slate-900 dark:text-white">
            <span>Scale:</span>
            <span className="text-indigo-600 dark:text-[#D4F938]">{fontScale}%</span>
            <span className="text-slate-400 text-[10px]">({((fontScale / 100) * 16).toFixed(1)}px base)</span>
          </div>
        </div>

        {/* The Font Size Range Slider Bar */}
        <div className="mt-6 p-6 rounded-2xl bg-[#F4F5F8] dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <span className="text-xs">A</span>
              <span>Smaller (85%)</span>
            </span>
            <span className="text-slate-700 dark:text-slate-300">100% Default</span>
            <span className="flex items-center gap-1">
              <span>Larger (130%)</span>
              <span className="text-lg font-black">A</span>
            </span>
          </div>

          {/* Slider input */}
          <div className="relative flex items-center py-2">
            <input
              type="range"
              min="85"
              max="130"
              step="5"
              value={fontScale}
              onChange={e => onFontScaleChange(Number(e.target.value))}
              aria-label="Font scale adjustment bar"
              className="w-full h-3 bg-slate-300 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#18191E] dark:accent-[#D4F938]"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-4 flex-wrap">
            {fontPresets.map(preset => (
              <button
                key={preset.scale}
                type="button"
                onClick={() => onFontScaleChange(preset.scale)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  fontScale === preset.scale
                    ? 'bg-[#18191E] text-white dark:bg-[#D4F938] dark:text-slate-950 shadow-sm scale-105'
                    : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200/60 dark:border-white/5'
                }`}
              >
                {preset.label} ({preset.scale}%)
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Live Text Preview */}
        <div className="mt-5 p-5 rounded-2xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Live Scaled Text Preview
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-[#D4F938] flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>Real-time typography render</span>
            </span>
          </div>

          <h4 className="font-extrabold text-slate-900 dark:text-white tracking-tight mb-1 text-base">
            DBIT ProjectTrack: Stage Gate Clearance Active
          </h4>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Topic similarity screening verified at 75% threshold. Stage-Gate Review 1 deliverable submitted with automated plagiarism check and faculty guide sign-off workflow.
          </p>
        </div>
      </div>

      {/* 3. Text Contrast & Readability Enhancements */}
      <div className="bg-white dark:bg-[#1A1C23] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600 dark:text-[#D4F938]" />
              <span>Readability &amp; High-Contrast Mode</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Enforces deep obsidian text on all white boxes and cards so statistics, table rows, and labels are 100% visible and razor sharp.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-black/30 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-slate-900 dark:text-white block">
              High-Contrast Cards &amp; Metric Badges
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              Uses high-contrast color values for stat cards, ensuring text never blends into white or dark backgrounds.
            </span>
          </div>

          <button
            type="button"
            onClick={() => onHighContrastChange(!highContrast)}
            className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              highContrast ? 'bg-[#18191E] dark:bg-[#D4F938]' : 'bg-slate-300 dark:bg-white/20'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full bg-white dark:bg-slate-950 absolute top-1 transition-transform ${
                highContrast ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Active Account Profile Overview */}
      <div className="bg-white dark:bg-[#1A1C23] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#18191E] text-[#D4F938] flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Active User Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Institutional account credentials and authority scope
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-4">
          <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
            <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">{currentUser.name}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Institutional Email</span>
            <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">{currentUser.email}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Authority Role</span>
            <span className="text-xs font-black text-[#18191E] dark:text-[#D4F938] uppercase tracking-wider block mt-0.5">
              {currentRole} Controller
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
