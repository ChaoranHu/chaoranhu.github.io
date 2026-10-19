# chaoranhu.github.io (huchaoran.com)

Source for Chaoran Hu's personal website, written as plain HTML and CSS. GitHub Pages serves it directly from the root of `main`; there is no build step. It is live at https://huchaoran.com (also https://chaoranhu.github.io/).

## Layout

| Path | Page |
| --- | --- |
| `index.html` | Home |
| `statistician/index.html` | Statistician |
| `statistician/whodrug/index.html` | My note of WHODrug |
| `statistician/e9r1_note/index.html` | My note of E9(R1) |
| `photographer/index.html` | Photographer gallery |
| `home/index.html` | Redirect so old `/home` links still reach the home page |
| `assets/css/style.css` | All styling |
| `assets/js/carousel.js` | Photo sliders |
| `assets/img/portrait.jpg` | Home page portrait |
| `assets/img/wildlife/`, `nature/`, `humanistics/` | Photos, one folder per section |
| `assets/img/notes/` | Figures used in the notes |
| `assets/img/ornaments/` | Hand drawn sketches (SVG) |
| `assets/img/icons/`, `favicon.ico` | Browser tab and home screen icons |
| `CNAME` | Custom domain for GitHub Pages; keep this file |

## Look

* Font: Cormorant Garamond (Google Fonts) for all text.
* Colours: white page with a few greys, set as variables at the top of `style.css` (`--ink`, `--text`, `--muted`, `--line`, `--hair`, `--pale`). Photos stay in full colour on white.
* Header: the name on the left links home, and the pines sketch sits at the right end.
* Sections: on the Photographer and Statistician pages each title sits on a pale full width band (`<div class="section-head">`) under a small hand drawn sketch; the content below stays on white.

## Adding a photo

1. Resize the image to about 1800 px on its long side, remove its EXIF and location data, and put it in `assets/img/wildlife/`, `assets/img/nature/` or `assets/img/humanistics/`.
2. In `photographer/index.html`, copy one `<figure>` line inside that section, change the file name and write a short `alt` description. The slider buttons, dots and counter update on their own.

To add a new section, create a new folder under `assets/img/` and copy a whole `<div class="section-head">` plus `<div class="carousel">` block.

## Section sketches

The sketches are single colour SVG files in `assets/img/ornaments/`. CSS uses each one as a mask and fills it with the text grey, so the drawing's own colour does not matter. Each has a class in `style.css`, for example `.ornament-birds`, and is placed with:

```
<span class="ornament ornament-birds" aria-hidden="true"></span>
```

To add one, save the SVG in that folder, add a `.ornament-name` rule next to the others (its `--src` path and `aspect-ratio`), and put the span above the section's `<h2>`. If you redraw an existing SVG, bump the `?v=` at the end of its path in `style.css` so browsers fetch the new drawing.

## After changing the CSS or JavaScript

Browsers keep `style.css` and `carousel.js` for about 10 minutes, so phones may show the old look right after a change. Pages load them as `style.css?v=17` and `carousel.js?v=17`; bump that number in every `index.html` whenever you edit either file and visitors get the new version straight away.

## Previewing locally

```
python3 -m http.server
```

Then open http://localhost:8000.

## Hosting reference

* GitHub Pages: repository Settings, then Pages, deploys from `main`, folder `/ (root)`, with custom domain `huchaoran.com` and "Enforce HTTPS" on.
* Domain: registered at Squarespace. Its DNS has four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and a `CNAME` record for `www` pointing to `chaoranhu.github.io`.
