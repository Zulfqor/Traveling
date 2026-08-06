import React from 'react';
import { Search, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ControlPanel = ({
  searchTerm,
  setSearchTerm,
  selectedCity,
  setSelectedCity,
  cities = [],
  priceSort,
  setPriceSort,
  ratingSort,
  setRatingSort,
  onOpenFilterSheet,
  activeFilterCount = 0,
  onResetFilters
}) => {
  const { t } = useLanguage();

  return (
    <div id="control-panel" className="sticky top-16 z-30 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-[16px] border-b border-black/10 dark:border-white/10 py-3.5 px-4 sm:px-6 lg:px-8 mb-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Input (Left) */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
            <Search className="w-4 h-4 text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-md text-xs font-semibold placeholder-[#8A8A8A] focus-ring text-[#0A0A0A] dark:text-[#F5F5F5]"
          />
        </div>

        {/* Desktop Filter Dropdowns (Right) */}
        <div className="hidden md:flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* City Filter */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 text-xs font-semibold text-[#0A0A0A] dark:text-[#F5F5F5] pl-3.5 pr-8 py-2 rounded-md focus-ring cursor-pointer transition-colors"
            >
              <option value="">{t('all_cities')}</option>
              {cities.map((city) => (
                <option key={city} value={city} className="bg-white dark:bg-[#141414]">
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
          </div>

          {/* Price Sort Filter */}
          <div className="relative">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="appearance-none bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 text-xs font-semibold text-[#0A0A0A] dark:text-[#F5F5F5] pl-3.5 pr-8 py-2 rounded-md focus-ring cursor-pointer transition-colors"
            >
              <option value="">{t('sort_price')}</option>
              <option value="low-high" className="bg-white dark:bg-[#141414]">{t('price_low_high')}</option>
              <option value="high-low" className="bg-white dark:bg-[#141414]">{t('price_high_low')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
          </div>

          {/* Rating Sort Filter */}
          <div className="relative">
            <select
              value={ratingSort}
              onChange={(e) => setRatingSort(e.target.value)}
              className="appearance-none bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 text-xs font-semibold text-[#0A0A0A] dark:text-[#F5F5F5] pl-3.5 pr-8 py-2 rounded-md focus-ring cursor-pointer transition-colors"
            >
              <option value="">{t('rating_sort')}</option>
              <option value="desc" className="bg-white dark:bg-[#141414]">{t('top_rated')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
          </div>

          {/* Filters Range Drawer Toggle Button */}
          <button
            onClick={onOpenFilterSheet}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider border focus-ring transition-colors ${
              activeFilterCount > 0
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] dark:bg-[#F5F5F5] dark:text-[#0A0A0A] dark:border-[#F5F5F5]'
                : 'bg-black/5 dark:bg-white/5 border-black/15 dark:border-white/15 text-[#0A0A0A] dark:text-[#F5F5F5]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{t('filters_btn')}</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Reset Filters button */}
          {(searchTerm || selectedCity || priceSort || ratingSort || activeFilterCount > 0) && (
            <button
              onClick={onResetFilters}
              title={t('clear_filters')}
              className="p-2 rounded-md text-[#8A8A8A] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors focus-ring"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}

        </div>

        {/* Mobile Control Row */}
        <div className="flex md:hidden items-center justify-between gap-2 w-full">
          <button
            onClick={onOpenFilterSheet}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#0A0A0A] dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] rounded-md font-semibold text-xs tracking-wider uppercase focus-ring"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
            <span>{t('filters_btn')}</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-white text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {(searchTerm || selectedCity || priceSort || ratingSort || activeFilterCount > 0) && (
            <button
              onClick={onResetFilters}
              className="p-2 border border-black/15 dark:border-white/15 rounded bg-black/5 text-[#0A0A0A] dark:text-[#F5F5F5]"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;
