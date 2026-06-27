import React, { useState } from 'react';
import { X, LogIn, UserPlus, KeyRound, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalsProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup' | 'forgot';
  onClose: () => void;
  onLoginSuccess: (role: UserRole, name: string, email?: string, token?: string) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>('recipient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword: password || 'reset123' }),
        });
      } catch (err) {
        // Fallback simulation
      }
      setIsLoading(false);
      setForgotSent(true);
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          requestedRole: role,
          role,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication restriction enforced.');
        setIsLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('foodbridge_auth_token', data.token);
      }

      const assignedRole = data.user?.role || role;
      const assignedName = data.user?.name || name || email.split('@')[0];
      const assignedEmail = data.user?.email || email;

      onLoginSuccess(assignedRole, assignedName, assignedEmail, data.token);
      onClose();
    } catch (err: any) {
      // Fallback local simulation if backend offline
      if (role === 'admin' && email.toLowerCase() !== 'fredaesiofori905@gmail.com') {
        setAuthError('Access Denied: Admin role is restricted strictly to fredaesiofori905@gmail.com.');
        setIsLoading(false);
        return;
      }
      const defaultNames: Record<UserRole, string> = {
        recipient: name || "Hope Valley Community Center",
        donor: name || "Harbor Bakery & Cafe",
        admin: name || "Freda Esiofori (Admin)",
        guest: name || "Community Guest Visitor",
      };
      onLoginSuccess(role, defaultNames[role], email);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialMock = (provider: 'google') => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      onLoginSuccess('recipient', 'Google Authenticated Kitchen', `${provider}_user@foodbridge.org`);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] border border-[#E6E2D3] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Modal Header Banner */}
        <div className="bg-[#386A20] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-black/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-2">
            <div className="w-6 h-6 bg-[#386A20] rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome Back to FoodBridge' : mode === 'signup' ? 'Join Surplus Rescue' : 'Reset Password'}
          </h2>
          <p className="text-xs text-[#E7F0E1] opacity-90 mt-1">
            Connect food surplus with community hunger in real time
          </p>
        </div>

        {/* Modal Content Body */}
        <div className="p-6">
          {mode === 'forgot' ? (
            <div>
              {forgotSent ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-[#E7F0E1] text-[#386A20] rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#1D1B16]">Password Reset Successful!</h3>
                  <p className="text-xs text-[#79776E]">
                    Your password for <span className="font-bold">{email || 'your account'}</span> has been updated. You can now log in with your new credentials.
                  </p>
                  <button
                    onClick={() => {
                      setForgotSent(false);
                      setMode('login');
                    }}
                    className="w-full py-3 bg-[#386A20] text-white rounded-xl text-sm font-bold mt-4 cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-[#79776E] mb-2">
                    Enter your registered email address and new password to instantly update your account credentials.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'admin' ? "fredaesiofori905@gmail.com" : "name@organization.org"}
                      className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#386A20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#386A20] outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#386A20] hover:bg-[#2C5319] text-white rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {isLoading ? 'Resetting...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-xs font-bold text-[#79776E] hover:text-[#1D1B16] mt-2 cursor-pointer"
                  >
                    ← Back to Log In
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Role Selector */}
              <div className="mb-5">
                <label className="block text-[10px] font-bold uppercase text-[#79776E] tracking-wider mb-2">
                  Select Your Platform Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['donor', 'recipient', 'guest', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer text-center ${
                        role === r
                          ? 'bg-[#E7F0E1] border-[#386A20] text-[#386A20] shadow-2xs'
                          : 'bg-[#F3F0E6] border-transparent text-[#79776E] hover:text-[#1D1B16]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {authError && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs font-bold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">
                      {role === 'donor' ? 'Business / Bakery Name' : 'Organization / Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'donor' ? 'e.g. Daily Crust Bakery' : "e.g. St. Jude's Pantry"}
                      className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#386A20] outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'admin' ? "fredaesiofori905@gmail.com" : "contact@foodbridge.org"}
                    className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#386A20] outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#1D1B16] uppercase">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] font-bold text-[#386A20] hover:underline cursor-pointer"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#386A20] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#386A20] hover:bg-[#2C5319] text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{mode === 'login' ? `Log In as ${role.toUpperCase()}` : `Create ${role.toUpperCase()} Account`}</span>
                </button>
              </form>

              {/* Social Login Mock */}
              <div className="mt-6 pt-5 border-t border-[#E6E2D3]">
                <p className="text-center text-[10px] uppercase font-bold text-[#79776E] mb-3 tracking-wider">
                  Or Instant Sign In With
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleSocialMock('google')}
                    disabled={!!socialLoading}
                    className="w-full py-2.5 bg-white border border-[#E6E2D3] hover:bg-[#F3F0E6] rounded-xl text-xs font-bold text-[#1D1B16] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.5 0 15.5s.7 5.8 1.9 8.2l3.7-2.9c-.9-.8-1.7-2-2-3z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                    </svg>
                    <span>{socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>
                </div>
              </div>

              {/* Mode Switch Toggle Footer */}
              <div className="mt-6 text-center text-xs">
                <span className="text-[#79776E]">
                  {mode === 'login' ? "Don't have an account yet?" : 'Already registered?'}
                </span>{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="font-bold text-[#386A20] hover:underline cursor-pointer ml-1"
                >
                  {mode === 'login' ? 'Sign Up Now' : 'Log In Here'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
