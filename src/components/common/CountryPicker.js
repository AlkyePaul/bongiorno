"use client";
import { useState, useRef, useEffect } from "react";
import allCountries from "@/data/countries.json";

/**
 * CountryPicker — searchable country selector with flag icons.
 *
 * Props:
 *  - value        : currently selected country name (string, matches JSON "Country" field)
 *  - onChange      : (countryName: string, flagCode: string) => void
 *  - pinned       : { label: string, value: string }[] — quick-pick chips
 *                   `value` must match the JSON Country name, `label` is the display text
 *  - placeholder  : placeholder text for the search input
 *  - required     : boolean
 *  - name         : form field name (for accessibility)
 */

// Build a lookup map: Country name → flag_code (lowercased)
const flagMap = Object.fromEntries(
  allCountries.map((c) => [c.Country, c.flag_code?.toLowerCase()])
);

// Deduplicate countries by name (some share country codes like +1)
const uniqueCountries = allCountries.filter(
  (c, i, arr) => arr.findIndex((x) => x.Country === c.Country) === i
);

function FlagIcon({ code, className = "" }) {
  if (!code) return null;
  const src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  return (
    <img
      src={src}
      alt=""
      width={20}
      height={15}
      className={`inline-block rounded-sm object-cover ${className}`}
      loading="lazy"
    />
  );
}

export default function CountryPicker({
  value,
  onChange,
  pinned = [],
  placeholder = "Cerca paese...",
  required = false,
  name = "country",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Build a label map from pinned items so we can show the local label
  // when a pinned country is selected
  const pinnedLabelMap = Object.fromEntries(
    pinned.map((p) => [p.value, p.label])
  );

  const filtered = search.trim()
    ? uniqueCountries.filter((c) =>
        c.Country.toLowerCase().includes(search.toLowerCase()) ||
        c.search_name?.toLowerCase().includes(search.toLowerCase())
      )
    : uniqueCountries;

  const select = (countryValue) => {
    onChange(countryValue, flagMap[countryValue] || "");
    setSearch("");
    setOpen(false);
  };

  const selectedFlag = flagMap[value];
  // Show local label if it's a pinned country, otherwise show the JSON name
  const displayName = pinnedLabelMap[value] || value;

  return (
    <div ref={wrapperRef} className="space-y-2">
      {/* Pinned quick-pick chips */}
      {pinned.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pinned.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => select(item.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                ${
                  value === item.value
                    ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              <FlagIcon code={flagMap[item.value]} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Selected display / search input */}
      <div className="relative">
        {value && !open ? (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-left"
          >
            <FlagIcon code={selectedFlag} />
            <span className="flex-1">{displayName}</span>
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="w-full px-4 py-2 pl-9 rounded-md bg-gray-100 border border-gray-300"
              autoComplete="off"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Hidden native input for form required validation */}
        {required && (
          <input
            type="text"
            name={name}
            value={value}
            required
            tabIndex={-1}
            className="absolute opacity-0 h-0 w-0 pointer-events-none"
            onChange={() => {}}
          />
        )}

        {/* Dropdown */}
        {open && (
          <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">Nessun risultato</li>
            )}
            {filtered.map((c) => (
              <li key={c.Country + c.flag_code}>
                <button
                  type="button"
                  onClick={() => select(c.Country)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-brand-accent/5 transition-colors
                    ${value === c.Country ? "bg-brand-accent/10 text-brand-accent font-medium" : "text-gray-700"}`}
                >
                  <FlagIcon code={c.flag_code?.toLowerCase()} />
                  <span>{c.Country}</span>
                  <span className="ml-auto text-xs text-gray-400">+{c["Country Code"]}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
