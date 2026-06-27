import React from 'react';
import { Search, UserCircle, LogIn, Sparkles, ShieldCheck, HeartHandshake, Utensils, Sun, Moon, BellRing } from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User;
  searchQuery: string;
  isDarkMode: boolean;
  onSearchChange: (query: string) => void;
  onOpenProfile: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSwitchRole: (role: UserRole) => void;
  onToggleTheme: () => void;
  onSimulateAlert: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  searchQuery,
  isDarkMode,
  onSearchChange,
  onOpenProfile,
  onOpenAuth,
  onSwitchRole,
  onToggleTheme,
  onSimulateAlert,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'donor':
        return { label: 'Food Donor Account', icon: Utensils, color: 'text-[#386A20] dark:text-[#76B058]' };
      case 'recipient':
        return { label: 'Recipient Account', icon: HeartHandshake, color: 'text-[#386A20] dark:text-[#76B058]' };
      case 'admin':
        return { label: 'Admin Moderator', icon: ShieldCheck, color: 'text-[#E46962] dark:text-[#F08A84]' };
      case 'guest':
        return { label: 'Guest Visitor', icon: UserCircle, color: 'text-[#79776E] dark:text-[#8AA280]' };
    }
  };

  const badge = getRoleBadge(currentUser.role);
  const BadgeIcon = badge.icon;
  const avgRating = currentUser.ratingSum && currentUser.reviewCount 
    ? (currentUser.ratingSum / currentUser.reviewCount).toFixed(1) 
    : null;

  return (
    <nav className="border-b border-[#E6E2D3] dark:border-[#24421C] bg-white dark:bg-[#12220E] px-3 sm:px-4 md:px-6 py-2.5 md:py-0 md:h-16 flex flex-col md:flex-row md:items-center justify-between shrink-0 z-20 transition-colors gap-2.5 md:gap-4 min-w-0">
      {/* Top Tier on Mobile / Left Tier on Desktop */}
      <div className="flex items-center justify-between gap-3 w-full md:w-auto">
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer min-h-[44px]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-[#386A20] dark:bg-[#4E8832] rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <div className="w-4 h-4 bg-white dark:bg-[#12220E] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-[#386A20] dark:bg-[#4E8832] rounded-full"></div>
            </div>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#386A20] dark:text-[#90C872]">FoodBridge</span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold bg-[#E7F0E1] dark:bg-[#224418] text-[#386A20] dark:text-[#A4D888] px-2 py-0.5 rounded-full tracking-wider whitespace-nowrap">
            Surplus Rescue
          </span>
        </div>

        {/* Mobile Controls Right Alignment */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {/* Mobile Role Switcher */}
          <select
            value={currentUser.role}
            onChange={(e) => onSwitchRole(e.target.value as UserRole)}
            aria-label="Switch User Role"
            className="bg-[#F3F0E6] dark:bg-[#1C3317] border border-[#E6E2D3] dark:border-[#2A4B20] text-[#1D1B16] dark:text-[#EAE6DF] text-xs font-extrabold rounded-lg px-2 py-2 min-h-[44px] cursor-pointer outline-none capitalize"
          >
            <option value="donor">Donor</option>
            <option value="recipient">Recipient</option>
            <option value="guest">Guest</option>
            <option value="admin">Admin</option>
          </select>

          {/* Deep-Forest Dark Mode Switcher */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Deep-Forest Dark Mode"}
            aria-label="Toggle Theme"
            className="w-11 h-11 rounded-lg bg-[#F3F0E6] dark:bg-[#1C3317] border border-[#E6E2D3] dark:border-[#2A4B20] text-[#1D1B16] dark:text-[#EAE6DF] hover:border-[#386A20] dark:hover:border-[#76B058] transition-all flex items-center justify-center cursor-pointer shrink-0"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
          </button>

          {/* User Profile Mobile Button */}
          <button
            onClick={onOpenProfile}
            title="Edit Profile & Preferences"
            aria-label="User Profile"
            className="relative group focus:outline-none w-11 h-11 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 bg-[#E6E2D3] dark:bg-[#2A4B20] rounded-full object-cover border-2 border-white dark:border-[#1C3317] shadow-sm"
            />
            <span className="absolute bottom-0 right-0 bg-[#386A20] dark:bg-[#4E8832] text-white rounded-full p-0.5">
              <UserCircle className="w-2.5 h-2.5" />
            </span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="w-full md:flex-1 md:max-w-xl md:mx-6 shrink-0">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search surplus food..."
            aria-label="Search surplus food"
            className="w-full bg-[#F3F0E6] dark:bg-[#1C3317] border-none rounded-full pl-10 pr-10 py-2.5 md:py-2 text-sm text-[#1D1B16] dark:text-[#EAE6DF] placeholder-[#79776E] dark:placeholder-[#8AA280] focus:outline-none focus:ring-2 focus:ring-[#386A20] dark:focus:ring-[#629E44] transition-all min-h-[44px]"
          />
          <Search className="w-4 h-4 absolute left-3.5 text-[#79776E] dark:text-[#8AA280]" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear Search"
              className="absolute right-3 text-xs bg-[#E6E2D3] dark:bg-[#2A4B20] text-[#79776E] dark:text-[#EAE6DF] hover:text-[#1D1B16] rounded-full w-7 h-7 flex items-center justify-center cursor-pointer min-h-[28px] min-w-[28px]"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Desktop Controls (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Simulate Toast Notification Trigger */}
        <button
          onClick={onSimulateAlert}
          title="Simulate Nearby Food Alert Notification"
          className="p-2 min-h-[40px] rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <BellRing className="w-4 h-4 animate-bounce shrink-0" />
          <span className="hidden xl:inline">Demo Alert</span>
        </button>

        {/* Deep-Forest Dark Mode Switcher */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Deep-Forest Dark Mode"}
          aria-label="Toggle Theme Desktop"
          className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-[#F3F0E6] dark:bg-[#1C3317] border border-[#E6E2D3] dark:border-[#2A4B20] text-[#1D1B16] dark:text-[#EAE6DF] hover:border-[#386A20] dark:hover:border-[#76B058] transition-all flex items-center justify-center cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
        </button>

        {/* Role Demo Switcher */}
        <div className="hidden lg:flex items-center bg-[#F3F0E6] dark:bg-[#1C3317] rounded-lg p-0.5 border border-[#E6E2D3] dark:border-[#2A4B20] text-[11px]">
          <span className="px-2 font-bold text-[#79776E] dark:text-[#8AA280] text-[10px]">ROLE:</span>
          {(['donor', 'recipient', 'guest', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => onSwitchRole(r)}
              className={`px-2.5 py-1 min-h-[36px] rounded-md font-bold capitalize transition-all cursor-pointer ${
                currentUser.role === r
                  ? 'bg-[#386A20] dark:bg-[#4E8832] text-white shadow-xs'
                  : 'text-[#79776E] dark:text-[#8AA280] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden xl:block">
            <p className={`text-[11px] font-bold flex items-center justify-end gap-1 ${badge.color}`}>
              <BadgeIcon className="w-3 h-3" />
              {badge.label}
            </p>
            <p className="text-sm font-bold text-[#1D1B16] dark:text-[#EAE6DF] truncate max-w-[160px] leading-tight flex items-center justify-end gap-1">
              <span>{currentUser.name}</span>
              {avgRating && <span className="text-xs text-amber-500 font-extrabold shrink-0">⭐ {avgRating}</span>}
            </p>
          </div>

          <button
            onClick={onOpenProfile}
            title="Edit Profile & Preferences"
            aria-label="User Profile Desktop"
            className="relative group focus:outline-none cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 bg-[#E6E2D3] dark:bg-[#2A4B20] rounded-full object-cover border-2 border-white dark:border-[#1C3317] shadow-sm group-hover:ring-2 group-hover:ring-[#386A20] dark:group-hover:ring-[#76B058] transition-all"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#386A20] dark:bg-[#4E8832] text-white rounded-full p-0.5">
              <UserCircle className="w-3 h-3" />
            </span>
          </button>
        </div>

        {/* Quick Auth Trigger */}
        <button
          onClick={() => onOpenAuth('login')}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] border border-[#E6E2D3] dark:border-[#2A4B20] hover:border-[#386A20] dark:hover:border-[#76B058] rounded-lg text-xs font-bold text-[#386A20] dark:text-[#A4D888] bg-[#FDFCF8] dark:bg-[#162912] transition-all cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          Switch
        </button>
      </div>
    </nav>
  );
};

