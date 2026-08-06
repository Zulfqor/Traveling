import React from 'react';
import { X, Mail, CheckCircle2, Building, Calendar, Users, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const EmailConfirmationModal = ({ isOpen, onClose, booking, hotel }) => {
  const { formatPrice } = useCurrency();

  if (!isOpen || !booking) return null;

  const hotelName = hotel ? hotel.name : 'Hotel Stay';
  const city = hotel ? hotel.city : '';
  const country = hotel ? hotel.country : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#141414] rounded-card border border-[#0A0A0A] dark:border-[#F5F5F5] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Email Header Strip */}
        <div className="p-4 bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <Mail className="w-4 h-4" strokeWidth={1.5} />
            <span>ELECTRONIC CONFIRMATION TICKET</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-75 focus-ring"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Email Envelope Header */}
        <div className="p-4 border-b border-[#E5E5E5] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-1.5 text-xs">
          <div className="flex">
            <span className="w-16 font-bold eyebrow text-[10px]">FROM:</span>
            <span className="text-[#0A0A0A] dark:text-[#F5F5F5]">reservations@traveler-app.com</span>
          </div>
          <div className="flex">
            <span className="w-16 font-bold eyebrow text-[10px]">TO:</span>
            <span className="text-[#0A0A0A] dark:text-[#F5F5F5]">{booking.email || 'guest@gmail.com'}</span>
          </div>
          <div className="flex">
            <span className="w-16 font-bold eyebrow text-[10px]">SUBJECT:</span>
            <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
              CONFIRMED: {hotelName} Reservation #{booking.id}
            </span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 space-y-5 text-xs text-[#0A0A0A] dark:text-[#F5F5F5] overflow-y-auto max-h-[60vh]">
          
          <div className="flex items-center gap-3 p-3 border border-[#0A0A0A] dark:border-[#F5F5F5] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            <CheckCircle2 className="w-6 h-6 text-[#0A0A0A] dark:text-[#F5F5F5] shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-sm">Booking Confirmed & Guaranteed</h4>
              <p className="text-[#8A8A8A] text-[11px]">Your check-in is secured with Traveler Concierge.</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E5E5E5] dark:border-[#262626]">
            <h5 className="font-bold text-xs uppercase tracking-wider eyebrow">GUEST DETAILS</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#8A8A8A] block text-[10px]">Guest Name</span>
                <span className="font-bold">{booking.guestName}</span>
              </div>
              <div>
                <span className="text-[#8A8A8A] block text-[10px]">Phone</span>
                <span className="font-bold">{booking.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E5E5E5] dark:border-[#262626]">
            <h5 className="font-bold text-xs uppercase tracking-wider eyebrow">RESERVATION SUMMARY</h5>
            <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] space-y-2 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <div className="flex justify-between font-bold text-sm">
                <span>{hotelName}</span>
                <span>{formatPrice(booking.totalPrice)}</span>
              </div>
              <div className="text-[11px] text-[#8A8A8A] flex justify-between">
                <span>{city}, {country}</span>
                <span>{booking.nights} night(s) · {booking.guests} guest(s)</span>
              </div>
              <div className="text-[11px] text-[#8A8A8A] pt-1 flex justify-between font-mono">
                <span>Check-in: {booking.checkIn}</span>
                <span>Check-out: {booking.checkOut || '12:00 PM'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#8A8A8A] pt-2">
            <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            <span>Present this confirmation email or reservation code #{booking.id} upon arrival.</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E5E5] dark:border-[#262626] flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary px-6 py-2 text-xs"
          >
            CLOSE PREVIEW
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailConfirmationModal;
