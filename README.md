# chaoranhu.github.io (huchaoran.com)

Source for Chaoran Hu's personal website, written as plain HTML and CSS. GitHub Pages serves it directly from the root of `main`; there is no build step. It is live at https://huchaoran.com (also https://chaoranhu.github.io/).

## Layout

| Path | Page |
| --- | --- |
| `index.html` | Home |
| `statistician/index.html` | Statistician |
| `statistician/whodrug/index.html` | My note of WHODrug |
| `statistician/e9r1_note/index.html` | My note of E9(R1) |
| `statistician/visitors/index.html` | Visitor Map (listed under Web Apps) |
| `photographer/index.html` | Photographer gallery |
| `home/index.html` | Redirect so old `/home` links still reach the home page |
| `assets/css/style.css` | All styling |
| `assets/js/carousel.js` | Photo sliders |
| `assets/img/portrait.jpg` | Home page portrait |
| `assets/img/wildlife/`, `nature/`, `humanistics/` | Photos, one folder per section |
| `assets/img/notes/` | Figures used in the notes |
| `assets/img/ornaments/` | Old engravings above the section titles and in the header (PNG) |
| `assets/img/icons/`, `favicon.ico` | Browser tab and home screen icons |
| `CNAME` | Custom domain for GitHub Pages; keep this file |

## Look

* Font: Cormorant Garamond (Google Fonts) for all text.
* Colours: white page with a few greys, set as variables at the top of `style.css` (`--ink`, `--text`, `--muted`, `--line`, `--hair`, `--pale`). Photos stay in full colour on white.
* Header: the name on the left links home, and the pines engraving sits at the right end.
* Sections: on the Photographer and Statistician pages each title sits on a pale full width band (`<div class="section-head">`) under a small old engraving; the content below stays on white.

## Adding a photo

1. Keep the photo at full size and quality (no resizing or recompression). Remove its EXIF, XMP and location data without re-encoding, keeping the colour profile; `python3 tools/stripjpeg.py in.jpg out.jpg` does this losslessly. Put it in `assets/img/wildlife/`, `assets/img/nature/` or `assets/img/humanistics/`.
2. In `photographer/index.html`, copy one `<figure>` line inside that section, change the file name and write a short `alt` description. The Previous / Next words and the counter update on their own.

To add a new section, create a new folder under `assets/img/` and copy a whole `<div class="section-head">` plus `<div class="carousel">` block.

## Section engravings

The pictures above the section titles (and the pines in the header) are old etchings and engravings that are free to use, public domain or CC0, mostly from Wikimedia Commons. Each is a PNG in `assets/img/ornaments/` whose transparency holds the drawing, with softly broken edges like a hand drawn vignette. Each picture is already coloured in the text grey (#3a3a3a), so they all share one ink colour, and CSS shows it as a plain background image. Each has a class in `style.css`, for example `.ornament-birds`, and is placed with:

```html
<span class="ornament ornament-birds" aria-hidden="true"></span>
```

To add one, save the PNG in that folder, add a `.ornament-name` rule next to the others (its `--src` path and `--r`, the image's width / height), and put the span above the section's `<h2>`. If you replace an existing picture, add or bump a `?v=` at the end of its path in `style.css` so browsers fetch the new one.

| Section | File | Source |
| --- | --- | --- |
| Header | `pines.png` | Mountain landscape with firs, ink and wash, Rijksmuseum (CC0) |
| Wildlife | `wildlife.png` | Ducks at Dawn, Frank W. Benson (public domain) |
| Nature | `nature.png` | Mountain Meadow, Alexandre Calame, 1840, National Gallery of Art (CC0) |
| Humanistics | `humanistics.png` | An Archway, Chioggia, Muirhead Bone (public domain) |
| my Notes | `notes.png` | Man writing at a desk, Tony Johannot (public domain) |
| Web Apps | `web-apps.png` | Buckingham telescope, wood engraving, 1869 (public domain) |
| News Coverage | `news.png` | The newspaper reader, Adolph Menzel (public domain) |
| Work Experience | `work.png` | Writing table, James H. Worman (public domain) |
| Education | `education.png` | New Quadrangle, Trinity College, Oxford, etching (public domain) |
| Honors and Awards | `honors.png` | Wreath and pen, William Harry Rogers (public domain) |
| Selected Publications | `publications.png` | Books on a desk, from Erasmus of Rotterdam, Albrecht Dürer, 1526 (public domain) |
| Software | `software.png` | Grant calculating machine, 1877 (public domain) |

## After changing the CSS or JavaScript

Browsers keep `style.css` and `carousel.js` for about 10 minutes, so phones may show the old look right after a change. Pages load them as `style.css?v=27`, `carousel.js?v=23` and `visitors.js?v=7`; bump that number in every `index.html` whenever you edit either file and visitors get the new version straight away. The tab icon links carry their own `?v=` in the same way; bump it if the icons change.

## Visitor map

The Visitor Map page (listed under Web Apps) shows a world map with a dot for each city visitors came from, counted over all time. Every page counts the visit. A free Cloudflare Worker does the counting: `tools/visitor-counter/worker.js`, with the table in `tools/visitor-counter/schema.sql` stored in a Cloudflare D1 database bound to the worker as `DB`. It keeps only the city, its state or province code, the country, coordinates rounded to about 10 km, and a visit count; no IP addresses and no cookies. The list under the map shows US places as "Carmel, IN" and others as "Shanghai, China". `add-region.sql` is the one time update that added the state column to the existing database. Each browser counts once per session.

`assets/js/visitors.js` sends the visit and draws the dots on `assets/img/world-outline.svg` (Natural Earth country outlines, public domain, Natural Earth projection; `world-dots.svg` is a dotted land version on the same grid). The worker lives at https://visitors.huchaoran.com (set as `ENDPOINT` at the top of that file); if `ENDPOINT` is empty the map stays hidden. It has its own address on huchaoran.com, whose DNS is on Cloudflare, because workers.dev is blocked in mainland China; the old https://visitors.huchaoran-stat.workers.dev address still reaches the same worker.

## Previewing locally

```
python3 -m http.server
```

Then open http://localhost:8000.

## Hosting reference

* GitHub Pages: repository Settings, then Pages, deploys from `main`, folder `/ (root)`, with custom domain `huchaoran.com` and "Enforce HTTPS" on.
* Domain: registered at Squarespace. Its DNS has four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and a `CNAME` record for `www` pointing to `chaoranhu.github.io`.
