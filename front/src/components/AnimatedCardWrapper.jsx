import React, { useState, useEffect, useRef } from 'react';

const AnimatedCardWrapper = ({ children, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve once triggered so it doesn't re-play on scroll up/down
          if (domRef.current) observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Stagger delay based on column index in 3-column desktop grid
  const staggerDelay = (index % 3) * 70;

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '450ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${staggerDelay}ms`,
      }}
      className={`transition-all ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-[14px] pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
};

export default AnimatedCardWrapper;
