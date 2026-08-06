import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_app_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('travel_app_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (hotel) => {
    setFavorites(prev => {
      const exists = prev.some(item => String(item.id) === String(hotel.id));
      if (exists) {
        return prev.filter(item => String(item.id) !== String(hotel.id));
      } else {
        // Prevent duplicates
        return [...prev, hotel];
      }
    });
  };

  const isFavorite = (id) => {
    return favorites.some(item => String(item.id) === String(id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
