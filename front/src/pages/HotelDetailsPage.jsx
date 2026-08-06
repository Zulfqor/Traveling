import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Star, Heart, Check, ImageOff, ChevronRight, ArrowRight, Minus, Plus, Calculator, Bell, Share2, MapPin, Wifi, Car, Waves, Coffee, Wind, RotateCcw, Zap, Users, ThumbsUp, TrendingDown, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import { fetchHotelById, fetchHotels } from '../services/api';
import { incrementHelpfulReviewApi } from '../services/bookingApi';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import BookingModal from '../components/BookingModal';
import HotelCard from '../components/HotelCard';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AmenityDetailItem = ({ name }) => {
  const iconProps = { className: "w-4 h-4 text-[#0A0A0A] dark:text-[#F5F5F5]", strokeWidth: 1.5 };
  let label = "Amenity";
  let icon = null;

  switch (name) {
    case 'wifi':
      label = "High-speed Wi-Fi";
      icon = <Wifi {...iconProps} />;
      break;
    case 'car':
      label = "Secured Parking";
      icon = <Car {...iconProps} />;
      break;
    case 'waves':
      label = "Swimming Pool";
      icon = <Waves {...iconProps} />;
      break;
    case 'coffee':
      label = "Artisanal Breakfast";
      icon = <Coffee {...iconProps} />;
      break;
    case 'wind':
      label = "Climate Control (AC)";
      icon = <Wind {...iconProps} />;
      break;
    default:
      label = name;
  }

  return (
    <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] flex items-center gap-2.5 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      {icon}
      <span className="text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{label}</span>
    </div>
  );
};

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [hotel, setHotel] = useState(null);
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Room Type Selection State
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  // Tabbed Switcher State: 'overview' | 'amenities' | 'reviews' | 'location'
  const [activeTab, setActiveTab] = useState('overview');

  // Price Alert Subscription state
  const [isPriceAlertSubscribed, setIsPriceAlertSubscribed] = useState(false);

  // Helpful reviews clicked map
  const [helpfulClickedMap, setHelpfulClickedMap] = useState({});

  // Live Cost Calculator States
  const [calcNights, setCalcNights] = useState(2);
  const [calcGuests, setCalcGuests] = useState(2);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHotelById(id);
      setHotel(data);

      const savedAlerts = localStorage.getItem('travel_price_alerts');
      if (savedAlerts) {
        const parsed = JSON.parse(savedAlerts);
        setIsPriceAlertSubscribed(parsed.includes(String(id)));
      }

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

  const handleTogglePriceAlert = () => {
    const savedAlerts = localStorage.getItem('travel_price_alerts');
    let alerts = savedAlerts ? JSON.parse(savedAlerts) : [];
    
    if (isPriceAlertSubscribed) {
      alerts = alerts.filter(aId => String(aId) !== String(id));
      setIsPriceAlertSubscribed(false);
      showToast("Price alert unsubscribed");
    } else {
      alerts.push(String(id));
      setIsPriceAlertSubscribed(true);
      showToast("Price alert set for this property");
    }
    localStorage.setItem('travel_price_alerts', JSON.stringify(alerts));
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard");
  };

  const handleHelpfulClick = async (reviewId) => {
    if (helpfulClickedMap[reviewId]) return;
    try {
      const updated = await incrementHelpfulReviewApi(hotel.id, reviewId);
      setHotel(updated);
      setHelpfulClickedMap(prev => ({ ...prev, [reviewId]: true }));
      showToast("Marked as helpful");
    } catch (e) {
      console.error(e);
    }
  };

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

  const roomTypes = hotel.roomTypes || [
    { id: 'rt_std', name: 'Standard King Room', price: hotel.price, capacity: 2, features: ['City View', 'Free Wi-Fi', 'King Bed'] },
    { id: 'rt_dlx', name: 'Executive Suite', price: Math.round(hotel.price * 1.35), capacity: 3, features: ['Balcony', 'Lounge Access', 'Breakfast'] }
  ];
  const currentRoom = roomTypes[selectedRoomIndex] || roomTypes[0];
  const activeRate = currentRoom.price || hotel.price;

  const imagesList = hotel.images && hotel.images.length > 0 ? hotel.images : (hotel.image ? [hotel.image] : []);
  const favorited = isFavorite(hotel.id);

  // Live Price Breakdown calculations based on active room rate
  const baseCost = activeRate * calcNights;
  const serviceFee = Math.round(baseCost * 0.06);
  const calculatedTotal = baseCost + serviceFee;

  // City Average Calculation
  const sameCityHotels = allHotels.filter(h => h.city === hotel.city);
  const cityAvgPrice = sameCityHotels.length > 0 
    ? Math.round(sameCityHotels.reduce((sum, h) => sum + h.price, 0) / sameCityHotels.length)
    : hotel.price;
  
  const diffFromAvgPercent = Math.round(((hotel.price - cityAvgPrice) / cityAvgPrice) * 100);

  // Better rated hotel recommendation link in similar price range (±20%)
  const betterRatedOption = allHotels.find(h => 
    String(h.id) !== String(hotel.id) &&
    h.city === hotel.city &&
    Math.abs(h.price - hotel.price) <= hotel.price * 0.25 &&
    h.rating > hotel.rating
  );

  // Monthly Price Seasonality Bar Chart Data
  const monthlyPrices = hotel.monthlyPrices || [200, 190, 180, 175, 180, 210, 220, 215, 195, 185, 170, 190];
  const minMonthlyPrice = Math.min(...monthlyPrices);
  const maxMonthlyPrice = Math.max(...monthlyPrices);
  const minPriceMonthIndex = monthlyPrices.indexOf(minMonthlyPrice);

  const similarHotels = allHotels
    .filter(h => String(h.id) !== String(hotel.id) && (h.city === hotel.city || Math.abs(h.price - hotel.price) < 80))
    .slice(0, 3);

  const nearbyList = hotel.nearby || [
    { name: "City Center", distance: "1.2 km" },
    { name: "International Airport", distance: "6.5 km" },
    { name: "Main Cultural Park", distance: "0.8 km" }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* Top Sticky Mini-Summary Bar on Scroll */}
      {showStickyBar && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-white/95 dark:bg-[#0A0A0A]/95 border-b border-[#E5E5E5] dark:border-[#262626] backdrop-blur-md py-3 px-4 sm:px-8 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">{hotel.name}</span>
            <span className="text-xs text-[#8A8A8A]">· {currentRoom.name}</span>
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

      {/* Navigation & Action Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn-outline py-2 px-4 text-xs h-10 inline-flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>{t('back_btn')}</span>
        </button>

        {/* Action Buttons: Share + Price Alert Bell */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePriceAlert}
            className={`btn-outline py-2 px-3 text-xs h-10 inline-flex items-center gap-2 ${
              isPriceAlertSubscribed ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]' : ''
            }`}
            title="Price Alert"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">
              {isPriceAlertSubscribed ? 'Alert Active' : 'Notify me if price drops'}
            </span>
          </button>

          <button
            onClick={handleShareClick}
            className="btn-outline py-2 px-3 text-xs h-10 inline-flex items-center gap-2"
            title="Share"
          >
            <Share2 className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
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

              {/* Status Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                {hotel.available ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#0A0A0A] bg-white text-[#0A0A0A] text-xs font-bold tracking-widest uppercase">
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                    <span>AVAILABLE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5E5E5] text-[#8A8A8A] text-xs font-bold tracking-widest uppercase">
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                    <span>BOOKED</span>
                  </span>
                )}

                {hotel.freeCancellation && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#0A0A0A] bg-white/90 text-[#0A0A0A]">
                    <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
                    <span>Free Cancellation</span>
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

            {/* Content Details Header */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="eyebrow flex items-center gap-2 mb-1 text-[10px] text-[#8A8A8A]">
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{hotel.buildingType || 'Luxury Hotel'}</span>
                    <span>·</span>
                    <span>{hotel.renovatedYear || 'Renovated in 2023'}</span>
                    {hotel.verifiedProperty && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-[#0A0A0A] dark:text-[#F5F5F5] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A] dark:text-[#F5F5F5]" />
                          <span>Verified</span>
                        </span>
                      </>
                    )}
                  </div>

                  <h1 className="font-bold text-3xl sm:text-4xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                    {hotel.name}
                  </h1>

                  {/* City Average Price Benchmark Subline */}
                  <div className="text-xs text-[#8A8A8A] flex items-center gap-1.5 pt-1">
                    {diffFromAvgPercent < 0 ? (
                      <span className="flex items-center gap-1 font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>{Math.abs(diffFromAvgPercent)}% below average rate for {hotel.city}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-[#8A8A8A]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{diffFromAvgPercent}% above average rate for {hotel.city}</span>
                      </span>
                    )}
                    <span>(Avg: {formatPrice(cityAvgPrice)}/night)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border border-[#0A0A0A] dark:border-[#F5F5F5] px-4 py-2 font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5] self-start sm:self-auto">
                  <Star className="w-4 h-4 fill-current" strokeWidth={1.5} />
                  <span>{hotel.rating} / 5.0</span>
                  <span className="text-[#8A8A8A] font-normal text-xs">({hotel.reviewCount || 120})</span>
                </div>
              </div>

              {/* "Similar price, better rated" Recommendation Link Banner */}
              {betterRatedOption && (
                <div className="p-3 border border-[#0A0A0A] dark:border-[#F5F5F5] bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0A0A0A] dark:text-[#F5F5F5]" />
                    <span>
                      Similar rate, higher rated in {hotel.city}: <strong className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{betterRatedOption.name} ({betterRatedOption.rating} ★)</strong>
                    </span>
                  </div>
                  <Link 
                    to={`/hotel/${betterRatedOption.id}`}
                    className="font-bold underline text-[#0A0A0A] dark:text-[#F5F5F5] hover:opacity-80"
                  >
                    View Stay →
                  </Link>
                </div>
              )}

              {/* Room Types Selection Cards */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs text-[#0A0A0A] dark:text-[#F5F5F5] uppercase tracking-wider">
                  Select Room Type
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roomTypes.map((room, rIdx) => {
                    const isSelected = rIdx === selectedRoomIndex;
                    return (
                      <div
                        key={room.id || rIdx}
                        onClick={() => setSelectedRoomIndex(rIdx)}
                        className={`p-3.5 border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'border-[#0A0A0A] bg-[#0A0A0A]/5 dark:border-[#F5F5F5] dark:bg-[#F5F5F5]/5'
                            : 'border-[#E5E5E5] dark:border-[#262626] hover:border-[#0A0A0A]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">
                              {room.name}
                            </h5>
                            <div className="flex items-center gap-1 text-[11px] text-[#8A8A8A]">
                              <Users className="w-3.5 h-3.5" />
                              <span>Up to {room.capacity} guests</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-base text-[#0A0A0A] dark:text-[#F5F5F5]">
                              {formatPrice(room.price)}
                            </span>
                            <span className="text-[10px] block text-[#8A8A8A]">/ night</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-[#8A8A8A] border-t border-[#E5E5E5] dark:border-[#262626] pt-1.5">
                          {(room.features || []).join(' · ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tabbed Switcher Navigation Bar (Overview / Amenities / Reviews / Location) */}
              <div className="flex items-center gap-6 border-b border-[#E5E5E5] dark:border-[#262626] pt-4 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'seasonality', label: 'Price Seasonality' },
                  { id: 'amenities', label: 'Amenities' },
                  { id: 'reviews', label: `Reviews (${(hotel.reviews || []).length})` },
                  { id: 'location', label: 'Location & Nearby' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-[#0A0A0A] dark:text-[#F5F5F5]'
                        : 'text-[#8A8A8A] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A0A0A] dark:bg-[#F5F5F5]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content 1: Overview */}
              {activeTab === 'overview' && (
                <div className="pt-4 text-sm text-[#8A8A8A] leading-relaxed space-y-4 animate-fade-in">
                  <p>
                    Located in the prime district of {hotel.city}, {hotel.country}, {hotel.name} features refined architecture, silent spaces, and rapid access to local sights. Crafted specifically for minimalist luxury travel.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                      <span className="eyebrow block text-[9px]">CATEGORY</span>
                      <span className="font-bold text-xs text-[#0A0A0A] dark:text-[#F5F5F5]">{hotel.stars || 5}.0 Star Hotel</span>
                    </div>
                    <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                      <span className="eyebrow block text-[9px]">CONFIRMATION</span>
                      <span className="font-bold text-xs text-[#0A0A0A] dark:text-[#F5F5F5]">Instant Ticket</span>
                    </div>
                    <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                      <span className="eyebrow block text-[9px]">CANCELLATION</span>
                      <span className="font-bold text-xs text-[#0A0A0A] dark:text-[#F5F5F5]">{hotel.freeCancellation ? 'Free Flexible' : 'Standard'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Price Seasonality Bar Chart */}
              {activeTab === 'seasonality' && (
                <div className="pt-4 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5] uppercase">
                      Monthly Price Trends (Jan - Dec)
                    </h4>
                    <span className="text-xs text-[#8A8A8A]">Lowest: {formatPrice(minMonthlyPrice)}</span>
                  </div>

                  {/* Custom Thin Vertical Monochrome Bar Chart */}
                  <div className="p-4 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-3">
                    <div className="h-44 flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-[#E5E5E5] dark:border-[#262626]">
                      {monthlyPrices.map((mPrice, mIdx) => {
                        const heightPercent = Math.max(15, Math.round(((mPrice - (minMonthlyPrice * 0.7)) / (maxMonthlyPrice - (minMonthlyPrice * 0.7))) * 100));
                        const isLowest = mIdx === minPriceMonthIndex;

                        return (
                          <div key={mIdx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                            {/* Hover tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-1.5 py-0.5 bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A] text-[9px] font-bold whitespace-nowrap z-20">
                              {formatPrice(mPrice)}
                            </div>

                            {/* Bar */}
                            <div 
                              className={`w-full max-w-[16px] transition-all duration-300 ${
                                isLowest
                                  ? 'bg-[#0A0A0A] dark:bg-[#F5F5F5] border border-[#0A0A0A] dark:border-[#F5F5F5]'
                                  : 'bg-[#E5E5E5] dark:bg-[#262626] hover:bg-[#8A8A8A]'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            />

                            <span className="text-[10px] text-[#8A8A8A] font-bold mt-1">{MONTH_NAMES[mIdx]}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Best Time to Book Tag */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A] font-bold text-[10px] uppercase">
                        Best time to book
                      </span>
                      <span className="text-[#8A8A8A] font-semibold">
                        {MONTH_NAMES[minPriceMonthIndex]} offers the lowest rates of the year at {formatPrice(minMonthlyPrice)}/night.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 3: Amenities */}
              {activeTab === 'amenities' && (
                <div className="pt-4 space-y-3 animate-fade-in">
                  <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5] uppercase">Included Amenities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(hotel.amenities || ['wifi', 'car', 'waves', 'coffee', 'wind']).map((aName, idx) => (
                      <AmenityDetailItem key={idx} name={aName} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content 4: Reviews & ThumbsUp Helpful Button */}
              {activeTab === 'reviews' && (
                <div className="pt-4 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5] uppercase">Guest Reviews</h4>
                    <span className="text-xs font-bold text-[#8A8A8A]">{hotel.rating} out of 5.0 Average</span>
                  </div>

                  {hotel.reviews && hotel.reviews.length > 0 ? (
                    <div className="space-y-3">
                      {hotel.reviews.map((rev) => {
                        const isHelpfulClicked = helpfulClickedMap[rev.id];
                        return (
                          <div key={rev.id} className="p-4 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#E5E5E5] dark:bg-[#262626] font-bold text-xs flex items-center justify-center">
                                  {rev.guestName.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] block">{rev.guestName}</span>
                                  {rev.tripType && (
                                    <span className="text-[9px] text-[#8A8A8A] font-semibold">{rev.tripType} traveler</span>
                                  )}
                                </div>
                              </div>
                              <span className="flex items-center gap-1 font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                                <Star className="w-3.5 h-3.5 fill-current" /> {rev.rating}.0
                              </span>
                            </div>
                            <p className="text-xs text-[#8A8A8A] italic">"{rev.comment}"</p>

                            {/* Helpful ThumbsUp Action */}
                            <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#262626] flex items-center justify-between text-[10px] text-[#8A8A8A]">
                              <span>Posted on {rev.createdAt || '2026-08-01'}</span>
                              <button
                                onClick={() => handleHelpfulClick(rev.id)}
                                className={`flex items-center gap-1 font-bold hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors ${
                                  isHelpfulClicked ? 'text-[#0A0A0A] dark:text-[#F5F5F5]' : ''
                                }`}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${isHelpfulClicked ? 'fill-current' : ''}`} strokeWidth={1.5} />
                                <span>Helpful ({rev.helpfulCount || 0})</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8A8A8A]">No reviews submitted yet for this property.</p>
                  )}
                </div>
              )}

              {/* Tab Content 5: Location & What's Nearby */}
              {activeTab === 'location' && (
                <div className="pt-4 space-y-4 animate-fade-in">
                  <div className="p-4 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-2">
                    <div className="eyebrow text-[10px]">EXACT COORDINATES</div>
                    <div className="text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.city}, {hotel.country} ({hotel.latitude || 41.3111}° N, {hotel.longitude || 69.2797}° E)</span>
                    </div>
                  </div>

                  {/* What's Nearby Block */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5] uppercase">What's Nearby</h4>
                    <div className="space-y-2">
                      {nearbyList.map((place, pIdx) => (
                        <div key={pIdx} className="p-3 border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                            <MapPin className="w-3.5 h-3.5 text-[#8A8A8A]" />
                            <span>{place.name}</span>
                          </span>
                          <span className="font-bold text-[#8A8A8A]">{place.distance}</span>
                        </div>
                      ))}
                    </div>
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
                <span className="eyebrow block text-[10px]">SELECTED ROOM</span>
                <div className="font-bold text-base text-[#0A0A0A] dark:text-[#F5F5F5] line-clamp-1">
                  {currentRoom.name}
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5]">
                    {formatPrice(activeRate)}
                  </span>
                  <span className="text-xs text-[#8A8A8A]"> / night</span>
                </div>
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
                    onClick={() => setCalcGuests(prev => Math.min(currentRoom.capacity, prev + 1))}
                    className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Cost Breakdown Table */}
              <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#262626] space-y-2 text-xs">
                <div className="flex justify-between text-[#8A8A8A]">
                  <span>{formatPrice(activeRate)} × {calcNights} nights</span>
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
                  <span>RESERVE {currentRoom.name.toUpperCase()}</span>
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
        hotel={{ ...hotel, price: activeRate, roomTypeName: currentRoom.name }}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={(updated) => setHotel(updated)}
      />

    </div>
  );
};

export default HotelDetailsPage;
