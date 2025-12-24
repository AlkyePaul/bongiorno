"use client";
import { useEffect, useState } from "react";

/**
 * StickyOnScroll
 * ---------------
 * Wraps header content and adds scroll-based style changes.
 * - Keeps header fixed with smooth transition
 * - Adds blur and compact style on scroll
 */
export default function StickyOnScroll({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
   <header
      className={`
        fixed top-0 left-0 right-0 z-[60] w-full transition-all duration-300 shadow-lg bg-white
        ${scrolled ? "pt-2 pb-0" : "pt-3 pb-1"}
        text-black
      `}
    >
      {children}
    </header>
  );
}
