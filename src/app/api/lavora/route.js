import { NextResponse } from "next/server";
import { createTransporter } from "@/lib/contactAutoReply";

const FROM_ADDRESS = "noreply@bongiornotrasporti.it";
const DEST_ADDRESS = "bongiorno@bongiornosrl.com";
const LOGO_URL = "https://www.bongiornotrasporti.it/img/logo-named.png";

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
      <div style="margin: 0;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 10px;">
              <img src="${LOGO_URL}" alt="Bongiorno Trasporti" width="100" style="display: block; max-width: 200px; height: auto;" />
            </td>
          </tr>
        </table>
      </div>
    </div>
  `;
}

const AUTO_REPLY = {
  it: {
    subject: (name) => `Candidatura ricevuta, ${name} - Bongiorno`,
    body: (name) => wrapEmail(`
      <h2 style="color: #1a3c6e;">Grazie per la tua candidatura, ${name}!</h2>
      <p>Abbiamo ricevuto la tua candidatura e la valuteremo con attenzione.</p>
      <p>Ti contatteremo al più presto se il tuo profilo risulta in linea con le nostre esigenze.</p>
      <p>Nel frattempo, non esitare a contattarci per qualsiasi necessità.</p>
    `),
  },
  en: {
    subject: (name) => `Application received, ${name} - Bongiorno`,
    body: (name) => wrapEmail(`
      <h2 style="color: #1a3c6e;">Thank you for your application, ${name}!</h2>
      <p>We have received your application and will review it carefully.</p>
      <p>We will contact you as soon as possible if your profile matches our needs.</p>
      <p>In the meantime, please don't hesitate to reach out if you need anything.</p>
    `),
  },
  es: {
    subject: (name) => `Candidatura recibida, ${name} - Bongiorno`,
    body: (name) => wrapEmail(`
      <h2 style="color: #1a3c6e;">Gracias por tu candidatura, ${name}!</h2>
      <p>Hemos recibido tu candidatura y la evaluaremos con atención.</p>
      <p>Nos pondremos en contacto contigo si tu perfil se ajusta a nuestras necesidades.</p>
      <p>Mientras tanto, no dudes en contactarnos para cualquier necesidad.</p>
    `),
  },
  fr: {
    subject: (name) => `Candidature reçue, ${name} - Bongiorno`,
    body: (name) => wrapEmail(`
      <h2 style="color: #1a3c6e;">Merci pour votre candidature, ${name} !</h2>
      <p>Nous avons bien reçu votre candidature et l'examinerons avec attention.</p>
      <p>Nous vous contacterons dès que possible si votre profil correspond à nos besoins.</p>
      <p>En attendant, n'hésitez pas à nous contacter pour toute question.</p>
    `),
  },
  ca: {
    subject: (name) => `Candidatura rebuda, ${name} - Bongiorno`,
    body: (name) => wrapEmail(`
      <h2 style="color: #1a3c6e;">Gràcies per la teva candidatura, ${name}!</h2>
      <p>Hem rebut la teva candidatura i l'avaluarem amb atenció.</p>
      <p>Ens posarem en contacte amb tu si el teu perfil s'ajusta a les nostres necessitats.</p>
      <p>Mentrestant, no dubtis en contactar-nos per a qualsevol necessitat.</p>
    `),
  },
};

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, phone, message, locale } = data;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    // Send notification to bongiorno@bongiornosrl.com
    const notificationHtml = `
      <div style="font-family: monospace; font-size: 14px; color: #333;">
        <h3>[Candidatura] ${name} - ${locale || "??"}</h3>
        <hr />
        <p><strong>Nome / Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono / Phone:</strong> ${phone || "—"}</p>
        <p><strong>Messaggio / Message:</strong></p>
        <p>${message || "—"}</p>
        <hr />
        <p><em>Lingua / Locale: ${locale || "—"}</em></p>
      </div>
    `;

    const autoReplyTemplate = AUTO_REPLY[locale] || AUTO_REPLY.en;

    // Send both emails in parallel
    const emailResults = await Promise.allSettled([
      transporter.sendMail({
        from: `"Bongiorno Web" <${FROM_ADDRESS}>`,
        to: DEST_ADDRESS,
        subject: `[Candidatura] ${name} - ${locale || "??"}`,
        html: notificationHtml,
      }),
      transporter.sendMail({
        from: `"Bongiorno Trasporti" <${FROM_ADDRESS}>`,
        to: email,
        subject: autoReplyTemplate.subject(name),
        html: autoReplyTemplate.body(name),
      }),
    ]);

    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        const label = i === 0 ? "Notification" : "Auto-reply";
        console.error(`${label} email failed:`, result.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Job application form error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
