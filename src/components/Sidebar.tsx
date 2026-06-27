import React, { useState } from 'react';
import { Layers, Clock, CheckCircle2, Navigation, Radar, Filter, RefreshCw } from 'lucide-react';
import { FoodCategory, SegmentTab, ViewMode } from '../types';

interface SidebarProps {
  activeSegment: SegmentTab;
  onSelectSegment: (seg: SegmentTab) => void;
  selectedCategory: FoodCategory | 'ALL';
  onSelectCategory: (cat: FoodCategory | 'ALL') => void;
  radiusKm: number;
  onChangeRadius: (rad: number) => void;
  counts: { all: number; available: number; claimed: number };
  onViewRadar: () => void;
  onResetFilters: () => void;
}

const CATEGORIES: FoodCategory[] = [
  'Bakery & Bread',
  'Fresh Produce',
  'Prepared Meals',
  'Dairy & Refrigerated',
  'Pantry & Dry',
  'Catering & Trays',
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSegment,
  onSelectSegment,
  selectedCategory,
  onSelectCategory,
  radiusKm,
  onChangeRadius,
  counts,
  onViewRadar,
  onResetFilters,
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E6E2D3] dark:border-[#24421C] bg-[#FDFCF8] dark:bg-[#0E1E0B] p-3 sm:p-4 md:p-6 shrink-0 flex flex-col gap-3 md:gap-6 md:overflow-y-auto md:max-h-[calc(100vh-8.5rem)] transition-colors min-w-0">
      {/* Mobile Filter Toggle Bar */}
      <button
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        aria-expanded={isMobileFiltersOpen}
        className="md:hidden w-full flex items-center justify-between min-h-[44px] px-4 py-2.5 bg-[#E7F0E1] dark:bg-[#203D17] text-[#386A20] dark:text-[#A4D888] font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-2xs border border-[#386A20]/20 dark:border-[#76B058]/30"
      >
        <span className="flex items-center gap-2 truncate pr-2">
          <Filter className="w-4 h-4 shrink-0" />
          <span className="truncate">
            Filter: {activeSegment === 'all' ? 'All Listings' : activeSegment === 'available' ? 'Available Now' : 'Claimed'} ({selectedCategory === 'ALL' ? 'All Types' : selectedCategory.split(' & ')[0]})
          </span>
        </span>
        <span className="shrink-0 text-xs font-extrabold ml-1">{isMobileFiltersOpen ? 'Hide ▲' : 'Filters ▼'}</span>
      </button>

      {/* Collapsible on Mobile, Permanent on Desktop */}
      <div className={`${isMobileFiltersOpen ? 'flex flex-col gap-5 max-h-[65vh] overflow-y-auto pt-2 pb-2 px-1' : 'hidden md:flex md:flex-col md:gap-6 flex-1'}`}>
        {/* Browse Segments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold uppercase text-[#79776E] dark:text-[#8AA280] tracking-wider">Browse Filters</h3>
            {(selectedCategory !== 'ALL' || activeSegment !== 'all' || radiusKm < 20) && (
              <button
                onClick={onResetFilters}
                title="Reset Filters"
                className="text-[10px] text-[#386A20] dark:text-[#90C872] font-bold flex items-center gap-1 hover:underline cursor-pointer min-h-[24px]"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Reset
              </button>
            )}
          </div>
          <div className="space-y-1">
            <div
              onClick={() => {
                onSelectSegment('all');
                setIsMobileFiltersOpen(false);
              }}
              className={`flex items-center justify-between p-2 rounded-md text-sm cursor-pointer transition-all min-h-[40px] ${
                activeSegment === 'all'
                  ? 'bg-[#E7F0E1] dark:bg-[#203D17] text-[#386A20] dark:text-[#A4D888] font-bold shadow-2xs'
                  : 'text-[#79776E] dark:text-[#8AA280] hover:bg-[#F3F0E6] dark:hover:bg-[#1C3317] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" /> All Listings
              </span>
              <span className="bg-[#E6E2D3] dark:bg-[#2A4B20] text-[#1D1B16] dark:text-[#EAE6DF] px-1.5 py-0.5 rounded text-[10px] font-bold">
                {counts.all}
              </span>
            </div>

            <div
              onClick={() => {
                onSelectSegment('available');
                setIsMobileFiltersOpen(false);
              }}
              className={`flex items-center justify-between p-2 rounded-md text-sm cursor-pointer transition-all min-h-[40px] ${
                activeSegment === 'available'
                  ? 'bg-[#E7F0E1] dark:bg-[#203D17] text-[#386A20] dark:text-[#A4D888] font-bold shadow-2xs'
                  : 'text-[#79776E] dark:text-[#8AA280] hover:bg-[#F3F0E6] dark:hover:bg-[#1C3317] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#386A20] dark:text-[#90C872]" /> Available Now
              </span>
              <span className="bg-[#386A20] dark:bg-[#4E8832] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                {counts.available}
              </span>
            </div>

            <div
              onClick={() => {
                onSelectSegment('claimed');
                setIsMobileFiltersOpen(false);
              }}
              className={`flex items-center justify-between p-2 rounded-md text-sm cursor-pointer transition-all min-h-[40px] ${
                activeSegment === 'claimed'
                  ? 'bg-[#E7F0E1] dark:bg-[#203D17] text-[#386A20] dark:text-[#A4D888] font-bold shadow-2xs'
                  : 'text-[#79776E] dark:text-[#8AA280] hover:bg-[#F3F0E6] dark:hover:bg-[#1C3317] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#79776E] dark:text-[#8AA280]" /> Reserved / Claimed
              </span>
              <span className="bg-[#E6E2D3] dark:bg-[#2A4B20] text-[#1D1B16] dark:text-[#EAE6DF] px-1.5 py-0.5 rounded text-[10px] font-bold">
                {counts.claimed}
              </span>
            </div>
          </div>
        </div>

        <hr className="border-[#E6E2D3] dark:border-[#24421C]" />

        {/* Food Categories */}
        <div>
          <h3 className="text-[10px] font-bold uppercase text-[#79776E] dark:text-[#8AA280] tracking-wider mb-3">Food Categories</h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                onSelectCategory('ALL');
                setIsMobileFiltersOpen(false);
              }}
              className={`px-3 py-2 sm:px-2.5 sm:py-1 rounded-md text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                selectedCategory === 'ALL'
                  ? 'bg-[#386A20] dark:bg-[#4E8832] text-white'
                  : 'bg-[#F3F0E6] dark:bg-[#1C3317] text-[#79776E] dark:text-[#8AA280] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
              }`}
            >
              All Types
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setIsMobileFiltersOpen(false);
                }}
                className={`px-3 py-2 sm:px-2.5 sm:py-1 rounded-md text-xs font-medium transition-all cursor-pointer min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-[#386A20] dark:bg-[#4E8832] text-white font-bold'
                    : 'bg-[#F3F0E6] dark:bg-[#1C3317] text-[#79776E] dark:text-[#8AA280] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
                }`}
              >
                {cat.split(' & ')[0]}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-[#E6E2D3] dark:border-[#24421C]" />

        {/* Radius Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[10px] font-bold uppercase text-[#79776E] dark:text-[#8AA280] tracking-wider flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#386A20] dark:text-[#90C872]" /> Distance Radius
            </h3>
            <span className="text-xs font-bold text-[#386A20] dark:text-[#A4D888] bg-[#E7F0E1] dark:bg-[#203D17] px-2 py-0.5 rounded-full">
              Within {radiusKm} km
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={radiusKm}
            onChange={(e) => onChangeRadius(Number(e.target.value))}
            className="w-full accent-[#386A20] dark:accent-[#76B058] cursor-pointer bg-[#E6E2D3] dark:bg-[#24421C] h-2 sm:h-1.5 rounded-lg min-h-[28px]"
          />
          <div className="flex justify-between text-[10px] text-[#79776E] dark:text-[#8AA280] mt-1 font-bold">
            <span>1 km</span>
            <span>5 km</span>
            <span>15 km</span>
            <span>25 km</span>
          </div>
        </div>

        {/* Promo Box */}
        <div className="p-4 bg-[#386A20] dark:bg-[#1A3812] rounded-xl text-white shadow-sm mt-auto relative overflow-hidden group border dark:border-[#386A20]/50">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-md group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90 mb-1.5">
            <Radar className="w-3.5 h-3.5 animate-spin text-[#A5D6A7]" style={{ animationDuration: '6s' }} />
            <span>Nearby Hotspot</span>
          </div>
          <h4 className="font-bold text-sm leading-snug">
            North Precinct & Midtown have 7 rescued drops ready
          </h4>
          <button
            onClick={() => {
              onViewRadar();
              setIsMobileFiltersOpen(false);
            }}
            className="mt-3 text-xs font-bold underline underline-offset-4 hover:text-[#A5D6A7] cursor-pointer flex items-center gap-1 min-h-[32px]"
          >
            View Radar Map →
          </button>
        </div>
      </div>
    </aside>
  );
};
