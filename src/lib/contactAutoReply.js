import nodemailer from "nodemailer";

const FROM_ADDRESS = "noreply@bongiornotrasporti.it";
const STORAGE_ADDRESS = "noreply@bongiornotrasporti.it";
const LOGO_URL = "https://www.bongiornotrasporti.it/img/logo-named.png";

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const PRIVACY_FOOTER = `Le informazioni contenute in questo messaggio, sono riservate e ad uso esclusivo del destinatario. La diffusione, distribuzione e/o la copiatura del documento trasmesso da parte di qualsiasi soggetto diverso dal destinatario è proibita, sia ai sensi dell'art. 616 c.p., e ai sensi del D.Lgs. 196/2003 e ss.mm.ii. (D.Lgs. 101/2018) e del Regolamento Europeo 679/2016 (GDPR). Nell'eventualità che questo messaggio Le fosse pervenuto per errore, La invitiamo ad eliminarlo senza copiarlo e a non inoltrarlo a terzi, dandocene gentilmente comunicazione. Grazie. Protezione dei dati personali La informiamo che il suo indirizzo è stato incluso nella banca dati della bongiorno srl, e viene utilizzato per fini istituzionali. Attraverso il seguente link (<a href="http://www.bongiornosrl.com/privacy" style="color: #1a3c6e;">www.bongiornosrl.com/privacy</a>), è possibile prendere visione dell'informativa resa dal nostro sito web istituzionale, la stessa contiene i dati di contatto del Titolare del trattamento e del Responsabile della Protezione dei Dati (RPD/DPO), nonché le modalità attraverso il quale vengono trattati i Suoi dati e le altre informazioni utili.`;

function wrapEmail(bodyContent) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      ${bodyContent}
      <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
      <p style="font-size: 14px; color: #666;">
        <strong>Bongiorno Trasporti</strong><br />
        Email: bongiorno@bongiornosrl.com<br />
        Web: www.bongiornotrasporti.it<br />
        Tel: +39 0331 776 334
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
<div style="margin: 0 auto;>
      <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 10px;">
            <img src="${LOGO_URL}" alt="Bongiorno Trasporti" width="100" style="display: block; max-width: 200px; height: auto;" />
          </td>
        </tr>
      </table>
      <p style="font-size: 11px; color: #999; line-height: 1.5;">
        ${PRIVACY_FOOTER}
      </p>
