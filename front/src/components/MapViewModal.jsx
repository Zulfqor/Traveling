import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Star, Check, ArrowRight, Eye } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Helper component to update view on center/zoom change
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

// Custom Monochrome Pin Icon
const createMonochromeIcon = (isDark) => {
  return L.divIcon({
    className: 'custom-monochrome-pin',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background-color: ${isDark ? '#F5F5F5' : '#0A0A0A'};
        color: ${isDark ? '#0A0A0A' : '#FFFFFF'};
        border-radius: 50%;
        border: 2px solid ${isDark ? '#0A0A0A' : '#FFFFFF'};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <div style="width: 8px; height: 8px; background-color: ${isDark ? '#0A0A0A' : '#FFFFFF'}; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const MapViewModal = ({ isOpen, onClose, hotels = [], onBookClick }) => {
  const { formatPrice } = useCurrency();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('world'); // 'world' or 'tashkent'

  if (!isOpen) return null;

  const worldCenter = [25.0, 15.0];
  const worldZoom = 2;

  const tashkentCenter = [41.3111, 69.2797];
  const tashkentZoom = 12;

  const currentCenter = activeTab === 'tashkent' ? tashkentCenter : worldCenter;
  const currentZoom = activeTab === 'tashkent' ? tashkentZoom : worldZoom;

  const displayHotels = activeTab === 'tashkent' 
    ? hotels.filter(h => h.city === 'Tashkent') 
    : hotels;

  const pinIcon = createMonochromeIcon(isDark);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-6xl h-[90vh] bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-card shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Tabs Overlay */}
        <div className="p-4 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-30">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0A0A0A] dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <span className="eyebrow block text-[10px]">Interactive Directory</span>
              <h3 className="font-bold text-base text-[#0A0A0A] dark:text-[#F5F5F5] uppercase tracking-tight">
                Map View ({displayHotels.length} Stays)
              </h3>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-2 border border-[#0A0A0A] dark:border-[#F5F5F5] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('world')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'world'
                  ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]'
                  : 'text-[#0A0A0A] dark:text-[#F5F5F5]'
              }`}
            >
              World View
            </button>
            <button
              onClick={() => setActiveTab('tashkent')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'tashkent'
                  ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]'
                  : 'text-[#0A0A0A] dark:text-[#F5F5F5]'
              }`}
            >
              Tashkent View
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#8A8A8A] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] focus-ring absolute top-4 right-4 sm:static"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>

        </div>

        {/* Leaflet Interactive Map */}
        <div className="flex-1 w-full h-full relative z-10 overflow-hidden">
          <MapContainer
            center={currentCenter}
            zoom={currentZoom}
            scrollWheelZoom={true}
            className="w-full h-full"
            style={{ background: isDark ? '#0A0A0A' : '#FAF9F6' }}
          >
            <MapRecenter center={currentCenter} zoom={currentZoom} />

            {/* CartoDB Monochrome Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url={
                isDark
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
              }
            />

            {/* Native Leaflet Marker Popups */}
            {displayHotels.map(hotel => (
              <Marker
                key={hotel.id}
                position={[hotel.latitude || 41.3111, hotel.longitude || 69.2797]}
                icon={pinIcon}
              >
                <Popup className="custom-monochrome-popup min-w-[240px]">
                  <div className="p-1 text-[#0A0A0A] dark:text-[#F5F5F5] space-y-2">
                    
                    {/* Image */}
                    <div className="w-full h-28 bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden border border-[#E5E5E5] dark:border-[#262626]">
                      {hotel.images && hotel.images[0] ? (
                        <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#E5E5E5] dark:bg-[#262626]" />
                      )}
                    </div>

                    {/* Meta */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#8A8A8A]">
                        <span>{hotel.city}, {hotel.country}</span>
                        <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5] line-clamp-1">
                        {hotel.name}
                      </h4>
                    </div>

                    {/* Price & Book Action */}
                    <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#262626] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] text-[#8A8A8A] block">Rate</span>
                        <span className="font-bold text-sm text-[#0A0A0A] dark:text-[#F5F5F5]">
                          {formatPrice(hotel.price)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hotel.available) {
                            onBookClick(hotel);
                          }
                        }}
                        disabled={!hotel.available}
                        className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          hotel.available
                            ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A]'
                            : 'bg-[#E5E5E5] text-[#8A8A8A] cursor-not-allowed'
                        }`}
                      >
                        {hotel.available ? 'Book' : 'Booked'}
                      </button>
                    </div>

                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default MapViewModal;
