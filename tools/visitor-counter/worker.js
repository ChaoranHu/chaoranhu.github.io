// Visitor counter for huchaoran.com, run as a free Cloudflare Worker with a D1 database bound as DB.
// It keeps only a city name, its state or province code, its country, rough coordinates and a
// visit count. No IP addresses, no cookies, nothing that identifies a person.
//   POST /hit     counts one visit for the caller's city (the site sends this once per browser session)
//   GET  /cities  returns [[city, country, lat, lon, visits, region], ...] for the map
//   GET  /where   shows what Cloudflare knows about your own location (nothing is stored)

const ALLOWED = ["https://huchaoran.com", "https://www.huchaoran.com", "https://chaoranhu.github.io"];

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin);

    if (request.method === "OPTIONS") return new Response(null, { headers });

    if (url.pathname === "/hit" && request.method === "POST") {
      const cf = request.cf || {};
      // Some visitors (for example iPhones using iCloud Private Relay) show only a region,
      // so fall back to the region or country name when the city is unknown
      const place = cf.city || cf.region || cf.country;
      // Only count visits made from the site itself, and only when there is a place to put the dot
      if (ALLOWED.includes(origin) && place && cf.latitude && cf.longitude) {
        // One decimal place is about 10 km: enough for a dot, too coarse to point at a house
        const lat = Math.round(parseFloat(cf.latitude) * 10) / 10;
        const lon = Math.round(parseFloat(cf.longitude) * 10) / 10;
        // regionCode is the state or province code, for example IN for Indiana
        await env.DB.prepare(
          `INSERT INTO cities (city, country, lat, lon, visits, region) VALUES (?1, ?2, ?3, ?4, 1, ?5)
           ON CONFLICT (city, country) DO UPDATE SET visits = visits + 1,
             region = COALESCE(NULLIF(excluded.region, ''), region)`
        ).bind(place, cf.country || "", lat, lon, cf.regionCode || "").run();
      }
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === "/cities" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT city, country, lat, lon, visits, region FROM cities ORDER BY visits DESC"
      ).all();
      const body = JSON.stringify(results.map(r => [r.city, r.country, r.lat, r.lon, r.visits, r.region]));
      return new Response(body, {
        headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
      });
    }

    if (url.pathname === "/where") {
      const cf = request.cf || {};
      const body = JSON.stringify({
        city: cf.city || null,
        region: cf.region || null,
        region_code: cf.regionCode || null,
        country: cf.country || null,
        has_coordinates: Boolean(cf.latitude && cf.longitude),
      }, null, 2);
      return new Response(body, { headers: { ...headers, "Content-Type": "application/json" } });
    }

    return new Response("Not found", { status: 404, headers });
  },
};
