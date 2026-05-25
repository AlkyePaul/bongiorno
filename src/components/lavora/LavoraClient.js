"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Briefcase, MapPin, Clock } from "lucide-react";
import H1 from "@/components/common/H1";
import { Link } from "@/i18n/navigation";

export default function LavoraClient() {
  const t = useTranslations("jobs");
  const locale = useLocale();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState("idle");

  const positions = [];
  let i = 0;
  while (t.has(`positions.${i}.title`)) {
    positions.push({
      title: t(`positions.${i}.title`),
      location: t(`positions.${i}.location`),
      type: t(`positions.${i}.type`),
      description: t(`positions.${i}.description`),
    });
    i++;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      alert(t("form.noConsent"));
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/lavora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "candidatura", locale }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "", consent: false });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="bg-gray-50 text-gray-800 py-20 px-6 antialiased">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <H1>{t("title")}</H1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Open Positions */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-8">{t("openPositions")}</h2>
          {positions.length === 0 ? (
            <p className="text-gray-500">{t("noPositions")}</p>
          ) : (
            <div className="grid gap-6">
              {positions.map((pos, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-md p-8 border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <Briefcase className="text-brand-accent w-7 h-7 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold">{pos.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {pos.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {t(pos.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {pos.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Application Form */}
        <section className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6">{t("form.title")}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-base font-medium mb-2">
                  {t("form.name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-base font-medium mb-2">
                  {t("form.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-base font-medium mb-2">
                  {t("form.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-base font-medium mb-2">
                  {t("form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
                />
              </div>
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
                  {t("form.consent")}{" "}
                  <Link href="/privacy" className="underline text-brand-accent hover:text-brand-accent/80">
                    {t("form.privacyLink")}
                  </Link>
                </label>
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-brand-accent text-white font-medium py-3 rounded-md hover:bg-brand-accent/90 transition disabled:opacity-50"
              >
                {status === "sending"
                  ? t("form.sending")
                  : status === "success"
                    ? t("form.success")
                    : t("form.submit")}
              </button>
              {status === "error" && (
                <p className="text-red-600 text-base mt-2">{t("form.error")}</p>
              )}
              {status === "success" && (
                <p className="text-green-600 text-base mt-2">{t("form.success")}</p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
