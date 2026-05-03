#!/usr/bin/env python3
"""
Парсит fireman.club и сохраняет список документов в JSON.
Запускать локально или там где есть доступ к интернету.
"""
import json, time, re, hashlib, requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

HEADERS = {"User-Agent": "Mozilla/5.0 Chrome/120"}
DELAY = 1.5

CATEGORY_MAP = {
    "свод правил": "Своды правил (СП)",
    "сп ": "Своды правил (СП)",
    "гост": "ГОСТы",
    "федеральный закон": "Федеральные законы",
    "фз ": "Федеральные законы",
    "постановление": "Постановления",
    "приказ": "Приказы МЧС",
    "письмо": "Письма МЧС",
    "снип": "СНиПы",
    "нпб": "НПБ/ППБ",
    "ппб": "НПБ/ППБ",
}

def detect_cat(title):
    t = title.lower()
    for k, v in CATEGORY_MAP.items():
        if k in t: return v
    return "Прочее"

def extract_year(text):
    m = re.search(r'\b(19|20)\d{2}\b', text)
    return int(m.group()) if m else 0

def get(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return r
    except Exception as e:
        print(f"  SKIP {url}: {e}")
        return None

base = "https://fireman.club"
CATS = [
    "/normativnye-dokumenty/gost/",
    "/normativnye-dokumenty/npb/",
    "/normativnye-dokumenty/ppb/",
    "/normativnye-dokumenty/svody-pravil/",
    "/normativnye-dokumenty/prikazy/",
    "/normativnye-dokumenty/snip/",
]

docs = {}
for cat_url in CATS:
    print(f"Парсинг {cat_url}...")
    # Несколько страниц пагинации
    for page in range(1, 10):
        url = base + cat_url + (f"page/{page}/" if page > 1 else "")
        r = get(url)
        if not r or (page > 1 and r.url == base + cat_url):
            break
        soup = BeautifulSoup(r.text, "lxml")
        links = soup.select("h2 a, h3 a, .entry-title a, article a")
        if not links:
            links = soup.select("a[href*='/normativnye-dokumenty/']")
        found = 0
        for a in links:
            title = a.get_text(strip=True)
            href = a.get("href", "")
            if len(title) < 8 or "normativnye-dokumenty" not in href:
                continue
            did = hashlib.md5(title.lower().strip().encode()).hexdigest()[:12]
            year = extract_year(title)
            if did not in docs or year > docs[did]["year"]:
                docs[did] = {
                    "id": did,
                    "title": title,
                    "category": detect_cat(title),
                    "year": year,
                    "source_url": urljoin(base, href),
                    "published_at": f"{year}-01-01" if year else "2020-01-01",
                    "is_free": False,
                }
            found += 1
        print(f"  стр.{page}: {found} документов")
        if found == 0:
            break
        time.sleep(DELAY)

result = list(docs.values())
result.sort(key=lambda x: (-x["year"], x["title"]))
with open("documents_parsed.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print(f"\nИтого: {len(result)} документов → documents_parsed.json")
