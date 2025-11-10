"use client";
import {useEffect, useRef, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import {createPortal} from 'react-dom';

export default function Dropdowns({ label, items }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setCoords({ top: r.bottom, left: r.left, width: r.width });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
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
        {open && createPortal(
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
          >
            <div className="border-t flex flex-col bg-white rounded-b-md shadow-lg min-w-[180px] p-2 max-w-[90vw] max-h-[70vh] overflow-y-auto overflow-x-hidden z-[100]">
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
            </div>
          </motion.div>, document.body)
        }
      </AnimatePresence>
    </div>
  );
}
