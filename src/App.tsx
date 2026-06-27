import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { Sidebar } from './components/Sidebar';
import { DropCard } from './components/DropCard';
import { RadarMap } from './components/RadarMap';
import { AuthModals } from './components/AuthModals';
import { ProfileModal } from './components/ProfileModal';
import { CreateDropModal } from './components/CreateDropModal';
import { AiRecipeModal } from './components/AiRecipeModal';
import { ConfettiOverlay } from './components/ConfettiOverlay';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence } from 'motion/react';
import { INITIAL_DROPS, INITIAL_USERS } from './data';
import { FoodCategory, FoodDrop, SegmentTab, SortOption, User, UserRole, ViewMode } from './types';
import { Sparkles, SlidersHorizontal, ArrowUpDown, RefreshCw, ShieldAlert } from 'lucide-react';
import { db } from './firebase';
import { collection, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY_DROPS = 'foodbridge_drops_v1';
const STORAGE_KEY_USER = 'foodbridge_user_v1';
const STORAGE_KEY_THEME = 'foodbridge_theme_v1';

export default function App() {
  // Startup Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) === 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Simulated Alert Toast state
  const [toastAlert, setToastAlert] = useState<{ title: string; subtitle: string } | null>(null);

  const handleSimulateAlert = () => {
    const sampleDrops = drops.filter(d => d.status === 'available');
    const target = sampleDrops[Math.floor(Math.random() * sampleDrops.length)] || drops[0];
    setToastAlert({
      title: `🚨 New Surplus Match Nearby (${target.distanceKm}km)`,
      subtitle: `${target.quantity} of ${target.title} posted by ${target.donorName} in ${target.neighborhood}!`
    });
    setTimeout(() => setToastAlert(null), 6000);
  };

  // Load initial User state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS[0]; // Recipient default
  });

  // Load initial Drops state
  const [drops, setDrops] = useState<FoodDrop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DROPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_DROPS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DROPS, JSON.stringify(drops));
  }, [drops]);

  // Real-time Firestore sync for Food Drops
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'food_drops'), (snapshot) => {
      if (!snapshot.empty) {
        const remoteDrops = snapshot.docs.map(docSnap => docSnap.data() as FoodDrop);
        setDrops(remoteDrops);
      } else {
        // Seed initial drops if remote collection is empty
        INITIAL_DROPS.forEach(drop => {
          setDoc(doc(db, 'food_drops', drop.id), drop).catch(() => {});
        });
      }
    }, (error) => {
      console.warn("Firestore sync offline or permissions restricted, using local storage:", error);
    });
    return () => unsub();
  }, []);

  // UI Navigation & View States
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<SegmentTab>('all');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [sortOption, setSortOption] = useState<SortOption>('soonest');

  // Modals visibility state
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' | 'forgot' }>({
    isOpen: false,
    mode: 'login',
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [createDropOpen, setCreateDropOpen] = useState(false);
  const [aiRecipeState, setAiRecipeState] = useState<{ isOpen: boolean; drop: FoodDrop | null }>({
    isOpen: false,
    drop: null,
  });
  const [confettiDrop, setConfettiDrop] = useState<FoodDrop | null>(null);
  const [currentRoute, setCurrentRoute] = useState<string>(() => window.location.hash || `#/dashboard/${currentUser.role}`);

  // Enforce Secure Role-Based URL Route Protection
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash || `#/dashboard/${currentUser.role}`;
      setCurrentRoute(hash);

      // RBAC URL Route Guard Rules
      if (hash.includes('/admin') && currentUser.role !== 'admin') {
        window.location.hash = '#/unauthorized';
        return;
      }
      if (hash.includes('/donor') && currentUser.role !== 'donor' && currentUser.role !== 'admin') {
        window.location.hash = '#/unauthorized';
        return;
      }
      if (hash.includes('/recipient') && currentUser.role !== 'recipient' && currentUser.role !== 'admin') {
        window.location.hash = '#/unauthorized';
        return;
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    if (!window.location.hash) {
      window.location.hash = `#/dashboard/${currentUser.role}`;
    } else {
      handleHashSync();
    }
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [currentUser.role]);

  // Role switching helper
  const handleSwitchRole = (role: UserRole) => {
    window.location.hash = `#/dashboard/${role}`;
    const matchingUser = INITIAL_USERS.find((u) => u.role === role);
    if (matchingUser) {
      setCurrentUser({ ...matchingUser, preferredRadiusKm: radiusKm });
    } else {
      setCurrentUser({ ...currentUser, role });
    }
  };

  // Drop actions
  const handleCreateDrop = (newDrop: FoodDrop) => {
    setDrops([newDrop, ...drops]);
    setDoc(doc(db, 'food_drops', newDrop.id), newDrop).catch(() => {});
  };

  const handleClaimDrop = (dropId: string) => {
    const updated = drops.map((d) => {
      if (d.id === dropId) {
        const next: FoodDrop = {
          ...d,
          status: 'claimed',
          claimedBy: currentUser.name || currentUser.id,
          claimedAt: new Date().toISOString(),
        };
        setDoc(doc(db, 'food_drops', d.id), next).catch(() => {});
        return next;
      }
      return d;
    });
    setDrops(updated);
  };

  const handleMarkCollected = (dropId: string) => {
    const target = drops.find((d) => d.id === dropId) || null;
    const updated = drops.map((d) => {
      if (d.id === dropId) {
        const next: FoodDrop = {
          ...d,
          status: 'picked_up',
          pickedUpAt: new Date().toISOString(),
        };
        setDoc(doc(db, 'food_drops', d.id), next).catch(() => {});
        return next;
      }
      return d;
    });
    setDrops(updated);
    if (target) {
      setConfettiDrop({ ...target, status: 'picked_up' });
    }
  };

  const handleDeleteDrop = (dropId: string) => {
    setDrops(drops.filter((d) => d.id !== dropId));
    deleteDoc(doc(db, 'food_drops', dropId)).catch(() => {});
  };

  const handleResetFilters = () => {
    setActiveSegment('all');
    setSelectedCategory('ALL');
    setSearchQuery('');
    setRadiusKm(25);
    setSortOption('soonest');
  };

  // Calculate counts for sidebar
  const counts = useMemo(() => {
    return {
      all: drops.length,
      available: drops.filter((d) => d.status === 'available').length,
      claimed: drops.filter((d) => d.status === 'claimed').length,
    };
  }, [drops]);

  // Filtered & Sorted drops array
  const filteredDrops = useMemo(() => {
    return drops
      .filter((drop) => {
        // Segment filter
        if (activeSegment === 'available' && drop.status !== 'available') return false;
        if (activeSegment === 'claimed' && drop.status !== 'claimed') return false;

        // Category filter
        if (selectedCategory !== 'ALL' && drop.category !== selectedCategory) return false;

        // Radius filter
        if (drop.distanceKm > radiusKm) return false;

        // Search query filter (title, donor, neighborhood)
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = drop.title.toLowerCase().includes(q);
          const matchDonor = drop.donorName.toLowerCase().includes(q);
          const matchLocation = drop.neighborhood.toLowerCase().includes(q) || drop.location.toLowerCase().includes(q);
          const matchCat = drop.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDonor && !matchLocation && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'soonest') {
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        }
        if (sortOption === 'newest') {
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        }
        if (sortOption === 'quantity') {
          return b.mealsEstimated - a.mealsEstimated;
        }
        return 0;
      });
  }, [drops, activeSegment, selectedCategory, radiusKm, searchQuery, sortOption]);

  return (
    <div className={`flex flex-col h-screen w-full bg-[#FDFCF8] dark:bg-[#0E1E0B] text-[#1D1B16] dark:text-[#EAE6DF] font-sans overflow-hidden select-none transition-colors ${isDarkMode ? 'dark' : ''}`}>
      {/* Startup Animated Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onFinish={() => {
              setShowSplash(false);
              setAuthModal({ isOpen: true, mode: 'login' });
            }}
          />
        )}
      </AnimatePresence>

      {/* Simulated Nearby Match Alert Toast Popup */}
      {toastAlert && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-white dark:bg-[#1C3317] border-2 border-[#386A20] dark:border-[#90C872] p-4 rounded-2xl shadow-xl animate-bounce flex flex-col gap-1.5 transition-all text-xs">
          <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
            <span>{toastAlert.title}</span>
            <button onClick={() => setToastAlert(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">×</button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{toastAlert.subtitle}</p>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        searchQuery={searchQuery}
        isDarkMode={isDarkMode}
        onSearchChange={setSearchQuery}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onSwitchRole={handleSwitchRole}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSimulateAlert={handleSimulateAlert}
      />

      {/* Hero Stats & Quick Actions Bar */}
      <StatsBar
        drops={drops}
        role={currentUser.role}
        onPostSurplus={() => {
          if (currentUser.role === 'donor' || currentUser.role === 'admin') {
            setCreateDropOpen(true);
          } else {
            setActiveSegment('available');
          }
        }}
        onManageClaims={() => setActiveSegment('claimed')}
        onOpenAiRecipeGeneral={() => setAiRecipeState({ isOpen: true, drop: null })}
      />

      {/* Main Content Workspace Layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0 min-w-0">
        {/* Sidebar Filters */}
        <Sidebar
          activeSegment={activeSegment}
          onSelectSegment={setActiveSegment}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          radiusKm={radiusKm}
          onChangeRadius={setRadiusKm}
          counts={counts}
          onViewRadar={() => setViewMode('map')}
          onResetFilters={handleResetFilters}
        />

        {/* Central Feed Main Area */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-[#FDFCF8] dark:bg-[#0E1E0B] transition-colors min-w-0">
          {currentRoute === '#/unauthorized' ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 sm:p-8 bg-white dark:bg-[#12220E] rounded-3xl border border-red-200 dark:border-red-900 shadow-xl max-w-xl mx-auto my-6 sm:my-10 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-9 h-9 animate-bounce" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-1 rounded-full">
                  403 Forbidden Route
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#1D1B16] dark:text-[#EAE6DF] pt-1">
                  Unauthorized Dashboard Access
                </h2>
                <p className="text-xs text-[#79776E] dark:text-[#8AA280] leading-relaxed">
                  Your active authentication role (<strong className="capitalize text-[#1D1B16] dark:text-[#EAE6DF]">{currentUser.role}</strong>) does not have permission privileges to inspect this restricted dashboard URL route.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = `#/dashboard/${currentUser.role}`;
                }}
                className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] bg-[#386A20] dark:bg-[#4E8832] hover:bg-[#2C5319] text-white font-extrabold rounded-xl text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                Return to My {currentUser.role.toUpperCase()} Dashboard
              </button>
            </div>
          ) : (
            <>
          {/* Admin Banner Alert if in Admin Mode */}
          {currentUser.role === 'admin' && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-red-900 dark:text-red-200 font-medium">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <span className="truncate sm:whitespace-normal"><strong>Admin Moderation Mode Active:</strong> You have permissions to inspect and delete community surplus listings.</span>
              </div>
              <button
                onClick={() => handleSwitchRole('recipient')}
                className="w-full sm:w-auto px-4 py-2 min-h-[36px] bg-white dark:bg-[#12220E] border border-red-300 dark:border-red-700 rounded-lg font-bold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer shrink-0 text-center"
              >
                Exit Admin
              </button>
            </div>
          )}

          {/* View Toolbar Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1D1B16] dark:text-[#EAE6DF] flex items-center gap-2 truncate">
                <span className="truncate">Surplus Feed Nearby</span>
                <span className="text-xs font-bold text-[#386A20] dark:text-[#A4D888] bg-[#E7F0E1] dark:bg-[#203D17] px-2.5 py-0.5 rounded-full shrink-0">
                  {filteredDrops.length} available
                </span>
              </h2>
            </div>
            {searchQuery && (
              <p className="text-xs text-[#79776E] dark:text-[#8AA280] -mt-2 sm:mt-0.5">
                Showing matches for "<span className="font-bold text-[#1D1B16] dark:text-[#EAE6DF]">{searchQuery}</span>"
              </p>
            )}

            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Sort Selector */}
              <div className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 bg-[#F3F0E6] dark:bg-[#1C3317] px-3 py-2 sm:py-1.5 rounded-xl border border-[#E6E2D3] dark:border-[#2A4B20] text-xs min-h-[40px]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#79776E] dark:text-[#8AA280] shrink-0" />
                <span className="font-bold text-[#79776E] dark:text-[#8AA280]">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  aria-label="Sort options"
                  className="bg-transparent font-bold text-[#386A20] dark:text-[#90C872] outline-none cursor-pointer"
                >
                  <option value="soonest" className="dark:bg-[#12220E]">Soonest</option>
                  <option value="newest" className="dark:bg-[#12220E]">Newest</option>
                  <option value="quantity" className="dark:bg-[#12220E]">Quantity</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-[#F3F0E6] dark:bg-[#1C3317] p-1 rounded-xl border border-[#E6E2D3] dark:border-[#2A4B20] shrink-0 min-h-[40px] items-center">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[32px] ${
                    viewMode === 'list' ? 'bg-white dark:bg-[#2A4B20] text-[#1D1B16] dark:text-[#EAE6DF] shadow-xs' : 'text-[#79776E] dark:text-[#8AA280] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[32px] ${
                    viewMode === 'map' ? 'bg-[#386A20] dark:bg-[#4E8832] text-white shadow-xs' : 'text-[#79776E] dark:text-[#8AA280] hover:text-[#1D1B16] dark:hover:text-[#EAE6DF]'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Main Display Area (Grid vs Map) */}
          {viewMode === 'map' ? (
            <RadarMap
              drops={filteredDrops}
              currentUser={currentUser}
              onClaim={handleClaimDrop}
              onOpenAiRecipe={(drop) => setAiRecipeState({ isOpen: true, drop })}
              onSwitchToGrid={() => setViewMode('list')}
            />
          ) : filteredDrops.length === 0 ? (
            /* Empty State */
            <div className="py-12 sm:py-20 text-center bg-white dark:bg-[#162912] border border-[#E6E2D3] dark:border-[#24421C] rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-xs my-6 sm:my-8">
              <div className="w-16 h-16 bg-[#F3F0E6] dark:bg-[#1C3317] text-[#79776E] dark:text-[#8AA280] rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1D1B16] dark:text-[#EAE6DF]">No surplus food matches your filters</h3>
              <p className="text-xs text-[#79776E] dark:text-[#8AA280] mt-1 mb-6 leading-relaxed">
                Try widening your distance radius, switching food category tabs, or clearing your search term.
              </p>
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-[#386A20] dark:bg-[#4E8832] hover:bg-[#2C5319] dark:hover:bg-[#629E44] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
              </button>
            </div>
          ) : (
            /* Grid View Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-16 min-w-0">
              {filteredDrops.map((drop) => (
                <DropCard
                  key={drop.id}
                  drop={drop}
                  currentUser={currentUser}
                  onClaim={handleClaimDrop}
                  onMarkCollected={handleMarkCollected}
                  onOpenAiRecipe={(drop) => setAiRecipeState({ isOpen: true, drop })}
                  onDeleteDrop={handleDeleteDrop}
                />
              ))}
            </div>
          )}
          </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-[#E6E2D3] dark:bg-[#162912] border-t border-[#D9D5C6] dark:border-[#24421C] px-6 flex items-center justify-between text-[10px] text-[#79776E] dark:text-[#8AA280] font-medium shrink-0 z-10 transition-colors">
        <div className="flex gap-4 items-center">
          <span>© 2026 FoodBridge Zero-Waste Platform</span>
          <span className="flex items-center gap-1.5 font-bold text-[#386A20] dark:text-[#90C872]">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Live Server: North Precinct District
          </span>
        </div>
        <div className="hidden sm:flex gap-4">
          <button onClick={() => setAuthModal({ isOpen: true, mode: 'login' })} className="hover:text-[#386A20] dark:hover:text-[#A4D888] cursor-pointer">Platform Auth</button>
          <span className="text-[#D9D5C6] dark:text-[#24421C]">|</span>
          <a href="#" className="hover:text-[#386A20] dark:hover:text-[#A4D888]">Privacy Policy</a>
          <a href="#" className="hover:text-[#386A20] dark:hover:text-[#A4D888]">Terms of Rescue</a>
        </div>
      </footer>

      {/* Modals & Popups */}
      <AuthModals
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onLoginSuccess={(role, name, email) => {
          window.location.hash = `#/dashboard/${role}`;
          handleSwitchRole(role);
          setCurrentUser((prev) => ({ ...prev, name, role, email: email || prev.email }));
        }}
      />

      <ProfileModal
        isOpen={profileOpen}
        currentUser={currentUser}
        drops={drops}
        onClose={() => setProfileOpen(false)}
        onSave={(updated) => setCurrentUser(updated)}
      />

      <CreateDropModal
        isOpen={createDropOpen}
        currentUser={currentUser}
        onClose={() => setCreateDropOpen(false)}
        onCreateDrop={handleCreateDrop}
      />

      <AiRecipeModal
        isOpen={aiRecipeState.isOpen}
        drop={aiRecipeState.drop}
        currentUser={currentUser}
        onClose={() => setAiRecipeState({ isOpen: false, drop: null })}
      />

      <ConfettiOverlay
        drop={confettiDrop}
        onClose={() => setConfettiDrop(null)}
      />
    </div>
  );
}

