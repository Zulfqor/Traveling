import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromoGridCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0A0A0A] text-[#F5F5F5] dark:bg-[#141414] dark:text-[#F5F5F5] border border-[#0A0A0A] dark:border-[#262626] rounded-card p-6 sm:p-7 flex flex-col justify-between h-full min-h-[380px] select-none hover:border-gray-500 transition-colors">
      
      {/* Top Header */}
      <div>
        <div className="eyebrow text-[10px] text-[#8A8A8A] flex items-center gap-1.5 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          <span>EDITORIAL ACCENT</span>
        </div>

        <h3 className="font-bold text-2xl text-white tracking-tight mb-3">
          Stay in Comfort
        </h3>

        <p className="text-xs text-[#8A8A8A] leading-relaxed">
          Curated luxury spaces with seamless 24/7 concierge and verified architectural elegance.
        </p>
      </div>

      {/* Signature Ticket Perforation Divider Line */}
      <div className="ticket-perforation-wrapper my-4">
        <div className="ticket-notch-left bg-[#FFFFFF] dark:bg-[#0A0A0A]" />
        <div className="ticket-divider border-gray-700" />
        <div className="ticket-notch-right bg-[#FFFFFF] dark:bg-[#0A0A0A]" />
      </div>

      {/* Bottom Action Button */}
      <div>
        <button
          onClick={() => navigate('/favorites')}
          className="w-full btn-sharp border border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors"
        >
          <span>VIEW SAVED</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

    </div>
  );
};

export default PromoGridCard;
