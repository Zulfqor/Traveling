import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Heart, Check, ImageOff, ChevronRight, ArrowRight, Minus, Plus, Calculator } from 'lucide-react';
import { fetchHotelById, fetchHotels } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import BookingModal from '../components/BookingModal';
import HotelCard from '../components/HotelCard';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const [hotel, setHotel] = useState(null);
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Live Cost Calculator States
  const [calcNights, setCalcNights] = useState(2);
  const [calcGuests, setCalcGuests] = useState(2);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHotelById(id);
      setHotel(data);

      try {
        const saved = localStorage.getItem('travel_app_recent');
        let recent = saved ? JSON.parse(saved) : [];
        recent = [data, ...recent.filter(item => String(item.id) !== String(data.id))].slice(0, 5);
        localStorage.setItem('travel_app_recent', JSON.stringify(recent));
      } catch (e) {
        console.error(e);
      }

      const all = await fetchHotels();
      setAllHotels(all);
    } catch (err) {
      console.error("Error loading hotel details:", err);
      setError("Could not load details for this hotel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen pt-24 pb-12 max-w-xl mx-auto px-4">
        <ErrorState message={error || 'Hotel not found'} onRetry={loadData} />
      </div>
    );
  }

  const imagesList = hotel.images && hotel.images.length > 0 ? hotel.images : (hotel.image ? [hotel.image] : []);
  const favorited = isFavorite(hotel.id);

  // Live Price Breakdown calculations
  const baseCost = hotel.price * calcNights;
  const serviceFee = Math.round(baseCost * 0.06); // 6% service fee
  const calculatedTotal = baseCost + serviceFee;

  const similarHotels = allHotels
    .filter(h => String(h.id) !== String(hotel.id) && (h.city === hotel.city || Math.abs(h.price - hotel.price) < 80))
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* Top Sticky Mini-Summary Bar on Scroll */}
      {showStickyBar && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-white/95 dark:bg-[#0A0A0A]/95 border-b border-[#E5E5E5] dark:border-[#262626] backdrop-blur-md py-3 px-4 sm:px-8 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">{hotel.name}</span>
            <span className="text-xs text-[#8A8A8A]">· {hotel.city}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-base text-[#0A0A0A] dark:text-[#F5F5F5]">
              {formatPrice(calculatedTotal)}
            </span>
            <button
              onClick={() => hotel.available && setIsBookingModalOpen(true)}
              disabled={!hotel.available}
              className="btn-primary py-1.5 px-4 text-xs h-9"
            >
              {hotel.available ? 'BOOK NOW' : 'BOOKED'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-outline py-2 px-4 text-xs h-10 inline-flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>{t('back_btn')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details Section (Col-Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card overflow-hidden">
            {/* Photo Carousel */}
            <div className="relative w-full h-80 sm:h-[400px] bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden">
              {imagesList.length === 0 || imageError ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8A8A8A] gap-2">
                  <ImageOff className="w-12 h-12" strokeWidth={1.5} />
                  <span className="eyebrow">No Image Available</span>
                </div>
              ) : (
                <>
                  <img
                    src={imagesList[currentImageIndex]}
                    alt={hotel.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {imagesList.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? imagesList.length - 1 : prev - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black transition-all focus-ring"
                      >
                        <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === imagesList.length - 1 ? 0 : prev + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black transition-all focus-ring"
                      >
                        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                {hotel.available ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0A0A0A] bg-white text-[#0A0A0A] text-xs font-bold tracking-widest uppercase">
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                    <span>AVAILABLE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E5E5E5] text-[#8A8A8A] text-xs font-bold tracking-widest uppercase">
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                    <span>BOOKED</span>
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(hotel)}
                aria-label="Favorite toggle"
                className="absolute top-4 right-4 z-10 w-10 h-10 border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5] flex items-center justify-center focus-ring"
              >
                <Heart
                  className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="eyebrow block mb-1">
                    {hotel.city} · {hotel.country}
                  </span>
                  <h1 className="font-bold text-3xl sm:text-4xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                    {hotel.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2 border border-[#0A0A0A] dark:border-[#F5F5F5] px-4 py-2 font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">
                  <Star className="w-4 h-4 fill-current" strokeWidth={1.5} />
                  <span>{hotel.rating} / 5.0</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#262626] text-sm text-[#8A8A8A] leading-relaxed space-y-2">
                <h3 className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] text-base uppercase">
                  {t('property_overview')}
                </h3>
                <p>
                  Located in {hotel.city}, {hotel.country}, {hotel.name} features refined architecture, silent spaces, and rapid access to local sights. Crafted for minimalist luxury travel.
                </p>
              </div>

              {/* Guest Reviews Section */}
              {hotel.reviews && hotel.reviews.length > 0 && (
                <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#262626] space-y-4">
                  <h3 className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] text-base uppercase">
                    GUEST REVIEWS ({hotel.reviews.length})
                  </h3>
                  <div className="space-y-3">
                    {hotel.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{rev.guestName}</span>
                          <span className="flex items-center gap-1 font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                            <Star className="w-3.5 h-3.5 fill-current" /> {rev.rating}.0
                          </span>
                        </div>
                        <p className="text-xs text-[#8A8A8A]">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Sticky Sidebar Live Calculator & Booking Box (Col-Span 1) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-[#141414] border border-[#0A0A0A] dark:border-[#F5F5F5] rounded-card p-6 space-y-6 shadow-xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#262626]">
              <div>
                <span className="eyebrow block text-[10px]">DAILY RATE</span>
                <span className="font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5]">
                  {formatPrice(hotel.price)}
                </span>
                <span className="text-xs text-[#8A8A8A]"> / night</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold border border-[#0A0A0A] dark:border-[#F5F5F5] px-2.5 py-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{hotel.rating}</span>
              </div>
            </div>

            {/* Live Interactive Price Calculator Inputs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" strokeWidth={1.5} />
                  <span>Cost Calculator</span>
                </span>
              </div>

              {/* Nights Selector */}
              <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-between">
                <span className="eyebrow text-[10px]">Nights</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCalcNights(prev => Math.max(1, prev - 1))}
                    className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm">{calcNights}</span>
                  <button
                    onClick={() => setCalcNights(prev => prev + 1)}
                    className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Guests Selector */}
              <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-between">
                <span className="eyebrow text-[10px]">Guests</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCalcGuests(prev => Math.max(1, prev - 1))}
                    className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm">{calcGuests}</span>
                  <button
                    onClick={() => setCalcGuests(prev => Math.min(6, prev + 1))}
                    className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Cost Breakdown Table */}
              <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#262626] space-y-2 text-xs">
                <div className="flex justify-between text-[#8A8A8A]">
                  <span>{formatPrice(hotel.price)} × {calcNights} nights</span>
                  <span className="font-semibold text-[#0A0A0A] dark:text-[#F5F5F5]">{formatPrice(baseCost)}</span>
                </div>

                <div className="flex justify-between text-[#8A8A8A]">
                  <span>Service fee (6%)</span>
                  <span className="font-semibold text-[#0A0A0A] dark:text-[#F5F5F5]">{formatPrice(serviceFee)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#E5E5E5] dark:border-[#262626] font-bold text-base text-[#0A0A0A] dark:text-[#F5F5F5]">
                  <span>Total Rate</span>
                  <span>{formatPrice(calculatedTotal)}</span>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => hotel.available && setIsBookingModalOpen(true)}
              disabled={!hotel.available}
              className={`w-full btn-primary py-3.5 text-xs ${
                !hotel.available ? 'bg-[#FAFAFA] text-[#8A8A8A] border border-[#E5E5E5] cursor-not-allowed' : ''
              }`}
            >
              {hotel.available ? (
                <>
                  <span>RESERVE FOR {formatPrice(calculatedTotal)}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" strokeWidth={1.5} />
                  <span>CURRENTLY BOOKED</span>
                </>
              )}
            </button>

          </div>
        </div>

      </div>

      {/* Similar Recommendations */}
      {similarHotels.length > 0 && (
        <div className="mt-16">
          <span className="eyebrow block mb-2">{t('recommendations')}</span>
          <h3 className="font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] mb-6">
            {t('you_might_also_like')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarHotels.map(item => (
              <HotelCard
                key={item.id}
                hotel={item}
                onBookClick={() => setIsBookingModalOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      <BookingModal
        hotel={hotel}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={(updated) => setHotel(updated)}
      />

    </div>
  );
};

export default HotelDetailsPage;
