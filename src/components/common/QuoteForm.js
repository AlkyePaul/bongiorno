"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import CountryPicker from "./CountryPicker";

const shipmentTypes = [
  {
    id: "pacco",
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="18" y="28" width="44" height="36" rx="3" />
        <path d="M18 40h44" />
        <path d="M40 28v36" />
        <path d="M18 28l10-12h24l10 12" />
        <path d="M28 16h24" strokeDasharray="4 2" />
      </svg>
    ),
  },
  {
    id: "pacchi",
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="34" width="32" height="28" rx="2" />
        <path d="M8 46h32" />
        <path d="M24 34v28" />
        <rect x="40" y="26" width="32" height="28" rx="2" />
        <path d="M40 38h32" />
        <path d="M56 26v28" />
        <rect x="24" y="54" width="32" height="20" rx="2" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "pallet",
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
        {/* pallet base */}
        <rect x="12" y="58" width="56" height="6" rx="1" />
        <rect x="16" y="64" width="8" height="6" />
        <rect x="36" y="64" width="8" height="6" />
        <rect x="56" y="64" width="8" height="6" />
        {/* boxes on pallet */}
        <rect x="16" y="38" width="22" height="20" rx="2" />
        <rect x="42" y="44" width="22" height="14" rx="2" />
        <rect x="22" y="22" width="18" height="16" rx="2" />
      </svg>
    ),
  },
  {
    id: "container",
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="24" width="68" height="38" rx="3" />
        {/* vertical ribs */}
        <path d="M20 24v38" />
        <path d="M34 24v38" />
        <path d="M48 24v38" />
        <path d="M62 24v38" />
        {/* door handles on right */}
        <rect x="66" y="38" width="4" height="10" rx="1" />
        {/* bottom rail */}
        <rect x="4" y="62" width="72" height="4" rx="1" />
      </svg>
    ),
  },
  {
    id: "veicolo",
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
        {/* car body */}
        <path d="M12 48h56v10H12z" />
        <path d="M20 48l6-16h28l6 16" />
        {/* windows */}
        <path d="M28 34h10v14" />
        <path d="M42 34h10l4 14" />
        {/* wheels */}
        <circle cx="24" cy="58" r="6" />
        <circle cx="56" cy="58" r="6" />
        <circle cx="24" cy="58" r="2" fill="currentColor" />
        <circle cx="56" cy="58" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "speciale",
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
        {/* wind turbine blade */}
        <circle cx="40" cy="34" r="4" />
        <path d="M40 30c-2-14-4-20 0-22s4 8 0 22" />
        <path d="M44 34c12 6 18 10 16 14s-10-2-16-14" />
        <path d="M36 34c-10 8-14 14-10 16s10-4 10-16" />
        {/* truck/flatbed below */}
        <rect x="10" y="56" width="60" height="8" rx="2" />
        <circle cx="20" cy="68" r="4" />
        <circle cx="60" cy="68" r="4" />
      </svg>
    ),
  },
];

