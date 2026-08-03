import feedparser
import json
import os
import re
from datetime import datetime

# Ada Derana Sinhala RSS Feed URL
SINHALA_RSS_URL = "http://sinhala.adaderana.lk/rss.php"
BACKUP_FILE = "derana_news.json"

def extract_image(entry):
    """Extracts image URL using feedparser attributes or regex."""
    # 1. Check media_thumbnail / media_content
    if 'media_thumbnail' in entry and len(entry.media_thumbnail) > 0:
        return entry.media_thumbnail[0].get('url', '')
    if 'media_content' in entry and len(entry.media_content) > 0:
        return entry.media_content[0].get('url', '')

    # 2. Extract <img> src using regex from summary
    summary_html = getattr(entry, 'summary', getattr(entry, 'description', ''))
    if summary_html:
        match = re.search(r'<img[^>]+src=["\'](.*?)["\']', summary_html, re.IGNORECASE)
        if match:
            return match.group(1)

    return ""

def clean_html(raw_html):
    """Removes HTML tags using built-in regex."""
    if not raw_html:
        return ""
    clean_text = re.sub(r'<[^>]+>', '', raw_html)
    return clean_text.strip()

def run_backup():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching Sinhala news & images...")
    
    feed = feedparser.parse(
        SINHALA_RSS_URL, 
        request_headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    
    if not feed.entries:
        print("[-] RSS feed is empty or failed to respond.")
        return

    existing_data = []
    if os.path.exists(BACKUP_FILE):
        try:
            with open(BACKUP_FILE, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except (json.JSONDecodeError, ValueError):
            existing_data = []

    existing_links = {item.get('link') for item in existing_data if isinstance(item, dict) and 'link' in item}
    new_count = 0

    for entry in feed.entries:
        news_link = getattr(entry, 'link', '')
        
        if news_link and news_link not in existing_links:
            raw_summary = getattr(entry, 'summary', getattr(entry, 'description', ''))
            
            news_item = {
                "id": len(existing_data) + 1,
                "title": getattr(entry, 'title', ''),
                "link": news_link,
                "image": extract_image(entry),
                "published": getattr(entry, 'published', getattr(entry, 'updated', '')),
                "summary": clean_html(raw_summary),
                "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            existing_data.append(news_item)
            existing_links.add(news_link)
            new_count += 1

    with open(BACKUP_FILE, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)

    print(f"[+] Done! Added {new_count} new items with image references. (Total: {len(existing_data)})")

if __name__ == "__main__":
    run_backup()
