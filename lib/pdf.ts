import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'

export async function generateTicketPDF(params: {
  participantName: string
  eventTitle: string
  eventVenue: string
  eventDate: string
  packageName: string
  qrCode: string
  orderRef: string
}): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Header background
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(0.102, 0.102, 0.102),
  })

  // Brand name
  page.drawText('CaribbeOne', {
    x: 40,
    y: height - 50,
    size: 28,
    font: boldFont,
    color: rgb(0.541, 0.710, 0.655),
  })

  page.drawText("ain't nothin' like caribbean life !", {
    x: 40,
    y: height - 75,
    size: 11,
    font: regularFont,
    color: rgb(0.8, 0.8, 0.8),
  })

  page.drawText('E-BILLET', {
    x: 40,
    y: height - 100,
    size: 10,
    font: boldFont,
    color: rgb(0.541, 0.710, 0.655),
  })

  // Event info
  page.drawText(params.eventTitle, {
    x: 40,
    y: height - 160,
    size: 22,
    font: boldFont,
    color: rgb(0.102, 0.102, 0.102),
  })

  page.drawText(params.eventVenue, {
    x: 40,
    y: height - 190,
    size: 13,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  page.drawText(params.eventDate, {
    x: 40,
    y: height - 210,
    size: 13,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  // Separator
  page.drawLine({
    start: { x: 40, y: height - 240 },
    end: { x: width - 40, y: height - 240 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  })

  // Participant
  page.drawText('PARTICIPANT', {
    x: 40,
    y: height - 270,
    size: 10,
    font: boldFont,
    color: rgb(0.541, 0.710, 0.655),
  })
  page.drawText(params.participantName, {
    x: 40,
    y: height - 290,
    size: 16,
    font: boldFont,
    color: rgb(0.102, 0.102, 0.102),
  })

  // Package
  page.drawText('PACK', {
    x: 40,
    y: height - 330,
    size: 10,
    font: boldFont,
    color: rgb(0.541, 0.710, 0.655),
  })
  page.drawText(params.packageName, {
    x: 40,
    y: height - 350,
    size: 14,
    font: regularFont,
    color: rgb(0.102, 0.102, 0.102),
  })

  // QR Code
  const qrDataUrl = await QRCode.toDataURL(params.qrCode, {
    width: 200,
    margin: 1,
    color: { dark: '#1a1a1a', light: '#ffffff' },
  })
  const qrBase64 = qrDataUrl.split(',')[1]
  const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, 'base64'))

  page.drawImage(qrImage, {
    x: width - 220,
    y: height - 420,
    width: 180,
    height: 180,
  })

  page.drawText('Scanner à l\'entrée', {
    x: width - 220,
    y: height - 440,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Ref
  page.drawText(`Réf: ${params.orderRef}`, {
    x: 40,
    y: 40,
    size: 9,
    font: regularFont,
    color: rgb(0.6, 0.6, 0.6),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