<div>
    </div>
  `;
}

const AUTO_REPLY_TEMPLATES = {
  it: {
    generale: {
      subject: (name) => `Grazie per averci contattato, ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Grazie per averci contattato, ${name}!</h2>
          <p>Abbiamo ricevuto il suo messaggio e il nostro team la contatterà il prima possibile.</p>
          <p>Nel frattempo, non esiti a contattarci per qualsiasi necessità.</p>
      `),
    },
    preventivo: {
      subject: (name) => `Richiesta di preventivo ricevuta ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Grazie per la sua richiesta, ${name}!</h2>
          <p>Abbiamo ricevuto la sua richiesta di preventivo con tutti i dettagli della spedizione.</p>
          <p>Il nostro team la analizzerà e le invierà un preventivo personalizzato il prima possibile.</p>
          <p>Nel frattempo, non esiti a contattarci per qualsiasi necessità.</p>
      `),
    },
  },

  en: {
    generale: {
      subject: (name) => `Thank you for contacting us ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Thank you for contacting us, ${name}!</h2>
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          <p>In the meantime, please don't hesitate to reach out if you need anything.</p>
      `),
    },
    preventivo: {
      subject: (name) => `Quote request received - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Thank you for your request, ${name}!</h2>
          <p>We have received your quote request along with all the shipment details.</p>
          <p>Our team will review it and send you a personalized quote as soon as possible.</p>
          <p>In the meantime, please don't hesitate to reach out if you need anything.</p>
      `),
    },
  },

  es: {
    generale: {
      subject: (name) => `Gracias por contactarnos ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gracias por contactarnos, ${name}!</h2>
          <p>Hemos recibido su mensaje y nuestro equipo se pondrá en contacto con usted lo antes posible.</p>
          <p>Mientras tanto, no dude en contactarnos para cualquier necesidad.</p>
      `),
    },
    preventivo: {
      subject: (name) => `Solicitud de presupuesto recibida ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gracias por su solicitud, ${name}!</h2>
          <p>Hemos recibido su solicitud de presupuesto con todos los detalles del envío.</p>
          <p>Nuestro equipo la analizará y le enviará un presupuesto personalizado lo antes posible.</p>
          <p>Mientras tanto, no dude en contactarnos para cualquier necesidad.</p>
      `),
    },
  },

  fr: {
    generale: {
      subject: (name) => `Merci de nous avoir contactés ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Merci de nous avoir contactés, ${name} !</h2>
          <p>Nous avons bien reçu votre message et notre équipe vous répondra dans les plus brefs délais.</p>
          <p>En attendant, n'hésitez pas à nous contacter pour toute question.</p>
      `),
    },
    preventivo: {
      subject: (name) => `Demande de devis reçue ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Merci pour votre demande, ${name} !</h2>
          <p>Nous avons bien reçu votre demande de devis avec tous les détails de l'expédition.</p>
          <p>Notre équipe l'analysera et vous enverra un devis personnalisé dans les plus brefs délais.</p>
          <p>En attendant, n'hésitez pas à nous contacter pour toute question.</p>
      `),
    },
  },

  ca: {
    generale: {
      subject: (name) => `Gràcies per contactar-nos ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gràcies per contactar-nos, ${name}!</h2>
          <p>Hem rebut el seu missatge i el nostre equip es posarà en contacte amb vostè el més aviat possible.</p>
          <p>Mentrestant, no dubti en contactar-nos per a qualsevol necessitat.</p>
      `),
    },
    preventivo: {
      subject: (name) => `Gràcies per la seva sol·licitud, ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gràcies per la seva sol·licitud, ${name}!</h2>
          <p>Hem rebut la seva sol·licitud de pressupost amb tots els detalls de l'enviament.</p>
          <p>El nostre equip l'analitzarà i li enviarà un pressupost personalitzat el més aviat possible.</p>
          <p>Mentrestant, no dubti en contactar-nos per a qualsevol necessitat.</p>
      `),
    },
  },
};

const FIELD_LABELS = {
  name: "Nome / Name",
  email: "Email",
  phone: "Telefono / Phone",
  companyName: "Azienda / Company",
  isPrivate: "Privato / Private",
  originCountry: "Paese di partenza / Origin country",
  originOther: "Altro paese di partenza / Other origin",
  originCity: "Città di partenza / Origin city",
  originZip: "CAP partenza / Origin ZIP",
  originAddress: "Indirizzo partenza / Origin address",
  destinationCountry: "Paese di destinazione / Destination country",
  destinationOther: "Altro paese destinazione / Other destination",
  dangerousGoods: "Merci pericolose / Dangerous goods",
  goodsClass: "Classe ADR / ADR class",
  estimatedWeight: "Peso stimato / Estimated weight",
  estimatedVolume: "Volume stimato / Estimated volume",
  details: "Dettagli / Details",
  message: "Messaggio / Message",
};

const EXCLUDED_FIELDS = ["consent", "type", "locale", "source", "date", "time"];

function formatStorageBody(data) {
  const lines = [];
  for (const [key, value] of Object.entries(data)) {
    if (EXCLUDED_FIELDS.includes(key)) continue;
    if (value === undefined || value === null || value === "") continue;
    const label = FIELD_LABELS[key] || key;
    lines.push(`<strong>${label}:</strong> ${value}`);
  }
  return `
    <div style="font-family: monospace; font-size: 14px; color: #333;">
      <h3>Dati ricevuti / Data received</h3>
      <p>Tipo: ${data.type === "preventivo" ? "Preventivo / Quote" : "Contatto / Contact"}</p>
      <p>Lingua / Locale: ${data.locale || "—"}</p>
      <hr />
      ${lines.map((l) => `<p>${l}</p>`).join("\n")}
    </div>
  `;
}

export async function sendAutoReply({ type, locale, name, email }) {
  const templates = AUTO_REPLY_TEMPLATES[locale] || AUTO_REPLY_TEMPLATES.en;
  const template = templates[type] || templates.generale;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Bongiorno Trasporti" <${FROM_ADDRESS}>`,
    to: email,
    subject: template.subject(name),
    html: template.body(name),
  });
}

export async function sendStorageCopy(data) {
  const { type, name, locale } = data;
  const tag = type === "preventivo" ? "Preventivo" : "Contatto";
  const subject = `[${tag}] ${name} - ${locale || "??"}`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Bongiorno Web" <${FROM_ADDRESS}>`,
    to: STORAGE_ADDRESS,
    subject,
    html: formatStorageBody(data),
  });
}
