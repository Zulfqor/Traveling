import React, { useState } from 'react';
import { X, Check, MapPin, Loader2, Minus, Plus, Calendar, Mail, User, Phone, Eye } from 'lucide-react';
import { createBookingApi } from '../services/bookingApi';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import EmailConfirmationModal from './EmailConfirmationModal';

const BookingModal = ({ hotel, isOpen, onClose, onBookingSuccess }) => {
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(1);
  const [step, setStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDateTime, setCheckInDateTime] = useState('');

  const [completedBooking, setCompletedBooking] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!isOpen || !hotel) return null;

  const totalPrice = hotel.price * nights;

  // Form Field Real-Time Validations
  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = phone.trim().length >= 7;
  const isDateValid = !!checkInDateTime;

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isDateValid;

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      addToast('Please fill in all booking details correctly.', 'error');
      return;
    }

    setLoading(true);
    setStep(2);
    try {
      const checkInDateStr = checkInDateTime.split('T')[0] || checkInDateTime;
      
      // Compute checkOut date
      const checkInDateObj = new Date(checkInDateStr);
      const checkOutDateObj = new Date(checkInDateObj);
      checkOutDateObj.setDate(checkOutDateObj.getDate() + nights);
      const checkOutDateStr = checkOutDateObj.toISOString().split('T')[0];

      const newBookingObj = {
        id: `b_${Date.now()}`,
        hotelId: hotel.id,
        guestName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        checkIn: checkInDateStr,
        checkOut: checkOutDateStr,
        guests,
        nights,
        totalPrice,
        status: 'Upcoming',
        createdAt: new Date().toISOString().split('T')[0]
      };

      const createdBooking = await createBookingApi(newBookingObj);
      setCompletedBooking(createdBooking);
      setStep(3);
      addToast(`${t('confirm')}: ${hotel.name} (${nights} ${t('nights')})`, 'success');
      onBookingSuccess({ ...hotel, available: false });
    } catch (err) {
      console.error("Booking error:", err);
      addToast('Failed to complete booking. Please try again.', 'error');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDoneClose = () => {
    onClose();
    setStep(1);
    setCompletedBooking(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setCheckInDateTime('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
        <div 
          className="w-full max-w-lg bg-white dark:bg-[#141414] rounded-card border border-[#E5E5E5] dark:border-[#262626] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 3-Step Segmented Progress Bar */}
          <div className="p-4 border-b border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className={`h-1 transition-colors ${step >= 1 ? 'bg-[#0A0A0A] dark:bg-[#F5F5F5]' : 'bg-[#E5E5E5] dark:bg-[#262626]'}`} />
              <div className={`h-1 transition-colors ${step >= 2 ? 'bg-[#0A0A0A] dark:bg-[#F5F5F5]' : 'bg-[#E5E5E5] dark:bg-[#262626]'}`} />
              <div className={`h-1 transition-colors ${step >= 3 ? 'bg-[#0A0A0A] dark:bg-[#F5F5F5]' : 'bg-[#E5E5E5] dark:bg-[#262626]'}`} />
            </div>
            <div className="flex justify-between text-[10px] font-bold tracking-widest eyebrow">
              <span className={step === 1 ? 'text-[#0A0A0A] dark:text-[#F5F5F5]' : ''}>{t('step1')}</span>
              <span className={step === 2 ? 'text-[#0A0A0A] dark:text-[#F5F5F5]' : ''}>{t('step2')}</span>
              <span className={step === 3 ? 'text-[#0A0A0A] dark:text-[#F5F5F5]' : ''}>{t('step3')}</span>
            </div>
          </div>

          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5] dark:border-[#262626]">
            <div>
              <span className="eyebrow block">{t('reservation_details')}</span>
              <h3 className="font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5]">
                {hotel.name}
              </h3>
            </div>
            <button
              onClick={handleDoneClose}
              disabled={loading}
              className="p-1 text-[#8A8A8A] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] focus-ring"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Modal Body */}
          {step === 3 && completedBooking ? (
            /* Step 3: Inline Confirmation Summary */
            <div className="p-6 space-y-5 text-xs">
              <div className="p-4 border border-[#0A0A0A] dark:border-[#F5F5F5] bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                  <span>RESERVATION CONFIRMED</span>
                </div>
                <p className="text-[#8A8A8A] text-xs">
                  Your stay at <strong>{hotel.name}</strong> is guaranteed under booking code <strong>#{completedBooking.id}</strong>.
                </p>
              </div>

              <div className="space-y-2 border-t border-[#E5E5E5] dark:border-[#262626] pt-4">
                <span className="eyebrow block">BOOKING RESUME</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8A8A8A] block">Guest Name</span>
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{completedBooking.guestName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A] block">Phone</span>
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{completedBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A] block">Email</span>
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{completedBooking.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A] block">Check-in</span>
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{completedBooking.checkIn}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-between font-bold text-sm bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <span>Total Rate ({completedBooking.nights} nights)</span>
                <span>{formatPrice(completedBooking.totalPrice)}</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="btn-outline w-full py-2.5 text-xs flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                  <span>VIEW CONFIRMATION EMAIL</span>
                </button>

                <button
                  type="button"
                  onClick={handleDoneClose}
                  className="btn-primary w-full py-2.5 text-xs"
                >
                  DONE
                </button>
              </div>
            </div>
          ) : (
            /* Step 1 & 2 Form */
            <form onSubmit={handleConfirm} className="p-5 space-y-4 overflow-y-auto flex-1">
              
              {/* Hotel Summary Card */}
              <div className="flex items-center gap-4 p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                {hotel.images && hotel.images[0] ? (
                  <img src={hotel.images[0]} alt={hotel.name} className="w-16 h-16 object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-[#E5E5E5] dark:bg-[#262626] flex items-center justify-center text-xs text-[#8A8A8A]">
                    No Img
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] text-sm line-clamp-1">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-[#8A8A8A] mt-0.5">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{hotel.city}, {hotel.country}</span>
                  </div>
                  <div className="text-sm font-bold text-[#0A0A0A] dark:text-[#F5F5F5] mt-1">
                    {formatPrice(hotel.price)} <span className="text-xs font-normal text-[#8A8A8A]">{t('night_unit')}</span>
                  </div>
                </div>
              </div>

              {/* User Inputs with Real-Time Validation Indicators */}
              <div className="space-y-3 pt-2">
                
                {/* Full Name */}
                <div>
                  <label className="eyebrow block text-[10px] mb-1">{t('full_name')} *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Traveler"
                      className={`w-full pl-9 pr-8 py-2 bg-white dark:bg-[#0A0A0A] border text-xs font-semibold focus-ring text-[#0A0A0A] dark:text-[#F5F5F5] ${
                        fullName ? (isNameValid ? 'border-green-600 dark:border-green-500' : 'border-red-500') : 'border-[#E5E5E5] dark:border-[#262626]'
                      }`}
                    />
                    {fullName && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">
                        {isNameValid ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="eyebrow block text-[10px] mb-1">{t('email_address')} *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.traveler@gmail.com"
                      className={`w-full pl-9 pr-8 py-2 bg-white dark:bg-[#0A0A0A] border text-xs font-semibold focus-ring text-[#0A0A0A] dark:text-[#F5F5F5] ${
                        email ? (isEmailValid ? 'border-green-600 dark:border-green-500' : 'border-red-500') : 'border-[#E5E5E5] dark:border-[#262626]'
                      }`}
                    />
                    {email && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">
                        {isEmailValid ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="eyebrow block text-[10px] mb-1">{t('phone_number')} *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className={`w-full pl-9 pr-8 py-2 bg-white dark:bg-[#0A0A0A] border text-xs font-semibold focus-ring text-[#0A0A0A] dark:text-[#F5F5F5] ${
                        phone ? (isPhoneValid ? 'border-green-600 dark:border-green-500' : 'border-red-500') : 'border-[#E5E5E5] dark:border-[#262626]'
                      }`}
                    />
                    {phone && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">
                        {isPhoneValid ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Check-in Date & Time */}
                <div>
                  <label className="eyebrow block text-[10px] mb-1">{t('checkin_datetime')} *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="datetime-local"
                      required
                      value={checkInDateTime}
                      onChange={(e) => setCheckInDateTime(e.target.value)}
                      className={`w-full pl-9 pr-8 py-2 bg-white dark:bg-[#0A0A0A] border text-xs font-semibold focus-ring text-[#0A0A0A] dark:text-[#F5F5F5] ${
                        checkInDateTime ? 'border-green-600 dark:border-green-500' : 'border-[#E5E5E5] dark:border-[#262626]'
                      }`}
                    />
                  </div>
                </div>

              </div>

              {/* Nights & Guests Selectors */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] space-y-1">
                  <span className="eyebrow block text-[10px]">{t('nights')}</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setNights(prev => Math.max(1, prev - 1))}
                      className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                    >
                      <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                    <span className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">{nights}</span>
                    <button
                      type="button"
                      onClick={() => setNights(prev => prev + 1)}
                      className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] space-y-1">
                  <span className="eyebrow block text-[10px]">{t('guests')}</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                      className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                    >
                      <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                    <span className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(prev => Math.min(6, prev + 1))}
                      className="p-1 border border-[#0A0A0A] dark:border-[#F5F5F5] text-[#0A0A0A] dark:text-[#F5F5F5]"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Price Summary */}
              <div className="flex items-center justify-between p-3.5 border border-[#0A0A0A] dark:border-[#F5F5F5] bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]">
                <span className="eyebrow text-white dark:text-[#0A0A0A]">{t('total_rate')}</span>
                <span className="font-bold text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Submit Action Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDoneClose}
                  disabled={loading}
                  className="btn-outline px-4 py-2 text-xs"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`btn-sharp px-6 py-2 text-xs ${
                    isFormValid && !loading
                      ? 'btn-primary'
                      : 'bg-[#E5E5E5] text-[#8A8A8A] border border-[#E5E5E5] dark:bg-[#262626] dark:border-[#262626] cursor-not-allowed opacity-60'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                      <span>{t('processing')}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" strokeWidth={1.5} />
                      <span>{t('confirm')} ({formatPrice(totalPrice)})</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* Confirmation Email Modal */}
      <EmailConfirmationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        booking={completedBooking}
        hotel={hotel}
      />
    </>
  );
};

export default BookingModal;
