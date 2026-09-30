import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { Mail, Lock, User, AlertCircle, Sparkles, Database, Users } from 'lucide-react';

export const AuthCard: React.FC = () => {
  const { login, signup, playAsGuest, dbStatus, pendingInviteCode } = useAuth();
  const { t } = useLanguage();

  const [isSignup, setIsSignup] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestNick, setGuestNick] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignup) {
        if (!nickname.trim()) throw new Error('Please enter a nickname.');
        if (!email.trim()) throw new Error('Please enter your email.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        await signup(nickname.trim(), email.trim(), password);
      } else {
        if (!email.trim()) throw new Error('Please enter your email.');
        if (!password) throw new Error('Please enter your password.');
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNick.trim()) {
      setError('Please enter a player nickname for guest access.');
      return;
    }
    playAsGuest(guestNick.trim());
  };

  return (
    <div className="w-full max-w-md bg-cream/95 backdrop-blur-md rounded-2xl border-2 border-sand p-6 sm:p-8 shadow-2xl relative z-10 transition-all">
      {pendingInviteCode && (
        <div className="mb-5 p-3 rounded-xl bg-gold/15 border border-gold/40 text-royal-brown flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-pulse">
          <Users className="w-5 h-5 text-gold-dark flex-shrink-0" />
          <span>🏰 Invited to join Room: <strong className="font-mono text-gold-dark text-base tracking-widest">{pendingInviteCode}</strong></span>
        </div>
      )}

      {dbStatus && !dbStatus.isDbConnected && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <Database className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>MongoDB Offline Notice</span>
          </div>
          <p className="text-amber-800/90 leading-relaxed">
            {dbStatus.message}
          </p>
          <p className="text-amber-900 font-medium">
            💡 You can still play instantly using <strong>Guest Mode</strong> below while you set up MongoDB.
          </p>
        </div>
      )}

      <div className="text-center mb-6">
        <h2 className="font-serif font-black text-2xl text-royal-brown tracking-wide">
          {showGuestForm ? t.guestMode : isSignup ? t.signup : t.login}
        </h2>
        <p className="text-xs sm:text-sm text-royal-muted mt-1">
          {showGuestForm
            ? 'Enter the palace immediately with a temporary royal name'
            : isSignup
            ? 'Forge your royal identity for recorded victories'
            : 'Access your kingdom account and history'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {showGuestForm ? (
        <form onSubmit={handleGuestSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-royal-brown mb-1.5">
              {t.nickname}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-royal-muted" />
              <input
                type="text"
                value={guestNick}
                onChange={(e) => setGuestNick(e.target.value)}
                placeholder="e.g. Commander Vikram"
                maxLength={20}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand rounded-xl text-royal-brown text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>

          <Button type="submit" variant="gold" fullWidth size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Enter Palace as Guest
          </Button>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setShowGuestForm(false)}
              className="text-xs font-semibold text-royal-muted hover:text-coral-deep underline"
            >
              Back to Standard Login / Signup
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-royal-brown mb-1.5">
                {t.nickname}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-royal-muted" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Prince Arjun"
                  maxLength={20}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand rounded-xl text-royal-brown text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-royal-brown mb-1.5">
              {t.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-royal-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="royal@kingdom.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand rounded-xl text-royal-brown text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-royal-brown mb-1.5">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-royal-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand rounded-xl text-royal-brown text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : isSignup ? t.signup : t.login}
          </Button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsSignup(!isSignup);
              }}
              className="font-semibold text-coral-deep hover:text-coral-hover underline cursor-pointer"
            >
              {isSignup ? t.loginPrompt : t.createAccountPrompt}
            </button>

            <button
              type="button"
              onClick={() => setShowGuestForm(true)}
              className="font-bold text-gold-dark hover:text-gold cursor-pointer"
            >
              {t.guestMode} →
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
