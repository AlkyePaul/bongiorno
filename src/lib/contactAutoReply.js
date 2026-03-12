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

const PRIVACY_LINK = `<a href="http://www.bongiornosrl.com/privacy" style="color: #1a3c6e;">www.bongiornosrl.com/privacy</a>`;

const PRIVACY_FOOTERS = {
  it: `Le informazioni contenute in questo messaggio sono riservate e ad uso esclusivo del destinatario. La diffusione, distribuzione e/o la copiatura del documento trasmesso da parte di qualsiasi soggetto diverso dal destinatario è proibita, sia ai sensi dell'art. 616 c.p., sia ai sensi del D.Lgs. 196/2003 e ss.mm.ii. (D.Lgs. 101/2018) e del Regolamento Europeo 679/2016 (GDPR). Nell'eventualità che questo messaggio Le fosse pervenuto per errore, La invitiamo ad eliminarlo senza copiarlo e a non inoltrarlo a terzi, dandocene gentilmente comunicazione. Grazie. Protezione dei dati personali: La informiamo che il suo indirizzo è stato incluso nella banca dati della Bongiorno srl e viene utilizzato per fini istituzionali. Attraverso il seguente link (${PRIVACY_LINK}), è possibile prendere visione dell'informativa resa dal nostro sito web istituzionale, la stessa contiene i dati di contatto del Titolare del trattamento e del Responsabile della Protezione dei Dati (RPD/DPO), nonché le modalità attraverso le quali vengono trattati i Suoi dati e le altre informazioni utili.`,

  en: `The information contained in this message is confidential and intended exclusively for the recipient. The dissemination, distribution and/or copying of this document by anyone other than the intended recipient is prohibited, in accordance with art. 616 of the Italian Criminal Code, Legislative Decree 196/2003 and subsequent amendments (Legislative Decree 101/2018) and European Regulation 679/2016 (GDPR). If you have received this message in error, please delete it without copying it and do not forward it to third parties, kindly notifying us. Thank you. Personal data protection: We inform you that your address has been included in the database of Bongiorno srl and is used for institutional purposes. Through the following link (${PRIVACY_LINK}), you can view the privacy policy published on our institutional website, which contains the contact details of the Data Controller and the Data Protection Officer (DPO), as well as the methods through which your data is processed and other useful information.`,

  es: `La información contenida en este mensaje es confidencial y de uso exclusivo del destinatario. La difusión, distribución y/o copia del documento transmitido por cualquier persona distinta del destinatario está prohibida, tanto en virtud del art. 616 del Código Penal italiano, como del D.Lgs. 196/2003 y sus modificaciones (D.Lgs. 101/2018) y del Reglamento Europeo 679/2016 (RGPD). En caso de haber recibido este mensaje por error, le rogamos que lo elimine sin copiarlo y que no lo reenvíe a terceros, comunicándonoslo amablemente. Gracias. Protección de datos personales: Le informamos de que su dirección ha sido incluida en la base de datos de Bongiorno srl y se utiliza con fines institucionales. A través del siguiente enlace (${PRIVACY_LINK}), puede consultar la política de privacidad publicada en nuestro sitio web institucional, que contiene los datos de contacto del Responsable del tratamiento y del Delegado de Protección de Datos (DPD/DPO), así como las modalidades de tratamiento de sus datos y demás información útil.`,

  fr: `Les informations contenues dans ce message sont confidentielles et réservées à l'usage exclusif du destinataire. La diffusion, la distribution et/ou la copie du document transmis par toute personne autre que le destinataire sont interdites, conformément à l'art. 616 du Code pénal italien, au D.Lgs. 196/2003 et ses modifications (D.Lgs. 101/2018) et au Règlement Européen 679/2016 (RGPD). Si vous avez reçu ce message par erreur, nous vous prions de le supprimer sans le copier et de ne pas le transmettre à des tiers, en nous en informant aimablement. Merci. Protection des données personnelles : Nous vous informons que votre adresse a été incluse dans la base de données de Bongiorno srl et est utilisée à des fins institutionnelles. Via le lien suivant (${PRIVACY_LINK}), vous pouvez consulter la politique de confidentialité publiée sur notre site web institutionnel, qui contient les coordonnées du Responsable du traitement et du Délégué à la Protection des Données (DPD/DPO), ainsi que les modalités de traitement de vos données et autres informations utiles.`,

  ca: `La informació continguda en aquest missatge és confidencial i d'ús exclusiu del destinatari. La difusió, distribució i/o còpia del document transmès per qualsevol persona diferent del destinatari està prohibida, tant en virtut de l'art. 616 del Codi Penal italià, com del D.Lgs. 196/2003 i les seves modificacions (D.Lgs. 101/2018) i del Reglament Europeu 679/2016 (RGPD). En cas d'haver rebut aquest missatge per error, li preguem que l'elimini sense copiar-lo i que no el reenviï a tercers, comunicant-nos-ho amablement. Gràcies. Protecció de dades personals: L'informem que la seva adreça ha estat inclosa a la base de dades de Bongiorno srl i s'utilitza amb fins institucionals. A través del següent enllaç (${PRIVACY_LINK}), pot consultar la política de privacitat publicada al nostre lloc web institucional, que conté les dades de contacte del Responsable del tractament i del Delegat de Protecció de Dades (DPD/DPO), així com les modalitats de tractament de les seves dades i altra informació útil.`,
};

