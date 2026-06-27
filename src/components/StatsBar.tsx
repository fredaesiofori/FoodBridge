import React from 'react';
import { PlusCircle, ClipboardList, Sparkles, AlertCircle } from 'lucide-react';
import { FoodDrop, UserRole } from '../types';

interface StatsBarProps {
  drops: FoodDrop[];
  role: UserRole;
  onPostSurplus: () => void;
  onManageClaims: () => void;
  onOpenAiRecipeGeneral: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  drops,
  role,
  onPostSurplus,
  onManageClaims,
  onOpenAiRecipeGeneral,
}) => {
  // Calculate dynamic metrics
  const activeDropsCount = drops.filter((d) => d.status === 'available').length;
  const totalMealsRescued = drops
    .filter((d) => d.status === 'claimed' || d.status === 'picked_up')
    .reduce((acc, curr) => acc + curr.mealsEstimated, 3120); // Base historical impact

  const totalKgRescued = Math.round(totalMealsRescued * 0.45); // approx 450g per meal

  return (
    <div className="py-3 md:py-0 md:h-20 bg-white dark:bg-[#12220E] border-b border-[#E6E2D3] dark:border-[#24421C] px-3 sm:px-4 md:px-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0 z-10 shadow-2xs transition-colors min-w-0">
      {/* Live Impact Metrics */}
      <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto py-1 no-scrollbar w-full md:w-auto">
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-[#79776E] dark:text-[#8AA280] font-bold">Total Rescued</span>
          <span className="text-xl sm:text-2xl font-bold text-[#386A20] dark:text-[#90C872]">
            {totalKgRescued.toLocaleString()} <span className="text-xs sm:text-sm font-normal text-[#79776E] dark:text-[#8AA280]">kg</span>
          </span>
        </div>

        <div className="h-8 sm:h-10 w-px bg-[#E6E2D3] dark:bg-[#24421C] shrink-0"></div>

        <div className="flex flex-col shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-[#79776E] dark:text-[#8AA280] font-bold">Active Drops</span>
          <span className="text-xl sm:text-2xl font-bold text-[#386A20] dark:text-[#90C872] flex items-center gap-1.5">
            {activeDropsCount}
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </span>
        </div>

        <div className="h-8 sm:h-10 w-px bg-[#E6E2D3] dark:bg-[#24421C] shrink-0"></div>

        <div className="flex flex-col shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-[#79776E] dark:text-[#8AA280] font-bold">Meals Rescued</span>
          <span className="text-xl sm:text-2xl font-bold text-[#386A20] dark:text-[#90C872]">{totalMealsRescued.toLocaleString()}</span>
        </div>

        <div className="hidden xl:block h-10 w-px bg-[#E6E2D3] dark:bg-[#24421C] shrink-0"></div>

        <div className="hidden xl:flex flex-col shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-[#79776E] dark:text-[#8AA280] font-bold">Impact Score</span>
          <span className="text-2xl font-bold text-[#386A20] dark:text-[#90C872]">98.4</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:ml-auto shrink-0 justify-between md:justify-end w-full md:w-auto">
        <button
          onClick={onOpenAiRecipeGeneral}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] bg-[#E7F0E1] dark:bg-[#1E3A15] text-[#386A20] dark:text-[#A4D888] hover:bg-[#D5E6CC] dark:hover:bg-[#2B5220] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer border border-[#386A20]/20 dark:border-[#76B058]/30 flex-1 md:flex-none justify-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#386A20] dark:text-[#A4D888] shrink-0" />
          <span>AI Chef Ideas</span>
        </button>

        {role === 'recipient' && (
          <button
            onClick={onManageClaims}
            className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] border border-[#386A20] dark:border-[#76B058] text-[#386A20] dark:text-[#90C872] hover:bg-[#F3F0E6] dark:hover:bg-[#1C3317] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex-1 md:flex-none whitespace-nowrap"
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span>My Claimed Pickups</span>
          </button>
        )}

        {role === 'donor' && (
          <button
            onClick={onManageClaims}
            className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] border border-[#386A20] dark:border-[#76B058] text-[#386A20] dark:text-[#90C872] hover:bg-[#F3F0E6] dark:hover:bg-[#1C3317] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex-1 md:flex-none whitespace-nowrap"
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span>My Donated Listings</span>
          </button>
        )}

        {role === 'admin' && (
          <button
            onClick={() => {
              window.location.hash = '#/dashboard/admin';
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex-1 md:flex-none whitespace-nowrap"
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>Admin Hub</span>
          </button>
        )}

        {(role === 'donor' || role === 'admin') && (
          <button
            onClick={onPostSurplus}
            className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] bg-[#386A20] dark:bg-[#4E8832] text-white hover:bg-[#2C5319] dark:hover:bg-[#629E44] rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex-1 md:flex-none whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>+ Post Surplus</span>
          </button>
        )}

        {(role === 'recipient' || role === 'guest') && (
          <button
            onClick={onPostSurplus}
            className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] bg-[#386A20] dark:bg-[#4E8832] text-white hover:bg-[#2C5319] dark:hover:bg-[#629E44] rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex-1 md:flex-none whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>+ Find Surplus</span>
          </button>
        )}
      </div>
    </div>
  );
};
