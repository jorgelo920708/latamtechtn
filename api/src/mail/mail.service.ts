import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export interface TalentLeadEmailData {
  name: string;
  company: string;
  email: string;
  role: string;
  specialty: string;
  message?: string | null;
}

export interface CandidateEmailData {
  fullName: string;
  email: string;
  phone?: string | null;
  location: string;
  linkedinUrl?: string | null;
  cvUrl?: string | null;
  mainRole?: string | null;
  otherRoles?: string | null;
  mainStack?: string | null;
  yearsExperience?: string | null;
  englishLevel: string;
  workedInternational: boolean;
  willingContractor?: boolean | null;
  jobSearchStatus?: string | null;
  desiredSalary?: number | null;
  minSalary?: number | null;
  availability?: string | null;
  message?: string | null;
}

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly resend = this.apiKey ? new Resend(this.apiKey) : null;
  private readonly from =
    process.env.MAIL_FROM ??
    'LATAM Tech Talent Network <onboarding@resend.dev>';
  private readonly adminEmail = (
    process.env.ADMIN_EMAIL ?? 'elbacaseres83@gmail.com'
  ).toLowerCase();

  async notifyNewTalentLead(lead: TalentLeadEmailData): Promise<void> {
    const rows: [string, string][] = [
      ['Empresa', lead.company],
      ['Contacto', lead.name],
      ['Email', lead.email],
      ['Rol', lead.role],
      ['Especialidad', lead.specialty],
    ];
    if (lead.message) rows.push(['Mensaje', lead.message]);

    const content =
      this.eyebrow('Nueva solicitud') +
      this.heading('Una empresa pidió talento') +
      this.paragraph(
        'Recibiste una nueva solicitud de talento desde el sitio.',
      ) +
      this.infoCard(rows) +
      this.button('Ver en el panel', this.adminUrl());

    await this.send(
      this.adminEmail,
      `Nueva solicitud de talento — ${lead.company}`,
      this.wrap('Una empresa pidió talento en LATAM Tech Talent.', content),
    );
  }

  async notifyNewCandidateApplication(c: CandidateEmailData): Promise<void> {
    const rows: [string, string][] = [
      ['Nombre', c.fullName],
      ['Email', c.email],
      ['Ubicación', c.location],
      ['Rol principal', c.mainRole ?? '—'],
      ['Inglés', c.englishLevel],
      ['Experiencia', c.yearsExperience ?? '—'],
      ['Internacional', c.workedInternational ? 'Sí' : 'No'],
    ];
    if (c.mainStack) rows.push(['Stack', c.mainStack]);
    if (c.otherRoles) rows.push(['Otros roles', c.otherRoles]);
    if (c.desiredSalary != null)
      rows.push(['Salario deseado', `$${c.desiredSalary} USD`]);
    if (c.minSalary != null) rows.push(['Salario mínimo', `$${c.minSalary} USD`]);
    if (c.availability) rows.push(['Disponibilidad', c.availability]);
    if (c.willingContractor != null)
      rows.push(['Contractor intl.', c.willingContractor ? 'Sí' : 'No']);
    if (c.jobSearchStatus) rows.push(['Búsqueda', c.jobSearchStatus]);
    if (c.phone) rows.push(['Teléfono', c.phone]);
    if (c.linkedinUrl) rows.push(['LinkedIn', c.linkedinUrl]);
    if (c.cvUrl) rows.push(['CV', c.cvUrl]);
    if (c.message) rows.push(['Mensaje', c.message]);

    const content =
      this.eyebrow('Nuevo candidato') +
      this.heading('Un candidato se inscribió') +
      this.paragraph('Un nuevo candidato se sumó a la red desde el sitio.') +
      this.infoCard(rows) +
      this.button('Ver en el panel', this.adminUrl());

    await this.send(
      this.adminEmail,
      `Nuevo candidato — ${c.fullName}`,
      this.wrap('Un candidato se inscribió en LATAM Tech Talent.', content),
    );
  }

  async notifyNewContactRequest(c: ContactEmailData): Promise<void> {
    const content =
      this.eyebrow('Nuevo contacto') +
      this.heading('Te escribieron desde el sitio') +
      this.paragraph('Recibiste un nuevo mensaje de contacto.') +
      this.infoCard([
        ['Nombre', c.name],
        ['Email', c.email],
        ['Mensaje', c.message],
      ]) +
      this.button('Ver en el panel', this.adminUrl());

    await this.send(
      this.adminEmail,
      `Nuevo contacto — ${c.name}`,
      this.wrap('Te escribieron desde LATAM Tech Talent.', content),
    );
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const content =
      this.eyebrow('Seguridad') +
      this.heading('Restablecer tu contraseña') +
      this.paragraph(
        'Recibimos una solicitud para cambiar la contraseña de tu panel. Hacé click en el botón para elegir una nueva. El enlace vence en 1 hora.',
      ) +
      this.button('Cambiar contraseña', resetUrl) +
      this.paragraph(
        'Si no fuiste vos, ignorá este correo — tu contraseña no cambia hasta que uses el enlace.',
      );

    await this.send(
      to,
      'Restablecer tu contraseña — LATAM Tech Talent',
      this.wrap('Enlace para restablecer tu contraseña.', content),
    );
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `RESEND_API_KEY ausente — email "${subject}" no enviado`,
      );
      return;
    }
    try {
      await this.resend.emails.send({ from: this.from, to, subject, html });
    } catch (error) {
      this.logger.error(
        `Error enviando "${subject}": ${(error as Error).message}`,
      );
    }
  }

  private adminUrl(): string {
    return process.env.ADMIN_URL ?? 'https://www.latamtechtn.com/admin/login';
  }

  private wrap(preheader: string, content: string): string {
    return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta name="color-scheme" content="light"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f1f5f9;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding-bottom:20px;">
          <span style="font-size:20px;font-weight:800;letter-spacing:0.06em;color:#0f172a;">LATAM</span>
          <span style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#64748b;display:block;margin-top:2px;">Tech Talent Network</span>
        </td></tr>
      </table>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr><td style="padding:36px 36px 30px;">${content}</td></tr>
      </table>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding:24px;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">© ${new Date().getFullYear()} LATAM Tech Talent Network</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  }

  private eyebrow(text: string): string {
    return `<p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:0.12em;">${this.escapeHtml(text)}</p>`;
  }

  private heading(text: string): string {
    return `<h1 style="margin:0 0 12px;font-size:23px;font-weight:800;color:#0f172a;line-height:1.2;letter-spacing:-0.02em;">${this.escapeHtml(text)}</h1>`;
  }

  private paragraph(text: string): string {
    return `<p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">${this.escapeHtml(text)}</p>`;
  }

  private button(label: string, href: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 6px;"><tr><td style="border-radius:12px;background:#15295c;">
      <a href="${href}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">${this.escapeHtml(label)}</a>
    </td></tr></table>`;
  }

  private infoCard(rows: [string, string][]): string {
    const body = rows
      .map(
        ([label, value], i) => `
        <tr>
          <td style="padding:${i === 0 ? '0' : '12px'} 0 0;width:120px;vertical-align:top;font-size:11px;font-weight:600;color:#64748b;letter-spacing:0.06em;text-transform:uppercase;">${this.escapeHtml(label)}</td>
          <td style="padding:${i === 0 ? '0' : '12px'} 0 0;font-size:14px;color:#0f172a;line-height:1.5;word-break:break-word;">${this.escapeHtml(value)}</td>
        </tr>`,
      )
      .join('');
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin:20px 0;"><tr><td style="padding:20px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table></td></tr></table>`;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
