"use client";
import { useState, useMemo, useEffect } from "react";
import {Link, usePathname, useRouter} from '@/i18n/navigation';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMessages } from "next-intl";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useLocale } from "next-intl";

// Keep locales stable across renders to avoid changing useMemo deps
const locales = [
  { code: "it", label: "IT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [scopriOpen, setScopriOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Country flags via country-flag-icons (language -> representative country)
  // IT -> Italy, EN -> Great Britain, ES -> Spain
  const messages = useMessages();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentLocale = useLocale();

  const basePath = useMemo(() => {
    const parts = (pathname || "/").split("/").filter(Boolean);
    if (parts.length === 0) return "";
    if (locales.some((l) => l.code === parts[0])) {
      return "/" + parts.slice(1).join("/");
    }
    return "/" + parts.join("/");
  }, [pathname]);

const switchLocale = (code) => {
  setLangOpen(false);
  // just tell the router to change locale; it will translate the path
  router.push(pathname, {locale: code});
};

const navLabel = messages?.nav;
const quoteLabel = messages?.common?.preventivo;


  const destinations = [
    { href: '/destinazioni/tunisia', label: navLabel?.tunisia },
    { href: '/destinazioni/algeria', label: navLabel?.algeria },
    { href: '/destinazioni/marocco', label: navLabel?.marocco },
    { href: '/destinazioni/libia', label: navLabel?.libia },
    { href: '/destinazioni/mauritania', label: navLabel?.mauritania },
    { href: '/destinazioni/mondo', label: navLabel?.mondo }
  ];

  const scopri =[
    {href: '/news', label: navLabel?.news },
    {href: '/chi-siamo', label: navLabel?.about },
    {href: '/contatti', label: navLabel?.contacts }
  ]

 const navLinks = [
  { href: '/', label: navLabel?.home },
  { href: '/servizi', label: navLabel?.services },
  { key: 'destinazioni', label: navLabel?.destinations, array: destinations },
  { key: 'scopri', label: navLabel?.scopri, array: scopri }
];

    // 🔹 Utility function to toggle a submenu cleanly
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
<div>
    <div className={`${scrolled ? "mt-16" : "mt-18"}`}></div>
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 shadow-lg
      ${scrolled ? "bg-white backdrop-blur-md py-0" : "bg-white py-4"}
      text-black `}
    >
      <nav className="mx-auto px-6 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/img/logo.webp" alt="Logo" width={70} height={70} priority />
        </Link>

    {/* CENTER LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.key === "destinazioni" || link.key === "scopri") {
              const isOpen = link.key === "destinazioni" ? destOpen : scopriOpen;

              return (
                <div key={link.key} className="relative">
                  <button
                    onClick={() => handleSubMenuToggle(link.key)}
                    className={`transition text-lg font-medium hover:text-brand-accent flex items-end ${
                      isOpen ? "text-brand-accent" : ""
                    }`}
                  >
                    {link.label}
                    {isOpen ? (
                      <FaAngleUp className="text-sm mb-1 ml-1" />
                    ) : (
                      <FaAngleDown className="text-sm mb-1 ml-1" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2 border-t flex flex-col bg-white rounded-b-md shadow-lg min-w-[180px] p-2"
                      >
                        {link.array.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="px-4 py-2 text-md hover:bg-white/10 whitespace-nowrap rounded-md"
                            onClick={() => {
                              setDestOpen(false);
                              setScopriOpen(false);
                            }}
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

            // Normal link
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition text-lg font-medium hover:text-brand-accent ${
                  pathname === link.href ? "text-brand-accent" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
     

        {/* RIGHT → CTA + Lang */}
          <Link href="/preventivi" className="px-5 py-2 rounded-md bg-brand-navy text-white font-medium shadow hover:bg-brand-accent transition">
            {quoteLabel}
          </Link>

          {/* Language selector */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
            >
              <div className="w-5 h-5 overflow-hidden rounded-sm">
                {(() => {
                  const { IT } = require('country-flag-icons/react/3x2');
                  const { GB } = require('country-flag-icons/react/3x2');
                  const { ES } = require('country-flag-icons/react/3x2');
                  const { FR } = require('country-flag-icons/react/3x2');
                  const map = { it: IT, en: GB, es: ES, fr: FR };
                  const Flag = map[currentLocale] || IT;
                  return <Flag title={currentLocale.toUpperCase()} className="w-5 h-5" />;
                })()}
              </div>
              <span className="text-sm uppercase"></span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 bg-white/90 border border-white/10 rounded-md shadow-lg overflow-hidden"
                >
                  {locales.map((l) => (
                    <li key={l.code}>
                      <button
                        className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-white/10"
                        onClick={() => switchLocale(l.code)}
                      >
                        <div className="w-5 h-5 overflow-hidden rounded-sm">
                          {(() => {
                            const { IT } = require('country-flag-icons/react/3x2');
                            const { GB } = require('country-flag-icons/react/3x2');
                            const { ES } = require('country-flag-icons/react/3x2');
                            const { FR } = require('country-flag-icons/react/3x2');
                            const map = { it: IT, en: GB, es: ES, fr: FR };
                            const Flag = map[l.code] || IT;
                            return <Flag title={l.label} className="w-5 h-5" />;
                          })()}
                        </div>
                        <span className="text-sm">{l.label}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => {
            setMenuOpen((v) => !v);
            setLangOpen(false);
          }}
          aria-label="Toggle menu"
        >
         <IoMenu/>
        </button>
      </nav>

   {/* 🔹 MOBILE MENU (white version) */}
<AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="lg:hidden bg-white text-gray-800 border-t border-gray-200 shadow-md"
    >
      <ul className="flex flex-col py-2">
        {navLinks.map((link) => {
          if (link.key === "destinazioni" || link.key === "scopri") {
            const isOpen = link.key === "destinazioni" ? destOpen : scopriOpen;

            return (
              <li key={link.key} className="border-b border-gray-100">
                <button
                  onClick={() => handleSubMenuToggle(link.key)}
                  className="w-full flex justify-between items-center px-5 py-3 font-medium text-brand-navy hover:bg-gray-50 transition"
                >
                  <span>{link.label}</span>
                  {isOpen ? (
                    <FaAngleUp className="text-sm" />
                  ) : (
                    <FaAngleDown className="text-sm" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
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

          // Normal link
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

        {/* CTA button (centered, 80% width) */}
        <li className="mt-4 flex justify-center">
          <Link
            href="/preventivi"
            className="w-4/5 text-center py-3 rounded-md bg-brand-navy text-white font-medium hover:bg-brand-accent transition"
            onClick={() => setMenuOpen(false)}
          >
            {quoteLabel}
          </Link>
        </li>
      </ul>
    </motion.div>
  )}
</AnimatePresence>

    </header>
  </div>);
}
