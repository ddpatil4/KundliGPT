// Simple in-memory rate limiter utility for client-side tracking
// This complements the server-side rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class ClientRateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 10 * 60 * 1000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string = 'default'): boolean {
    const now = Date.now();
    const entry = this.storage.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.storage.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string = 'default'): number {
    const entry = this.storage.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string = 'default'): number | null {
    const entry = this.storage.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }
    return entry.resetTime;
  }

  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.storage.entries());
    for (const [key, entry] of entries) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Export a singleton instance
export const rateLimiter = new ClientRateLimiter();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);
