"use client";
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { DEFAULT_SHIPPING_FEE_INR, MINIMUM_ORDER_AMOUNT_INR } from '@/lib/config';

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
  const [deliveryChargeInPaise, setDeliveryChargeInPaise] = useState<number | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('');
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  
  // Error states for form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { items: cartItems, subtotalInPaise, clear } = useCart();
  const shippingInPaise = deliveryChargeInPaise ?? 0;
  const gstInPaise = 0;
  const totalInPaise = subtotalInPaise + shippingInPaise;

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

  useEffect(() => {
    const pin = postalCode.replace(/\D/g, '');
    if (pin.length !== 6) {
      setDeliveryChargeInPaise(null);
      setDeliveryStatus('');
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsCheckingDelivery(true);
      try {
        const res = await fetch(`/api/delhivery/pincode?pin=${pin}`);
        const data = await res.json();
        const code = data?.delivery_codes?.[0]?.postal_code;
        const pinCode = data?.delivery_codes?.[0]?.pin_code;
        const isServiceable = !!pinCode || (!!code && (code.pre_paid === 'Y' || code.cash === 'Y'));

        if (!cancelled) {
          if (isServiceable) {
            const rateRes = await fetch(
              `/api/delhivery/rate?pin=${pin}&weightKg=0.5&cod=0&orderValue=${(subtotalInPaise / 100).toFixed(2)}`
            );
            const rateData = await rateRes.json();
            if (rateRes.ok && typeof rateData.rateInPaise === 'number') {
              setDeliveryChargeInPaise(rateData.rateInPaise);
              setDeliveryStatus('Delivery available');
            } else {
              setDeliveryChargeInPaise(DEFAULT_SHIPPING_FEE_INR * 100);
              setDeliveryStatus('Delivery available (standard rate)');
            }
          } else {
            setDeliveryChargeInPaise(null);
            setDeliveryStatus('Delivery not available for this pincode');
          }
        }
      } catch (_e) {
        if (!cancelled) {
          setDeliveryChargeInPaise(DEFAULT_SHIPPING_FEE_INR * 100);
          setDeliveryStatus('Unable to fetch rates, showing standard delivery');
        }
      } finally {
        if (!cancelled) {
          setIsCheckingDelivery(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [postalCode, subtotalInPaise]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!address1.trim()) {
      newErrors.address1 = 'Address is required';
    }
    
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{6}$/.test(postalCode.replace(/\D/g, ''))) {
      newErrors.postalCode = 'Please enter a valid 6-digit postal code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    // Check minimum order amount
    if (subtotalInPaise < MINIMUM_ORDER_AMOUNT_INR * 100) {
      setErrors({...errors, orderAmount: `Minimum order amount is ₹${MINIMUM_ORDER_AMOUNT_INR}. Please add more items to your cart.`});
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
          shippingInPaise,
          gstInPaise,
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

      // Get Razorpay key from meta tag
      const razorpayKey = document.querySelector('meta[name="razorpay-key"]')?.getAttribute('content');
      if (!razorpayKey) {
        throw new Error('Razorpay key not found. Please check environment configuration.');
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
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
      setErrors({...errors, payment: message});
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
            <div>
              <input 
                className={`w-full border p-3 rounded ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Full Name" 
                value={fullName} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    setErrors({...errors, fullName: ''});
                  }
                }} 
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            
            <div>
              <input 
                className={`w-full border p-3 rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Phone" 
                value={phone} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPhone(e.target.value);
                  if (errors.phone) {
                    setErrors({...errors, phone: ''});
                  }
                }} 
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <input 
                className={`w-full border p-3 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Email (optional)" 
                value={email} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({...errors, email: ''});
                  }
                }} 
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <input 
                className={`w-full border p-3 rounded ${errors.address1 ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Address Line 1" 
                value={address1} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress1(e.target.value);
                  if (errors.address1) {
                    setErrors({...errors, address1: ''});
                  }
                }} 
              />
              {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
            </div>
            
            <div>
              <input 
                className="w-full border p-3 rounded border-gray-300" 
                placeholder="Address Line 2" 
                value={address2} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress2(e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input 
                  className={`w-full border p-3 rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`} 
                  placeholder="City" 
                  value={city} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCity(e.target.value);
                    if (errors.city) {
                      setErrors({...errors, city: ''});
                    }
                  }} 
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <input 
                  className={`w-full border p-3 rounded ${errors.state ? 'border-red-500' : 'border-gray-300'}`} 
                  placeholder="State" 
                  value={state} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setState(e.target.value);
                    if (errors.state) {
                      setErrors({...errors, state: ''});
                    }
                  }} 
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>
            
            <div>
              <input 
                className={`w-full border p-3 rounded ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Postal Code" 
                value={postalCode} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPostalCode(e.target.value);
                  if (errors.postalCode) {
                    setErrors({...errors, postalCode: ''});
                  }
                }} 
              />
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
            </div>
            
            <div>
              <input 
                className="w-full border p-3 rounded border-gray-300" 
                placeholder="GSTIN (optional)" 
                value={gstin} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGstin(e.target.value)} 
              />
            </div>
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
            <div className="flex justify-between text-sm text-gray-700">
              <span>Delivery Charges</span>
              <span>
                {isCheckingDelivery ? 'Checking...' : deliveryChargeInPaise !== null ? `₹${(deliveryChargeInPaise / 100).toFixed(2)}` : '--'}
              </span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>₹{(totalInPaise / 100).toFixed(2)}</span>
            </div>
            {deliveryStatus && (
              <p className={`text-xs ${deliveryStatus.includes('not') ? 'text-red-600' : 'text-gray-600'}`}>
                {deliveryStatus}
              </p>
            )}
            <p className="text-xs text-gray-600">Total includes delivery charges</p>
            {errors.orderAmount && (
              <p className="text-xs text-red-600 mt-2">
                {errors.orderAmount}
              </p>
            )}
            {subtotalInPaise < MINIMUM_ORDER_AMOUNT_INR * 100 && !errors.orderAmount && (
              <p className="text-xs text-red-600 mt-2">
                Minimum order amount: ₹{MINIMUM_ORDER_AMOUNT_INR}
              </p>
            )}
            {errors.payment && (
              <p className="text-xs text-red-600 mt-2">
                {errors.payment}
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
            className="mt-6 w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            {isSubmitting ? 'Processing...' : subtotalInPaise < MINIMUM_ORDER_AMOUNT_INR * 100 ? `Minimum ₹${MINIMUM_ORDER_AMOUNT_INR} required` : 'Pay via UPI'}
          </button>
        </div>
      </div>
    </div>
  );
}


