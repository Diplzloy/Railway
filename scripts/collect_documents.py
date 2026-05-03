#!/usr/bin/env python3
"""
Скрипт для сбора нормативных документов по пожарной безопасности.
Парсит списки документов с ключевых сайтов, скачивает PDF с docs.cntd.ru,
загружает в Supabase Storage без дублирований.

Запуск:
  pip install requests beautifulsoup4 supabase python-dotenv lxml
  python collect_documents.py
"""

import os
import re
import time
import hashlib
import logging
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from urllib.parse import urljoin, quote
from datetime import datetime

# ── Настройки ──────────────────────────────────────────────────────────────
SUPABASE_URL = "https://omocijrnaacstnxktouw.supabase.co"
SUPABASE_KEY = "sb_publishable_4zz3mJOG1inyVwX33jjBGw_Kf39uQNj"
BUCKET_NAME  = "documents"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept-Language": "ru-RU,ru;q=0.9",
}
DELAY = 2.0          # секунды между запросами (вежливо)
MAX_DOCS = 200       # максимум документов за один запуск

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("collect.log")],
)
log = logging.getLogger(__name__)

# ── Категории ───────────────────────────────────────────────────────────────
CATEGORY_MAP = {
    "федеральный закон": "Федеральные законы",
    "фз-": "Федеральные законы",
    "№123-фз": "Федеральные законы",
    "свод правил": "Своды правил (СП)",
    " сп ": "Своды правил (СП)",
    "гост": "ГОСТы",
    "постановление": "Постановления",
    "приказ мчс": "Приказы МЧС",
    "письмо мчс": "Письма МЧС",
    "снип": "СНиПы",
    "нпб": "НПБ/ППБ",
    "ппб": "НПБ/ППБ",
}

def detect_category(title: str) -> str:
    t = title.lower()
    for key, cat in CATEGORY_MAP.items():
        if key in t:
            return cat
    return "Прочее"

# ── Вспомогательные функции ─────────────────────────────────────────────────
def get(url: str, timeout=15) -> requests.Response | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout)
        r.raise_for_status()
        return r
    except Exception as e:
        log.warning(f"GET {url} → {e}")
        return None

def extract_year(text: str) -> int:
    m = re.search(r'\b(19|20)\d{2}\b', text)
    return int(m.group()) if m else 0

def doc_id(title: str) -> str:
    """Нормализованный ID для проверки дубликатов."""
    return hashlib.md5(re.sub(r'\s+', ' ', title.lower().strip()).encode()).hexdigest()[:12]

# ── Парсеры сайтов ──────────────────────────────────────────────────────────
def parse_fireman_club() -> list[dict]:
    """Парсит каталог нормативных документов fireman.club"""
    log.info("Парсинг fireman.club...")
    docs = []
    base = "https://fireman.club"
    cats = [
        "/normativnye-dokumenty/gost/",
        "/normativnye-dokumenty/postanovleniya/",
        "/normativnye-dokumenty/rukovodyashchie-dokumenty/",
        "/normativnye-dokumenty/npb/",
        "/normativnye-dokumenty/ppb/",
        "/normativnye-dokumenty/svody-pravil/",
        "/normativnye-dokumenty/prikazy/",
        "/normativnye-dokumenty/snip/",
        "/normativnye-dokumenty/pisma-i-kontseptsii/",
        "/normativnye-dokumenty/ukazy/",
        "/normativnye-dokumenty/federalnye-zakony/",
    ]
    for cat_url in cats:
        r = get(base + cat_url)
        if not r:
            continue
        soup = BeautifulSoup(r.text, "lxml")
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            title = a.get_text(strip=True)
            if len(title) < 10:
                continue
            if any(kw in title.lower() for kw in ["гост", "сп ", "нпб", "ппб", "снип", "фз", "постановление", "приказ", "письмо"]):
                docs.append({
                    "title": title,
                    "source_url": urljoin(base, href),
                    "category": detect_category(title),
                    "year": extract_year(title),
                })
        time.sleep(DELAY)
    log.info(f"fireman.club: {len(docs)} документов")
    return docs

