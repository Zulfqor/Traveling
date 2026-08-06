import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchHotels } from '../services/api';
import ControlPanel from '../components/ControlPanel';
import HeroCarousel from '../components/HeroCarousel';
import FilterBottomSheet from '../components/FilterBottomSheet';
import HotelCard from '../components/HotelCard';
import AnimatedCardWrapper from '../components/AnimatedCardWrapper';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import BookingModal from '../components/BookingModal';
import QuickViewModal from '../components/QuickViewModal';
import CompareModal from '../components/CompareModal';
import RecentlyViewed from '../components/RecentlyViewed';
import Footer from '../components/Footer';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SearchX, RotateCcw, GitCompare, LayoutGrid, List, Star } from 'lucide-react';

const PAGE_SIZE = 6;

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { compareList, clearCompare } = useCompare();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const searchTerm = searchParams.get('search') || '';
  const selectedCity = searchParams.get('city') || '';
  const priceSort = searchParams.get('priceSort') || '';
  const ratingSort = searchParams.get('ratingSort') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [priceRange, setPriceRange] = useState(1000);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [quickViewHotel, setQuickViewHotel] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [recentlyViewedHotels, setRecentlyViewedHotels] = useState([]);

  const updateURLParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        newParams.set(key, val);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  const setSearchTerm = (val) => updateURLParams({ search: val, page: '1' });
  const setSelectedCity = (val) => updateURLParams({ city: val, page: '1' });
  const setPriceSort = (val) => updateURLParams({ priceSort: val, page: '1' });
  const setRatingSort = (val) => updateURLParams({ ratingSort: val, page: '1' });
  const setCurrentPage = (val) => updateURLParams({ page: String(val) });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHotels();
      setHotels(data);
      if (data.length > 0) {
        const maxP = Math.max(...data.map(h => h.price));
        setPriceRange(maxP);
      }
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
      setError(err.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    try {
      const saved = localStorage.getItem('travel_app_recent');
      if (saved) setRecentlyViewedHotels(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const cities = useMemo(() => {
    const set = new Set(hotels.map(h => h.city).filter(Boolean));
    return Array.from(set).sort();
  }, [hotels]);

  const minPrice = useMemo(() => {
    if (hotels.length === 0) return 0;
    return Math.min(...hotels.map(h => h.price));
  }, [hotels]);

  const maxPrice = useMemo(() => {
    if (hotels.length === 0) return 1000;
    return Math.max(...hotels.map(h => h.price));
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(h => h.name.toLowerCase().includes(term));
    }

    if (selectedCity) {
      result = result.filter(h => h.city === selectedCity);
    }

    if (priceRange) {
      result = result.filter(h => h.price <= priceRange);
    }

    if (ratingSort === 'desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (priceSort === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [hotels, searchTerm, selectedCity, priceSort, ratingSort, priceRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCity) count++;
    if (priceSort) count++;
    if (ratingSort) count++;
    if (priceRange < maxPrice) count++;
    return count;
  }, [selectedCity, priceSort, ratingSort, priceRange, maxPrice]);

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
    setPriceRange(maxPrice);
  };

  const totalPages = Math.ceil(filteredHotels.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(pageParam, totalPages);

  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredHotels.slice(start, start + PAGE_SIZE);
  }, [filteredHotels, currentPage]);

  const handleBookingSuccess = (updatedHotel) => {
    setHotels(prev => prev.map(h => h.id === updatedHotel.id ? updatedHotel : h));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      <div>
        {/* Control Bar Panel */}
        <ControlPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cities={cities}
          priceSort={priceSort}
          setPriceSort={setPriceSort}
          ratingSort={ratingSort}
          setRatingSort={setRatingSort}
          onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Hero Banner */}
          {!loading && !searchTerm && !selectedCity && (
            <HeroCarousel />
          )}

          {/* Recently Viewed Row */}
          {!loading && recentlyViewedHotels.length > 0 && (
            <RecentlyViewed items={recentlyViewedHotels} />
          )}

          {/* Catalog Title + View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E5E5E5] dark:border-[#262626]">
            <div>
              <span className="eyebrow block mb-1">
                {filteredHotels.length} {t('stays_found')}
              </span>
              <h2 className="font-bold text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                {selectedCity ? `Properties in ${selectedCity}` : 'Architectural Hotel Listing'}
              </h2>
            </div>

            {/* Grid vs List View Switcher Buttons */}
            <div className="flex items-center gap-1 self-start sm:self-auto border border-[#0A0A0A] dark:border-[#F5F5F5]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]' 
                    : 'text-[#0A0A0A] dark:text-[#F5F5F5]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]' 
                    : 'text-[#0A0A0A] dark:text-[#F5F5F5]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {loading ? (
            /* Shimmer Skeleton Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <ErrorState message={error} onRetry={loadData} />
          ) : filteredHotels.length === 0 ? (
            /* Architectural Empty State */
            <div className="flex flex-col items-center justify-center p-16 text-center border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#141414] my-8">
              <div className="w-16 h-16 border border-[#0A0A0A] dark:border-[#F5F5F5] flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] mb-2 tracking-tight">
                {t('no_hotels_found')}
              </h3>
              <p className="eyebrow text-xs max-w-sm mb-6">
                {t('no_hotels_desc')}
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-outline px-6 py-2 text-xs"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                <span>{t('clear_filters')}</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Pure Hotel Grid Mode with Scroll Reveal */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {paginatedHotels.map((hotel, index) => (
                  <AnimatedCardWrapper key={hotel.id} index={index}>
                    <HotelCard
                      hotel={hotel}
                      onBookClick={(h) => setSelectedHotelForBooking(h)}
                      onQuickViewClick={(h) => setQuickViewHotel(h)}
                    />
                  </AnimatedCardWrapper>
                ))}
              </div>

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          ) : (
            /* Numbered List Mode (01, 02, 03...) */
            <div className="space-y-4">
              {paginatedHotels.map((hotel, index) => {
                const itemNumber = String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, '0');
                return (
                  <AnimatedCardWrapper key={hotel.id} index={index}>
                    <div
                      onClick={() => navigate(`/hotel/${hotel.id}`)}
                      className="group cursor-pointer p-4 sm:p-6 bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] hover:border-[#0A0A0A] dark:hover:border-[#F5F5F5] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-2xl font-bold text-[#8A8A8A] group-hover:text-[#0A0A0A] dark:group-hover:text-[#F5F5F5] transition-colors">
                          {itemNumber}
                        </span>

                        <div className="w-20 h-16 bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden shrink-0">
                          {hotel.images && hotel.images[0] ? (
                            <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full bg-[#E5E5E5] dark:bg-[#262626]" />
                          )}
                        </div>

                        <div>
                          <div className="eyebrow text-[10px] flex items-center gap-2">
                            <span>{hotel.city} · {hotel.country}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5 text-[#0A0A0A] dark:text-[#F5F5F5] font-bold">
                              <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-[#F5F5F5] group-hover:underline">
                            {hotel.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="eyebrow text-[10px] block">{t('starting_from')}</span>
                          <span className="font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5]">
                            {formatPrice(hotel.price)}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hotel.available) setSelectedHotelForBooking(hotel);
                          }}
                          disabled={!hotel.available}
                          className={`btn-sharp px-4 text-xs ${
                            hotel.available
                              ? 'btn-primary'
                              : 'bg-[#FAFAFA] text-[#8A8A8A] border border-[#E5E5E5] cursor-not-allowed'
                          }`}
                        >
                          {hotel.available ? t('book_now') : t('booked_btn')}
                        </button>
                      </div>
                    </div>
                  </AnimatedCardWrapper>
                );
              })}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

        </main>
      </div>

      {/* Footer Section */}
      <Footer />

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A] px-5 py-3 border border-[#0A0A0A] dark:border-[#F5F5F5] shadow-2xl flex items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <GitCompare className="w-4 h-4" strokeWidth={1.5} />
            <span>{compareList.length} Selected</span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-1.5 bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-white text-xs font-bold uppercase tracking-widest transition-colors focus-ring"
          >
            {t('compare_now')}
          </button>
          <button
            onClick={clearCompare}
            className="text-xs text-[#8A8A8A] hover:underline"
          >
            {t('clear')}
          </button>
        </div>
      )}

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        ratingSort={ratingSort}
        setRatingSort={setRatingSort}
        onResetFilters={handleResetFilters}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        hotel={quickViewHotel}
        isOpen={!!quickViewHotel}
        onClose={() => setQuickViewHotel(null)}
        onBookClick={(h) => setSelectedHotelForBooking(h)}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onBookClick={(h) => setSelectedHotelForBooking(h)}
      />

      {/* Booking Confirmation Modal */}
      <BookingModal
        hotel={selectedHotelForBooking}
        isOpen={!!selectedHotelForBooking}
        onClose={() => setSelectedHotelForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

    </div>
  );
};

export default HomePage;
