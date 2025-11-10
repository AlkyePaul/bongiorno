"use client";
import {useState} from 'react';
import {Link} from '@/i18n/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

export default function Dropdowns({ label, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v=>!v)}
        className={`transition text-lg font-medium hover:text-brand-accent flex items-end ${open ? 'text-brand-accent' : ''}`}
      >
        {label}
        {open ? (
          <FaAngleUp className="text-base mb-1 ml-1" />
        ) : (
          <FaAngleDown className="text-base mb-1 ml-1" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 border-t flex flex-col bg-white rounded-b-md shadow-lg min-w-[180px] p-2"
          >
            {items.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="px-4 py-2 text-md hover:bg-white/10 whitespace-nowrap rounded-md"
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
