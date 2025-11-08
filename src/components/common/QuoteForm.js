"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {Link} from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function QuoteForm() {
  const t = useTranslations("quote");
  const locale = useLocale();

  const [form, setForm] = useState({
    companyName: "",
    isPrivate: false,
    name: "",
    email: "",
    phone: "",
    originCountry: "",
    originOther: "",
    originCity: "",
    originZip: "",
    originAddress: "",
    destinationCountry: "",
    destinationOther: "",
    dangerousGoods: false,
    goodsClass: "",
    estimatedWeight: "",
    estimatedVolume: "",
    details: "",
    consent: false,
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        companyName: "",
        isPrivate: false,
        name: "",
        email: "",
        phone: "",
        originCountry: "",
        originOther: "",
        originCity: "",
        originZip: "",
        originAddress: "",
        destinationCountry: "",
        destinationOther: "",
        dangerousGoods: false,
        goodsClass: "",
        estimatedWeight: "",
        estimatedVolume: "",
        details: "",
        consent: false,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const sendCountries = [
    "Italia",
    "Francia",
    "Spagna",
    "Germania",
    "Polonia",
    "Repubblica Ceca",
    t("other"),
  ];

    const receiveCountries = [
    "Tunisia",
    "Algeria",
    "Marocco",
    "Libia",
    "Mauritania",
    t("other"),
  ];

  const adrClasses = [
    "Classe 1 – Esplosivi",
    "Classe 2 – Gas",
    "Classe 3 – Liquidi infiammabili",
    "Classe 4 – Solidi infiammabili",
    "Classe 5 – Sostanze comburenti e perossidi organici",
    "Classe 6 – Tossiche e infettive",
    "Classe 7 – Radioattive",
    "Classe 8 – Corrosive",
    "Classe 9 – Varie sostanze pericolose",
  ];

  return (
    <section id={t("id")}>
      <div className="mx-auto md:px-6 max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-gray-950 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          {/* 🏢 Azienda o privato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium mb-1">{t("fields.companyName")}</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder={t("placeholders.company")}
                className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="flex items-center mt-6">
              <input
                id="isPrivate"
                type="checkbox"
                name="isPrivate"
                checked={form.isPrivate}
                onChange={handleChange}
                className="h-5 w-5 mr-2 rounded border-gray-300 dark:border-gray-700 text-brand-accent focus:ring-brand-accent"
              />
              <label htmlFor="isPrivate">{t("fields.isPrivate")}</label>
            </div>
          </div>

          {/* 📛 Nome */}
          <div>
            <label className="block text-base font-medium mb-1">{t("fields.name")}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* 📧 Email / ☎️ Telefono */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium mb-1">{t("fields.email")}</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">{t("fields.phone")}</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          {/* 🌍 Paese di partenza */}
          <div>
            <label className="block text-base font-medium mb-1">{t("fields.originCountry")}</label>
            <select
              name="originCountry"
              value={form.originCountry}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            >
              <option value="">{t("select")}</option>
              {sendCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {form.originCountry === t("other") && (
              <input
                type="text"
                name="originOther"
                placeholder={t("placeholders.otherCountry")}
                value={form.originOther}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              />
            )}
          </div>

          {/* 📍 Extra info partenza */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="originCity"
              placeholder={t("fields.city")}
              value={form.originCity}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              name="originZip"
              placeholder={t("fields.zip")}
              value={form.originZip}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              name="originAddress"
              placeholder={t("fields.address")}
              value={form.originAddress}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* 🎯 Paese di destinazione */}
          <div>
            <label className="block text-base font-medium mb-1">{t("fields.destinationCountry")}</label>
            <select
              name="destinationCountry"
              value={form.destinationCountry}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            >
              <option value="">{t("select")}</option>
              {receiveCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {form.destinationCountry === t("other") && (
              <input
                type="text"
                name="destinationOther"
                placeholder={t("placeholders.otherCountry")}
                value={form.destinationOther}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              />
            )}
          </div>

          {/* ☣️ Merci pericolose */}
          <div className="flex items-center gap-3">
            <input
              id="dangerousGoods"
              type="checkbox"
              name="dangerousGoods"
              checked={form.dangerousGoods}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-700 text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="dangerousGoods">{t("fields.dangerousGoods")}</label>
          </div>

          {form.dangerousGoods && (
            <div>
              <label className="block text-base font-medium mb-1">{t("fields.goodsClass")}</label>
              <select
                name="goodsClass"
                value={form.goodsClass}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              >
                <option value="">{t("select")}</option>
                {adrClasses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* ⚖️ Info opzionali */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="estimatedWeight"
              placeholder={t("fields.estimatedWeight")}
              value={form.estimatedWeight}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              name="estimatedVolume"
              placeholder={t("fields.estimatedVolume")}
              value={form.estimatedVolume}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* 📝 Messaggio */}
          <div>
            <textarea
              name="details"
              placeholder={t("placeholders.details")}
              rows={4}
              value={form.details}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            ></textarea>
          </div>

          {/* ✅ Consenso */}
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              required
              className="mt-1 h-5 w-5 rounded border-gray-300 dark:border-gray-700 text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="consent" className="text-base text-gray-700 dark:text-gray-300">
              {t("fields.consent")}{" "}
              <Link href="/privacy" locale={locale} className="underline text-brand-accent hover:text-brand-accent/80">
                {t("privacyLink")}
              </Link>
            </label>
          </div>

          {/* Submit */}
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
