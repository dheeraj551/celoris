// Shared helper for emails sent to the Celoris support inbox.
// Same SMTP settings as the other support forms (MAIL_* env vars).
// Every value a visitor typed must go through esc() before it is put into
// the HTML, so nobody can inject links or fake content into these emails.
import nodemailer from 'nodemailer'

export const SUPPORT_INBOX = 'support@celorisdesigns.com'

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** One-line text safe for an email subject (no line breaks, capped). */
export function subjectText(value: unknown, max = 120): string {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
}

export const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/

/** Renders label/value rows (values are escaped here). Empty values are skipped. */
export function fieldRows(rows: Array<[string, unknown] | [string, unknown, { href?: string; pre?: boolean }]>): string {
  return rows
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([label, value, opts]) => {
      const safe = esc(value)
      const inner = opts?.href
        ? `<a href="${esc(opts.href)}" style="color:#059669;">${safe}</a>`
        : opts?.pre
          ? `<div style="white-space:pre-wrap;">${safe}</div>`
          : safe
      return `<tr><td style="padding:8px 12px;font-weight:bold;color:#0f766e;vertical-align:top;width:170px;">${esc(label)}</td><td style="padding:8px 12px;color:#111827;">${inner}</td></tr>`
    })
    .join('')
}

export function emailLayout(title: string, intro: string, rowsHtml: string, footer?: string): string {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f3f4f6;padding:20px;">
<div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">
<div style="background:#059669;color:#ffffff;padding:18px 22px;"><h2 style="margin:0;font-size:20px;">${esc(title)}</h2></div>
<div style="padding:20px 22px;">
<p style="margin:0 0 14px;color:#374151;">${esc(intro)}</p>
<table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;">${rowsHtml}</table>
<p style="margin:18px 0 0;font-size:12px;color:#6b7280;">${esc(footer || 'Sent automatically by celorisdesigns.com')} · ${esc(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))} IST</p>
</div></div></body></html>`
}

export async function sendSupportEmail(opts: { subject: string; html: string; replyTo?: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    // Same as the existing support forms (app/api/courses/inquiry).
    tls: { rejectUnauthorized: false },
  })
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || 'Celoris'}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: SUPPORT_INBOX,
    subject: subjectText(opts.subject, 180),
    html: opts.html,
    replyTo: opts.replyTo && EMAIL_RE.test(opts.replyTo) ? opts.replyTo : undefined,
  })
}
