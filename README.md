# huchaoran.com

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
| `assets/img/` | Portrait, social icons, photos and figures |

## Adding a photo

1. Put the image in `assets/img/mammal/`, `assets/img/bird/` or `assets/img/nature/` (about 1280 px wide keeps the page fast).
2. In `photographer/index.html`, copy one `<figure>` line inside that section and change the file name. The slider buttons, dots and counter update on their own.

To add a new section, create a new folder under `assets/img/` and copy a whole `<h2>` plus `<div class="carousel">` block.

## Previewing locally

```
python3 -m http.server
```

Then open http://localhost:8000.

## Launch checklist: moving huchaoran.com from Google Sites to GitHub Pages

1. Merge the site into the branch GitHub Pages will publish (for example `main`).
2. In the repository, open Settings, then Pages. Under "Build and deployment" choose "Deploy from a branch", pick that branch and the `/ (root)` folder, and save. The site appears at https://chaoranhu.github.io/huchaoran.github.io/ within a minute or two. Check every page there.
3. In the same Pages screen, enter `www.huchaoran.com` as the custom domain and save. GitHub adds a `CNAME` file to the branch for you.
4. At your domain registrar (where huchaoran.com was bought), replace the Google Sites DNS records:
   * Delete the `CNAME` record for `www` that points to `ghs.googlehosted.com` and add a `CNAME` record for `www` pointing to `chaoranhu.github.io`.
   * Delete any `A` records for the bare domain `huchaoran.com` that point to Google, and add four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
5. In Google Sites, open the site's Settings, then Custom domains, and remove huchaoran.com so Google stops claiming it.
6. Wait for DNS to update (usually under an hour, sometimes up to a day). When the Pages screen shows the DNS check as successful, tick "Enforce HTTPS".
7. Visit https://huchaoran.com, https://www.huchaoran.com and each page to confirm everything loads from GitHub.
8. Only then delete or unpublish the old Google Site. Every image and file the new site uses already lives in this repository, so nothing breaks when Google Sites goes away.

Optional: in Settings, then Pages, use "Verify domain" for huchaoran.com so no other GitHub account can claim it.
