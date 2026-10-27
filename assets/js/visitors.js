// Visitor counter and map: every page counts the visit once per browser session;
// the Visitor Map page (statistician/visitors/) also draws a dot per city.
(function () {
  const ENDPOINT = "https://visitors.huchaoran.com"; // the Cloudflare counter (tools/visitor-counter/)
  if (!ENDPOINT) return;

  // Mark the session as counted only once the counter has confirmed the visit,
  // so a failed attempt is retried on the next page
  let counted = false;
  try { counted = sessionStorage.getItem("counted") === "1"; } catch (e) {}
  const hit = counted ? Promise.resolve() :
    fetch(ENDPOINT + "/hit", { method: "POST" })
      .then(r => { if (r.ok) try { sessionStorage.setItem("counted", "1"); } catch (e) {} })
      .catch(() => {});

  const box = document.querySelector(".visitors");
  if (!box) return;

  // Natural Earth projection fitted to the 960 x 470 map drawn in assets/img/world-*.svg
  const K = 176.15557, TX = 480, TY = 266.53244, R = Math.PI / 180;
  function project(lat, lon) {
    const l = lon * R, p = lat * R, p2 = p * p, p4 = p2 * p2;
    const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
    const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
    return [TX + K * x, TY - K * y];
  }

  // Load the cities after this visit is counted, so a first visit shows up straight away
  hit.then(() => fetch(ENDPOINT + "/cities", { cache: "no-store" }))
    .then(r => r.json())
    .then(rows => {
      if (!rows.length) {
        box.querySelector(".count").textContent = "No visits counted yet";
        return;
      }
      const svgNS = "http://www.w3.org/2000/svg";
      const g = box.querySelector("svg g");
      // "Carmel, IN" for places in the US, "Shanghai, China" elsewhere
      let countryName = code => code;
      try {
        const names = new Intl.DisplayNames(["en"], { type: "region" });
        countryName = code => names.of(code) || code;
      } catch (e) {}
      // Mainland China, Taiwan, Hong Kong and Macau all read "China" (some phones say "China mainland")
      const CHINA = ["CN", "TW", "HK", "MO"];
      const placeName = code => CHINA.includes(code) ? "China" : countryName(code);
      const label = ([city, country, , , , region]) =>
        country === "US" ? (region ? city + ", " + region : city) :
        country ? city + ", " + placeName(country) : city;

      const r = 2.2; // every city gets the same dot, however many visits it has
      rows.forEach(row => {
        const [, , lat, lon] = row;
        const [x, y] = project(lat, lon);
        const halo = document.createElementNS(svgNS, "circle");
        halo.setAttribute("class", "halo");
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("class", "dot");
        [[halo, r * 2], [dot, r]].forEach(([c, rad]) => {
          c.setAttribute("cx", x.toFixed(1));
          c.setAttribute("cy", y.toFixed(1));
          c.setAttribute("r", rad.toFixed(1));
        });
        const title = document.createElementNS(svgNS, "title");
        title.textContent = label(row);
        dot.appendChild(title);
        g.append(halo, dot);
      });
      const names = [...new Set(rows.map(label))].sort((a, b) => a.localeCompare(b));
      box.querySelector(".cities").textContent = names.join("  ·  ");
      box.querySelector(".count").textContent =
        rows.length === 1 ? "from 1 city so far" : "from " + rows.length + " cities so far";
    })
    .catch(() => {});
})();
