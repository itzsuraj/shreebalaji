/**
 * Input sanitization utilities to prevent XSS attacks
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content
 * Removes dangerous scripts, event handlers, and other XSS vectors
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'section', 'article'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id',
      'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
  });
}

/**
 * Sanitize plain text (removes all HTML)
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase().trim();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '#';
    }
  }
  
  return url;
}

/**
 * Sanitize object with string values recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T, fieldsToSanitize: string[]): T {
  const sanitized = { ...obj } as any;
  
  for (const key in sanitized) {
    if (fieldsToSanitize.includes(key) && typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeHTML(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map((item: any) =>
          typeof item === 'string' && fieldsToSanitize.includes(key)
            ? sanitizeHTML(item)
            : typeof item === 'object' && item !== null
            ? sanitizeObject(item, fieldsToSanitize)
            : item
        );
      } else {
        sanitized[key] = sanitizeObject(sanitized[key], fieldsToSanitize);
      }
    }
  }
  
  return sanitized as T;
}
