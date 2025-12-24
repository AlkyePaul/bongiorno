"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, MapPin } from "lucide-react";
import H1 from "@/components/common/H1";
import { Link } from "@/i18n/navigation";

export default function ContattiClient() {
  const t = useTranslations("contact");
  const f = useTranslations("quote");
  const locale = useLocale();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

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
      alert(t("errors.noConsent"));
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "generale", locale }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", message: "", consent: false });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="bg-gray-50 text-gray-800 py-20 px-6 antialiased">
      <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-16 items-start">
        {/* Left: Contact Info */}
        <div className="space-y-8">
          <H1>{t("title")}</H1>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-brand-accent w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold">{t("address.label")}</h3>
                <p>{t("address.value")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="text-brand-accent w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold">{t("email.label")}</h3>
                <Link href="mailto:bongiorno@bongiornosrl.com" className="text-brand-accent hover:underline">
                  {t("email.value")}
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-brand-accent w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold">{t("phone.label")}</h3>
                <Link href="tel:+390331776334" className="text-brand-accent hover:underline">
                  {t("phone.value")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
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
                {t("form.consent")} {" "}
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
              <p className="text-red-600 text-base mt-2">❌ {f("error")}</p>
            )}
            {status === "success" && (
              <p className="text-green-600 text-base mt-2">✅ {f("success")}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
