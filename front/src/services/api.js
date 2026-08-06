import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

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
