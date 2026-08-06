import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const UZS_RATE = 12600;

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'UZS'

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'USD' ? 'UZS' : 'USD'));
  };

  const formatPrice = (priceInUSD) => {
    if (!priceInUSD && priceInUSD !== 0) return '';
    if (currency === 'UZS') {
      const uzsAmount = Math.round(priceInUSD * UZS_RATE);
      return `${uzsAmount.toLocaleString()} UZS`;
    }
    return `$${priceInUSD}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
