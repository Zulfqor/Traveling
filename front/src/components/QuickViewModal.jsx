import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Star, MapPin, Check, Heart, ImageOff, Users } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';

const QuickViewModal = ({ hotel, isOpen, onClose, onBookClick }) => {
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  if (!isOpen || !hotel) return null;

  const imagesList = hotel.images && hotel.images.length > 0 ? hotel.images : (hotel.image ? [hotel.image] : []);
  const favorited = isFavorite(hotel.id);

  const roomTypes = hotel.roomTypes || [
    { id: 'rt_std', name: 'Standard Room', price: hotel.price, capacity: 2, features: ['City View', 'Free Wi-Fi'] },
    { id: 'rt_dlx', name: 'Deluxe Suite', price: Math.round(hotel.price * 1.35), capacity: 3, features: ['Balcony', 'Breakfast'] }
  ];

  const currentRoom = roomTypes[selectedRoomIndex] || roomTypes[0];
  const activeRate = currentRoom.price || hotel.price;
  const basePrice = Math.round(activeRate * 0.88);
  const taxPrice = activeRate - basePrice;

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side Photo Carousel */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] shrink-0 overflow-hidden">
          {imagesList.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8A8A8A] gap-2">
              <ImageOff className="w-10 h-10" strokeWidth={1.5} />
              <span className="eyebrow text-[10px]">No Image</span>
            </div>
          ) : (
            <>
              <img
                src={imagesList[currentImageIndex]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 text-white hover:bg-black transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 text-white hover:bg-black transition-all"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            {hotel.available ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase border border-[#0A0A0A] bg-white text-[#0A0A0A]">
                <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>AVAILABLE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase bg-[#E5E5E5] text-[#8A8A8A]">
                <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>BOOKED</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side Info & Actions */}
        <div className="p-6 flex flex-col justify-between flex-1 overflow-y-auto space-y-4">
          <div>
            {/* Header / Close */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="eyebrow block text-[10px]">QUICK PREVIEW</span>
                <h3 className="font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5] uppercase tracking-tight">
                  {hotel.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[#8A8A8A] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] focus-ring"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Location & Rating */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0A0A0A] dark:text-[#F5F5F5]" />
                  <span>{hotel.city}, {hotel.country}</span>
                </span>
                <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {hotel.rating} ({hotel.reviewCount || 120})
                </span>
              </div>

              {/* Room Types Selector List */}
              <div className="space-y-2 pt-2 border-t border-[#E5E5E5] dark:border-[#262626]">
                <span className="eyebrow block text-[10px]">SELECT ROOM TYPE</span>
                <div className="space-y-1.5">
                  {roomTypes.map((room, rIdx) => {
                    const isSelected = rIdx === selectedRoomIndex;
                    return (
                      <div
                        key={room.id || rIdx}
                        onClick={() => setSelectedRoomIndex(rIdx)}
                        className={`p-2.5 border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'border-[#0A0A0A] bg-[#0A0A0A]/5 dark:border-[#F5F5F5] dark:bg-[#F5F5F5]/5'
                            : 'border-[#E5E5E5] dark:border-[#262626] hover:border-[#8A8A8A]'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center gap-2">
                            <span>{room.name}</span>
                            <span className="flex items-center gap-0.5 text-[10px] text-[#8A8A8A] font-normal">
                              <Users className="w-3 h-3" /> {room.capacity}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#8A8A8A]">
                            {(room.features || []).join(' · ')}
                          </div>
                        </div>

                        <div className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                          {formatPrice(room.price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Footer Price & Buttons */}
          <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#262626] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="eyebrow text-[10px] block">TOTAL RATE</span>
                <span className="text-[10px] text-[#8A8A8A]">
                  {formatPrice(basePrice)} base + {formatPrice(taxPrice)} taxes & fees
                </span>
              </div>
              <span className="font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5]">
                {formatPrice(activeRate)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(hotel)}
                aria-label="Favorite toggle"
                className="p-3 border border-[#0A0A0A] dark:border-[#F5F5F5] bg-white dark:bg-[#141414] text-[#0A0A0A] dark:text-[#F5F5F5] focus-ring"
              >
                <Heart
                  className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`}
                  strokeWidth={1.5}
                />
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (hotel.available) onBookClick({ ...hotel, price: activeRate, roomTypeName: currentRoom.name });
                }}
                disabled={!hotel.available}
                className={`flex-1 py-3 px-4 btn-sharp text-xs uppercase ${
                  hotel.available
                    ? 'btn-primary'
                    : 'bg-[#FAFAFA] text-[#8A8A8A] border border-[#E5E5E5] cursor-not-allowed'
                }`}
              >
                {hotel.available ? (
                  <span>Book {currentRoom.name} ({formatPrice(activeRate)})</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" strokeWidth={1.5} />
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
