import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, Trophy, Heart } from 'lucide-react';
import { FoodDrop } from '../types';

interface ConfettiOverlayProps {
  drop: FoodDrop | null;
  onClose: () => void;
}

const COLORS = ['#386A20', '#E46962', '#F59E0B', '#3B82F6', '#8AA280', '#D97706'];

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ drop, onClose }) => {
  useEffect(() => {
    if (drop) {
      const timer = setTimeout(() => {
        onClose();
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [drop, onClose]);

  if (!drop) return null;

  // Generate 45 celebratory falling particles
  const particles = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage vw
    delay: Math.random() * 0.8,
    duration: 2.2 + Math.random() * 2,
    size: 8 + Math.random() * 14,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
        {/* Backdrop flash */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
          onClick={onClose}
        />

        {/* Falling Confetti Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                top: '-10%',
                left: `${p.x}%`,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                top: '110%',
                left: `${p.x + (Math.random() * 20 - 10)}%`,
                rotate: p.rotation + 360,
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
                repeat: 1,
              }}
              style={{
                position: 'absolute',
                width: `${p.size}px`,
                height: `${p.size * 0.6}px`,
                backgroundColor: p.color,
                borderRadius: p.id % 3 === 0 ? '50%' : '3px',
              }}
            />
          ))}
        </div>

        {/* Success Modal Popup */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white dark:bg-[#12220E] border-2 border-[#386A20] dark:border-[#76B058] rounded-3xl p-8 max-w-md w-full shadow-2xl relative pointer-events-auto text-center space-y-5 overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#386A20] via-[#F59E0B] to-[#E46962]" />

          <div className="relative mx-auto w-20 h-20 bg-[#E7F0E1] dark:bg-[#203D17] rounded-full flex items-center justify-center shadow-inner">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Trophy className="w-10 h-10 text-[#386A20] dark:text-[#90C872]" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#386A20] dark:text-[#90C872] bg-[#E7F0E1] dark:bg-[#1C3317] px-3 py-1 rounded-full">
              🎉 Rescue Completed
            </span>
            <h3 className="text-2xl font-black text-[#1D1B16] dark:text-[#EAE6DF] tracking-tight pt-1">
              Surplus Food Collected!
            </h3>
            <p className="text-xs text-[#79776E] dark:text-[#8AA280] leading-relaxed max-w-xs mx-auto">
              You have successfully collected <strong className="text-[#1D1B16] dark:text-[#EAE6DF]">{drop.quantity}</strong> of <strong className="text-[#1D1B16] dark:text-[#EAE6DF]">{drop.title}</strong> from {drop.donorName}.
            </p>
          </div>

          <div className="bg-[#F8F7F2] dark:bg-[#182B14] p-4 rounded-2xl border border-[#E6E2D3] dark:border-[#24421C] text-left flex items-center gap-3.5">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/60 rounded-xl text-green-700 dark:text-green-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1D1B16] dark:text-[#EAE6DF]">Zero-Waste Impact Logged</p>
              <p className="text-[11px] text-[#79776E] dark:text-[#8AA280]">
                Est. {drop.mealsEstimated || 15} nourishing meals prevented from landfill.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#386A20] dark:bg-[#4E8832] hover:bg-[#2C5319] text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-green-900/20 transition-transform active:scale-95 cursor-pointer"
          >
            Awesome, Continue Dashboard
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
