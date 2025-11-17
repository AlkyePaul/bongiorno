"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LOCALES} from '@/lib/locales';


export default function NotFound() {
  const pathname = usePathname() || '/';
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  const locale = LOCALES.includes(firstSegment) ? firstSegment : 'it';

  const copy = {
    it: {
      title: 'Pagina non trovata',
      description: 'La pagina che stai cercando potrebbe essere stata spostata o non esiste.',
      cta: 'Torna alla home'
    },
    en: {
      title: 'Page not found',
      description: 'The page you are looking for may have been moved or does not exist.',
      cta: 'Back to home'
    },
    es: {
      title: 'Página no encontrada',
      description: 'Es posible que la página que buscas haya sido movida o no exista.',
      cta: 'Volver al inicio'
    },
    fr: {
      title: 'Page introuvable',
      description: "La page que vous recherchez a peut-être été déplacée ou n'existe pas.",
      cta: "Retour à l'accueil"
    }
  };

  const t = copy[locale] || copy.it;

  return (
<>

<main style={{minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
      <div style={{textAlign: 'center', maxWidth: 640}}>
        <h1 style={{fontSize: '2rem', marginBottom: '0.75rem'}}>{t.title}</h1>
        <p style={{marginBottom: '1.5rem', color: '#555'}}>{t.description}</p>
        <Link href={`/${locale}`} className="btn">
          {t.cta}
        </Link>
      </div>
    </main>
    </>
  );
}
