import React, { useState } from 'react';
import { X, Star, Check, Loader2 } from 'lucide-react';
import { submitReviewApi } from '../services/bookingApi';
import { useToast } from '../context/ToastContext';

const LeaveReviewModal = ({ isOpen, onClose, booking, hotel, onReviewSubmitted }) => {
  const { addToast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking || !hotel) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please write a short review comment.', 'error');
      return;
    }

    setLoading(true);
    try {
      const reviewObj = {
        id: `r_${Date.now()}`,
        guestName: booking.guestName || 'Anonymous Guest',
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedHotel = await submitReviewApi(hotel.id, reviewObj);
      addToast('Review submitted! Hotel rating updated.', 'success');
      onReviewSubmitted(updatedHotel);
      onClose();
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
      addToast('Failed to submit review.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#141414] rounded-card border border-[#E5E5E5] dark:border-[#262626] shadow-2xl overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3">
          <div>
            <span className="eyebrow block text-[10px]">GUEST FEEDBACK</span>
            <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-[#F5F5F5]">
              Review {hotel.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#8A8A8A] hover:text-[#0A0A0A]">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating Selector */}
          <div className="text-center space-y-1.5 py-2">
            <span className="eyebrow block text-[10px]">YOUR RATING</span>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const active = starIndex <= (hoverRating || rating);
                return (
                  <button
                    key={starIndex}
                    type="button"
                    onMouseEnter={() => setHoverRating(starIndex)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starIndex)}
                    className="p-1 transition-transform hover:scale-110 focus-ring"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        active
                          ? 'fill-current text-[#0A0A0A] dark:text-[#F5F5F5]'
                          : 'text-[#E5E5E5] dark:text-[#262626]'
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5] block">
              {rating}.0 out of 5 Stars
            </span>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="eyebrow block text-[10px] mb-1">YOUR REVIEW</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your stay, comfort, architectural design..."
              className="w-full p-3 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] text-xs focus-ring text-[#0A0A0A] dark:text-[#F5F5F5]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default LeaveReviewModal;
