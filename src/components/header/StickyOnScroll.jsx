"use client";
import {useEffect, useState} from 'react';

export default function StickyOnScroll({children}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className='overflow-x-hidden'>
      <div className={scrolled ? 'mt-14' : 'mt-20'} />
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 shadow-lg ${
          scrolled ? 'bg-white backdrop-blur-md py-1' : 'bg-white py-4'
        } text-black`}
      >
        {children}
      </header>
    </div>
  );
}
