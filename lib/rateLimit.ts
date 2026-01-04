type LimitResult = { blocked: boolean; response?: Response }

const buckets = new Map<string, { count: number; resetAt: number }>()

function keyFor(request: Request, key?: string) {
  const ip =
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const ua = request.headers.get("user-agent") || "ua"
  return `${key || "global"}:${ip}:${ua}`
}

export function rateLimit(
  request: Request,
  options: { key?: string; max: number; windowMs: number },
): LimitResult {
  const { key, max, windowMs } = options
  const k = keyFor(request, key)
  const now = Date.now()
  const bucket = buckets.get(k)
  if (!bucket || now > bucket.resetAt) {
    buckets.set(k, { count: 1, resetAt: now + windowMs })
    return { blocked: false }
  }
  if (bucket.count >= max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
    return {
      blocked: true,
      response: new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "Cache-Control": "no-store",
        },
      }),
    }
  }
  bucket.count += 1
  return { blocked: false }
}
