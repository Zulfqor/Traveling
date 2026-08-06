import axios from 'axios';
import { fetchHotelById } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-production-109c0.up.railway.app';

export const fetchBookings = async () => {
  const response = await axios.get(`${API_BASE_URL}/bookings`);
  return response.data;
};

export const createBookingApi = async (bookingData) => {
  const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
  // Also set hotel available status to false
  if (bookingData.hotelId) {
    await axios.patch(`${API_BASE_URL}/hotels/${bookingData.hotelId}`, { available: false });
  }
  return response.data;
};

export const updateBookingApi = async (id, updates) => {
  const response = await axios.patch(`${API_BASE_URL}/bookings/${id}`, updates);
  return response.data;
};

export const cancelBookingApi = async (bookingId, hotelId) => {
  // Set booking status to Cancelled
  const updatedBooking = await updateBookingApi(bookingId, { status: 'Cancelled' });
  
  // Set hotel available status back to true
  if (hotelId) {
    await axios.patch(`${API_BASE_URL}/hotels/${hotelId}`, { available: true });
  }
  return updatedBooking;
};

export const submitReviewApi = async (hotelId, reviewObj) => {
  const hotel = await fetchHotelById(hotelId);
  const currentReviews = hotel.reviews || [];
  const updatedReviews = [reviewObj, ...currentReviews];

  // Calculate new average rating
  const totalStars = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
  const newAverageRating = parseFloat((totalStars / updatedReviews.length).toFixed(2));

  const response = await axios.patch(`${API_BASE_URL}/hotels/${hotelId}`, {
    reviews: updatedReviews,
    rating: newAverageRating
  });

  return response.data;
};
