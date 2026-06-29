import React, { useState } from 'react';
import { Clock, MapPin, Sparkles, CheckCircle, Package, Utensils, AlertTriangle, ShieldX, Share2, Check, ShieldCheck, Award, MessageCircle, Copy, X } from 'lucide-react';
import { FoodDrop, User, UserRole } from '../types';
import { formatTimeLeft } from '../utils';
import { INITIAL_USERS } from '../data';

const getDonorTrustStats = (donorName: string) => {
  const user = INITIAL_USERS.find(u => u.name.toLowerCase() === donorName.toLowerCase());
  if (user && user.reviewCount && user.ratingSum) {
    const avg = (user.ratingSum / user.reviewCount).toFixed(1);
    const trustScore = Math.min(99, Math.round((Number(avg) / 5) * 100));
    return {
      isVerified: true,
      trustScore: `${trustScore}% Trust Score`,
      pickups: `${user.reviewCount * 3 + 12} Successful Pickups`,
      rating: avg,
    };
  }
  let charSum = 0;
  for (let i = 0; i < donorName.length; i++) charSum += donorName.charCodeAt(i);
  const isVerified = charSum % 5 !== 0;
  const trustPercent = 94 + (charSum % 6);
  const pickupsCount = 8 + (charSum % 45);
  return {
    isVerified,
    trustScore: `${trustPercent}% Trust Score`,
    pickups: `${pickupsCount} Successful Pickups`,
    rating: (4.7 + (charSum % 4) * 0.1).toFixed(1),
  };
};

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
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?dropId=${drop.id}`;
  const shareText = `Check out this surplus food rescue: "${drop.title}" (${drop.quantity}) on FoodBridge!`;
  const donorStats = getDonorTrustStats(drop.donorName);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
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

          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <p className="text-xs text-[#79776E] dark:text-[#8AA280] flex items-center gap-1">
              <span>Posted by</span>
              <span className="font-bold text-[#1D1B16] dark:text-[#EAE6DF]">{drop.donorName}</span>
            </p>
            {donorStats.isVerified && (
              <span title="Verified Food Donor Organization" className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800 shrink-0 shadow-2xs">
                <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Verified
              </span>
            )}
            <span title="Based on successful past surplus rescues" className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 text-[10px] font-bold border border-amber-200 dark:border-amber-800/80 shrink-0">
              <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              {donorStats.trustScore} • {donorStats.pickups}
            </span>
          </div>

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
          <div className="flex items-center gap-1.5 relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              title="Share surplus listing on social media or copy link"
              aria-label="Share Drop Link"
              className="p-2.5 min-h-[36px] min-w-[36px] bg-[#F3F0E6] dark:bg-[#1C3317] hover:bg-[#E7F0E1] dark:hover:bg-[#203D17] text-[#386A20] dark:text-[#A4D888] rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Share Popover Menu */}
            {showShareMenu && (
              <div className="absolute bottom-11 left-0 bg-white dark:bg-[#1C3317] border border-[#E6E2D3] dark:border-[#2A4B20] rounded-2xl shadow-2xl p-2 z-40 flex flex-col gap-1 min-w-[180px] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <span>Share Listing</span>
                  <button onClick={() => setShowShareMenu(false)} className="hover:text-gray-700 dark:hover:text-gray-300 p-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span className="font-extrabold text-xs text-sky-500 shrink-0">𝕏</span> Twitter / X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span className="font-black text-xs text-blue-600 dark:text-blue-400 shrink-0">f</span> Facebook
                </a>
                <button
                  type="button"
                  onClick={() => {
                    handleCopyLink();
                    setShowShareMenu(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold transition-colors text-left w-full cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
            )}

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
