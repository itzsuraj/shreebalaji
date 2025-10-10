"use client";
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { MINIMUM_ORDER_AMOUNT_INR } from '@/lib/config';

export default function CheckoutPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [gstin, setGstin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items: cartItems, subtotalInPaise, clear } = useCart();

  useEffect(() => {
    // Load Razorpay script once on mount
    const scriptId = 'razorpay-checkout-js';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const createOrder = async () => {
    // Check minimum order amount
    if (subtotalInPaise < MINIMUM_ORDER_AMOUNT_INR * 100) {
      alert(`Minimum order amount is ₹${MINIMUM_ORDER_AMOUNT_INR}. Please add more items to your cart.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(p => ({ productId: p.productId, name: p.name, price: p.price, quantity: p.quantity, image: p.image, category: p.category, size: p.size, color: p.color, pack: p.pack })),
          customer: {
            fullName, phone, email, addressLine1: address1, addressLine2: address2, city, state, postalCode, country: 'IN', gstin
          },
          paymentMethod: 'UPI',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      // Create Razorpay order (UPI-only)
      const rz = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountInPaise: data.totalInPaise, receipt: `order_${data.orderId}` }),
      });
      const rzData = await rz.json();
      if (!rz.ok) {
        console.error('Razorpay order creation failed:', rzData);
        throw new Error(rzData.error || 'Failed to create Razorpay order');
      }
      console.log('Razorpay order created:', rzData.order);

      type RazorpayHandlerResponse = {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };
      type RazorpayOptions = {
        key?: string;
        amount: number;
        currency: string;
        name: string;
        order_id: string;
        prefill: { name: string; email?: string; contact?: string };
        method: { upi: boolean; card: boolean; netbanking: boolean; wallet: boolean; paylater: boolean; emi: boolean };
        upi: { flow: 'collect' | 'intent' };
        notes: { orderId: string };
        handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
      };

      const options: RazorpayOptions = {
        key: 'rzp_live_RReoS5dvMkKg72',
        amount: rzData.order.amount,
        currency: 'INR',
        name: 'Shree Balaji Enterprises',
        order_id: rzData.order.id,
        prefill: { name: fullName, email, contact: phone },
        // UPI-only configuration for live environment
        method: { upi: true, card: false, netbanking: false, wallet: false, paylater: false, emi: false },
        // Use collect flow for better UPI compatibility
        upi: { flow: 'collect' },
        notes: { orderId: data.orderId },
        handler: async function (response: RazorpayHandlerResponse) {
          try {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verify = await verifyRes.json();
            if (!verifyRes.ok || !verify.success) throw new Error(verify.error || 'Verification failed');
            clear();
            window.location.href = `/checkout/success?orderId=${data.orderId}`;
          } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Verification failed';
            alert(message);
          }
        },
      };

      const RZPConstructor = (window as unknown as { Razorpay: new (opts: RazorpayOptions) => { open: () => void } }).Razorpay;
      const rzp = new RZPConstructor(options);
      rzp.open();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Billing & Shipping</h2>
          <div className="space-y-3">
            <input className="w-full border p-3 rounded" placeholder="Full Name" value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
            <input className="w-full border p-3 rounded" placeholder="Phone" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
            <input className="w-full border p-3 rounded" placeholder="Email (optional)" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
            <input className="w-full border p-3 rounded" placeholder="Address Line 1" value={address1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress1(e.target.value)} />
            <input className="w-full border p-3 rounded" placeholder="Address Line 2" value={address2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress2(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full border p-3 rounded" placeholder="City" value={city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)} />
              <input className="w-full border p-3 rounded" placeholder="State" value={state} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)} />
            </div>
            <input className="w-full border p-3 rounded" placeholder="Postal Code" value={postalCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostalCode(e.target.value)} />
            <input className="w-full border p-3 rounded" placeholder="GSTIN (optional)" value={gstin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGstin(e.target.value)} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="border rounded p-4 space-y-2">
            {cartItems.map((p) => (
              <div key={p.productId} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span>₹{p.price}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Subtotal</span>
              <span>₹{(subtotalInPaise/100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-600">GST 18% and shipping calculated at next step</p>
            {subtotalInPaise < MINIMUM_ORDER_AMOUNT_INR * 100 && (
              <p className="text-xs text-red-600 mt-2">
                Minimum order amount: ₹{MINIMUM_ORDER_AMOUNT_INR}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="paymethod" defaultChecked readOnly />
                <span>UPI (GPay/PhonePe/Paytm)</span>
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input type="radio" name="paymethod" disabled readOnly />
                <span>Cash on Delivery (coming soon)</span>
              </label>
            </div>
          </div>

          <button 
            disabled={isSubmitting || subtotalInPaise < MINIMUM_ORDER_AMOUNT_INR * 100} 
            onClick={createOrder} 
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : subtotalInPaise < MINIMUM_ORDER_AMOUNT_INR * 100 ? `Minimum ₹${MINIMUM_ORDER_AMOUNT_INR} required` : 'Pay via UPI'}
          </button>
        </div>
      </div>
    </div>
  );
}


