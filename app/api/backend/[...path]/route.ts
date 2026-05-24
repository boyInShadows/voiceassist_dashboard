import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.BACKEND_BASE_URL?.replace(/\/$/, "");
const TOKEN_COOKIE = "auth-token";

const PUBLIC_PROXY_ROUTES = new Set(["auth/login", "auth/setup"]);

function isPublicProxyPath(parts: string[]): boolean {
  return PUBLIC_PROXY_ROUTES.has(parts.join("/"));
}

function buildForwardHeaders(req: NextRequest, token: string | undefined): Headers {
  const headers = new Headers();

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  if (token) headers.set("authorization", `Bearer ${token}`);

  return headers;
}

function buildResponseHeaders(upstream: Response): Headers {
  const headers = new Headers();

  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const cacheControl = upstream.headers.get("cache-control");
  if (cacheControl) headers.set("cache-control", cacheControl);

  return headers;
}

async function handler(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ path: string[] }> },
) {
  try {
    const params = await paramsPromise;

    if (!BASE) {
      return NextResponse.json(
        { error: "BACKEND_BASE_URL not set" },
        { status: 500 },
      );
    }

    const parts = params.path ?? [];

    // Do not expose debug environment info through the proxy.
    if (parts[0] === "__whoami") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const cookieToken = req.cookies.get(TOKEN_COOKIE)?.value;

    if (!isPublicProxyPath(parts) && !cookieToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const target = new URL(`${BASE}/${parts.join("/")}`);
    req.nextUrl.searchParams.forEach((v, k) => target.searchParams.set(k, v));

    const method = req.method.toUpperCase();
    const headers = buildForwardHeaders(req, cookieToken);
    const body = ["GET", "HEAD"].includes(method) ? undefined : await req.arrayBuffer();

    const upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: buildResponseHeaders(upstream),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Proxy error", details: msg },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
