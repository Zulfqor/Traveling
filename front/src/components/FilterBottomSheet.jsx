import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

const FilterBottomSheet = ({
  isOpen,
  onClose,
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
  selectedCity,
  setSelectedCity,
  cities = [],
  priceSort,
  setPriceSort,
  ratingSort,
  setRatingSort,
  onResetFilters
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-[#141414] rounded-t-card sm:rounded-card border border-[#E5E5E5] dark:border-[#262626] shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-4 mb-4">
          <div className="flex items-center gap-2 font-bold text-lg text-[#0A0A0A] dark:text-[#F5F5F5]">
            <SlidersHorizontal className="w-5 h-5 text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
            <span>{t('filter_options')}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8A8A8A] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] focus-ring"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6">
          
          {/* Price Range Slider */}
          <div>
            <label className="eyebrow block mb-2">
              {t('max_price')}: <span className="text-[#0A0A0A] dark:text-[#F5F5F5] font-bold">{formatPrice(priceRange)}</span>
            </label>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 bg-[#E5E5E5] dark:bg-[#262626] rounded-none appearance-none cursor-pointer accent-[#0A0A0A] dark:accent-[#F5F5F5]"
            />
            <div className="flex justify-between text-xs text-[#8A8A8A] mt-1 font-mono">
              <span>{formatPrice(minPrice)}</span>
              <span>{formatPrice(maxPrice)}</span>
            </div>
          </div>

          {/* City Selector */}
          <div>
            <label className="eyebrow block mb-2">{t('all_cities')}</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] px-3.5 py-2.5 text-xs font-semibold focus-ring text-[#0A0A0A] dark:text-[#F5F5F5]"
            >
              <option value="">{t('all_cities')}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Sorting */}
          <div>
            <label className="eyebrow block mb-2">{t('sort_price')}</label>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] px-3.5 py-2.5 text-xs font-semibold focus-ring text-[#0A0A0A] dark:text-[#F5F5F5]"
            >
              <option value="">{t('sort_price')}</option>
              <option value="low-high">{t('price_low_high')}</option>
              <option value="high-low">{t('price_high_low')}</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="eyebrow block mb-2">{t('rating_sort')}</label>
            <select
              value={ratingSort}
              onChange={(e) => setRatingSort(e.target.value)}
              className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] px-3.5 py-2.5 text-xs font-semibold focus-ring text-[#0A0A0A] dark:text-[#F5F5F5]"
            >
              <option value="">{t('rating_sort')}</option>
              <option value="desc">{t('top_rated')}</option>
            </select>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-[#E5E5E5] dark:border-[#262626] mt-6">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="btn-outline flex-1 py-2.5 text-xs"
          >
            {t('reset')}
          </button>
          <button
            onClick={onClose}
            className="btn-primary flex-1 py-2.5 text-xs"
          >
            <Check className="w-4 h-4" strokeWidth={1.5} />
            <span>{t('apply')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterBottomSheet;
