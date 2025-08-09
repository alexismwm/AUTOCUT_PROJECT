export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) {
      return new Response('Missing url', { status: 400 });
    }

    const upstream = await fetch(url);
    if (!upstream.ok || !upstream.body) {
      return new Response('Upstream error', { status: 502 });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    return new Response(upstream.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      }
    });
  } catch (err) {
    return new Response('Proxy error', { status: 500 });
  }
} 