def parse_propb() -> list[dict]:
    """Парсит библиотеку нормативной базы propb.ru"""
    log.info("Парсинг propb.ru...")
    docs = []
    r = get("https://propb.ru/library/normativnaya-baza/")
    if not r:
        return docs
    soup = BeautifulSoup(r.text, "lxml")
    for a in soup.select("a[href]"):
        title = a.get_text(strip=True)
        href = a.get("href", "")
        if len(title) < 10:
            continue
        if any(kw in title.lower() for kw in ["гост", " сп ", "нпб", "снип", "фз", "постановление", "приказ"]):
            docs.append({
                "title": title,
                "source_url": urljoin("https://propb.ru", href),
                "category": detect_category(title),
                "year": extract_year(title),
            })
    log.info(f"propb.ru: {len(docs)} документов")
    return docs

def parse_vniipo() -> list[dict]:
    """Парсит публикации ВНИИПО МЧС"""
    log.info("Парсинг firesafety-vniipo.ru...")
    docs = []
    for url in [
        "https://firesafety-vniipo.ru/publications/",
        "https://firesafety-vniipo.ru/normativy/",
    ]:
        r = get(url)
        if not r:
            continue
        soup = BeautifulSoup(r.text, "lxml")
        for a in soup.select("a[href]"):
            title = a.get_text(strip=True)
            href = a.get("href", "")
            if len(title) < 10:
                continue
            if any(kw in title.lower() for kw in ["гост", " сп ", "нпб", "снип", "фз", "постановление", "требования"]):
                docs.append({
                    "title": title,
                    "source_url": urljoin("https://firesafety-vniipo.ru", href),
                    "category": detect_category(title),
                    "year": extract_year(title),
                })
        time.sleep(DELAY)
    log.info(f"vniipo: {len(docs)} документов")
    return docs

def parse_mchs() -> list[dict]:
    """Парсит приказы и документы МЧС России"""
    log.info("Парсинг mchs.gov.ru...")
    docs = []
    for url in [
        "https://mchs.gov.ru/dokumenty/normativnye-pravovye-akty/",
        "https://mchs.gov.ru/dokumenty/prikazy/",
    ]:
        r = get(url)
        if not r:
            continue
        soup = BeautifulSoup(r.text, "lxml")
        for a in soup.select("a[href]"):
            title = a.get_text(strip=True)
            href = a.get("href", "")
            if len(title) < 10:
                continue
            if any(kw in title.lower() for kw in ["пожар", "противопожар", "фз", "приказ", "гост", "сп "]):
                docs.append({
                    "title": title,
                    "source_url": urljoin("https://mchs.gov.ru", href),
                    "category": detect_category(title),
                    "year": extract_year(title),
                })
        time.sleep(DELAY)
    log.info(f"mchs.gov.ru: {len(docs)} документов")
    return docs

# ── Скачивание PDF с docs.cntd.ru ───────────────────────────────────────────
def search_cntd(title: str) -> str | None:
    """Ищет документ на docs.cntd.ru и возвращает URL для скачивания PDF."""
    query = quote(title[:100])
    r = get(f"https://docs.cntd.ru/search?text={query}&collection=normative")
    if not r:
        return None
    soup = BeautifulSoup(r.text, "lxml")
    # Берём первый результат
    link = soup.select_one("a.search-result__title, a.document-title, .search-item a")
    if not link:
        return None
    doc_url = urljoin("https://docs.cntd.ru", link["href"])
    # Ищем кнопку PDF на странице документа
    time.sleep(DELAY)
    r2 = get(doc_url)
    if not r2:
        return None
    soup2 = BeautifulSoup(r2.text, "lxml")
    pdf_link = soup2.select_one("a[href*='.pdf'], a[href*='/download'], a.btn-download")
    if pdf_link:
        return urljoin("https://docs.cntd.ru", pdf_link["href"])
    return None

