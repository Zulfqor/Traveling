import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

const DEFAULT_WISHLISTS = {
  'All Saved': [],
  'Summer Trip': [],
  'Weekend Getaways': []
};

export const FavoritesProvider = ({ children }) => {
  const [wishlists, setWishlists] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_app_wishlists');
      if (saved) return JSON.parse(saved);
      
      // Migration from old flat favorites array
      const oldFavs = localStorage.getItem('travel_app_favorites');
      if (oldFavs) {
        const parsedOld = JSON.parse(oldFavs);
        return {
          ...DEFAULT_WISHLISTS,
          'All Saved': parsedOld
        };
      }
      return DEFAULT_WISHLISTS;
    } catch {
      return DEFAULT_WISHLISTS;
    }
  });

  const [activeWishlist, setActiveWishlist] = useState('All Saved');

  useEffect(() => {
    localStorage.setItem('travel_app_wishlists', JSON.stringify(wishlists));
  }, [wishlists]);

  // Extract all unique favorite hotels across all wishlists for flat compatibility
  const allFavoritesMap = new Map();
  Object.values(wishlists).forEach(list => {
    list.forEach(hotel => {
      if (hotel && hotel.id) {
        allFavoritesMap.set(String(hotel.id), hotel);
      }
    });
  });
  const favorites = Array.from(allFavoritesMap.values());

  const createWishlist = (name) => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    if (!wishlists[cleanName]) {
      setWishlists(prev => ({
        ...prev,
        [cleanName]: []
      }));
    }
    setActiveWishlist(cleanName);
  };

  const addToWishlist = (hotel, wishlistName = 'All Saved') => {
    setWishlists(prev => {
      const currentList = prev[wishlistName] || [];
      const exists = currentList.some(item => String(item.id) === String(hotel.id));
      if (exists) return prev;

      // Also ensure it is in 'All Saved'
      const allSaved = prev['All Saved'] || [];
      const inAllSaved = allSaved.some(item => String(item.id) === String(hotel.id));

      return {
        ...prev,
        'All Saved': inAllSaved ? allSaved : [...allSaved, hotel],
        [wishlistName]: [...currentList, hotel]
      };
    });
  };

  const removeFromWishlist = (hotelId, wishlistName) => {
    setWishlists(prev => {
      if (wishlistName === 'All Saved') {
        // Remove from ALL wishlists
        const updated = {};
        Object.keys(prev).forEach(key => {
          updated[key] = prev[key].filter(item => String(item.id) !== String(hotelId));
        });
        return updated;
      }

      return {
        ...prev,
        [wishlistName]: prev[wishlistName].filter(item => String(item.id) !== String(hotelId))
      };
    });
  };

  const toggleFavorite = (hotel) => {
    const isSavedInAny = isFavorite(hotel.id);
    if (isSavedInAny) {
      removeFromWishlist(hotel.id, 'All Saved');
    } else {
      addToWishlist(hotel, 'All Saved');
    }
  };

  const isFavorite = (id) => {
    return favorites.some(item => String(item.id) === String(id));
  };

  const isFavoriteInWishlist = (id, wishlistName) => {
    const list = wishlists[wishlistName] || [];
    return list.some(item => String(item.id) === String(id));
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        wishlists, 
        activeWishlist, 
        setActiveWishlist, 
        createWishlist, 
        addToWishlist, 
        removeFromWishlist, 
        toggleFavorite, 
        isFavorite,
        isFavoriteInWishlist
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
