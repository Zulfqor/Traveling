import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Star, MapPin, Check, Heart, ImageOff } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';

const QuickViewModal = ({ hotel, isOpen, onClose, onBookClick }) => {
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !hotel) return null;

  const imagesList = hotel.images && hotel.images.length > 0 ? hotel.images : (hotel.image ? [hotel.image] : []);
  const favorited = isFavorite(hotel.id);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#FAF9F6] dark:bg-[#1B1F26] rounded-card border border-[#E7E5DF] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side Photo Carousel */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100 dark:bg-slate-800 shrink-0 overflow-hidden">
          {imagesList.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <ImageOff className="w-10 h-10" strokeWidth={1.5} />
              <span className="text-xs">No Image</span>
            </div>
          ) : (
            <>
              <img
                src={imagesList[currentImageIndex]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Navigation Arrows */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {imagesList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            {hotel.available ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1F6F5C] text-white shadow-sm">
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                <span>AVAILABLE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-600/90 text-white shadow-sm">
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                <span>BOOKED</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side Info & Actions */}
        <div className="p-6 flex flex-col justify-between flex-1 overflow-y-auto">
          <div>
            {/* Header / Close */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <span className="eyebrow block mb-1">Quick Preview</span>
                <h3 className="font-serif font-bold text-2xl text-[#1C1F26] dark:text-[#EDEBE5]">
                  {hotel.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus-ring"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Location & Rating */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-1.5 text-sm text-[#6B6F76] dark:text-[#8A8D93]">
                <MapPin className="w-4 h-4 text-[#1F6F5C] shrink-0" strokeWidth={1.75} />
                <span className="font-medium text-gray-800 dark:text-gray-200">{hotel.city}</span>
                <span>•</span>
                <span>{hotel.country}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FAF9F6] dark:bg-slate-800 p-2.5 rounded-xl border border-[#E7E5DF] dark:border-slate-700 w-fit">
                <Star className="w-4 h-4 text-[#C99A4B] fill-[#C99A4B]" strokeWidth={1.75} />
                <span className="text-sm font-bold text-[#C99A4B]">{hotel.rating}</span>
                <span className="text-xs text-[#6B6F76]">/ 5.0 Rating</span>
              </div>

              <p className="text-xs text-[#6B6F76] dark:text-gray-400 leading-relaxed pt-2">
                Experience high-end comfort and top editorial style in {hotel.city}. Book directly with instant confirmation.
              </p>
            </div>
          </div>

          {/* Footer Price & Buttons */}
          <div className="pt-4 border-t border-[#E7E5DF] dark:border-slate-800 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Price per night</span>
              <span className="font-serif italic font-bold text-2xl text-[#1C1F26] dark:text-[#EDEBE5]">
                {formatPrice(hotel.price)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(hotel)}
                aria-label="Favorite toggle"
                className="p-3 rounded-xl border border-[#E7E5DF] dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:border-[#1F6F5C] transition-colors focus-ring"
              >
                <Heart
                  className={`w-5 h-5 ${favorited ? 'text-[#C99A4B] fill-[#C99A4B]' : ''}`}
                  strokeWidth={1.75}
                />
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (hotel.available) onBookClick(hotel);
                }}
                disabled={!hotel.available}
                className={`flex-1 py-3 px-4 rounded-xl font-body font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 focus-ring shadow-sm ${
                  hotel.available
                    ? 'bg-[#1F6F5C] text-white hover:bg-[#1C1F26] active:scale-[0.98]'
                    : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {hotel.available ? (
                  <span>Book Now</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2} />
                    <span>Booked</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
