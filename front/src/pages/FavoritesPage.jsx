import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartOff, ArrowLeft, Plus } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import HotelCard from '../components/HotelCard';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';

const FavoritesPage = () => {
  const { wishlists, activeWishlist, setActiveWishlist, createWishlist } = useFavorites();
  const { t } = useLanguage();
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [showAddListInput, setShowAddListInput] = useState(false);

  const activeHotelsList = wishlists[activeWishlist] || [];

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;
    createWishlist(newWishlistName.trim());
    setNewWishlistName('');
    setShowAddListInput(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-20">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#262626]">
          <div>
            <h1 className="font-bold text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] uppercase tracking-tight">
              Wishlists & Collections
            </h1>
            <p className="eyebrow text-xs text-[#8A8A8A] mt-1">
              Organize your saved stays by journey ({Object.keys(wishlists).length} collections)
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

        {/* Wishlists Tabs Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#E5E5E5] dark:border-[#262626] no-scrollbar">
          {Object.keys(wishlists).map((listName) => {
            const count = (wishlists[listName] || []).length;
            const isActive = activeWishlist === listName;
            return (
              <button
                key={listName}
                onClick={() => setActiveWishlist(listName)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] dark:bg-[#F5F5F5] dark:text-[#0A0A0A] dark:border-[#F5F5F5]'
                    : 'bg-white text-[#0A0A0A] border-[#E5E5E5] dark:bg-[#141414] dark:text-[#F5F5F5] dark:border-[#262626] hover:border-[#0A0A0A]'
                }`}
              >
                <span>{listName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 font-bold ${isActive ? 'bg-white/20 dark:bg-black/20' : 'bg-[#FAFAFA] dark:bg-[#262626]'}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {showAddListInput ? (
            <form onSubmit={handleCreateList} className="flex items-center gap-1">
              <input
                type="text"
                placeholder="List name..."
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                autoFocus
                className="px-3 py-1.5 text-xs bg-transparent border border-[#0A0A0A] dark:border-[#F5F5F5] focus:outline-none"
              />
              <button type="submit" className="btn-primary py-1.5 px-3 text-xs">Save</button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddListInput(true)}
              className="px-3 py-2 text-xs font-bold uppercase border border-dashed border-[#8A8A8A] text-[#8A8A8A] hover:text-[#0A0A0A] hover:border-[#0A0A0A] dark:hover:text-[#F5F5F5] dark:hover:border-[#F5F5F5] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New List</span>
            </button>
          )}
        </div>

        {/* Grid or Empty State */}
        {activeHotelsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card my-6 space-y-3">
            <div className="w-16 h-16 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center mb-2">
              <HeartOff className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5]">
              No hotels in "{activeWishlist}"
            </h3>
            <p className="eyebrow text-xs max-w-sm">
              Save properties to this collection by clicking the heart icon on any hotel card.
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
            {activeHotelsList.map((hotel) => (
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
      />

    </div>
  );
};

export default FavoritesPage;
