import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (hotel) => {
    setCompareList(prev => {
      const exists = prev.some(item => String(item.id) === String(hotel.id));
      if (exists) {
        return prev.filter(item => String(item.id) !== String(hotel.id));
      } else {
        if (prev.length >= 3) {
          // Keep max 3 items
          return [...prev.slice(1), hotel];
        }
        return [...prev, hotel];
      }
    });
  };

  const isCompared = (id) => {
    return compareList.some(item => String(item.id) === String(id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isCompared, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
