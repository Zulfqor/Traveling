import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, Check, ImageOff, Eye, GitCompare, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';
import { useLanguage } from '../context/LanguageContext';

const HotelCard = ({ hotel, onBookClick, onQuickViewClick }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { formatPrice } = useCurrency();
  const { isCompared, toggleCompare } = useCompare();
  const { t } = useLanguage();

  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imagesList = hotel.images && hotel.images.length > 0 ? hotel.images : (hotel.image ? [hotel.image] : []);
  const favorited = isFavorite(hotel.id);
  const compared = isCompared(hotel.id);

  // Hover-preview photo fade
  const displayImageIndex = (isHovered && imagesList.length > 1) ? 1 : 0;
  const officialStars = hotel.stars || 5;

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    navigate(`/hotel/${hotel.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(hotel);
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
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card shadow-none hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-[#0A0A0A] dark:hover:border-[#F5F5F5] transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between h-full overflow-hidden select-none"
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

          {/* Top Left: Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            {hotel.available ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5]">
                <Check className="w-3 h-3" strokeWidth={1.5} />
                <span>{t('available_badge')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-[#E5E5E5] text-[#8A8A8A] dark:bg-[#262626]">
                <Check className="w-3 h-3" strokeWidth={1.5} />
                <span>{t('booked_badge')}</span>
              </span>
            )}
          </div>

          {/* Top Right Buttons */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              onClick={handleQuickViewClick}
              aria-label="Quick View"
              className="w-8 h-8 rounded-none border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] transition-colors focus-ring"
              title="Quick View"
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <button
              onClick={handleFavoriteClick}
              aria-label={favorited ? "Remove favorite" : "Add favorite"}
              className="w-8 h-8 rounded-none border border-[#0A0A0A] bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] transition-colors focus-ring"
            >
              <Heart
                className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`}
                strokeWidth={1.5}
              />
            </button>
          </div>

        </div>

        {/* Ticket Perforation Line */}
        <div className="ticket-perforation-wrapper">
          <div className="ticket-notch-left" />
          <div className="ticket-divider" />
          <div className="ticket-notch-right" />
        </div>

        {/* Info Block */}
        <div className="p-6 space-y-3">
          
          {/* Metadata Eyebrow Line */}
          <div className="eyebrow flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
              <span>{hotel.city}</span>
              <span>·</span>
              <span>{hotel.country}</span>
            </div>

            {/* Guest Rating Score */}
            <div className="flex items-center gap-1 font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
              <Star className="w-3 h-3 fill-current" strokeWidth={1.5} />
              <span>{hotel.rating} Score</span>
            </div>
          </div>

          {/* Hotel Name */}
          <h3 className="font-bold text-xl sm:text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] line-clamp-1 tracking-tight">
            {hotel.name}
          </h3>

          {/* Official Hotel Star Category Row (5 Lucide Stars) */}
          <div className="flex items-center justify-between pt-1 text-xs border-t border-[#E5E5E5] dark:border-[#262626]">
            <span className="eyebrow text-[10px]">Hotel Category</span>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((sIndex) => (
                  <Star
                    key={sIndex}
                    className={`w-3.5 h-3.5 ${
                      sIndex <= officialStars
                        ? 'fill-current text-[#0A0A0A] dark:text-[#F5F5F5]'
                        : 'text-[#E5E5E5] dark:text-[#262626]'
                    }`}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="font-bold text-[11px] text-[#0A0A0A] dark:text-[#F5F5F5] ml-1">
                {officialStars}.0 Star
              </span>
            </div>
          </div>

          {/* Price Line */}
          <div className="pt-2 flex items-baseline justify-between border-t border-[#E5E5E5] dark:border-[#262626]">
            <span className="eyebrow text-[10px]">{t('starting_from')}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                {formatPrice(hotel.price)}
              </span>
              <span className="text-xs text-[#8A8A8A] font-normal">{t('night_unit')}</span>
            </div>
          </div>

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
      <div className="p-6 pt-0">
        <button
          onClick={handleBookClickInternal}
          disabled={!hotel.available}
          className={`w-full group/btn btn-sharp ${
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
