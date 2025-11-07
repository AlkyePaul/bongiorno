"use client";

import { IT } from 'country-flag-icons/react/3x2';
import { GB } from 'country-flag-icons/react/3x2';
import { ES } from 'country-flag-icons/react/3x2';
import { FR } from 'country-flag-icons/react/3x2';

const LOCALE_FLAGS = {
  it: { Flag: IT, label: 'IT' },
  es: { Flag: ES, label: 'ES' },
  en: { Flag: GB, label: 'EN' },
  fr: { Flag: FR, label: 'FR' },
};

const LOCALE_NAMES = {
  it: 'Italiano',
  es: 'Español',
  en: 'English',
  fr: 'Français',
};

/**
 * Display language availability badges for an article
 */
export default function LanguageBadges({ availableLocales, currentLocale, variant = 'compact' }) {
  if (!availableLocales || availableLocales.length === 0) {
    return null;
  }

  const allLocales = ['it', 'es', 'en', 'fr'];

  if (variant === 'compact') {
    // Small badges showing available languages
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {allLocales.map(locale => {
          const isAvailable = availableLocales.includes(locale);
          const isCurrent = locale === currentLocale;
          const { Flag, label } = LOCALE_FLAGS[locale];

          return (
            <span
              key={locale}
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                isAvailable
                  ? isCurrent
                    ? 'bg-brand-accent text-white font-semibold'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 opacity-50'
              }`}
              title={isAvailable ? `Disponibile in ${LOCALE_NAMES[locale]}` : `Non disponibile in ${LOCALE_NAMES[locale]}`}
            >
              <Flag className="w-3 h-3" />
              <span>{label}</span>
            </span>
          );
        })}
      </div>
    );
  }

  if (variant === 'banner') {
    // Prominent banner showing which languages the article is available in
    const missingLocales = allLocales.filter(loc => !availableLocales.includes(loc));
    
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🌐</div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Questo articolo è disponibile in:
            </p>
            <div className="flex gap-2 flex-wrap">
              {availableLocales.map(locale => {
                const { Flag, label } = LOCALE_FLAGS[locale];
                const isCurrent = locale === currentLocale;
                
                return (
                  <span
                    key={locale}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm ${
                      isCurrent
                        ? 'bg-brand-accent text-white font-semibold'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    <span>{LOCALE_NAMES[locale]}</span>
                  </span>
                );
              })}
            </div>
            {missingLocales.length > 0 && (
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Traduzione non ancora disponibile per: {missingLocales.map(loc => LOCALE_NAMES[loc]).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
