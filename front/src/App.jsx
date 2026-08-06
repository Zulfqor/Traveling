import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import MyBookingsPage from './pages/MyBookingsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import CompareModal from './components/CompareModal';
import BookingModal from './components/BookingModal';
import MapViewModal from './components/MapViewModal';
import QuickViewModal from './components/QuickViewModal';
import { fetchHotels } from './services/api';

const App = () => {
  const [hotels, setHotels] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [quickViewHotel, setQuickViewHotel] = useState(null);

  useEffect(() => {
    fetchHotels().then(setHotels).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
      />
      <div className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/hotel/:id" element={<HotelDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Interactive Map View Modal */}
      <MapViewModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        hotels={hotels}
        onQuickViewClick={(h) => setQuickViewHotel(h)}
        onBookClick={(h) => setSelectedHotelForBooking(h)}
      />

      {/* Global Quick View Modal */}
      <QuickViewModal
        hotel={quickViewHotel}
        isOpen={!!quickViewHotel}
        onClose={() => setQuickViewHotel(null)}
        onBookClick={(h) => setSelectedHotelForBooking(h)}
      />

      {/* Global Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onBookClick={(h) => setSelectedHotelForBooking(h)}
      />

      {/* Global Booking Modal */}
      <BookingModal
        hotel={selectedHotelForBooking}
        isOpen={!!selectedHotelForBooking}
        onClose={() => setSelectedHotelForBooking(null)}
        onBookingSuccess={() => {
          fetchHotels().then(setHotels).catch(console.error);
        }}
      />
    </div>
  );
};

export default App;