def download_pdf(url: str) -> bytes | None:
    """Скачивает PDF-файл."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=60, stream=True)
        r.raise_for_status()
        if "pdf" not in r.headers.get("Content-Type", "").lower():
            return None
        return r.content
    except Exception as e:
        log.warning(f"Скачивание PDF {url} → {e}")
        return None

# ── Supabase ────────────────────────────────────────────────────────────────
def init_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_existing_ids(sb: Client) -> set[str]:
    """Возвращает множество doc_id уже загруженных документов."""
    try:
        res = sb.table("documents").select("id").execute()
        return {row["id"] for row in (res.data or [])}
    except Exception:
        return set()

def upload_to_storage(sb: Client, filename: str, content: bytes) -> str | None:
    """Загружает PDF в Supabase Storage, возвращает публичный URL."""
    try:
        path = f"pdf/{filename}"
        sb.storage.from_(BUCKET_NAME).upload(
            path, content, {"content-type": "application/pdf", "upsert": "false"}
        )
        return sb.storage.from_(BUCKET_NAME).get_public_url(path)
    except Exception as e:
        log.warning(f"Storage upload {filename} → {e}")
        return None

def save_document(sb: Client, doc: dict) -> bool:
    """Сохраняет метаданные документа в таблицу documents."""
    try:
        sb.table("documents").insert({
            "id": doc["doc_id"],
            "title": doc["title"][:500],
            "description": doc.get("description", ""),
            "category": doc["category"],
            "file_url": doc.get("file_url"),
            "file_size": doc.get("file_size"),
            "published_at": doc.get("published_at", datetime.now().strftime("%Y-%m-%d")),
            "is_free": False,
            "source": doc.get("source_url", ""),
        }).execute()
        return True
    except Exception as e:
        log.warning(f"DB insert {doc['title'][:50]} → {e}")
        return False

def ensure_bucket(sb: Client):
    """Создаёт публичный bucket если его нет."""
    try:
        buckets = [b.name for b in sb.storage.list_buckets()]
        if BUCKET_NAME not in buckets:
            sb.storage.create_bucket(BUCKET_NAME, {"public": True})
            log.info(f"Bucket '{BUCKET_NAME}' создан")
    except Exception as e:
        log.warning(f"Bucket check → {e}")

# ── Дедупликация ─────────────────────────────────────────────────────────────
def deduplicate(docs: list[dict]) -> list[dict]:
    """
    Убирает дубликаты по нормализованному названию.
    При совпадении оставляет документ с бо́льшим годом.
    """
    seen: dict[str, dict] = {}
    for d in docs:
        key = doc_id(d["title"])
        d["doc_id"] = key
        if key not in seen or d["year"] > seen[key]["year"]:
            seen[key] = d
    return list(seen.values())

# ── Главный цикл ─────────────────────────────────────────────────────────────
def main():
    log.info("=== Запуск сбора документов ===")
    sb = init_supabase()
    ensure_bucket(sb)

    # Собираем со всех источников
    raw = []
    raw += parse_fireman_club()
    raw += parse_propb()
    raw += parse_vniipo()
    raw += parse_mchs()
    log.info(f"Всего собрано (сырых): {len(raw)}")

    # Дедупликация
    docs = deduplicate(raw)
    log.info(f"После дедупликации: {len(docs)}")

    # Исключаем уже загруженные
    existing = get_existing_ids(sb)
    docs = [d for d in docs if d["doc_id"] not in existing]
    log.info(f"Новых (не в базе): {len(docs)}")

    # Ограничение за один запуск
    docs = docs[:MAX_DOCS]
    log.info(f"Обрабатываем: {len(docs)}")

    ok = 0
    fail = 0
    for i, doc in enumerate(docs, 1):
        log.info(f"[{i}/{len(docs)}] {doc['title'][:70]}")

        # Ищем PDF на docs.cntd.ru
        pdf_url = search_cntd(doc["title"])
        if pdf_url:
            pdf_bytes = download_pdf(pdf_url)
            if pdf_bytes:
                size_kb = len(pdf_bytes) // 1024
                filename = f"{doc['doc_id']}.pdf"
                public_url = upload_to_storage(sb, filename, pdf_bytes)
                doc["file_url"] = public_url
                doc["file_size"] = f"{size_kb} KB" if size_kb < 1024 else f"{size_kb//1024:.1f} MB"
                log.info(f"  ✓ PDF {doc['file_size']}")
            else:
                log.info("  ✗ PDF не скачался")
        else:
            log.info("  ✗ PDF на cntd.ru не найден")

        if save_document(sb, doc):
            ok += 1
        else:
            fail += 1

        time.sleep(DELAY)

    log.info(f"=== Готово: загружено {ok}, ошибок {fail} ===")

if __name__ == "__main__":
    main()
