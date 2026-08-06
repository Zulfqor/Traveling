import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, Check, ImageOff, Eye, GitCompare, ArrowRight, RotateCcw, Zap, Wifi, Car, Waves, Coffee, Wind, Share2, Plus, ShieldCheck, PawPrint, Footprints } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

// Helper component for contour amenity icon mapping
const AmenityIcon = ({ name }) => {
  const iconProps = { className: "w-3.5 h-3.5 text-[#8A8A8A]", strokeWidth: 1.5 };
  switch (name) {
    case 'wifi':
      return <Wifi {...iconProps} title="Free Wi-Fi" />;
    case 'car':
      return <Car {...iconProps} title="Free Parking" />;
    case 'waves':
      return <Waves {...iconProps} title="Swimming Pool" />;
    case 'coffee':
      return <Coffee {...iconProps} title="Breakfast Included" />;
    case 'wind':
      return <Wind {...iconProps} title="Air Conditioning" />;
    default:
      return null;
  }
};

const HotelCard = ({ hotel, onBookClick, onQuickViewClick }) => {
  const navigate = useNavigate();
  const { isFavorite, wishlists, addToWishlist, createWishlist } = useFavorites();
  const { formatPrice } = useCurrency();
  const { isCompared, toggleCompare } = useCompare();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showWishlistMenu, setShowWishlistMenu] = useState(false);
  const [newWishlistInput, setNewWishlistInput] = useState('');

  const imagesList = hotel.images && hotel.images.length > 0 ? hotel.images : (hotel.image ? [hotel.image] : []);
  const favorited = isFavorite(hotel.id);
  const compared = isCompared(hotel.id);

  const displayImageIndex = (isHovered && imagesList.length > 1) ? 1 : 0;
  const officialStars = hotel.stars || 5;

  // Latest review snippet
  const latestReview = hotel.reviews && hotel.reviews.length > 0 ? hotel.reviews[0] : null;
  const authorInitial = latestReview ? latestReview.guestName.charAt(0).toUpperCase() : '?';

  // Price calculations
  const basePrice = hotel.basePrice || Math.round(hotel.price * 0.88);
  const taxPrice = hotel.taxPrice || (hotel.price - basePrice);

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    navigate(`/hotel/${hotel.id}`);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setShowWishlistMenu(prev => !prev);
  };

  const handleSelectWishlist = (e, wishlistName) => {
    e.stopPropagation();
    addToWishlist(hotel, wishlistName);
    setShowWishlistMenu(false);
    showToast(`Saved to "${wishlistName}"`);
  };

  const handleCreateAndAddWishlist = (e) => {
    e.stopPropagation();
    if (!newWishlistInput.trim()) return;
    createWishlist(newWishlistInput.trim());
    addToWishlist(hotel, newWishlistInput.trim());
    setNewWishlistInput('');
    setShowWishlistMenu(false);
    showToast(`Saved to "${newWishlistInput.trim()}"`);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/hotel/${hotel.id}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard");
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    onQuickViewClick(hotel);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    toggleCompare(hotel);
  };

  const handleBookClickInternal = (e) => {
    e.stopPropagation();
    if (hotel.available) {
      onBookClick(hotel);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowWishlistMenu(false);
      }}
      className="group cursor-pointer bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card shadow-none hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-[#0A0A0A] dark:hover:border-[#F5F5F5] transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between h-full overflow-hidden select-none relative"
    >
      <div>
        {/* Photo Container */}
        <div className="relative w-full h-56 bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden">
          {imagesList.length === 0 || imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8A8A8A] gap-2">
              <ImageOff className="w-8 h-8" strokeWidth={1.5} />
              <span className="eyebrow text-[10px]">No Image</span>
            </div>
          ) : (
            <img
              src={imagesList[displayImageIndex]}
              alt={hotel.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
            />
          )}

          {/* Top Left: Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
            {hotel.available ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5]">
                <Check className="w-3 h-3" strokeWidth={1.5} />
                <span>{t('available_badge')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#E5E5E5] text-[#8A8A8A] dark:bg-[#262626]">
                <Check className="w-3 h-3" strokeWidth={1.5} />
                <span>{t('booked_badge')}</span>
              </span>
            )}

            {hotel.discountPercent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border border-[#0A0A0A] bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]">
                <span>-{hotel.discountPercent}% OFF</span>
              </span>
            )}

            {hotel.freeCancellation && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border border-[#0A0A0A]/40 bg-white/90 text-[#0A0A0A] dark:bg-[#0A0A0A]/90 dark:text-[#F5F5F5] dark:border-[#F5F5F5]/40 backdrop-blur-xs">
                <RotateCcw className="w-2.5 h-2.5" strokeWidth={1.5} />
                <span>Free Cancellation</span>
              </span>
            )}
          </div>

          {/* Top Right Action Buttons (Share, QuickView, Favorite Heart) */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              onClick={handleShareClick}
              aria-label="Share Link"
              className="w-8 h-8 rounded-none border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] transition-colors focus-ring"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <button
              onClick={handleQuickViewClick}
              aria-label="Quick View"
              className="w-8 h-8 rounded-none border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] transition-colors focus-ring"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <div className="relative">
              <button
                onClick={handleHeartClick}
                aria-label={favorited ? "Wishlist options" : "Save to wishlist"}
                className="w-8 h-8 rounded-none border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] transition-colors focus-ring"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`}
                  strokeWidth={1.5}
                />
              </button>

              {/* Wishlists Menu Popover */}
              {showWishlistMenu && (
                <div 
                  className="absolute right-0 top-10 w-48 bg-white dark:bg-[#141414] border border-[#0A0A0A] dark:border-[#F5F5F5] shadow-2xl p-2 z-50 animate-fade-in space-y-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="eyebrow text-[9px] px-2 py-1 border-b border-[#E5E5E5] dark:border-[#262626]">
                    Save to Wishlist
                  </div>
                  {Object.keys(wishlists).map((listName) => (
                    <button
                      key={listName}
                      onClick={(e) => handleSelectWishlist(e, listName)}
                      className="w-full text-left px-2 py-1.5 hover:bg-[#FAFAFA] dark:hover:bg-[#262626] font-bold text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-between"
                    >
                      <span className="truncate">{listName}</span>
                      <span className="text-[10px] text-[#8A8A8A]">
                        ({(wishlists[listName] || []).length})
                      </span>
                    </button>
                  ))}

                  <div className="pt-1.5 border-t border-[#E5E5E5] dark:border-[#262626] flex items-center gap-1">
                    <input 
                      type="text"
                      placeholder="New list..."
                      value={newWishlistInput}
                      onChange={(e) => setNewWishlistInput(e.target.value)}
                      className="w-full text-[11px] px-1.5 py-1 bg-transparent border border-[#E5E5E5] dark:border-[#262626] focus:outline-none"
                    />
                    <button
                      onClick={handleCreateAndAddWishlist}
                      className="p-1 bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Ticket Perforation Line */}
        <div className="ticket-perforation-wrapper">
          <div className="ticket-notch-left" />
          <div className="ticket-divider" />
          <div className="ticket-notch-right" />
        </div>

        {/* Info Block */}
        <div className="p-5 space-y-2.5">
          
          {/* Building Type & Renovation Eyebrow Tag */}
          <div className="eyebrow flex items-center justify-between text-[9px] text-[#8A8A8A]">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{hotel.buildingType || 'Luxury Hotel'}</span>
              <span>·</span>
              <span>{hotel.renovatedYear || 'Renovated in 2023'}</span>
            </div>

            {hotel.verifiedProperty && (
              <span className="flex items-center gap-0.5 text-[#0A0A0A] dark:text-[#F5F5F5] font-bold">
                <ShieldCheck className="w-3 h-3 text-[#0A0A0A] dark:text-[#F5F5F5]" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Location & Rating Score */}
          <div className="eyebrow flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-[#8A8A8A]">
              <MapPin className="w-3 h-3 text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
              <span>{hotel.city}, {hotel.country}</span>
            </div>

            {/* Score & Clickable Total Reviews Count */}
            <button
              onClick={handleQuickViewClick}
              className="flex items-center gap-1 font-bold text-[#0A0A0A] dark:text-[#F5F5F5] hover:underline"
            >
              <Star className="w-3 h-3 fill-current" strokeWidth={1.5} />
              <span>{hotel.rating}</span>
              <span className="text-[#8A8A8A] font-normal">({hotel.reviewCount || 120})</span>
            </button>
          </div>

          {/* Hotel Name */}
          <h3 className="font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5] line-clamp-1 tracking-tight">
            {hotel.name}
          </h3>

          {/* Official Hotel Star Category Row + Top Rated Host Badge */}
          <div className="flex items-center justify-between pt-1 text-xs border-t border-[#E5E5E5] dark:border-[#262626]">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((sIndex) => (
                  <Star
                    key={sIndex}
                    className={`w-3 h-3 ${
                      sIndex <= officialStars
                        ? 'fill-current text-[#0A0A0A] dark:text-[#F5F5F5]'
                        : 'text-[#E5E5E5] dark:text-[#262626]'
                    }`}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              {hotel.topRatedHost && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 border border-[#0A0A0A] dark:border-[#F5F5F5]">
                  Top-Rated Host
                </span>
              )}
            </div>

            {/* Amenities Icons Strip */}
            <div className="flex items-center gap-2">
              {(hotel.amenities || ['wifi', 'waves', 'coffee']).slice(0, 5).map((aName, aIdx) => (
                <AmenityIcon key={aIdx} name={aName} />
              ))}
            </div>
          </div>

          {/* Useful Micro-Facts (Pet Friendly / Walk Fact) */}
          {(hotel.petFriendly || hotel.walkFact) && (
            <div className="flex items-center gap-3 pt-1 text-[10px] text-[#8A8A8A]">
              {hotel.petFriendly && (
                <span className="flex items-center gap-1">
                  <PawPrint className="w-3 h-3 text-[#0A0A0A] dark:text-[#F5F5F5]" />
                  <span>Pet friendly</span>
                </span>
              )}
              {hotel.walkFact && (
                <span className="flex items-center gap-1 line-clamp-1">
                  <Footprints className="w-3 h-3 text-[#0A0A0A] dark:text-[#F5F5F5]" />
                  <span>{hotel.walkFact}</span>
                </span>
              )}
            </div>
          )}

          {/* Subtle Demand Indicator */}
          {hotel.demandText && (
            <div className="text-[10px] text-[#8A8A8A] italic">
              {hotel.demandText}
            </div>
          )}

          {/* Price Line with Breakdown */}
          <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#262626]">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-[10px]">{t('starting_from')}</span>
              <div className="flex items-baseline gap-1.5">
                {hotel.oldPrice && (
                  <span className="text-xs text-[#8A8A8A] line-through font-normal">
                    {formatPrice(hotel.oldPrice)}
                  </span>
                )}
                <span className="font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                  {formatPrice(hotel.price)}
                </span>
                <span className="text-xs text-[#8A8A8A] font-normal">{t('night_unit')}</span>
              </div>
            </div>

            {/* Price breakdown subline */}
            <div className="text-right text-[10px] text-[#8A8A8A] font-normal mt-0.5">
              {formatPrice(basePrice)} base + {formatPrice(taxPrice)} taxes & fees
            </div>
          </div>

          {/* Latest Review Snippet Sub-layer */}
          {latestReview && (
            <div 
              onClick={handleQuickViewClick}
              className="mt-2 p-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] text-[11px] space-y-1 hover:border-[#0A0A0A] dark:hover:border-[#F5F5F5] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#E5E5E5] dark:bg-[#262626] text-[#0A0A0A] dark:text-[#F5F5F5] text-[9px] font-bold flex items-center justify-center">
                    {authorInitial}
                  </div>
                  <span className="font-bold text-[10px] text-[#8A8A8A]">{latestReview.guestName}</span>
                </div>
                {latestReview.tripType && (
                  <span className="text-[9px] px-1 bg-[#E5E5E5] dark:bg-[#262626] font-bold">
                    {latestReview.tripType}
                  </span>
                )}
              </div>
              <p className="text-[#8A8A8A] dark:text-[#A3A3A3] line-clamp-1 italic text-[10px]">
                "{latestReview.comment}"
              </p>
            </div>
          )}

          {/* Compare Checkbox */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={handleCompareClick}
              className={`flex items-center gap-1 eyebrow text-[10px] ${
                compared ? 'text-[#0A0A0A] dark:text-[#F5F5F5] font-bold' : 'text-[#8A8A8A] hover:text-[#0A0A0A]'
              }`}
            >
              <GitCompare className="w-3 h-3" strokeWidth={1.5} />
              <span>{compared ? t('comparing') : t('compare')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0">
        <button
          onClick={handleBookClickInternal}
          disabled={!hotel.available}
          className={`w-full group/btn btn-sharp py-2.5 ${
            hotel.available
              ? 'btn-primary'
              : 'bg-[#FAFAFA] text-[#8A8A8A] border border-[#E5E5E5] dark:bg-[#141414] dark:border-[#262626] dark:text-[#8A8A8A] cursor-not-allowed'
          }`}
        >
          {hotel.available ? (
            <>
              <span>{t('book_now')}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={1.5} />
            </>
          ) : (
            <>
              <Check className="w-4 h-4" strokeWidth={1.5} />
              <span>{t('booked_btn')}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default HotelCard;
