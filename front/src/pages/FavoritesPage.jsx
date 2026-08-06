import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartOff, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import HotelCard from '../components/HotelCard';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);

  const handleBookingSuccess = () => {
    // Hotel availability updated in backend
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-20">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E5E5E5] dark:border-[#262626]">
          <div>
            <h1 className="font-bold text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] uppercase tracking-tight">
              {t('saved_favorites')}
            </h1>
            <p className="eyebrow text-xs text-[#8A8A8A] mt-1">
              Your saved hotels and destinations ({favorites.length})
            </p>
          </div>
          
          <Link
            to="/"
            className="btn-outline py-2 px-4 text-xs h-10 inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>BACK TO HOTELS</span>
          </Link>
        </div>

        {/* Grid or Empty State */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card my-6 space-y-3">
            <div className="w-16 h-16 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center mb-2">
              <HeartOff className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5]">
              {t('no_favorites')}
            </h3>
            <p className="eyebrow text-xs max-w-sm">
              {t('no_favorites_desc')}
            </p>
            <Link
              to="/"
              className="btn-primary px-6 py-2 text-xs"
            >
              <span>{t('explore_hotels')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {favorites.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onBookClick={(h) => setSelectedHotelForBooking(h)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        hotel={selectedHotelForBooking}
        isOpen={!!selectedHotelForBooking}
        onClose={() => setSelectedHotelForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

    </div>
  );
};

export default FavoritesPage;
