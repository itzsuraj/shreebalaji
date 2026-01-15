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
DELHIVERY_RATE_SS=Delivered

# Defaults for shipment creation
DELHIVERY_DEFAULT_WEIGHT_KG=0.5
DELHIVERY_DEFAULT_LENGTH_CM=20
DELHIVERY_DEFAULT_WIDTH_CM=15
DELHIVERY_DEFAULT_HEIGHT_CM=10

# Auto pickup (optional)
DELHIVERY_PICKUP_ENABLED=true
DELHIVERY_PICKUP_PATH=/fm/request/new/
DELHIVERY_PICKUP_TIME=10:00-18:00

# Seller / Return details (recommended)
DELHIVERY_SELLER_NAME=Shree balaji enterprises
DELHIVERY_SELLER_ADDRESS=C wing, flat 704, Grit height, G.M link road opposite indian oil nagar near shankara colony
DELHIVERY_SELLER_PIN=400043
DELHIVERY_SELLER_CITY=Mumbai
DELHIVERY_SELLER_STATE=Maharashtra
DELHIVERY_SELLER_COUNTRY=India
DELHIVERY_SELLER_PHONE=9372268410
DELHIVERY_SELLER_GST=

DELHIVERY_RETURN_ADDRESS=C wing, flat 704, Grit height, G.M link road opposite indian oil nagar near shankara colony
DELHIVERY_RETURN_CITY=Mumbai
DELHIVERY_RETURN_PIN=400043
DELHIVERY_RETURN_STATE=Maharashtra
DELHIVERY_RETURN_COUNTRY=India
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
