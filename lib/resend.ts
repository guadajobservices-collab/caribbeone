let _resend: import('resend').Resend | null = null

export function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) return null
    const { Resend } = require('resend')
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export async function sendConfirmationEmail(params: {
  to: string
  firstName: string
  eventTitle: string
  orderRef: string
  pdfUrls: string[]
}) {
  const resend = getResend()
  if (!resend) {
    console.warn('Resend not configured, skipping email')
    return
  }
  await resend.emails.send({
    from: 'CaribbeOne <billets@caribbeone.com>',
    to: params.to,
    subject: `✅ Votre réservation - ${params.eventTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8ab5a7;">Réservation confirmée !</h1>
        <p>Bonjour ${params.firstName},</p>
        <p>Votre réservation pour <strong>${params.eventTitle}</strong> est confirmée.</p>
        <p>Référence : <code>${params.orderRef}</code></p>
        <p>Vos e-billets sont disponibles dans votre espace client.</p>
        <p style="color: #666; font-size: 12px;">ain't nothin' like caribbean life !</p>
      </div>
    `,
  })
}
