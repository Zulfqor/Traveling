import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Star, ImageOff } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const RecentlyViewed = ({ items = [] }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10 pt-6 border-t border-[#E5E5E5] dark:border-[#262626]">
      
      {/* Section Eyebrow Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-[#8A8A8A]" strokeWidth={1.5} />
        <span className="eyebrow text-xs tracking-widest text-[#8A8A8A]">
          {t('recently_viewed')} ({items.length})
        </span>
      </div>

      {/* Scroll Wrapper with Subtle Edge Gradients */}
      <div className="relative group/scroll">
        
        {/* Left Scroll Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#0A0A0A] to-transparent z-10 pointer-events-none opacity-60" />
        
        {/* Right Scroll Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#0A0A0A] to-transparent z-10 pointer-events-none opacity-60" />

        {/* Horizontal Scroll Track */}
        <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none scroll-smooth">
          {items.map((hotel) => {
            const firstImg = hotel.images && hotel.images[0] ? hotel.images[0] : hotel.image;

            return (
              <div
                key={hotel.id}
                onClick={() => navigate(`/hotel/${hotel.id}`)}
                className="group cursor-pointer shrink-0 w-72 sm:w-80 bg-[#FAFAFA] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card p-2.5 flex items-center gap-3.5 hover:border-[#0A0A0A] dark:hover:border-[#F5F5F5] hover:-translate-y-0.5 transition-all duration-200 shadow-none hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] select-none"
              >
                {/* Left Thumbnail (Square / Short Rectangle) */}
                <div className="w-20 h-20 bg-white dark:bg-[#0A0A0A] rounded-none overflow-hidden shrink-0 border border-[#E5E5E5] dark:border-[#262626]">
                  {firstImg ? (
                    <img
                      src={firstImg}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8A8A8A]">
                      <ImageOff className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Right Text Content Block */}
                <div className="flex-1 min-w-0 py-0.5 space-y-1">
                  
                  {/* Hotel Name (Single-line truncation) */}
                  <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5] truncate group-hover:underline">
                    {hotel.name}
                  </h4>

                  {/* City Line */}
                  <div className="flex items-center gap-1 text-xs text-[#8A8A8A]">
                    <MapPin className="w-3 h-3 text-[#8A8A8A] shrink-0" strokeWidth={1.5} />
                    <span className="truncate">{hotel.city}, {hotel.country}</span>
                  </div>

                  {/* Price & Rating Single Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#E5E5E5]/60 dark:border-[#262626]/60">
                    <span className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">
                      {formatPrice(hotel.price)}
                    </span>

                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-current text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
                      <span className="font-semibold text-[#8A8A8A] text-[11px]">
                        {hotel.rating}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default RecentlyViewed;
