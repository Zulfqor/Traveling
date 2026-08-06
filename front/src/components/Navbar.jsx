import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Sun, Moon, Menu, X, ArrowLeftRight, Globe, ChevronDown, Map, Ticket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchBookings } from '../services/bookingApi';

const Navbar = ({ onOpenCompare, onOpenMap }) => {
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { currency, toggleCurrency } = useCurrency();
  const { compareList } = useCompare();
  const { lang, setLang, t, LANGUAGES } = useLanguage();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeBookingCount, setActiveBookingCount] = useState(0);

  const favCount = favorites.length;
  const compareCount = compareList.length;

  useEffect(() => {
    fetchBookings()
      .then(bookings => {
        const active = bookings.filter(b => b.status === 'Upcoming').length;
        setActiveBookingCount(active);
      })
      .catch(console.error);
  }, [location.pathname]);

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[2];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-[16px] border-b border-black/10 dark:border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group focus-ring p-1"
        >
          <div className="w-8 h-8 rounded-none bg-[#0A0A0A] dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] flex items-center justify-center font-bold text-base tracking-widest">
            T
          </div>
          <span className="font-bold text-xl tracking-tighter text-[#0A0A0A] dark:text-[#F5F5F5] uppercase">
            {t('brand_name')}<span className="text-[#8A8A8A]">.</span>
          </span>
        </Link>

        {/* Right Nav Pill Buttons Container */}
        <div className="hidden md:flex items-center gap-2.5">
          
          {/* Map View Pill Button */}
          <button
            onClick={onOpenMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[11px] font-semibold tracking-wider uppercase text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10 transition-all focus-ring"
            title="Interactive Map View"
          >
            <Map className="w-3.5 h-3.5 text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
            <span>Map View</span>
          </button>

          {/* My Bookings Pill Button */}
          <Link
            to="/bookings"
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wider uppercase border transition-all focus-ring ${
              location.pathname === '/bookings'
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] dark:bg-[#F5F5F5] dark:text-[#0A0A0A] dark:border-[#F5F5F5]'
                : 'border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>My Bookings</span>
            {activeBookingCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-[#0A0A0A] dark:bg-[#F5F5F5] dark:text-[#0A0A0A] rounded-full">
                {activeBookingCount}
              </span>
            )}
          </Link>

          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[11px] font-semibold tracking-wider uppercase text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10 transition-all focus-ring"
            >
              <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{currentLangObj.name}</span>
              <ChevronDown className="w-3 h-3 text-[#8A8A8A]" strokeWidth={1.5} />
            </button>

            {/* Language Dropdown */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#141414] border border-black/15 dark:border-white/15 shadow-2xl py-1 z-50 animate-fade-in">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                      lang === l.code
                        ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]'
                        : 'text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Toggle Pill */}
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[11px] font-semibold tracking-wider uppercase text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10 transition-all focus-ring"
            title="Toggle Currency"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{currency}</span>
          </button>

          {/* Compare Badge Pill */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[11px] font-semibold tracking-wider uppercase text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10 transition-all focus-ring"
            >
              <span>{t('compare_link')}</span>
              <span className="w-4 h-4 rounded-full bg-[#0A0A0A] dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center">
                {compareCount}
              </span>
            </button>
          )}

          {/* Favorites Pill */}
          <Link
            to="/favorites"
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wider uppercase border transition-all focus-ring ${
              location.pathname === '/favorites'
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] dark:bg-[#F5F5F5] dark:text-[#0A0A0A] dark:border-[#F5F5F5]'
                : 'border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <Heart 
              className={`w-3.5 h-3.5 ${favCount > 0 ? 'fill-current' : ''}`} 
              strokeWidth={1.5} 
            />
            <span>{t('favorites_link')}</span>
            {favCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-[#0A0A0A] dark:bg-[#F5F5F5] dark:text-[#0A0A0A] rounded-full">
                {favCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle Pill */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-md border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[#0A0A0A] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-all focus-ring"
          >
            {isDark ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/bookings"
            className="px-2.5 py-1 text-[10px] font-bold border border-black/15 dark:border-white/15 rounded bg-black/5 dark:bg-white/5 text-[#0A0A0A] dark:text-[#F5F5F5]"
          >
            BOOKINGS
          </Link>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 border border-black/15 dark:border-white/15 rounded bg-black/5 dark:bg-white/5 text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center"
          >
            {isDark ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 border border-black/15 dark:border-white/15 rounded bg-black/5 dark:bg-white/5 text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" strokeWidth={1.5} /> : <Menu className="w-4 h-4" strokeWidth={1.5} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0A0A0A]/95 px-4 py-3 space-y-2 animate-fade-in">
          <Link
            to="/bookings"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-bold tracking-widest uppercase text-[#0A0A0A] dark:text-[#F5F5F5]"
          >
            My Bookings ({activeBookingCount})
          </Link>
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 text-xs font-bold tracking-widest uppercase ${
              location.pathname === '/' 
                ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]' 
                : 'text-[#0A0A0A] dark:text-[#F5F5F5]'
            }`}
          >
            Hotels
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
