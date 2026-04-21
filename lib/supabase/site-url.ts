type HeaderLike = {
  get(name: string): string | null
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "")
}

function isLocalHost(host: string): boolean {
  return host.includes("localhost") || host.startsWith("127.0.0.1")
}

export function resolveSiteUrl(headerStore?: HeaderLike): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL

  if (configured && configured.trim().length > 0) {
    return normalizeBaseUrl(configured)
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl && vercelUrl.trim().length > 0) {
    return `https://${normalizeBaseUrl(vercelUrl)}`
  }

  if (headerStore) {
    const rawForwardedHost = headerStore.get("x-forwarded-host")
    const forwardedHost = rawForwardedHost?.split(",")[0]?.trim()
    const host = forwardedHost || headerStore.get("host")
    const forwardedProto = headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim()

    if (host) {
      const protocol =
        forwardedProto || (isLocalHost(host) ? "http" : "https")
      return `${protocol}://${normalizeBaseUrl(host)}`
    }
  }

  return "http://localhost:3000"
}
