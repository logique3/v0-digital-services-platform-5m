// WhatsApp utility functions

export function isWhatsAppConfigured(): boolean {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  // Check if it's a valid format: should contain digits and start with +
  const isValid = number.startsWith('+') && /\d/.test(number) && !number.includes('XXXXXXXXX')
  return isValid
}

export function getWhatsAppStatusMessage(): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  
  if (!number) {
    return 'WhatsApp number not configured'
  }
  
  if (number.includes('XXXXXXXXX')) {
    return 'WhatsApp number using placeholder (+216XXXXXXXXX). Please configure NEXT_PUBLIC_WHATSAPP_NUMBER environment variable.'
  }
  
  return `WhatsApp configured: ${maskNumber(number)}`
}

function maskNumber(number: string): string {
  // Mask all but first 4 and last 2 digits
  if (number.length <= 6) return number
  return number.slice(0, 4) + '*'.repeat(number.length - 6) + number.slice(-2)
}

export function formatWhatsAppMessage(items: Array<{ name: string; quantity: number; price: number }>, total: number): string {
  const itemsList = items
    .map(item => `• ${item.name}: ${item.quantity}x ${item.price.toFixed(2)} TND = ${(item.price * item.quantity).toFixed(2)} TND`)
    .join('\n')

  return `Bonjour, je voudrais passer une commande:\n\n${itemsList}\n\nTotal: ${total.toFixed(2)} TND\n\nVerification et confirmation du paiement.`
}
