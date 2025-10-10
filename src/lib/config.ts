export const GST_PERCENT = 18; // 18%
export const DEFAULT_SHIPPING_FEE_INR = 0; // set actual value later
export const MINIMUM_ORDER_AMOUNT_INR = 10; // Minimum ₹10 for testing

export function calculateTotals(subtotalInPaise: number) {
  const shippingInPaise = DEFAULT_SHIPPING_FEE_INR * 100;
  const gstInPaise = Math.round((subtotalInPaise + shippingInPaise) * (GST_PERCENT / 100));
  const grandTotalInPaise = subtotalInPaise + shippingInPaise + gstInPaise;

  return {
    shippingInPaise,
    gstInPaise,
    grandTotalInPaise,
  };
}