function wrapEmail(bodyContent, locale = "it") {
  const footer = PRIVACY_FOOTERS[locale] || PRIVACY_FOOTERS.en;
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
      <div style="margin: 0 auto; text-align: center;">
        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 10px;">
              <img src="${LOGO_URL}" alt="Bongiorno Trasporti" width="100" style="display: block; max-width: 200px; height: auto;" />
            </td>
          </tr>
        </table>
      </div>
      <p style="font-size: 11px; color: #999; line-height: 1.5;">
        ${footer}
      </p>
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
      `, "it"),
    },
    preventivo: {
      subject: (name) => `Richiesta di preventivo ricevuta ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Grazie per la sua richiesta, ${name}!</h2>
          <p>Abbiamo ricevuto la sua richiesta di preventivo con tutti i dettagli della spedizione.</p>
          <p>Il nostro team la analizzerà e le invierà un preventivo personalizzato il prima possibile.</p>
          <p>Nel frattempo, non esiti a contattarci per qualsiasi necessità.</p>
      `, "it"),
    },
  },

  en: {
    generale: {
      subject: (name) => `Thank you for contacting us ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Thank you for contacting us, ${name}!</h2>
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          <p>In the meantime, please don't hesitate to reach out if you need anything.</p>
      `, "en"),
    },
    preventivo: {
      subject: (name) => `Quote request received - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Thank you for your request, ${name}!</h2>
          <p>We have received your quote request along with all the shipment details.</p>
          <p>Our team will review it and send you a personalized quote as soon as possible.</p>
          <p>In the meantime, please don't hesitate to reach out if you need anything.</p>
      `, "en"),
    },
  },

  es: {
    generale: {
      subject: (name) => `Gracias por contactarnos ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gracias por contactarnos, ${name}!</h2>
          <p>Hemos recibido su mensaje y nuestro equipo se pondrá en contacto con usted lo antes posible.</p>
          <p>Mientras tanto, no dude en contactarnos para cualquier necesidad.</p>
      `, "es"),
    },
    preventivo: {
      subject: (name) => `Solicitud de presupuesto recibida ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gracias por su solicitud, ${name}!</h2>
          <p>Hemos recibido su solicitud de presupuesto con todos los detalles del envío.</p>
          <p>Nuestro equipo la analizará y le enviará un presupuesto personalizado lo antes posible.</p>
          <p>Mientras tanto, no dude en contactarnos para cualquier necesidad.</p>
      `, "es"),
    },
  },

  fr: {
    generale: {
      subject: (name) => `Merci de nous avoir contactés ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Merci de nous avoir contactés, ${name} !</h2>
          <p>Nous avons bien reçu votre message et notre équipe vous répondra dans les plus brefs délais.</p>
          <p>En attendant, n'hésitez pas à nous contacter pour toute question.</p>
      `, "fr"),
    },
    preventivo: {
      subject: (name) => `Demande de devis reçue ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Merci pour votre demande, ${name} !</h2>
          <p>Nous avons bien reçu votre demande de devis avec tous les détails de l'expédition.</p>
          <p>Notre équipe l'analysera et vous enverra un devis personnalisé dans les plus brefs délais.</p>
          <p>En attendant, n'hésitez pas à nous contacter pour toute question.</p>
      `, "fr"),
    },
  },

  ca: {
    generale: {
      subject: (name) => `Gràcies per contactar-nos ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gràcies per contactar-nos, ${name}!</h2>
          <p>Hem rebut el seu missatge i el nostre equip es posarà en contacte amb vostè el més aviat possible.</p>
          <p>Mentrestant, no dubti en contactar-nos per a qualsevol necessitat.</p>
      `, "ca"),
    },
    preventivo: {
      subject: (name) => `Gràcies per la seva sol·licitud, ${name} - Bongiorno`,
      body: (name) => wrapEmail(`
          <h2 style="color: #1a3c6e;">Gràcies per la seva sol·licitud, ${name}!</h2>
          <p>Hem rebut la seva sol·licitud de pressupost amb tots els detalls de l'enviament.</p>
          <p>El nostre equip l'analitzarà i li enviarà un pressupost personalitzat el més aviat possible.</p>
          <p>Mentrestant, no dubti en contactar-nos per a qualsevol necessitat.</p>
      `, "ca"),
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
