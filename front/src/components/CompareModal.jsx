import React from 'react';
import { X, Star, Check, ImageOff, Trash2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';

const CompareModal = ({ isOpen, onClose, onBookClick }) => {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const { formatPrice } = useCurrency();

  if (!isOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-4xl bg-[#FAF9F6] dark:bg-[#1B1F26] rounded-card border border-[#E7E5DF] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5DF] dark:border-slate-800">
          <div>
            <span className="eyebrow block">Hotel Comparison</span>
            <h3 className="font-serif font-bold text-xl text-[#1C1F26] dark:text-[#EDEBE5]">
              Comparing {compareList.length} Hotel{compareList.length > 1 ? 's' : ''}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 focus-ring p-1 rounded-md"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Clear</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus-ring"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E7E5DF] dark:border-slate-800">
                <th className="py-3 px-4 eyebrow w-1/4">Property</th>
                {compareList.map(hotel => (
                  <th key={hotel.id} className="py-3 px-4 w-1/4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-800 mb-2 relative">
                        {hotel.images && hotel.images[0] ? (
                          <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                        ) : hotel.image ? (
                          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageOff className="w-5 h-5" />
                          </div>
                        )}
                        <button
                          onClick={() => toggleCompare(hotel)}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                          title="Remove from compare"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-serif font-bold text-sm text-[#1C1F26] dark:text-[#EDEBE5] line-clamp-1">
                        {hotel.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5DF] dark:divide-slate-800 text-sm">
              
              {/* Location Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B6F76] dark:text-gray-400 text-xs uppercase tracking-wider">
                  Location
                </td>
                {compareList.map(hotel => (
                  <td key={hotel.id} className="py-3.5 px-4 text-center text-gray-800 dark:text-gray-200">
                    {hotel.city}, {hotel.country}
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B6F76] dark:text-gray-400 text-xs uppercase tracking-wider">
                  Price / Night
                </td>
                {compareList.map(hotel => (
                  <td key={hotel.id} className="py-3.5 px-4 text-center font-serif italic font-bold text-lg text-[#1F6F5C]">
                    {formatPrice(hotel.price)}
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B6F76] dark:text-gray-400 text-xs uppercase tracking-wider">
                  Rating
                </td>
                {compareList.map(hotel => (
                  <td key={hotel.id} className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF9F6] dark:bg-slate-800 border border-[#E7E5DF] dark:border-slate-700 text-[#C99A4B] font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#C99A4B]" strokeWidth={1.75} />
                      {hotel.rating}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Availability Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B6F76] dark:text-gray-400 text-xs uppercase tracking-wider">
                  Status
                </td>
                {compareList.map(hotel => (
                  <td key={hotel.id} className="py-3.5 px-4 text-center">
                    {hotel.available ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F6F5C]">
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        Available
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-500">
                        Booked
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Action Button Row */}
              <tr>
                <td className="py-4 px-4 font-semibold text-[#6B6F76] text-xs uppercase tracking-wider">
                  Action
                </td>
                {compareList.map(hotel => (
                  <td key={hotel.id} className="py-4 px-4 text-center">
                    <button
                      onClick={() => {
                        onClose();
                        if (hotel.available) onBookClick(hotel);
                      }}
                      disabled={!hotel.available}
                      className={`w-full py-2.5 px-3 rounded-xl font-body font-semibold text-xs tracking-wider uppercase transition-all duration-200 ${
                        hotel.available
                          ? 'bg-[#1F6F5C] text-white hover:bg-[#1C1F26]'
                          : 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {hotel.available ? 'Book' : 'Booked'}
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
