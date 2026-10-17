"""One time helper: copy page sources and selected images from the old Google Site.

Runs in GitHub Actions (see .github/workflows/mirror-google-site.yml).
"""
import html
import os
import re
import sys
import urllib.request

SITE = "https://www.huchaoran.com/"
PAGES = ["home", "statistician", "photographer", "statistician/whodrug", "statistician/e9r1_note"]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

# Photographer page: which photos (1 based, in page order) to keep, per section.
# Mammal photos are 1 to 31, Bird 32 to 48, Nature 49 to 59.
PICKS = {"mammal": [1, 5, 10, 20], "bird": [32, 37, 43], "nature": [49, 53, 57]}


def get(url, referer=SITE):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": referer})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def images(page_html):
    urls = re.findall(r'<img[^>]+src="([^"]+)"', page_html)
    return [html.unescape(u) for u in urls]


def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)
    print(f"{path}: {len(data)} bytes")


def main():
    sources = {}
    for page in PAGES:
        data = get(SITE + page)
        sources[page] = data.decode("utf-8")
        save(f"_source/{page.replace('/', '_')}.html", data)

    failures = 0

    def fetch(url, path):
        nonlocal failures
        try:
            save(path, get(url, SITE))
        except Exception as e:  # keep going, report at the end
            failures += 1
            print(f"FAILED {path} {url[:90]}: {e}")

    home = images(sources["home"])
    print("home images:", *home, sep="\n  ")
    for i, url in enumerate(home, 1):
        fetch(url, f"_source/home_img/{i:02d}")

    photos = [u for u in images(sources["photographer"]) if "sitesv-images" in u]
    print(f"photographer page has {len(photos)} photos")
    for section, picks in PICKS.items():
        for n, idx in enumerate(picks, 1):
            fetch(photos[idx - 1], f"assets/img/{section}/{n:02d}.jpg")

    note = [u for u in images(sources["statistician/e9r1_note"]) if "sitesv-images" in u]
    for n, url in enumerate(note, 1):
        fetch(url, f"assets/img/notes/e9r1-{n}.jpg")

    print("failures:", failures)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
