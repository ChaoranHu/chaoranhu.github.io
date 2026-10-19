# chaoranhu.github.io (huchaoran.com)

Source for Chaoran Hu's personal website, rebuilt from the original Google Site as plain HTML and CSS. GitHub Pages serves it directly; there is no build step.

## Layout

| Path | Page |
| --- | --- |
| `index.html` | Home |
| `statistician/index.html` | Statistician |
| `statistician/whodrug/index.html` | My note of WHODrug |
| `statistician/e9r1_note/index.html` | My note of E9(R1) |
| `photographer/index.html` | Photographer gallery |
| `home/index.html` | Redirect from the old `/home` address |
| `assets/css/style.css` | All styling |
| `assets/js/carousel.js` | Photo sliders |
| `assets/img/` | Portrait, photos and figures |
| `assets/img/ornaments/` | Hand drawn section sketches (SVG) |

## Look

* Font: Cormorant Garamond (Google Fonts) for all text.
* Colours: white page with a few greys, set as variables at the top of `style.css` (`--ink`, `--text`, `--muted`, `--line`, `--hair`, `--pale`). Photos stay in full colour on white.
* Sections: on the Photographer and Statistician pages each title sits on a pale full width band (`<div class="section-head">`) under a small hand drawn sketch; the content below stays on white.

## Adding a photo

1. Resize the image to about 1800 px on its long side, remove its EXIF and location data, and put it in `assets/img/wildlife/`, `assets/img/nature/` or `assets/img/humanistics/`.
2. In `photographer/index.html`, copy one `<figure>` line inside that section, change the file name and write a short `alt` description. The slider buttons, dots and counter update on their own.

A section with no photos shows "Coming soon": replace that paragraph with the carousel block given in the comment at the top of `photographer/index.html`.

To add a new section, create a new folder under `assets/img/` and copy a whole `<div class="section-head">` plus `<div class="carousel">` block.

## Section sketches

The sketches are single colour SVG files in `assets/img/ornaments/`. CSS uses each one as a mask and fills it with the text grey, so the drawing's own colour does not matter. Each has a class in `style.css`, for example `.ornament-birds`, and is placed with:

```
<span class="ornament ornament-birds" aria-hidden="true"></span>
```

To add one, save the SVG in that folder, add a `.ornament-name` rule next to the others (its `--src` path and `aspect-ratio`), and put the span above the section's `<h2>`. If you redraw an existing SVG, bump the `?v=` at the end of its path in `style.css` so browsers fetch the new drawing.

## Previewing locally

```
python3 -m http.server
```

Then open http://localhost:8000.

## Launch checklist: moving huchaoran.com from Google Sites to GitHub Pages

Steps 1 and 2 are already done; the site is live at https://chaoranhu.github.io/ (the repository is named `chaoranhu.github.io`, which makes it a GitHub user site served from the root).

1. Merge the site into the branch GitHub Pages will publish (for example `main`).
2. In the repository, open Settings, then Pages. Under "Build and deployment" choose "Deploy from a branch", pick that branch and the `/ (root)` folder, and save. The site appears at https://chaoranhu.github.io/ within a minute or two. Check every page there.
3. In the same Pages screen, enter `huchaoran.com` as the custom domain and save. GitHub adds a `CNAME` file to the branch for you.
4. At your domain registrar (where huchaoran.com was bought), replace the Google Sites DNS records:
   * Delete the `CNAME` record for `www` that points to `ghs.googlehosted.com` and add a `CNAME` record for `www` pointing to `chaoranhu.github.io`.
   * Delete any `A` records for the bare domain `huchaoran.com` that point to Google, and add four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
5. In Google Sites, open the site's Settings, then Custom domains, and remove huchaoran.com so Google stops claiming it.
6. Wait for DNS to update (usually under an hour, sometimes up to a day). When the Pages screen shows the DNS check as successful, tick "Enforce HTTPS".
7. Visit https://huchaoran.com, https://www.huchaoran.com and each page to confirm everything loads from GitHub.
8. Only then delete or unpublish the old Google Site. Every image and file the new site uses already lives in this repository, so nothing breaks when Google Sites goes away.

Optional: verify the domain so no other GitHub account can claim it. This lives in your personal account settings, not the repository: click your profile picture, then Settings, then Pages (under "Code, planning, and automation"), then "Add a domain" and enter huchaoran.com. GitHub shows a TXT record named `_github-pages-challenge-ChaoranHu`; add it at your registrar (Squarespace, under DNS settings), wait for it to take effect, then click "Verify".

## After changing the CSS or JavaScript

Browsers keep `style.css` and `carousel.js` for about 10 minutes, so phones may show the old look right after a change. Pages load them as `style.css?v=16` and `carousel.js?v=16`; bump that number in every `index.html` whenever you edit either file and visitors get the new version straight away.
