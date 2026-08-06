import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Compass, ShieldCheck, Heart, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      addToast('Subscribed to Traveler Editorial Newsletter', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-white dark:bg-[#0A0A0A] border-t border-[#E5E5E5] dark:border-[#262626] text-[#0A0A0A] dark:text-[#F5F5F5] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0A0A0A] dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] flex items-center justify-center font-bold text-sm tracking-widest">
                T
              </div>
              <span className="font-bold text-xl tracking-tighter uppercase">
                TRAVELER<span className="text-[#8A8A8A]">.</span>
              </span>
            </Link>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              Strict monochrome architectural hotel directory. Built for minimalist gallery exploration and instant bookings.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#0A0A0A] dark:text-[#F5F5F5]">
              <Globe className="w-4 h-4" strokeWidth={1.5} />
              <Compass className="w-4 h-4" strokeWidth={1.5} />
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>

          {/* Column 2: Popular Destinations */}
          <div className="space-y-3">
            <span className="eyebrow block">DESTINATIONS</span>
            <ul className="space-y-2 text-xs text-[#8A8A8A]">
              <li><Link to="/?city=Tashkent" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Tashkent, Uzbekistan</Link></li>
              <li><Link to="/?city=Paris" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Paris, France</Link></li>
              <li><Link to="/?city=Tokyo" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Tokyo, Japan</Link></li>
              <li><Link to="/?city=Dubai" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Dubai, UAE</Link></li>
              <li><Link to="/?city=Samarkand" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Samarkand, Uzbekistan</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <span className="eyebrow block">NAVIGATION</span>
            <ul className="space-y-2 text-xs text-[#8A8A8A]">
              <li><Link to="/" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Explore Listing</Link></li>
              <li><Link to="/favorites" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Saved Favorites</Link></li>
              <li><a href="#control-panel" className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors">Search & Filter</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3 md:col-span-1">
            <span className="eyebrow block">NEWSLETTER</span>
            <p className="text-xs text-[#8A8A8A]">
              Subscribe for weekly architectural picks and editorial stays.
            </p>
            {subscribed ? (
              <div className="p-3 border border-[#0A0A0A] text-xs font-bold text-[#0A0A0A] dark:text-[#F5F5F5] dark:border-[#F5F5F5] flex items-center gap-2">
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>SUBSCRIBED</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    required
                    className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-xs focus-ring text-[#0A0A0A] dark:text-[#F5F5F5]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A] hover:opacity-80 transition-opacity focus-ring"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E5E5E5] dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8A8A]">
          <p>© 2026 TRAVELER ARCHITECTURAL DIRECTORY. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-1 font-bold">
            <Heart className="w-3.5 h-3.5 fill-current text-[#0A0A0A] dark:text-[#F5F5F5]" strokeWidth={1.5} />
            <span>STRICT MONOCHROME MINIMALISM</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
