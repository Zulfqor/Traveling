import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const HERO_SLIDES = [
  {
    id: "1",
    title: "Hilton Tashkent City",
    location: "Tashkent, Uzbekistan",
    tagline: "Unmatched Luxury & Sky Views in Central Asia",
    price: 180,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "3",
    title: "Grand Hotel Du Palais",
    location: "Paris, France",
    tagline: "Timeless Parisian Heritage Near Eiffel Tower",
    price: 340,
    rating: 4.92,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "7",
    title: "Ubud Rainforest Villa",
    location: "Bali, Indonesia",
    tagline: "Serene Private Pool Retreat Surrounded by Jungle",
    price: 190,
    rating: 4.96,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80"
  }
];

const HeroCarousel = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden mb-8 shadow-lg group">
      {/* Slide Image Background */}
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105"
      />
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Hero Content */}
      <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between z-10 text-white">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md border border-white/30 text-white">
            <span>FEATURED DESTINATION</span>
          </span>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[#C99A4B] font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-[#C99A4B]" strokeWidth={1.75} />
            <span>{slide.rating}</span>
          </div>
        </div>

        {/* Bottom Details & Action */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-200">
            <MapPin className="w-3.5 h-3.5 text-[#1F6F5C]" strokeWidth={2} />
            <span>{slide.location}</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-white tracking-tight">
            {slide.title}
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 font-normal max-w-lg line-clamp-2">
            {slide.tagline}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => navigate(`/hotel/${slide.id}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F6F5C] hover:bg-white hover:text-[#1C1F26] text-white rounded-xl font-body font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-md focus-ring"
            >
              <span>Explore Stay ({formatPrice(slide.price)})</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Carousel Indicators & Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all focus-ring"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          </button>
          
          <div className="flex gap-1.5 px-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all focus-ring"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeroCarousel;
