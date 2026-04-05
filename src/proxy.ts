import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limit store — lazy singleton so Turbopack's static
// analysis sees a clean module with only function exports.
// Note: Edge workers may run multiple instances; for multi-region production
// replace with Upstash Redis or similar.
declare const globalThis: typeof global & {
  _rlStore?: Map<string, { count: number; resetAt: number }>;
  _rlCleanedAt?: number;
};

function getStore() {
  if (!globalThis._rlStore) globalThis._rlStore = new Map();
  return globalThis._rlStore;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 40;

function cleanup() {
  const now = Date.now();
  const cleaned = globalThis._rlCleanedAt ?? 0;
  if (now - cleaned < 300_000) return;
  globalThis._rlCleanedAt = now;
  for (const [key, entry] of getStore()) {
    if (now > entry.resetAt) getStore().delete(key);
  }
}

function getIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? '127.0.0.1';
  return ip.replace(/^::ffff:/, '');
}

export default function proxy(req: NextRequest) {
  cleanup();

  const ip = getIP(req);
  const now = Date.now();
  const ua = req.headers.get('user-agent') ?? '';

  const blockedAgents = [
    'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
    'ClaudeBot', 'Claude-Web',
    'Google-Extended', 'Amazonbot',
    'PerplexityBot', 'YouBot',
    'Bytespider', 'PetalBot',
    'SemrushBot', 'AhrefsBot', 'DotBot', 'MJ12bot',
    'DataForSeoBot', 'ImagesiftBot',
    'Diffbot', 'Scrapy', 'python-requests', 'Go-http-client',
  ];

  if (blockedAgents.some(agent => ua.toLowerCase().includes(agent.toLowerCase()))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const store = getStore();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
    if (entry.count > MAX_REQUESTS) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please slow down.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
          },
        },
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  const remaining = Math.max(0, MAX_REQUESTS - (store.get(ip)?.count ?? 1));
  response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS));
  response.headers.set('X-RateLimit-Remaining', String(remaining));

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
