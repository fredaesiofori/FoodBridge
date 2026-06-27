import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Utensils, HeartHandshake } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // 3.5 seconds startup delay before automatically triggering auth redirect
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#FDFCF8] dark:bg-[#0E1E0B] text-[#1D1B16] dark:text-[#EAE6DF] select-none overflow-hidden px-4"
    >
      {/* Background Subtle Glowing Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#386A20]/10 dark:bg-[#90C872]/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* App Logo Icon Badge */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#386A20] to-[#254615] dark:from-[#76B058] dark:to-[#4E8832] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#386A20]/20 dark:shadow-none p-6 transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDFCF8] dark:bg-[#0E1E0B] rounded-full flex items-center justify-center relative shadow-inner">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#386A20] dark:bg-[#90C872] rounded-full animate-ping absolute opacity-75"></div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#386A20] dark:bg-[#90C872] rounded-full relative z-10"></div>
            </div>
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -top-3 -right-3 bg-[#E7F0E1] dark:bg-[#1C3317] text-[#386A20] dark:text-[#90C872] p-2.5 rounded-2xl shadow-md border border-[#386A20]/20"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#386A20] dark:text-[#90C872]">
            FoodBridge
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#53524A] dark:text-[#C5C2B8] tracking-wide">
            Rescuing Surplus • Nourishing Communities
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-3 mt-6 w-full max-w-xs">
          <div className="w-48 h-1.5 bg-[#E6E2D3] dark:bg-[#24421C] rounded-full overflow-hidden p-0 relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.4, ease: "easeInOut" }}
              className="h-full bg-[#386A20] dark:bg-[#90C872] rounded-full"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#386A20] dark:text-[#90C872] animate-pulse mt-1">
            <span>Initializing Rescue Network</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Footer Credits */}
      <div className="absolute bottom-8 flex items-center gap-4 text-xs font-medium text-[#79776E] dark:text-[#8AA280]">
        <span className="flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5" /> Donors Connected
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5" /> Zero Waste Goal
        </span>
      </div>
    </motion.div>
  );
};
