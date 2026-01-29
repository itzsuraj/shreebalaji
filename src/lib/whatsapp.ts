// Helper utilities for WhatsApp Cloud API integration (B2B enquiries chatbot)
// NOTE: You must configure the following environment variables in your deployment:
// - WHATSAPP_CLOUD_API_TOKEN: Permanent access token from Meta
// - WHATSAPP_CLOUD_PHONE_NUMBER_ID: Phone number ID from Meta Business
// - WHATSAPP_VERIFY_TOKEN: Arbitrary string used when setting up the webhook
//
// The webhook endpoint is implemented in `src/app/api/whatsapp/webhook/route.ts`.

const WHATSAPP_API_BASE = 'https://graph.facebook.com/v20.0';

export async function sendWhatsAppTextMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error('[WhatsApp] Missing WHATSAPP_CLOUD_API_TOKEN or WHATSAPP_CLOUD_PHONE_NUMBER_ID');
    return;
  }

  try {
    const res = await fetch(`${WHATSAPP_API_BASE}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: text,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[WhatsApp] Failed to send message', res.status, body);
    }
  } catch (err) {
    console.error('[WhatsApp] Error sending message', err);
  }
}

// Very simple enquiry-focused chatbot logic.
// You can expand this later or plug in a real AI backend.
export function getWhatsAppBotReply(message: string): string {
  const q = message.trim().toLowerCase();

  if (!q) {
    return 'Namaste! 👋 This is Shree Balaji Enterprises WhatsApp assistant.\n\nYou can ask about:\n• Product details (buttons, zippers, elastic, cords)\n• Pricing & MOQ for bulk orders\n• Delivery time & shipping\n• Customisation options\n\nHow can we help you today?';
  }

  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('moq') || q.includes('minimum')) {
    return 'For B2B pricing we quote based on product and quantity.\n\nPlease reply with:\n1) Product type (button/zipper/elastic/cord)\n2) Approx quantity (e.g. 5,000 pcs)\n3) City / state\n\nWe will reply with indicative pricing and next steps.';
  }

  if (q.includes('button') || q.includes('buttons')) {
    return 'We manufacture a wide range of garment buttons (metal, plastic, wooden, shell etc.).\n\nReply with:\n1) Type (metal/plastic/wooden)\n2) Size (e.g. 18L / 11mm)\n3) Finish/colour\n4) Approx quantity\n\nWe will share suitable options and pricing.';
  }

  if (q.includes('zipper') || q.includes('zippers')) {
    return 'We supply nylon coil, invisible, metal and plastic moulded zippers.\n\nReply with:\n1) Type of zipper\n2) Length (in inches/cm)\n3) Usage (dress/hoodie/bag/etc.)\n4) Approx quantity\n\nWe will help you with the right product and pricing.';
  }

  if (q.includes('elastic')) {
    return 'We provide different widths and qualities of elastic bands.\n\nReply with:\n1) Width (e.g. 1 inch / 25mm)\n2) Application (waistband, cuffs, etc.)\n3) Approx quantity (in rolls or metres)\n\nWe will respond with options and bulk rates.';
  }

  if (q.includes('cord') || q.includes('drawstring')) {
    return 'We manufacture cotton and other cords for hoodies, lowers and bags.\n\nReply with:\n1) Cord type (cotton/satin/etc.)\n2) Thickness (e.g. 3mm)\n3) Colour\n4) Approx quantity\n\nWe will get back with availability and pricing.';
  }

  if (q.includes('sample') || q.includes('catalog') || q.includes('catalogue')) {
    return 'We can share photos/catalogue on WhatsApp for shortlisted items.\n\nFirst please reply with which product family you are interested in (buttons / zippers / elastic / cords) and your approximate monthly requirement.';
  }

  if (q.includes('address') || q.includes('location') || q.includes('visit')) {
    return 'Our factory/office is in Chembur, Mumbai:\nC Wing 704, Grit Height,\nG.M Link Road, Chembur West,\nMumbai - 400043.\n\nVisits are by appointment – please share a suitable date & time.';
  }

  if (q.includes('gst') || q.includes('tax')) {
    return 'We are a GST-registered business. GST is charged as per applicable slab (typically 18%) and shown clearly on the invoice.';
  }

  if (q.includes('hi') || q.includes('hello') || q.includes('namaste') || q.includes('good morning') || q.includes('good evening')) {
    return 'Hello! 👋 Thank you for contacting Shree Balaji Enterprises.\n\nAre you looking for buttons, zippers, elastic, or cords? Please tell us your requirement and approximate quantity.';
  }

  // Default catch-all
  return 'Thank you for your message.\n\nTo help you faster, please share:\n1) Product type (buttons/zippers/elastic/cords)\n2) Approx quantity\n3) City / state\n\nA team member will reply shortly with details.';
}

