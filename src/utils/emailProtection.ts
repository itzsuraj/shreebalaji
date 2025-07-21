// Email protection utility to prevent spam harvesting
export function encodeEmail(email: string): string {
  return email
    .split('')
    .map(char => `&#${char.charCodeAt(0)};`)
    .join('');
}

export function getProtectedEmail(): string {
  const email = 'shreebalajienterprises400077@gmail.com';
  return encodeEmail(email);
}

export function getEmailLink(): string {
  const email = 'shreebalajienterprises400077@gmail.com';
  return `mailto:${email}`;
}

// Alternative method using JavaScript to decode on client side
export function getEmailWithJSProtection(): { encoded: string; decoded: string } {
  const email = 'shreebalajienterprises400077@gmail.com';
  const encoded = email
    .split('')
    .map(char => `&#${char.charCodeAt(0)};`)
    .join('');
  
  return {
    encoded,
    decoded: email
  };
} 