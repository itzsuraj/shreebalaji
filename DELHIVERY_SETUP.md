# Delhivery API Integration Setup

This document explains how to configure Delhivery integration for shipment creation, tracking, and pincode checks.

## Environment Variables

Add the following to `.env.local`:

```env
# Delhivery API
DELHIVERY_API_TOKEN=your_api_token_here
DELHIVERY_BASE_URL=https://track.delhivery.com/api
DELHIVERY_AUTH_SCHEME=Token
DELHIVERY_RATE_PATH=/kinko/v1/invoice/charges/
DELHIVERY_PICKUP_PIN=400001

# Defaults for shipment creation
DELHIVERY_DEFAULT_WEIGHT_KG=0.5
DELHIVERY_DEFAULT_LENGTH_CM=20
DELHIVERY_DEFAULT_WIDTH_CM=15
DELHIVERY_DEFAULT_HEIGHT_CM=10
```

Notes:
- Delhivery typically expects `Authorization: Token <token>`; if your account uses a different scheme, set `DELHIVERY_AUTH_SCHEME`.
- If your account uses a different base URL (staging or custom), set `DELHIVERY_BASE_URL`.

## API Endpoints (App)

### Create Shipment
```
POST /api/delhivery/create-shipment
Content-Type: application/json

{
  "orderId": "<order_id>",
  "pickupLocation": "Your_Pickup_Location_Name"
}
```

### Track Shipment
```
GET /api/delhivery/track?waybill=XXXXXXXX
```

### Pincode Check
```
GET /api/delhivery/pincode?pin=560001
```

### Webhook (optional)
```
POST /api/delhivery/webhook
```

## What this integration does

- Creates Delhivery shipments for existing orders
- Stores waybill and status in the order fulfillment
- Tracks shipments by waybill
- Optionally processes webhook updates

## Important

Do not paste API keys in chat or in code. Use `.env.local` and Vercel environment variables.
