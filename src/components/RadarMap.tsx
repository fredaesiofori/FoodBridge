import React, { useState } from 'react';
import { Radar, MapPin, Package, Clock, Sparkles, Navigation, X } from 'lucide-react';
import { FoodDrop, User } from '../types';
import { formatTimeLeft } from '../utils';

interface RadarMapProps {
  drops: FoodDrop[];
  currentUser: User;
  onClaim: (id: string) => void;
  onOpenAiRecipe: (drop: FoodDrop) => void;
  onSwitchToGrid: () => void;
}

export const RadarMap: React.FC<RadarMapProps> = ({
  drops,
  currentUser,
  onClaim,
  onOpenAiRecipe,
  onSwitchToGrid,
}) => {
  const [selectedPin, setSelectedPin] = useState<FoodDrop | null>(drops[0] || null);

  // Group drops by neighborhood coordinates simulation
  const NEIGHBORHOOD_COORDS: Record<string, { top: string; left: string }> = {
    'North Precinct': { top: '35%', left: '42%' },
    'Midtown': { top: '50%', left: '60%' },
    'Central District': { top: '65%', left: '48%' },
    'Harbor View': { top: '25%', left: '72%' },
    'Eastside': { top: '75%', left: '75%' },
    'Westside': { top: '55%', left: '25%' },
  };

  return (
    <div className="bg-white dark:bg-[#12220E] border border-[#E6E2D3] dark:border-[#24421C] text-[#1D1B16] dark:text-[#EAE6DF] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col h-[calc(100dvh-18rem)] md:h-[calc(100vh-16rem)] min-h-[340px] sm:min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E6E2D3] dark:border-[#24421C] mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#E7F0E1] text-[#386A20] rounded-lg">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="font-bold text-[#1D1B16] text-base">Surplus Radar & Neighborhood Clusters</h3>
            <p className="text-xs text-[#79776E]">Live real-time geographic distribution of rescue drops</p>
          </div>
        </div>

        <button
          onClick={onSwitchToGrid}
          className="text-xs font-bold text-[#386A20] hover:underline px-3 py-1.5 bg-[#F3F0E6] rounded-lg cursor-pointer"
        >
          ← Back to Grid View
        </button>
      </div>

      {/* Radar Canvas Viewport */}
      <div className="flex-1 bg-[#FDFCF8] rounded-xl border border-[#E6E2D3] relative overflow-hidden flex items-center justify-center">
        {/* Radar Rings Grid */}
        <div className="absolute w-[80%] h-[80%] border border-[#386A20]/15 rounded-full pointer-events-none"></div>
        <div className="absolute w-[55%] h-[55%] border border-[#386A20]/25 rounded-full pointer-events-none"></div>
        <div className="absolute w-[30%] h-[30%] border border-[#386A20]/35 rounded-full pointer-events-none"></div>
        <div className="absolute w-px h-full bg-[#386A20]/10 pointer-events-none"></div>
        <div className="absolute h-px w-full bg-[#386A20]/10 pointer-events-none"></div>

        {/* Center Recipient Pin */}
        <div className="absolute z-10 flex flex-col items-center pointer-events-none">
          <div className="w-6 h-6 bg-[#386A20] rounded-full flex items-center justify-center ring-4 ring-[#E7F0E1] shadow-md animate-pulse">
            <Navigation className="w-3 h-3 text-white fill-white rotate-45" />
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow-2xs border border-[#E6E2D3] mt-1 text-[#386A20]">
            Your Location
          </span>
        </div>

        {/* Distance Labels */}
        <span className="absolute top-[12%] right-[52%] text-[9px] font-bold text-[#79776E] bg-white/80 px-1 rounded">5 km</span>
        <span className="absolute top-[25%] right-[52%] text-[9px] font-bold text-[#79776E] bg-white/80 px-1 rounded">3 km</span>
        <span className="absolute top-[38%] right-[52%] text-[9px] font-bold text-[#79776E] bg-white/80 px-1 rounded">1 km</span>

        {/* Render Surplus Pins */}
        {drops.map((drop, idx) => {
          const coords = NEIGHBORHOOD_COORDS[drop.neighborhood] || {
            top: `${30 + (idx % 4) * 15}%`,
            left: `${30 + ((idx * 3) % 4) * 15}%`,
          };
          const isSelected = selectedPin?.id === drop.id;
          const isUrgent = formatTimeLeft(drop.expiresAt).isUrgent;

          return (
            <button
              key={drop.id}
              onClick={() => setSelectedPin(drop)}
              style={{ top: coords.top, left: coords.left }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-200 ${
                isSelected ? 'scale-125 z-20' : 'hover:scale-110'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform ${
                  drop.status === 'claimed'
                    ? 'bg-[#79776E] text-white'
                    : isUrgent
                    ? 'bg-[#E46962] text-white animate-bounce'
                    : 'bg-[#386A20] text-white'
                }`}
              >
                <Package className="w-4 h-4" />
              </div>

              <div className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-[#E6E2D3] text-[10px] font-bold text-[#1D1B16] mt-1 whitespace-nowrap flex items-center gap-1">
                <span>{drop.quantity}</span>
                {isUrgent && <span className="text-[#E46962]">⏳</span>}
              </div>
            </button>
          );
        })}

        {/* Selected Drop Floating Card Bottom */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-white border border-[#386A20] rounded-2xl p-4 shadow-lg z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex justify-between items-start gap-3 mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={selectedPin.donorAvatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-[#E6E2D3]"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#1D1B16] leading-tight">{selectedPin.title}</h4>
                  <p className="text-[11px] text-[#79776E]">{selectedPin.donorName} • {selectedPin.distanceKm} km</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-[#79776E] hover:text-[#1D1B16] p-1 bg-[#F3F0E6] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#F3F0E6] p-2 rounded-lg text-xs font-bold text-[#1D1B16] mb-3">
              <span>Quantity: {selectedPin.quantity}</span>
              <span className={formatTimeLeft(selectedPin.expiresAt).isUrgent ? 'text-[#E46962]' : 'text-[#386A20]'}>
                ⏳ {formatTimeLeft(selectedPin.expiresAt).text} left
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onOpenAiRecipe(selectedPin)}
                className="flex-1 py-2 bg-[#E7F0E1] hover:bg-[#D5E6CC] text-[#386A20] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Chef Plan
              </button>
              {selectedPin.status === 'available' ? (
                <button
                  onClick={() => {
                    onClaim(selectedPin.id);
                    setSelectedPin({ ...selectedPin, status: 'claimed' });
                  }}
                  className="flex-1 py-2 bg-[#386A20] hover:bg-[#2C5319] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Claim Drop
                </button>
              ) : (
                <span className="flex-1 py-2 bg-[#E6E2D3] text-[#79776E] rounded-xl text-xs font-bold text-center">
                  {selectedPin.status === 'claimed' ? 'Reserved' : 'Collected'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
