// Security headers middleware
export const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://*.googleusercontent.com; style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://*.googleusercontent.com; img-src 'self' data: https://*.googleusercontent.com https://translate.googleapis.com; connect-src 'self' https://api.anthropic.com https://*.supabase.co; font-src 'self'; frame-src 'self' https://translate.google.com;",
  },
]

// Input sanitization function
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Remove potentially dangerous HTML and script tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim()
}

// Token validation function
export function validateToken(token: string): boolean {
  // Check if token exists
  if (!token) return false

  // Check token format (example: check if it's a valid JWT)
  const jwtPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
  return jwtPattern.test(token)
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, { count: number; timestamp: number }> = new Map()
  private limit: number
  private windowMs: number

  constructor(limit = 100, windowMs = 60000) {
    this.limit = limit
    this.windowMs = windowMs
  }

  check(ip: string): boolean {
    const now = Date.now()
    const requestData = this.requests.get(ip) || { count: 0, timestamp: now }

    // Reset if window has passed
    if (now - requestData.timestamp > this.windowMs) {
      requestData.count = 1
      requestData.timestamp = now
    } else {
      requestData.count++
    }

    this.requests.set(ip, requestData)

    // Check if limit exceeded
    return requestData.count <= this.limit
  }
}

