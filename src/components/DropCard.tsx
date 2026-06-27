import React, { useState } from 'react';
import { Clock, MapPin, Sparkles, CheckCircle, Package, Utensils, AlertTriangle, ShieldX, Share2, Check } from 'lucide-react';
import { FoodDrop, User, UserRole } from '../types';
import { formatTimeLeft } from '../utils';

interface DropCardProps {
  drop: FoodDrop;
  currentUser: User;
  onClaim: (dropId: string) => void;
  onMarkCollected: (dropId: string) => void;
  onOpenAiRecipe: (drop: FoodDrop) => void;
  onDeleteDrop?: (dropId: string) => void;
  onRateDrop?: (dropId: string, targetRole: 'donor' | 'recipient', rating: number, comment: string) => void;
}

export const DropCard: React.FC<DropCardProps> = ({
  drop,
  currentUser,
  onClaim,
  onMarkCollected,
  onOpenAiRecipe,
  onDeleteDrop,
  onRateDrop,
}) => {
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?dropId=${drop.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const time = formatTimeLeft(drop.expiresAt);
  const isClaimedByMe = drop.claimedBy === currentUser.name || drop.claimedBy === currentUser.id;
  const diffMs = new Date(drop.expiresAt).getTime() - new Date().getTime();
  const diffMins = Math.round(diffMs / (60 * 1000));
  const isUrgentPickup = drop.status === 'claimed' && diffMins <= 30 && diffMins > -180;

  return (
    <div className="bg-white dark:bg-[#162912] border border-[#E6E2D3] dark:border-[#24421C] hover:border-[#386A20]/40 dark:hover:border-[#76B058]/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group relative">
      {/* Urgent Pickup Deadline Timer Indicator (<30 mins) */}
      {isUrgentPickup && (
        <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-300 dark:border-amber-700 px-3.5 py-2.5 flex items-center justify-between gap-2 text-amber-900 dark:text-amber-200 animate-pulse z-10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-bounce" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
              {diffMins > 0 ? `⏱️ Pickup Deadline in ${diffMins} mins!` : '🚨 Pickup Deadline Due Now!'}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            Urgent Pickup
          </span>
        </div>
      )}

      {/* Image & Status Header */}
      <div className="h-36 bg-[#F3F0E6] dark:bg-[#1C3317] relative overflow-hidden">
        {drop.imageUrl ? (
          <img
            src={drop.imageUrl}
            alt={drop.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#A5D6A7]">
            <Package className="w-12 h-12 opacity-50" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        {/* Status Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {drop.status === 'available' && time.isUrgent && !time.isExpired && (
            <div className="bg-[#E46962] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span>Expiring Soon ⏳</span>
            </div>
          )}
          {drop.status === 'claimed' && (
            <>
              <div className="bg-[#386A20] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>{isClaimedByMe ? 'You Claimed This' : 'Reserved'}</span>
              </div>
              {isUrgentPickup && (
                <div className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  <span>&lt;30m Left</span>
                </div>
              )}
            </>
          )}
          {drop.status === 'picked_up' && (
            <div className="bg-[#79776E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span>Picked Up ✔</span>
            </div>
          )}
        </div>

        {/* Category Pill Top Right */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#1D1B16] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
          {drop.category}
        </div>

        {/* Admin Moderate Delete Button */}
        {(currentUser.role === 'admin' || (currentUser.role === 'donor' && drop.donorName === currentUser.name)) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDrop?.(drop.id);
            }}
            title="Remove Drop Listing"
            aria-label="Remove Drop Listing"
            className="absolute bottom-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-2 min-h-[36px] min-w-[36px] rounded-lg text-xs font-bold transition-all md:opacity-0 md:group-hover:opacity-100 shadow-sm cursor-pointer flex items-center justify-center"
          >
            <ShieldX className="w-4 h-4" />
          </button>
        )}

        {/* Location tag bottom left */}
        <div className="absolute bottom-2 left-3 text-white text-xs font-semibold flex items-center gap-1 drop-shadow-sm truncate max-w-[80%]">
          <MapPin className="w-3 h-3 text-[#A5D6A7] shrink-0" />
          <span className="truncate">{drop.neighborhood} • {drop.distanceKm} km away</span>
        </div>
      </div>

      {/* Expiry Countdown Timer Bar */}
      {drop.status !== 'picked_up' && (
        <div className={`px-4 py-1.5 border-b flex items-center justify-between text-xs font-bold transition-colors ${
          diffMins <= 60 && diffMins > 0
            ? 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse'
            : diffMins <= 0
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
            : 'bg-[#E7F0E1] dark:bg-[#1C3317] text-[#386A20] dark:text-[#A4D888] border-[#E6E2D3] dark:border-[#24421C]'
        }`}>
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {diffMins <= 0
                ? 'Expired'
                : diffMins <= 60
                ? `🚨 Expires in ${diffMins} mins (< 1 hr left!)`
                : `⏳ Expires in ${Math.floor(diffMins / 60)}h ${diffMins % 60}m`}
            </span>
          </div>
          <span className="text-[10px] uppercase opacity-80 shrink-0 ml-1">Countdown</span>
        </div>
      )}

      {/* Status Timeline Progress Bar */}
      <div className="px-4 pt-3 pb-2.5 bg-[#FDFCF8] dark:bg-[#12220E] border-b border-[#E6E2D3] dark:border-[#24421C]">
        <div className="flex items-center justify-between relative max-w-[220px] mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-3 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
          {/* Active Progress Line */}
          <div className={`absolute left-6 top-3 h-0.5 transition-all duration-500 -z-0 ${
            drop.status === 'picked_up' ? 'right-6 bg-[#386A20] dark:bg-[#76B058]' : drop.status === 'claimed' ? 'w-1/2 bg-[#386A20] dark:bg-[#76B058]' : 'w-0'
          }`}></div>

          {/* Step 1: Listed */}
          <div className="flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-[#386A20] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ✔
            </div>
            <span className="text-[9px] font-bold mt-1 text-[#386A20] dark:text-[#90C872]">Listed</span>
          </div>

          {/* Step 2: Claimed */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              drop.status === 'claimed' || drop.status === 'picked_up'
                ? 'bg-[#386A20] text-white shadow-xs'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {drop.status === 'claimed' || drop.status === 'picked_up' ? '✔' : '2'}
            </div>
            <span className={`text-[9px] font-bold mt-1 ${
              drop.status === 'claimed' || drop.status === 'picked_up' ? 'text-[#386A20] dark:text-[#90C872]' : 'text-gray-400 dark:text-gray-500'
            }`}>Claimed</span>
          </div>

          {/* Step 3: Collected */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              drop.status === 'picked_up'
                ? 'bg-[#386A20] text-white shadow-xs'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {drop.status === 'picked_up' ? '✔' : '3'}
            </div>
            <span className={`text-[9px] font-bold mt-1 ${
              drop.status === 'picked_up' ? 'text-[#386A20] dark:text-[#90C872]' : 'text-gray-400 dark:text-gray-500'
            }`}>Collected</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-bold text-[#1D1B16] dark:text-[#EAE6DF] text-sm leading-snug line-clamp-2 group-hover:text-[#386A20] dark:group-hover:text-[#90C872] transition-colors">
              {drop.title}
            </h3>
            <span className="text-[#386A20] dark:text-[#A4D888] font-bold text-sm whitespace-nowrap bg-[#E7F0E1] dark:bg-[#203D17] px-2 py-0.5 rounded-md shrink-0">
              {drop.quantity}
            </span>
          </div>

          <p className="text-xs text-[#79776E] dark:text-[#8AA280] flex items-center gap-1 mb-2">
            <span>Posted by</span>
            <span className="font-bold text-[#1D1B16] dark:text-[#EAE6DF]">{drop.donorName}</span>
          </p>

          {drop.scheduledPickupTime && (
            <div className="text-xs text-[#386A20] dark:text-[#A4D888] font-bold flex items-center gap-1.5 mb-2 bg-[#E7F0E1]/80 dark:bg-[#203D17]/80 px-2.5 py-1 rounded-lg w-fit border border-[#386A20]/20">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#386A20] dark:text-[#A4D888]" />
              <span>Pickup Window: {drop.scheduledPickupTime}</span>
            </div>
          )}

          {drop.notes && (
            <p className="text-[11px] text-[#79776E] dark:text-[#8AA280] bg-[#F3F0E6]/60 dark:bg-[#1C3317]/60 p-2 rounded-lg line-clamp-2 italic mb-2">
              "{drop.notes}"
            </p>
          )}

          {drop.allergens && drop.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {drop.allergens.map((alg) => (
                <span key={alg} className="text-[9px] font-bold bg-[#F3F0E6] dark:bg-[#1C3317] text-[#79776E] dark:text-[#8AA280] px-1.5 py-0.5 rounded">
                  ⚠️ {alg}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F3F0E6] dark:border-[#24421C] mt-auto">
          {/* Expiry / Status display */}
          <div className="text-[10px] text-[#79776E] dark:text-[#8AA280]">
            {drop.status === 'available' ? (
              <>
                <p className="font-bold uppercase tracking-wider text-[9px]">Expires In</p>
                <p className={`font-bold text-xs ${time.isUrgent ? 'text-[#E46962] dark:text-[#F08A84]' : 'text-[#386A20] dark:text-[#90C872]'}`}>
                  {time.text}
                </p>
              </>
            ) : drop.status === 'claimed' ? (
              <>
                <p className="font-bold uppercase tracking-wider text-[9px]">Status</p>
                <p className="text-[#386A20] dark:text-[#90C872] font-bold text-xs">Ready for pickup</p>
              </>
            ) : (
              <>
                <p className="font-bold uppercase tracking-wider text-[9px]">Archived</p>
                <p className="text-[#79776E] dark:text-[#8AA280] font-bold text-xs">Rescued & Fed</p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              title={copied ? "Link Copied!" : "Copy link to share item"}
              aria-label="Share Drop Link"
              className="p-2.5 min-h-[36px] min-w-[36px] bg-[#F3F0E6] dark:bg-[#1C3317] hover:bg-[#E7F0E1] dark:hover:bg-[#203D17] text-[#386A20] dark:text-[#A4D888] rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onOpenAiRecipe(drop)}
              title="Generate Chef Gemini Zero-Waste Ideas"
              aria-label="AI Recipe Ideas"
              className="p-2.5 min-h-[36px] min-w-[36px] bg-[#F3F0E6] dark:bg-[#1C3317] hover:bg-[#E7F0E1] dark:hover:bg-[#203D17] text-[#386A20] dark:text-[#A4D888] rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {drop.status === 'available' && currentUser.role !== 'donor' && (
              <button
                onClick={() => onClaim(drop.id)}
                className="px-4 py-2 min-h-[36px] bg-[#386A20] dark:bg-[#4E8832] hover:bg-[#2C5319] dark:hover:bg-[#629E44] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              >
                {currentUser.role === 'guest' ? 'Sign in to Claim' : 'Claim Drop'}
              </button>
            )}

            {drop.status === 'claimed' && currentUser.role !== 'donor' && (
              <button
                onClick={() => onMarkCollected(drop.id)}
                className="px-3.5 py-2 min-h-[36px] bg-white dark:bg-[#12220E] border border-[#386A20] dark:border-[#76B058] text-[#386A20] dark:text-[#90C872] hover:bg-[#E7F0E1] dark:hover:bg-[#1C3317] rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
              >
                {currentUser.role === 'guest' ? 'Sign in to Collect' : 'Mark Collected'}
              </button>
            )}

            {drop.status === 'picked_up' && (
              <span className="text-[11px] font-bold text-[#79776E] dark:text-[#8AA280] px-2.5 py-1.5 min-h-[36px] flex items-center bg-[#F3F0E6] dark:bg-[#1C3317] rounded-full shrink-0">
                Collected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mutual Rating & Review Section after Pickup */}
      {drop.status === 'picked_up' && (
        <div className="px-4 py-3 bg-[#F8F7F2] dark:bg-[#182B14] border-t border-[#E6E2D3] dark:border-[#24421C] space-y-2">
          {(() => {
            const isMyDonorDrop = currentUser.role === 'donor' && (drop.donorName === currentUser.name || drop.donorName === currentUser.organization);
            const isMyRecipientDrop = currentUser.role === 'recipient' && (drop.claimedBy === currentUser.name || drop.claimedBy === currentUser.id);

            if (!isMyDonorDrop && !isMyRecipientDrop && currentUser.role !== 'admin') {
              return (
                <div className="flex items-center justify-between text-xs text-[#79776E] dark:text-[#8AA280]">
                  <span className="font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> Rescue Verified</span>
                  <span>{drop.donorRating || drop.recipientRating ? "⭐ Rated by partners" : "Completed rescue"}</span>
                </div>
              );
            }

            const targetRole = isMyDonorDrop ? 'recipient' : 'donor';
            const existingRating = isMyDonorDrop ? drop.donorRating : drop.recipientRating;
            const existingReview = isMyDonorDrop ? drop.donorReview : drop.recipientReview;

            if (existingRating || isRatingSubmitted) {
              const displayRate = existingRating || ratingVal;
              const displayRev = existingReview || reviewComment;
              return (
                <div className="text-xs bg-white dark:bg-[#12220E] p-2.5 rounded-xl border border-[#E6E2D3] dark:border-[#24421C] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#386A20] dark:text-[#90C872]">Your Rating for {targetRole === 'donor' ? drop.donorName : drop.claimedBy || 'Recipient'}:</span>
                    {displayRev && <p className="text-[#79776E] dark:text-[#8AA280] italic text-[11px] mt-0.5">"{displayRev}"</p>}
                  </div>
                  <span className="text-amber-500 font-bold tracking-widest shrink-0 ml-2">{"⭐".repeat(displayRate)}</span>
                </div>
              );
            }

            return (
              <div className="bg-white dark:bg-[#12220E] p-3 rounded-xl border border-[#E6E2D3] dark:border-[#24421C] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1D1B16] dark:text-[#EAE6DF]">
                    Rate {targetRole === 'donor' ? `Donor (${drop.donorName})` : `Recipient (${drop.claimedBy || 'Partner'})`}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setRatingVal(st)}
                        className={`text-sm cursor-pointer transition-transform hover:scale-110 ${st <= ratingVal ? 'opacity-100' : 'opacity-30 grayscale'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Leave an optional review note..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-[#E6E2D3] dark:border-[#24421C] bg-[#FDFCF8] dark:bg-[#1C3317] text-[#1D1B16] dark:text-[#EAE6DF] focus:outline-none focus:border-[#386A20]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onRateDrop?.(drop.id, targetRole, ratingVal, reviewComment);
                      setIsRatingSubmitted(true);
                    }}
                    className="px-3 py-1.5 bg-[#386A20] dark:bg-[#4E8832] hover:bg-[#2C5319] text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-2xs"
                  >
                    Submit
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