export default function QuoteFormTest() {
  const t = useTranslations("quote");
  const locale = useLocale();

  const [form, setForm] = useState({
    shipmentType: "",
    companyName: "",
    isPrivate: false,
    name: "",
    email: "",
    phone: "",
    originCountry: "",
    originCountryCode: "",
    originOther: "",
    originCity: "",
    originZip: "",
    originAddress: "",
    destinationCountry: "",
    destinationCountryCode: "",
    destinationOther: "",
    destinationCity: "",
    destinationZip: "",
    destinationAddress: "",
    dangerousGoods: false,
    goodsClass: "",
    goodsValue: "",
    insureGoods: false,
    details: "",
    consent: false,
  });

  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (name === "companyName" || name === "isPrivate") {
      setErrors((prev) => ({ ...prev, companyOrPrivate: undefined }));
    }
    if (name === "goodsValue") {
      setErrors((prev) => ({ ...prev, goodsValue: undefined }));
    }
  };

  const selectShipmentType = (id) => {
    setForm((prev) => ({ ...prev, shipmentType: id }));
    setErrors((prev) => ({ ...prev, shipmentType: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.companyName.trim() && !form.isPrivate) {
      newErrors.companyOrPrivate = t("errors.companyOrPrivate");
    }
    if (!form.shipmentType) {
      newErrors.shipmentType = t("errors.shipmentTypeRequired");
    }
    if (!form.goodsValue) {
      newErrors.goodsValue = t("errors.goodsValueRequired");
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[data-error="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});

    if (!form.consent) {
      alert(t("errors.noConsent"));
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "preventivo", locale }),
      });
      if (!res.ok) throw new Error();

      setForm({
        shipmentType: "",
        companyName: "",
        isPrivate: false,
        name: "",
        email: "",
        phone: "",
        originCountry: "",
        originCountryCode: "",
        originOther: "",
        originCity: "",
        originZip: "",
        originAddress: "",
        destinationCountry: "",
        destinationCountryCode: "",
        destinationOther: "",
        destinationCity: "",
        destinationZip: "",
        destinationAddress: "",
        dangerousGoods: false,
        goodsClass: "",
        goodsValue: "",
        insureGoods: false,
        details: "",
        consent: false,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const countryLabels = {
    it: {
      Italy: "Italia", France: "Francia", Spain: "Spagna", Germany: "Germania",
      Poland: "Polonia", "Czech Rep.": "Rep. Ceca",
      Tunisia: "Tunisia", Algeria: "Algeria", Morocco: "Marocco",
      Libya: "Libia", Mauritania: "Mauritania",
    },
    es: {
      Italy: "Italia", France: "Francia", Spain: "España", Germany: "Alemania",
      Poland: "Polonia", "Czech Rep.": "Rep. Checa",
      Tunisia: "Túnez", Algeria: "Argelia", Morocco: "Marruecos",
      Libya: "Libia", Mauritania: "Mauritania",
    },
    en: {
      Italy: "Italy", France: "France", Spain: "Spain", Germany: "Germany",
      Poland: "Poland", "Czech Rep.": "Czech Republic",
      Tunisia: "Tunisia", Algeria: "Algeria", Morocco: "Morocco",
      Libya: "Libya", Mauritania: "Mauritania",
    },
    fr: {
      Italy: "Italie", France: "France", Spain: "Espagne", Germany: "Allemagne",
      Poland: "Pologne", "Czech Rep.": "Rép. tchèque",
      Tunisia: "Tunisie", Algeria: "Algérie", Morocco: "Maroc",
      Libya: "Libye", Mauritania: "Mauritanie",
    },
    ca: {
      Italy: "Itàlia", France: "França", Spain: "Espanya", Germany: "Alemanya",
      Poland: "Polònia", "Czech Rep.": "Rep. Txeca",
      Tunisia: "Tunísia", Algeria: "Algèria", Morocco: "Marroc",
      Libya: "Líbia", Mauritania: "Mauritània",
    },
  };

  const loc = countryLabels[locale] || countryLabels.en;
  const pin = (value) => ({ label: loc[value] || value, value });

  const sendCountries = [
    pin("Italy"), pin("France"), pin("Spain"),
    pin("Germany"), pin("Poland"),
  ];

  const receiveCountries = [
    pin("Tunisia"), pin("Algeria"), pin("Morocco"),
    pin("Libya"), pin("Mauritania"),
  ];

  const goodsValueRanges = [
    t("goodsValueRange1"),
    t("goodsValueRange2"),
    t("goodsValueRange3"),
    t("goodsValueRange4"),
  ];

  const adrClasses = [
    t("adrClass1"),
    t("adrClass2"),
    t("adrClass3"),
    t("adrClass4"),
    t("adrClass5"),
    t("adrClass6"),
    t("adrClass7"),
    t("adrClass8"),
    t("adrClass9"),
  ];

  const selectedType = shipmentTypes.find((s) => s.id === form.shipmentType);
  const detailsHint = form.shipmentType
    ? t(`shipmentHints.${form.shipmentType}`)
    : t("placeholders.details");

  return (
    <section>
      <div className="mx-auto md:px-6 max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
        >
          {/* ═══ 1. CONTACT & GENERAL INFO ═══ */}

          {/* ── Company / Private ── */}
          <div data-error="companyOrPrivate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium mb-1">
                  {t("fields.companyName")}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder={t("placeholders.company")}
                  className={`w-full px-4 py-2 rounded-md bg-gray-100 border ${errors.companyOrPrivate ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  id="isPrivate"
                  type="checkbox"
                  name="isPrivate"
                  checked={form.isPrivate}
                  onChange={handleChange}
                  className="h-5 w-5 mr-2 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                />
                <label htmlFor="isPrivate">{t("fields.isPrivate")}</label>
              </div>
            </div>
            {errors.companyOrPrivate && (
              <p className="text-red-500 text-sm mt-1">{errors.companyOrPrivate}</p>
            )}
          </div>

          {/* ── Name ── */}
          <div>
            <label className="block text-base font-medium mb-1">
              {t("fields.name")}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
          </div>

          {/* ── Email / Phone ── */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium mb-1">
                {t("fields.email")}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">
                {t("fields.phone")}
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* ═══ 2. ORIGIN & DESTINATION ═══ */}

          {/* ── Origin Country ── */}
          <div>
            <label className="block text-base font-medium mb-1">
              {t("fields.originCountry")}
            </label>
            <CountryPicker
              value={form.originCountry}
              onChange={(country, code) =>
                setForm((prev) => ({ ...prev, originCountry: country, originCountryCode: code, originOther: "" }))
              }
              pinned={sendCountries}
              placeholder={t("placeholders.searchOrigin")}
              required
              name="originCountry"
            />
          </div>

          {/* ── Origin details ── */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="originCity"
              placeholder={t("fields.city")}
              value={form.originCity}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
            <input
              type="text"
              name="originZip"
              placeholder={t("fields.zip")}
              value={form.originZip}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
            <input
              type="text"
              name="originAddress"
              placeholder={t("fields.address")}
              value={form.originAddress}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
          </div>

          {/* ── Destination Country ── */}
          <div>
            <label className="block text-base font-medium mb-1">
              {t("fields.destinationCountry")}
            </label>
            <CountryPicker
              value={form.destinationCountry}
              onChange={(country, code) =>
                setForm((prev) => ({ ...prev, destinationCountry: country, destinationCountryCode: code, destinationOther: "" }))
              }
              pinned={receiveCountries}
              placeholder={t("placeholders.searchDestination")}
              required
              name="destinationCountry"
            />
          </div>

          {/* ── Destination details ── */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="destinationCity"
              placeholder={t("fields.city")}
              value={form.destinationCity}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
            <input
              type="text"
              name="destinationZip"
              placeholder={t("fields.zip")}
              value={form.destinationZip}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
            <input
              type="text"
              name="destinationAddress"
              placeholder={t("fields.address")}
              value={form.destinationAddress}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
          </div>

          <hr className="border-gray-200" />

          {/* ═══ 3. SHIPMENT TYPE & GOODS DETAILS ═══ */}

          {/* ── Shipment Type Visual Selector ── */}
          <div data-error="shipmentType">
            <label className="block text-lg font-semibold mb-4">
              {t("fields.shipmentQuestion")}
            </label>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 ${errors.shipmentType ? "ring-2 ring-red-500 rounded-xl p-1" : ""}`}>
              {shipmentTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectShipmentType(item.id)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer
                    ${
                      form.shipmentType === item.id
                        ? "border-brand-accent bg-brand-accent/5 text-brand-accent shadow-md"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  <div
                    className={`transition-colors ${
                      form.shipmentType === item.id ? "text-brand-accent" : "text-gray-400"
                    }`}
                  >
                    {item.svg}
                  </div>
                  <span className="text-sm font-semibold leading-tight text-center">
                    {t(`shipmentTypes.${item.id}`)}
                  </span>
                  {form.shipmentType === item.id && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-brand-accent rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
            {errors.shipmentType && (
              <p className="text-red-500 text-sm mt-1">{errors.shipmentType}</p>
            )}
          </div>

          {/* ── Details textarea with contextual hint ── */}
          <div>
            <label className="block text-base font-medium mb-1">
              {form.shipmentType
                ? `${t("fields.detailsFor")} – ${t(`shipmentTypes.${form.shipmentType}`)}`
                : t("fields.detailsGeneric")}
            </label>
            <textarea
              name="details"
              placeholder={detailsHint}
              rows={4}
              value={form.details}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            />
          </div>

          {/* ── Dangerous Goods ── */}
          <div className="flex items-center gap-3">
            <input
              id="dangerousGoods"
              type="checkbox"
              name="dangerousGoods"
              checked={form.dangerousGoods}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="dangerousGoods">{t("fields.dangerousGoods")}</label>
          </div>

          {form.dangerousGoods && (
            <div>
              <label className="block text-base font-medium mb-1">
                {t("fields.goodsClass")}
              </label>
              <select
                name="goodsClass"
                value={form.goodsClass}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
              >
                <option value="">{t("select")}</option>
                {adrClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

         

          {/* ── Goods Value & Insurance ── */}
          <div data-error="goodsValue" className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium mb-1">
                {t("fields.goodsValue")}
              </label>
              <select
                name="goodsValue"
                value={form.goodsValue}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md bg-gray-100 border ${errors.goodsValue ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">{t("select")}</option>
                {goodsValueRanges.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.goodsValue && (
                <p className="text-red-500 text-sm mt-1">{errors.goodsValue}</p>
              )}
            </div>
            <div className="flex items-center mt-6">
              <input
                id="insureGoods"
                type="checkbox"
                name="insureGoods"
                checked={form.insureGoods}
                onChange={handleChange}
                className="h-5 w-5 mr-2 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
              />
              <label htmlFor="insureGoods" className="font-medium">
                {t("fields.insureGoods")}
              </label>
            </div>
          </div>

          {/* ── Consent ── */}
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              required
              className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="consent" className="text-base text-gray-700">
              {t("fields.consent")}{" "}
              <Link
                href="/privacy"
                locale={locale}
                className="underline text-brand-accent hover:text-brand-accent/80"
              >
                {t("privacyLink")}
              </Link>
            </label>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-brand-accent text-white font-semibold py-3 rounded-md hover:bg-brand-accent/90 transition disabled:opacity-50"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>

          {status === "success" && (
            <p className="text-green-500 mt-2">{t("success")}</p>
          )}
          {status === "error" && (
            <p className="text-red-500 mt-2">{t("error")}</p>
          )}
        </form>
      </div>
    </section>
  );
}
