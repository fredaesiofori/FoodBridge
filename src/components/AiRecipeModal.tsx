import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChefHat, Clock, Users, Utensils, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { FoodDrop, AiRecipePlan, User } from '../types';

interface AiRecipeModalProps {
  isOpen: boolean;
  drop: FoodDrop | null;
  currentUser: User;
  onClose: () => void;
}

export const AiRecipeModal: React.FC<AiRecipeModalProps> = ({
  isOpen,
  drop,
  currentUser,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AiRecipePlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customItemInput, setCustomItemInput] = useState('');

  const targetTitle = drop ? drop.title : customItemInput || 'Assorted Bakery & Organic Produce';
  const targetQuantity = drop ? drop.quantity : '15 portions';
  const targetCat = drop ? drop.category : 'General Surplus';

  const fetchChefPlan = async (title: string, qty: string, cat: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodTitle: title,
          quantity: qty,
          category: cat,
          recipientType: currentUser.organization || currentUser.name || 'Community Shelter',
        }),
      });
      if (!res.ok) throw new Error('Network error generating AI Chef plan');
      const data = await res.json();
      setPlan(data);
    } catch (err: any) {
      setError(err.message || 'Could not reach Chef Gemini API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChefPlan(targetTitle, targetQuantity, targetCat);
    } else {
      setPlan(null);
      setError(null);
    }
  }, [isOpen, drop]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] border border-[#E6E2D3] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Banner Header */}
        <div className="bg-gradient-to-r from-[#386A20] to-[#2C5319] p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-black/15"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E7F0E1] text-[#386A20] rounded-2xl flex items-center justify-center shadow-md shrink-0">
              <ChefHat className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Chef Gemini AI ✧
                </span>
                <span className="text-xs text-[#E7F0E1]">Zero-Waste Meal Rescue</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-0.5">
                {drop ? `Meal Plan for: ${drop.title}` : 'Custom Surplus Meal Idea Generator'}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!drop && (
            <div className="bg-[#F3F0E6] p-4 rounded-2xl border border-[#E6E2D3] flex gap-2 items-center">
              <input
                type="text"
                value={customItemInput}
                onChange={(e) => setCustomItemInput(e.target.value)}
                placeholder="Type surplus item (e.g. 10 kg tomatoes, stale bread)..."
                className="flex-1 bg-white border border-[#E6E2D3] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#386A20]"
              />
              <button
                onClick={() => fetchChefPlan(customItemInput || 'Surplus Produce', '10 kg', 'General')}
                className="px-4 py-2 bg-[#386A20] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#2C5319] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Craft Ideas
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-[#E7F0E1] text-[#386A20] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="font-bold text-lg text-[#1D1B16]">Chef Gemini is analyzing ingredient pairings...</h3>
              <p className="text-xs text-[#79776E] max-w-sm mx-auto">
                Calculating nutritional balance and portioning {targetQuantity} for {currentUser.organization || 'your recipients'}.
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-red-600 font-bold text-sm">{error}</p>
              <button
                onClick={() => fetchChefPlan(targetTitle, targetQuantity, targetCat)}
                className="px-4 py-2 bg-[#386A20] text-white rounded-xl text-xs font-bold"
              >
                Retry Generation
              </button>
            </div>
          ) : plan ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Recipe Headline Card */}
              <div className="bg-[#E7F0E1] p-5 rounded-3xl border border-[#386A20]/20 space-y-2 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 text-[#386A20]/10 pointer-events-none">
                  <Utensils className="w-40 h-40" />
                </div>
                <h3 className="text-2xl font-bold text-[#386A20] tracking-tight">{plan.recipeName}</h3>
                <p className="text-xs text-[#1D1B16] font-medium leading-relaxed max-w-lg">{plan.summary}</p>
                <div className="flex flex-wrap gap-4 pt-2 font-bold text-xs text-[#386A20]">
                  <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-[#E46962]" /> Prep: {plan.prepTime}
                  </span>
                  <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg shadow-2xs">
                    <Users className="w-3.5 h-3.5 text-[#386A20]" /> Yield: {plan.servings}
                  </span>
                </div>
              </div>

              {/* Ingredients & Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ingredients */}
                <div className="md:col-span-1 bg-white border border-[#E6E2D3] p-5 rounded-2xl shadow-2xs">
                  <h4 className="text-[11px] font-bold uppercase text-[#79776E] tracking-wider mb-3 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#386A20]" /> Required Items
                  </h4>
                  <ul className="space-y-2 text-xs text-[#1D1B16]">
                    {plan.ingredients?.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#F3F0E6]/50 p-2 rounded-lg font-medium">
                        <span className="text-[#386A20] font-bold">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="md:col-span-2 bg-white border border-[#E6E2D3] p-5 rounded-2xl shadow-2xs">
                  <h4 className="text-[11px] font-bold uppercase text-[#79776E] tracking-wider mb-3 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-[#386A20]" /> Preparation Steps
                  </h4>
                  <ol className="space-y-3 text-xs text-[#1D1B16]">
                    {plan.instructions?.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-[#386A20] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-medium pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Safety & Storage Tip */}
              {plan.storageTip && (
                <div className="p-4 bg-[#F3F0E6] rounded-2xl border border-[#E6E2D3] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#386A20] shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#386A20]">Food Preservation Tip</span>
                    <p className="text-xs text-[#1D1B16] font-medium leading-snug">{plan.storageTip}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E6E2D3] flex justify-between items-center">
            <button
              onClick={() => fetchChefPlan(targetTitle, targetQuantity, targetCat)}
              disabled={loading}
              className="text-xs font-bold text-[#386A20] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Re-generate Plan
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1D1B16] hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
