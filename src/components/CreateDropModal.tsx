import React, { useState } from 'react';
import { X, PlusCircle, Clock, MapPin, Camera, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { FoodCategory, FoodDrop, User } from '../types';
import { PRESET_FOOD_IMAGES } from '../data';

interface CreateDropModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onCreateDrop: (newDrop: FoodDrop) => void;
}

const CATEGORIES: FoodCategory[] = [
  'Bakery & Bread',
  'Fresh Produce',
  'Prepared Meals',
  'Dairy & Refrigerated',
  'Pantry & Dry',
  'Catering & Trays',
];

export const CreateDropModal: React.FC<CreateDropModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onCreateDrop,
}) => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Prepared Meals');
  const [location, setLocation] = useState('742 Market St, North Precinct');
  const [neighborhood, setNeighborhood] = useState('North Precinct');
  const [expireHours, setExpireHours] = useState(3);
  const [imageUrl, setImageUrl] = useState(PRESET_FOOD_IMAGES[0].url);
  const [notes, setNotes] = useState('');
  const [scheduledPickupTime, setScheduledPickupTime] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().getTime();
    const expiresAt = new Date(now + expireHours * 60 * 60 * 1000).toISOString();

    const newDrop: FoodDrop = {
      id: `drop-${Date.now()}`,
      title,
      quantity,
      mealsEstimated: parseInt(quantity) || 15,
      category,
      donorName: currentUser.name || 'Artisan Bakery',
      donorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80',
      location,
      neighborhood,
      distanceKm: Number((Math.random() * 3 + 0.5).toFixed(1)),
      postedAt: new Date().toISOString(),
      expiresAt,
      status: 'available',
      imageUrl,
      notes,
      scheduledPickupTime: scheduledPickupTime.trim() || undefined,
      allergens: ['Wheat', 'Dairy']
    };

    onCreateDrop(newDrop);
    onClose();
    // Reset
    setTitle('');
    setQuantity('');
    setNotes('');
    setScheduledPickupTime('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] dark:bg-[#162912] border border-[#E6E2D3] dark:border-[#24421C] text-[#1D1B16] dark:text-[#EAE6DF] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#386A20] p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-[#E7F0E1]" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Post Surplus Drop (&lt;30s)</h2>
              <p className="text-xs text-[#E7F0E1] opacity-90">Rescue excess food instantly for local recipients</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-full bg-black/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Pre-fill ideas */}
          <div className="bg-[#E7F0E1] p-3 rounded-xl border border-[#386A20]/20 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-bold text-[#386A20] shrink-0">💡 Quick Fill:</span>
            <button
              type="button"
              onClick={() => {
                setTitle('Surplus Sourdough & Croissant Box');
                setQuantity('18 pcs');
                setCategory('Bakery & Bread');
                setImageUrl(PRESET_FOOD_IMAGES[0].url);
              }}
              className="bg-white px-2.5 py-1 rounded-lg font-bold text-[#386A20] shadow-2xs shrink-0 cursor-pointer hover:bg-[#F3F0E6]"
            >
              🍞 Bakery Box
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('Fresh Organic Veggie & Herb Crates');
                setQuantity('12 kg');
                setCategory('Fresh Produce');
                setImageUrl(PRESET_FOOD_IMAGES[1].url);
              }}
              className="bg-white px-2.5 py-1 rounded-lg font-bold text-[#386A20] shadow-2xs shrink-0 cursor-pointer hover:bg-[#F3F0E6]"
            >
              🥗 Veggie Crates
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('Catered Sandwiches & Wrap Platters');
                setQuantity('20 portions');
                setCategory('Prepared Meals');
                setImageUrl(PRESET_FOOD_IMAGES[4].url);
              }}
              className="bg-white px-2.5 py-1 rounded-lg font-bold text-[#386A20] shadow-2xs shrink-0 cursor-pointer hover:bg-[#F3F0E6]"
            >
              🌯 Sandwich Platters
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Food Title / Description</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Assorted Sourdough Loaves & Pastries"
              className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#386A20]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Quantity / Est. Meals</label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 15 boxed meals, 5 kg"
                className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#386A20]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2.5 text-sm outline-none font-bold text-[#386A20]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expiration Slider */}
          <div className="bg-[#F3F0E6] p-4 rounded-2xl border border-[#E6E2D3]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#1D1B16] uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E46962]" /> Expiration Timeline
              </label>
              <span className="text-xs font-bold text-white bg-[#E46962] px-2.5 py-0.5 rounded-full">
                Expires in {expireHours} {expireHours === 1 ? 'hour' : 'hours'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={expireHours}
              onChange={(e) => setExpireHours(Number(e.target.value))}
              className="w-full accent-[#E46962] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#79776E] mt-1 font-bold">
              <span>Urgent (1h)</span>
              <span>Standard (4h)</span>
              <span>End of Day (12h)</span>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Pickup Street Address</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#386A20]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Neighborhood / District</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-sm outline-none font-bold"
              >
                <option value="North Precinct">North Precinct</option>
                <option value="Midtown">Midtown</option>
                <option value="Central District">Central District</option>
                <option value="Harbor View">Harbor View</option>
                <option value="Eastside">Eastside</option>
              </select>
            </div>
          </div>

          {/* Image Picker */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#1D1B16] uppercase flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#386A20]" /> Image Attachment
              </label>
              <button
                type="button"
                onClick={() => setShowPresetPicker(!showPresetPicker)}
                className="text-xs font-bold text-[#386A20] hover:underline cursor-pointer"
              >
                {showPresetPicker ? 'Hide Preset Photos' : 'Browse Preset Photography'}
              </button>
            </div>

            {showPresetPicker ? (
              <div className="grid grid-cols-4 gap-2 p-3 bg-[#F3F0E6] rounded-xl border border-[#E6E2D3] mb-2">
                {PRESET_FOOD_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => {
                      setImageUrl(img.url);
                      setShowPresetPicker(false);
                    }}
                    className={`relative rounded-lg overflow-hidden h-16 border-2 transition-all cursor-pointer ${
                      imageUrl === img.url ? 'border-[#386A20] ring-2 ring-[#386A20]' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white truncate px-1 text-center font-bold">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex gap-2 items-center">
              <img src={imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#E6E2D3] shrink-0" />
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[#386A20]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Scheduled Pickup Window (Optional)</label>
            <input
              type="text"
              value={scheduledPickupTime}
              onChange={(e) => setScheduledPickupTime(e.target.value)}
              placeholder="e.g. Today 4:00 PM - 6:00 PM"
              className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[#386A20]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1D1B16] uppercase mb-1">Surplus Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Packaged in sanitary containers. Ring back doorbell upon arrival."
              className="w-full bg-[#F3F0E6] border border-[#E6E2D3] rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[#386A20]"
            />
          </div>

          {/* Submit Action */}
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
              <PlusCircle className="w-4 h-4" /> Publish Surplus Drop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
