import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-production-109c0.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const fetchHotels = async () => {
  const response = await api.get('/hotels');
  return response.data;
};

export const fetchHotelById = async (id) => {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
};

export const bookHotelApi = async (id) => {
  const response = await api.patch(`/hotels/${id}`, { available: false });
  return response.data;
};

export default api;
