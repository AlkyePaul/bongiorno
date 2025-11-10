"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

/**
 * Dropdowns — hybrid approach
 * - Same look/feel as old header
 * - Fixed z-index (visible above header)
 * - No coordinate issues
 */
export default function Dropdowns({ label, items }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className={`transition text-lg font-medium flex items-center gap-1 hover:text-brand-accent ${
          open ? "text-brand-accent" : ""
        }`}
      >
        {label}
        {open ? (
          <FaAngleUp className="text-base mt-[2px]" />
        ) : (
          <FaAngleDown className="text-base mt-[2px]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="
              absolute left-0 mt-2 border-t border-gray-100 flex flex-col
              bg-white rounded-b-md shadow-lg min-w-[180px] p-2
              max-w-[90vw] max-h-[70vh] overflow-y-auto
              z-[9999]
            "
          >
            {items.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="px-4 py-2 text-md text-gray-800 hover:bg-gray-50 whitespace-nowrap rounded-md transition"
                onClick={() => setOpen(false)}
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
