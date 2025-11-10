"use client";
import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import {IoMenu} from 'react-icons/io5';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { IoClose } from 'react-icons/io5';
import { createPortal } from 'react-dom';


export default function MobileMenu({ navLinks, quoteLabel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [scopriOpen, setScopriOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = prevOverflow || '';
      document.body.style.touchAction = prevTouchAction || '';
    };
  }, [menuOpen]);

  const handleSubMenuToggle = (key) => {
    if (key === 'destinazioni') {
      setDestOpen(v=>!v);
      setScopriOpen(false);
    } else if (key === 'scopri') {
      setScopriOpen(v=>!v);
      setDestOpen(false);
    }
  };

  return (
    <div className="lg:hidden">
      <button
        className="text-2xl"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(true)}
      >
        <IoMenu />
      </button>

      <AnimatePresence>
        {menuOpen && createPortal(
          <motion.div
            className="fixed inset-0 z-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
            />
            {/* Drawer panel */}
            <motion.aside
              className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white text-gray-800 shadow-xl flex flex-col overscroll-y-contain"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <span className="font-semibold">Menu</span>
                <button
                  aria-label="Close menu"
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <IoClose size={20} />
                </button>
              </div>

              <ul className="flex-1 overflow-y-auto flex flex-col py-2">
                {navLinks.map((link) => {
                  if (link.key === 'destinazioni' || link.key === 'scopri') {
                    const isOpen = link.key === 'destinazioni' ? destOpen : scopriOpen;
                    return (
                      <li key={link.key} className="border-b border-gray-100">
                        <button
                          onClick={() => handleSubMenuToggle(link.key)}
                          className="w-full flex justify-between items-center px-5 py-3 font-medium text-brand-navy hover:bg-gray-50 transition"
                        >
                          <span>{link.label}</span>
                          {isOpen ? <FaAngleUp className="text-base" /> : <FaAngleDown className="text-base" />}
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col pl-8 pb-2 bg-gray-50"
                            >
                              {link.array.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 rounded-md transition"
                                    onClick={() => {
                                      setMenuOpen(false);
                                      setDestOpen(false);
                                      setScopriOpen(false);
                                    }}
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }

                  return (
                    <li key={link.href} className="border-b border-gray-100">
                      <Link
                        href={link.href}
                        className="block px-5 py-3 text-gray-800 font-medium hover:bg-gray-50 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                {/* CTA button */}
                <li className="mt-4 px-5 pb-6">
                  <Link
                    href="/preventivi"
                    className="w-full inline-block text-center py-3 rounded-md bg-brand-navy text-white font-medium hover:bg-brand-accent transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {quoteLabel}
                  </Link>
                </li>
              </ul>
            </motion.aside>
          </motion.div>, document.body)
        }
      </AnimatePresence>
    </div>
  );
}
