"use client";
import { useMessages } from 'next-intl';
import Hero from "@/components/homepage/Hero";
import Intro from "@/components/homepage/Intro";
import H2 from "@/components/common/H2";
import DestinationCards from "@/components/common/DestinationCards";
import ServicesSection from "@/components/homepage/Services";
import { Package, Truck, Landmark, ShieldCheck } from "lucide-react";
import HomepageContent from '@/components/homepage/Content';
import QualitySection from '@/components/homepage/QualitySection';
import SediSection from '@/components/homepage/Sedi';
import FromPreventivi from '@/components/common/QuoteForm';

export default function HomePage() {
  const messages = useMessages();
  const home = messages?.home || {};
    const quote = messages?.quote || {};
  

  const title = home?.hero?.title || '';
  const subtitle = home?.hero?.subtitle || '';
  const claim = home?.hero?.claim || '';

  const intro = Array.isArray(home?.intro) ? home.intro : [];
  const introText = intro.map((text, i) => (
    <p key={i} className="mb-4">{text}</p>
  ));

  const destinations = home?.destinations?.items || [];

  const serviceItems = Array.isArray(home?.services?.items) ? home.services.items : [];
  const iconSet = [
    <Package key="i0" size={32} />, 
    <Landmark key="i1" size={32} />, 
    <Truck key="i2" size={32} />, 
    <ShieldCheck key="i3" size={32} />
  ];
  const services = serviceItems.map((s, i) => ({
    title: s?.title || '',
    text: s?.description || '',
    icon: iconSet[i % iconSet.length]
  }));

  const ctas = home?.hero?.ctas || [];
  

  return (
    <main>
      <Hero title={title} subtitle={subtitle} ctas={ctas} claim={claim} />
      
      <section className=" px-4 lg:px-0 max-w-4xl mx-auto py-12">
        <Intro>{introText}</Intro>
      </section>
         <section className=" px-4 lg:px-0 max-w-4xl mx-auto py-12">
  <H2>{home?.destinations?.title || ''}</H2>
      <DestinationCards items={destinations} />
      </section>

      <section className="mx-auto lg:bg-[linear-gradient(to_right,_white_55%,_#f3f4f6_55%)] py-20">
        <ServicesSection/>
      </section>
           <section className="mx-auto lg:bg-[linear-gradient(to_left,_white_55%,_#f3f4f6_55%)] py-20">
        <HomepageContent/>
      </section>
      <section className="mx-auto">
        <QualitySection/>
      </section>
      <section className="mx-auto">
        <SediSection/>
      </section>
       <section id="preventivi" className="grid grid-cols-1 lg:grid-cols-[40%_60%] max-w-6xl mx-auto rounded-2xl bg-gray-50 dark:bg-gray-900 md:py-20 py-12 px-4">
      <div className="mx-auto lg:px-24 lg:py-4 px-4">
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {quote.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          {quote.subtitle}
        </p>
      
        </div>
        <FromPreventivi/>
      </section>
    </main>
  );
}
