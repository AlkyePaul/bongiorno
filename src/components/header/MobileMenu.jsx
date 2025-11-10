"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

/**
 * MobileMenu (No Portal)
 * ----------------------
 * - Drawer menu slides from right
 * - No createPortal needed
 * - Renders directly inside header context
 * - Locks scroll while open
 */
export default function MobileMenu({ navLinks, quoteLabel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [scopriOpen, setScopriOpen] = useState(false);

  // ✅ Disable background scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }, [menuOpen]);

  // ✅ Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubMenuToggle = (key) => {
    if (key === "destinazioni") {
      setDestOpen((v) => !v);
      setScopriOpen(false);
    } else if (key === "scopri") {
      setScopriOpen((v) => !v);
      setDestOpen(false);
    }
  };

  return (
    <div className="lg:hidden relative z-[2000]">
      {/* Toggle Button */}
      <button
        className="text-2xl"
        aria-label="Apri menu"
        onClick={() => setMenuOpen(true)}
      >
        <IoMenu />
      </button>

      {/* Drawer Overlay + Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-[2000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Click outside to close */}
            <div
              className="absolute inset-0"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.aside
              className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white text-gray-800 shadow-xl flex flex-col overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-[10]">
                <span className="font-semibold text-lg">Menu</span>
                <button
                  aria-label="Chiudi menu"
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <IoClose size={22} />
                </button>
              </div>

              {/* Links */}
              <ul className="flex-1 flex flex-col divide-y divide-gray-100">
                {navLinks.map((link) => {
                  if (link.key === "destinazioni" || link.key === "scopri") {
                    const isOpen =
                      link.key === "destinazioni" ? destOpen : scopriOpen;

                    return (
                      <li key={link.key}>
                        <button
                          onClick={() => handleSubMenuToggle(link.key)}
                          className="w-full flex justify-between items-center px-5 py-3 font-medium text-brand-navy hover:bg-gray-50 transition"
                        >
                          <span>{link.label}</span>
                          {isOpen ? (
                            <FaAngleUp className="text-base" />
                          ) : (
                            <FaAngleDown className="text-base" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
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

                  // Normal link
                  return (
                    <li key={link.href}>
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

                {/* CTA */}
                <li className="mt-4 p-5">
                  <Link
                    href="/preventivi"
                    className="block text-center py-3 rounded-md bg-brand-navy text-white font-semibold hover:bg-brand-accent transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {quoteLabel}
                  </Link>
                </li>
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
