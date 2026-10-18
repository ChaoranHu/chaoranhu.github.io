# One time helper: saves Chaoran's recent public Instagram photos into _ig/.
import json, os, urllib.request

USER = "chaoran_hu"
os.makedirs("_ig", exist_ok=True)
log = open("_ig/log.txt", "w")

def get(url, headers):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
data = None
for host in ("https://i.instagram.com", "https://www.instagram.com"):
    try:
        raw = get(f"{host}/api/v1/users/web_profile_info/?username={USER}",
                  {"User-Agent": ua, "x-ig-app-id": "936619743392459", "Accept": "*/*"})
        data = json.loads(raw)
        log.write(f"ok {host}\n")
        break
    except Exception as e:
        log.write(f"fail {host}: {e}\n")

if data:
    edges = data["data"]["user"]["edge_owner_to_timeline_media"]["edges"]
    captions = []
    n = 0
    for e in edges:
        node = e["node"]
        items = [c["node"] for c in node.get("edge_sidecar_to_children", {}).get("edges", [])] or [node]
        cap = node.get("edge_media_to_caption", {}).get("edges", [])
        cap = cap[0]["node"]["text"] if cap else ""
        for k, it in enumerate(items):
            if it.get("is_video"):
                continue
            n += 1
            name = f"{n:02d}_{node['shortcode']}_{k}.jpg"
            try:
                open(f"_ig/{name}", "wb").write(get(it["display_url"], {"User-Agent": ua}))
                captions.append({"file": name, "caption": cap, "w": it["dimensions"]["width"], "h": it["dimensions"]["height"]})
            except Exception as ex:
                log.write(f"img fail {name}: {ex}\n")
    json.dump(captions, open("_ig/captions.json", "w"), indent=1, ensure_ascii=False)
    log.write(f"saved {n}\n")
log.close()
