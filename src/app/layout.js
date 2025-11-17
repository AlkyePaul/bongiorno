import "./globals.css";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { routing } from "../i18n/routing";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bongiorno Srl",
  description: "Spedizioni internazionali",
};



export default function RootLayout({ children, params }) {
  const lang = params?.locale || routing.defaultLocale || 'it';
  return (
    <html lang={lang}>
          <body className={`${geistSans.variable} ${outfitSans.variable} max-w-screen overflow-x-hidden  antialiased`}>
    
        {children}
      </body>
    </html>
  );
}
