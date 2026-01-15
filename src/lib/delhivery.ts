/**
 * Delhivery API Integration
 * Docs vary by account; base URL and auth scheme are configurable.
 */

const DELHIVERY_BASE_URL = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com/api';
const DELHIVERY_API_TOKEN = process.env.DELHIVERY_API_TOKEN || '';
const DELHIVERY_AUTH_SCHEME = process.env.DELHIVERY_AUTH_SCHEME || 'Token';
const DELHIVERY_RATE_PATH = process.env.DELHIVERY_RATE_PATH || '/kinko/v1/invoice/charges/';

function getAuthHeader() {
  if (!DELHIVERY_API_TOKEN) {
    throw new Error('Delhivery API token not configured');
  }
  return `${DELHIVERY_AUTH_SCHEME} ${DELHIVERY_API_TOKEN}`.trim();
}

async function delhiveryFetch(path: string, init?: RequestInit) {
  const url = `${DELHIVERY_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(init?.headers || {});
  headers.set('Authorization', getAuthHeader());
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Delhivery request failed (${response.status})`);
  }
  return response;
}

export interface DelhiveryCreateShipmentRequest {
  shipments: Array<{
    name: string;
    add: string;
    pin: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    order: string;
    payment_mode: 'Prepaid' | 'COD';
    products_desc: string;
    amount: number;
    cod_amount: number;
    weight: number;
    quantity: number;
    shipment_length?: number;
    shipment_width?: number;
    shipment_height?: number;
    seller_name?: string;
    seller_add?: string;
    seller_pin?: string;
    seller_city?: string;
    seller_state?: string;
    seller_country?: string;
    seller_phone?: string;
    seller_gst?: string;
    return_add?: string;
    return_city?: string;
    return_pin?: string;
    return_state?: string;
    return_country?: string;
  }>;
  pickup_location: string;
}

export interface DelhiveryCreateShipmentResponse {
  success?: boolean;
  packages?: Array<{
    waybill?: string;
    status?: string;
    status_type?: string;
  }>;
  message?: string;
}

/**
 * Create shipment (Forward order)
 * Uses /cmu/create.json with form-encoded payload
 */
export async function createDelhiveryShipment(
  request: DelhiveryCreateShipmentRequest
): Promise<DelhiveryCreateShipmentResponse> {
  const params = new URLSearchParams();
  params.set('format', 'json');
  params.set('data', JSON.stringify(request));

  const response = await delhiveryFetch('/cmu/create.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  return response.json();
}

export interface DelhiveryTrackResponse {
  ShipmentData?: Array<{
    Shipment?: {
      Status?: string;
      StatusDateTime?: string;
      ShipmentStatus?: {
        Status?: string;
        Instructions?: string;
      };
      Scan?: Array<{
        Status?: string;
        StatusDateTime?: string;
        ScannedLocation?: string;
      }>;
    };
  }>;
}

/**
 * Track shipment by waybill
 * Uses /v1/packages/json/?waybill=XXXX
 */
export async function trackDelhiveryShipment(waybill: string): Promise<DelhiveryTrackResponse> {
  const response = await delhiveryFetch(`/v1/packages/json/?waybill=${encodeURIComponent(waybill)}`, {
    method: 'GET',
  });
  return response.json();
}

export interface DelhiveryPincodeResponse {
  delivery_codes?: Array<{
    postal_code?: {
      pin?: string;
      city?: string;
      state?: string;
      country?: string;
      pre_paid?: string;
      cash?: string;
    };
  }>;
}

/**
 * Check pincode serviceability
 * Uses /pin-codes/json/?filter_codes=XXXX
 */
export async function checkDelhiveryPincode(pin: string): Promise<DelhiveryPincodeResponse> {
  const response = await delhiveryFetch(`/pin-codes/json/?filter_codes=${encodeURIComponent(pin)}`, {
    method: 'GET',
  });
  return response.json();
}

export interface DelhiveryRateParams {
  originPin: string;
  destPin: string;
  weightKg: number;
  paymentMode: 'Pre-paid' | 'COD';
  declaredValue?: number;
  mode?: string;
}

export interface DelhiveryRateResponse {
  total_amount?: number;
  charge?: number;
  freight_charge?: number;
  cod_charge?: number;
  [key: string]: unknown;
}

/**
 * Rate calculation (charges)
 * Default path uses /kinko/v1/invoice/charges/
 */
export async function getDelhiveryRate(params: DelhiveryRateParams): Promise<DelhiveryRateResponse> {
  const weightGrams = Math.max(1, Math.round(params.weightKg * 1000));
  const query = new URLSearchParams({
    o_pin: params.originPin,
    d_pin: params.destPin,
    cgm: String(weightGrams),
    pt: params.paymentMode,
    md: params.mode || 'E',
  });

  if (typeof params.declaredValue === 'number') {
    query.set('d_val', String(params.declaredValue));
  }

  const path = `${DELHIVERY_RATE_PATH}?${query.toString()}`;
  const response = await delhiveryFetch(path, { method: 'GET' });
  return response.json();
}
