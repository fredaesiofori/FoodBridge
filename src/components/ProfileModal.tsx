import React, { useState } from 'react';
import { X, Save, UserCircle, MapPin, Sliders, Check, Sparkles, History, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { User, FoodCategory, UserRole, FoodDrop } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  currentUser: User;
  drops?: FoodDrop[];
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const ALL_CATEGORIES: FoodCategory[] = [
  'Bakery & Bread',
  'Fresh Produce',
  'Prepared Meals',
  'Dairy & Refrigerated',
  'Pantry & Dry',
  'Catering & Trays',
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  currentUser,
  drops = [],
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<User>({ ...currentUser });

  if (!isOpen) return null;

  // Compute user history
  const userHistory = drops.filter((d) => {
    const isMyDonor = d.donorName === currentUser.name || d.donorName === currentUser.id;
    const isMyRecipient = d.claimedBy === currentUser.name || d.claimedBy === currentUser.id;
    return isMyDonor || isMyRecipient;
  });

  // Gather all reviews
  const dynamicReviewsFromDrops = drops
    .map(d => {
      if (currentUser.role === 'donor' && (d.donorName === currentUser.name || d.donorName === currentUser.organization) && d.recipientRating) {
        return {
          id: `drop-rev-${d.id}`,
          reviewerName: d.claimedBy || 'Recipient Partner',
          reviewerRole: 'recipient',
          rating: d.recipientRating,
          comment: d.recipientReview,
          createdAt: d.pickedUpAt || d.postedAt
        };
      }
      if (currentUser.role === 'recipient' && (d.claimedBy === currentUser.name || d.claimedBy === currentUser.id) && d.donorRating) {
        return {
          id: `drop-rev-${d.id}`,
          reviewerName: d.donorName,
          reviewerRole: 'donor',
          rating: d.donorRating,
          comment: d.donorReview,
          createdAt: d.pickedUpAt || d.postedAt
        };
      }
      return null;
    })
    .filter(Boolean) as any[];

  const allReviews = [...(currentUser.reviews || []), ...dynamicReviewsFromDrops];
  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : (currentUser.ratingSum && currentUser.reviewCount ? (currentUser.ratingSum / currentUser.reviewCount).toFixed(1) : 'No reviews yet');

  const toggleCategory = (cat: FoodCategory) => {
    const prefs = formData.preferredFoodTypes || [];
    if (prefs.includes(cat)) {
      setFormData({ ...formData, preferredFoodTypes: prefs.filter((c) => c !== cat) });
    } else {
      setFormData({ ...formData, preferredFoodTypes: [...prefs, cat] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] dark:bg-[#162912] border border-[#E6E2D3] dark:border-[#24421C] text-[#1D1B16] dark:text-[#EAE6DF] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#386A20] p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-[#E7F0E1]" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Account & Preference Center</h2>
              <p className="text-xs text-[#E7F0E1] opacity-90">Customize your surplus alerts and rescue matching criteria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-full bg-black/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Avatar & Role Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#F3F0E6] rounded-2xl border border-[#E6E2D3]">
            <img
              src={formData.avatar}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label className="block text-xs font-bold text-[#1D1B16] uppercase">Choose Preset Avatar</label>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {SAMPLE_AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: av })}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                      formData.avatar === av ? 'border-[#386A20] scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="Or paste custom image URL..."
                className="w-full text-xs bg-white border border-[#E6E2D3] rounded-lg px-3 py-1 mt-1 outline-none focus:ring-1 focus:ring-[#386A20]"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Full Name / Org Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#386A20]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#386A20]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-sm outline-none font-bold text-[#386A20]"
              >
                <option value="donor">Food Donor</option>
                <option value="recipient">Recipient</option>
                <option value="guest">Guest Visitor</option>
                <option value="admin">Admin Moderator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Preferred Rescue Radius</label>
              <div className="flex items-center gap-3 bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-1.5">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.preferredRadiusKm}
                  onChange={(e) => setFormData({ ...formData, preferredRadiusKm: Number(e.target.value) })}
                  className="flex-1 accent-[#386A20]"
                />
                <span className="text-xs font-bold text-[#386A20] w-12 text-right">{formData.preferredRadiusKm} km</span>
              </div>
            </div>
          </div>

          <hr className="border-[#E6E2D3]" />

          {/* Preferred Food Matching Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#1D1B16] uppercase">
                Preferred Food Matching Categories
              </label>
              <span className="text-[11px] text-[#79776E]">
                {formData.preferredFoodTypes.length} selected
              </span>
            </div>
            <p className="text-xs text-[#79776E] mb-3">
              We'll highlight and prioritize matching surplus alerts in your feed.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = formData.preferredFoodTypes.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#E7F0E1] border-[#386A20] text-[#386A20] shadow-2xs'
                        : 'bg-[#FDFCF8] border-[#E6E2D3] text-[#79776E] hover:border-[#386A20]/40'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#386A20]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-[#E6E2D3]" />

          {/* Reputation & Reviews Section */}
          <div className="bg-[#FDFCF8] p-4 rounded-2xl border border-[#E6E2D3] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <label className="text-xs font-bold text-[#1D1B16] uppercase">
                  Community Reputation & Experience
                </label>
              </div>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                ⭐ {avgRating} ({allReviews.length} Reviews)
              </span>
            </div>
            
            {allReviews.length === 0 ? (
              <p className="text-xs text-[#79776E] italic">No ratings or community feedback logged yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {allReviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="p-2.5 bg-white border border-[#E6E2D3] rounded-xl text-xs space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#386A20]">{rev.reviewerName}</span>
                      <span className="text-amber-500">{"⭐".repeat(rev.rating)}</span>
                    </div>
                    {rev.comment && <p className="text-[#79776E] text-[11px] italic">"{rev.comment}"</p>}
                    <span className="text-[9px] text-gray-400 block text-right">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-[#E6E2D3]" />

          {/* Donation & Pickup History Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-[#386A20]" />
              <label className="block text-xs font-bold text-[#1D1B16] uppercase">
                Donation & Rescue History ({userHistory.length})
              </label>
            </div>
            {userHistory.length === 0 ? (
              <div className="p-6 bg-[#F3F0E6] rounded-2xl border border-[#E6E2D3] text-center text-xs text-[#79776E]">
                No past completed rescues or posted drops yet. Start claiming or donating today!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {userHistory.map((item) => {
                  const isSuccessful = item.status === 'picked_up';
                  const isExpired = item.status === 'expired';
                  const isClaimed = item.status === 'claimed';
                  
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-white border border-[#E6E2D3] rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-[#386A20]/30 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Package className="w-4 h-4 text-[#79776E] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#1D1B16] truncate">{item.title}</p>
                          <p className="text-[10px] text-[#79776E]">
                            {item.quantity} • {item.donorName}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="shrink-0">
                        {isSuccessful ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Successful
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Expired
                          </span>
                        ) : isClaimed ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                            ⏱️ In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#E6E2D3] flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E6E2D3] text-xs font-bold text-[#79776E] hover:text-[#1D1B16] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#386A20] hover:bg-[#2C5319] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
