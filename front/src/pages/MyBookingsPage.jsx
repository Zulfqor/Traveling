import React, { useState, useEffect } from 'react';
import { fetchBookings, updateBookingApi, cancelBookingApi } from '../services/bookingApi';
import { fetchHotels } from '../services/api';
import { Ticket, Calendar, Users, MapPin, Check, AlertTriangle, Eye, Edit3, Trash2, Star, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import EmailConfirmationModal from '../components/EmailConfirmationModal';
import LeaveReviewModal from '../components/LeaveReviewModal';
import SkeletonCard from '../components/SkeletonCard';
import Footer from '../components/Footer';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedBookingForEmail, setSelectedBookingForEmail] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [selectedHotelForReview, setSelectedHotelForReview] = useState(null);

  // Modify Modal State
  const [editingBooking, setEditingBooking] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editNights, setEditNights] = useState(1);
  const [editGuests, setEditGuests] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  // Cancel Confirmation State
  const [cancelingBooking, setCancelingBooking] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, hotelsData] = await Promise.all([
        fetchBookings(),
        fetchHotels()
      ]);
      setBookings(bookingsData.reverse());
      setHotels(hotelsData);
    } catch (err) {
      console.error(err);
      addToast('Failed to load bookings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getHotelObj = (hotelId) => {
    return hotels.find(h => String(h.id) === String(hotelId)) || null;
  };

  // Handle Modify Booking Save
  const handleSaveModify = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    setIsUpdating(true);
    try {
      const hotel = getHotelObj(editingBooking.hotelId);
      const basePrice = hotel ? hotel.price : (editingBooking.totalPrice / editingBooking.nights);

      const checkInDateObj = new Date(editCheckIn);
      const checkOutDateObj = new Date(checkInDateObj);
      checkOutDateObj.setDate(checkOutDateObj.getDate() + editNights);
      const editCheckOut = checkOutDateObj.toISOString().split('T')[0];

      const newTotalPrice = basePrice * editNights;

      const updated = await updateBookingApi(editingBooking.id, {
        checkIn: editCheckIn,
        checkOut: editCheckOut,
        nights: editNights,
        guests: editGuests,
        totalPrice: newTotalPrice
      });

      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      addToast('Booking updated', 'success');
      setEditingBooking(null);
    } catch (err) {
      console.error(err);
      addToast('Failed to update booking.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Cancel Booking Confirm
  const handleConfirmCancel = async () => {
    if (!cancelingBooking) return;
    setIsCanceling(true);
    try {
      const updated = await cancelBookingApi(cancelingBooking.id, cancelingBooking.hotelId);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      addToast('Booking cancelled & hotel released', 'success');
      setCancelingBooking(null);
    } catch (err) {
      console.error(err);
      addToast('Failed to cancel booking.', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-20">
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E5E5E5] dark:border-[#262626]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => navigate('/')} className="eyebrow hover:underline inline-flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Directory
              </button>
            </div>
            <h1 className="font-bold text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] uppercase tracking-tight flex items-center gap-2.5">
              <Ticket className="w-7 h-7 text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
              <span>My Reservations ({bookings.length})</span>
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 border border-[#E5E5E5] dark:border-[#262626] text-center space-y-4 bg-white dark:bg-[#141414]">
            <Ticket className="w-12 h-12 mx-auto text-[#8A8A8A]" strokeWidth={1.5} />
            <h3 className="font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5]">NO ACTIVE BOOKINGS</h3>
            <p className="eyebrow text-xs max-w-sm mx-auto">Explore our listing and book your next stay.</p>
            <button onClick={() => navigate('/')} className="btn-primary px-6 py-2 text-xs">
              EXPLORE HOTELS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const hotel = getHotelObj(booking.hotelId);
              const hotelImg = hotel && hotel.images && hotel.images[0] ? hotel.images[0] : '';

              return (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card overflow-hidden shadow-none hover:border-[#0A0A0A] dark:hover:border-[#F5F5F5] transition-all"
                >
                  {/* Perforation Ticket Header */}
                  <div className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                    
                    <div className="flex items-center gap-4">
                      {hotelImg ? (
                        <img src={hotelImg} alt={hotel ? hotel.name : ''} className="w-16 h-16 object-cover border border-[#E5E5E5] dark:border-[#262626] shrink-0" />
                      ) : (
                        <div className="w-16 h-16 bg-[#E5E5E5] dark:bg-[#262626] flex items-center justify-center text-xs text-[#8A8A8A]">
                          No Img
                        </div>
                      )}
                      <div>
                        <span className="eyebrow text-[10px] block">TICKET #{booking.id}</span>
                        <h3 className="font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5]">
                          {hotel ? hotel.name : `Hotel #${booking.hotelId}`}
                        </h3>
                        <p className="text-xs text-[#8A8A8A] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{hotel ? `${hotel.city}, ${hotel.country}` : ''}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border ${
                        booking.status === 'Upcoming'
                          ? 'border-[#0A0A0A] text-[#0A0A0A] dark:border-[#F5F5F5] dark:text-[#F5F5F5]'
                          : booking.status === 'Completed'
                          ? 'border-[#8A8A8A] text-[#8A8A8A]'
                          : 'border-red-400 text-red-500 line-through'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                  </div>

                  {/* Ticket Perforation Divider Line */}
                  <div className="ticket-perforation-wrapper">
                    <div className="ticket-notch-left" />
                    <div className="ticket-divider" />
                    <div className="ticket-notch-right" />
                  </div>

                  {/* Ticket Body Content */}
                  <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="eyebrow text-[10px] block">CHECK-IN</span>
                      <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{booking.checkIn}</span>
                    </div>

                    <div>
                      <span className="eyebrow text-[10px] block">CHECK-OUT</span>
                      <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{booking.checkOut || '12:00 PM'}</span>
                    </div>

                    <div>
                      <span className="eyebrow text-[10px] block">GUESTS & NIGHTS</span>
                      <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                        {booking.guests} guest(s) · {booking.nights} night(s)
                      </span>
                    </div>

                    <div>
                      <span className="eyebrow text-[10px] block">TOTAL PRICE</span>
                      <span className="font-bold text-base text-[#0A0A0A] dark:text-[#F5F5F5]">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Action Footer */}
                  <div className="p-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] border-t border-[#E5E5E5] dark:border-[#262626] flex flex-wrap items-center justify-end gap-2">
                    
                    <button
                      onClick={() => {
                        setSelectedBookingForEmail(booking);
                      }}
                      className="btn-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </button>

                    {booking.status === 'Upcoming' && (
                      <>
                        <button
                          onClick={() => {
                            setEditingBooking(booking);
                            setEditCheckIn(booking.checkIn);
                            setEditNights(booking.nights);
                            setEditGuests(booking.guests);
                          }}
                          className="btn-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modify</span>
                        </button>

                        <button
                          onClick={() => setCancelingBooking(booking)}
                          className="px-3 py-1.5 text-xs font-bold border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}

                    {booking.status === 'Completed' && hotel && (
                      <button
                        onClick={() => {
                          setSelectedBookingForReview(booking);
                          setSelectedHotelForReview(hotel);
                        }}
                        className="btn-primary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Leave a Review</span>
                      </button>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />

      {/* View Email Ticket Confirmation Modal */}
      <EmailConfirmationModal
        isOpen={!!selectedBookingForEmail}
        onClose={() => setSelectedBookingForEmail(null)}
        booking={selectedBookingForEmail}
        hotel={selectedBookingForEmail ? getHotelObj(selectedBookingForEmail.hotelId) : null}
      />

      {/* Leave Review Modal */}
      <LeaveReviewModal
        isOpen={!!selectedBookingForReview}
        onClose={() => {
          setSelectedBookingForReview(null);
          setSelectedHotelForReview(null);
        }}
        booking={selectedBookingForReview}
        hotel={selectedHotelForReview}
        onReviewSubmitted={() => loadData()}
      />

      {/* Modify Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#141414] rounded-card border border-[#E5E5E5] dark:border-[#262626] p-6 space-y-4">
            <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-[#F5F5F5]">
              Modify Reservation #{editingBooking.id}
            </h3>

            <form onSubmit={handleSaveModify} className="space-y-4">
              <div>
                <label className="eyebrow block text-[10px] mb-1">NEW CHECK-IN DATE</label>
                <input
                  type="date"
                  required
                  value={editCheckIn}
                  onChange={(e) => setEditCheckIn(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow block text-[10px] mb-1">NIGHTS</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={editNights}
                    onChange={(e) => setEditNights(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5]"
                  />
                </div>
                <div>
                  <label className="eyebrow block text-[10px] mb-1">GUESTS</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={editGuests}
                    onChange={(e) => setEditGuests(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="eyebrow text-[10px]">NEW TOTAL PRICE</span>
                <span className="font-bold text-lg text-[#0A0A0A] dark:text-[#F5F5F5]">
                  {formatPrice((getHotelObj(editingBooking.hotelId)?.price || 150) * editNights)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="btn-outline px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary px-6 py-2 text-xs"
                >
                  {isUpdating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#141414] rounded-card border border-[#E5E5E5] dark:border-[#262626] p-6 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" strokeWidth={1.5} />
            <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-[#F5F5F5]">
              Cancel Reservation?
            </h3>
            <p className="text-xs text-[#8A8A8A]">
              Are you sure you want to cancel booking #{cancelingBooking.id}? This will release the hotel for other guests.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCancelingBooking(null)}
                className="btn-outline flex-1 py-2 text-xs"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCanceling}
                className="flex-1 py-2 text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {isCanceling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;
