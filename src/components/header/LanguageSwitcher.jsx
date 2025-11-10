"use client";
import {useState} from 'react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {AnimatePresence, motion} from 'framer-motion';

const locales = [
  { code: 'it', label: 'IT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' }
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (code) => {
    setOpen(false);
    router.push(pathname, { locale: code });
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(v=>!v)}
      >
        <div className="w-5 h-5 overflow-hidden rounded-sm">
          {(() => {
            const { IT } = require('country-flag-icons/react/3x2');
            const { GB } = require('country-flag-icons/react/3x2');
            const { ES } = require('country-flag-icons/react/3x2');
            const { FR } = require('country-flag-icons/react/3x2');
            const map = { it: IT, en: GB, es: ES, fr: FR };
            const Flag = map[locale] || IT;
            return <Flag title={locale.toUpperCase()} className="w-5 h-5" />;
          })()}
        </div>
        <span className="text-base uppercase" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-white/90 border border-white/10 rounded-md shadow-lg overflow-hidden z-50"
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
                  <span className="text-base">{l.label}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
