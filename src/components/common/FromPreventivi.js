"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function QuoteForm() {
  const t = useTranslations("quote");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    origin: "",
    transportType: "",
    dangerousGoods: false,
    details: "",
    consent: false,
  });

  const [status, setStatus] = useState("idle"); // idle | sending | success | error

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
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({
          name: "",
          email: "",
          phone: "",
          destination: "",
          origin: "",
          transportType: "",
          dangerousGoods: false,
          details: "",
          consent: false,
        });
        setStatus("success");
      } else throw new Error();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const destinations = [
    "Tunisia",
    "Algeria",
    "Marocco",
    "Libia",
    "Mauritania",
    t("other")
  ];
  const origins = [
    "Italia",
    "Francia",
    "Spagna",
    "Germania",
    "Polonia",
    "Repubblica Ceca",
    t("other")
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[40%_60%] max-w-6xl mx-auto rounded-2xl bg-gray-50 dark:bg-gray-900 py-20 mb-20 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          {t("subtitle")}
        </p>
        </div>
      <div className="container mx-auto px-6 max-w-4xl">

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-950 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* 🧍 Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("fields.name")}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* 📧 Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("fields.email")}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* 📞 Phone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("fields.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* 🌍 Destination */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("fields.destination")}
            </label>
            <select
              name="destination"
              value={form.destination}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">{t("select")}</option>
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 🏭 Origin */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("fields.origin")}
            </label>
            <select
              name="origin"
              value={form.origin}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">{t("select")}</option>
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* 🚛 Transport Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("fields.transportType")}
            </label>
            <input
              type="text"
              name="transportType"
              value={form.transportType}
              onChange={handleChange}
              placeholder={t("placeholders.transport")}
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* ☣️ Dangerous Goods */}
          <div className="flex items-center gap-3">
            <input
              id="dangerousGoods"
              type="checkbox"
              name="dangerousGoods"
              checked={form.dangerousGoods}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-700 text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="dangerousGoods" className="text-sm text-gray-700 dark:text-gray-300">
              {t("fields.dangerousGoods")}
            </label>
          </div>

          {/* 📦 Details */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("fields.details")}
            </label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder={t("placeholders.details")}
              rows={4}
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            ></textarea>
          </div>

          {/* ✅ Consent */}
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
            <label htmlFor="consent" className="text-sm text-gray-700 dark:text-gray-300">
              {t("fields.consent")}{" "}
              <a href="/privacy" className="underline text-brand-accent hover:text-brand-accent/80">
                {t("privacyLink")}
              </a>
            </label>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-brand-accent text-white font-semibold py-3 rounded-md hover:bg-brand-accent/90 transition disabled:opacity-50"
            >
              {status === "sending" ? t("sending") : t("submit")}
            </button>
          </div>

          {/* Feedback messages */}
          {status === "success" && (
            <div className="text-green-600 dark:text-green-400 text-sm">
              ✅ {t("success")}
            </div>
          )}
          {status === "error" && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              ❌ {t("error")}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
