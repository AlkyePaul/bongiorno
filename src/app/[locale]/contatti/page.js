"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin } from "lucide-react";
import H1 from "@/components/common/H1";

export default function ContattiPage() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("sending");
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type: "generale" }),
    });

    if (!res.ok) throw new Error("Failed to send");
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  } catch (err) {
    console.error(err);
    setStatus("error");
  }
};


  return (
    <main className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 py-20 px-6">
      <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-start">
        {/* 🔹 Left Column: Contact Info */}
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
                <a href="mailto:bongiorno@bongiornosrl.com" className="text-brand-accent hover:underline">
                  {t("email.value")}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-brand-accent w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold">{t("phone.label")}</h3>
                <a href="tel:+390331776334" className="text-brand-accent hover:underline">
                  {t("phone.value")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Right Column: Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6">{t("form.title")}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t("form.name")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t("form.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                {t("form.message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-brand-accent text-white font-medium py-3 rounded-md hover:bg-brand-accent/90 transition"
            >
              {status === "sending"
                ? t("form.sending")
                : status === "success"
                ? t("form.success")
                : t("form.submit")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
