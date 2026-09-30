import React from 'react';
import { CrownSvg } from '../svg/CrownSvg';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSound } from '../../context/SoundContext';
import { Volume2, VolumeX, Globe, LogOut, ShieldAlert, Sparkles, Maximize, Minimize } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, dbStatus } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isMuted, toggleMute, reducedMotion, toggleReducedMotion } = useSound();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="w-full bg-cream/95 backdrop-blur-md border-b border-sand shadow-sm sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-gold/15 p-2 rounded-xl border border-gold/30 flex items-center justify-center">
            <CrownSvg size="sm" />
          </div>
          <div>
            <h1 className="font-serif font-black text-lg sm:text-xl text-royal-brown tracking-wide flex items-center gap-1.5">
              <span>{t.appTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark font-sans font-bold border border-gold/30">
                5-30P
              </span>
            </h1>
          </div>
        </div>

        {/* Global Controls & User Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Database Alert Icon if disconnected */}
          {dbStatus && !dbStatus.isDbConnected && (
            <div
              title={dbStatus.message}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-medium cursor-help"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>DB Setup Notice</span>
            </div>
          )}

          {/* Reduced Motion Toggle */}
          <button
            onClick={toggleReducedMotion}
            className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1 ${
              reducedMotion
                ? 'bg-gold text-cream border-gold-dark'
                : 'bg-beige/60 text-royal-brown hover:bg-beige border-sand'
            }`}
            title="Toggle Reduced Motion"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">{t.reducedMotion}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-beige/60 hover:bg-beige text-royal-brown border border-sand transition-all"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-coral-deep" /> : <Volume2 className="w-4 h-4 text-gold-dark" />}
          </button>

          {/* Fullscreen Mobile Game Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-beige/60 hover:bg-beige text-royal-brown border border-sand transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (App Mode)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-gold-dark" /> : <Maximize className="w-4 h-4 text-gold-dark" />}
          </button>

          {/* Language Toggle (EN / TA) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="px-2.5 py-1.5 rounded-xl bg-beige/60 hover:bg-beige text-royal-brown border border-sand transition-all text-xs font-bold flex items-center gap-1.5"
            title="Switch Language / மொழியை மாற்றவும்"
          >
            <Globe className="w-3.5 h-3.5 text-gold-dark" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center space-x-2 pl-2 border-l border-sand">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-royal-brown truncate max-w-[120px]">
                  {user.nickname}
                </div>
                {user.email ? (
                  <div className="text-[10px] text-royal-muted truncate max-w-[120px]">
                    {user.email}
                  </div>
                ) : (
                  <div className="text-[10px] text-coral-deep font-semibold">
                    Guest
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-coral-reef/15 hover:bg-coral-reef/25 text-coral-deep border border-coral-reef/30 transition-all"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
