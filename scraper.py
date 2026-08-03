import feedparser
import json
import os
from datetime import datetime

# Ada Derana RSS Feed URLs (Sinhala & Alternative)
RSS_URLS = [
    "http://sinhala.adaderana.lk/rss.php",
    "https://www.adaderana.lk/rss.php"
]

BACKUP_FILE = "derana_news.json"

def run_backup():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching news from Ada Derana...")
    
    # 1. දැනට පවතින `derana_news.json` එක Read කිරීම
    existing_data = []
    if os.path.exists(BACKUP_FILE):
        try:
            with open(BACKUP_FILE, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except (json.JSONDecodeError, ValueError):
            existing_data = []

    existing_links = {item.get('link') for item in existing_data if isinstance(item, dict) and 'link' in item}
    new_count = 0

    # 2. Feeds හරහා Loop කර Data ලබාගැනීම
    for url in RSS_URLS:
        print(f"Fetching from: {url}")
        feed = feedparser.parse(url, request_headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        
        if not feed.entries:
            continue

        for entry in feed.entries:
            news_link = getattr(entry, 'link', '')
            
            if news_link and news_link not in existing_links:
                news_item = {
                    "id": len(existing_data) + 1,
                    "title": getattr(entry, 'title', ''),
                    "link": news_link,
                    "published": getattr(entry, 'published', getattr(entry, 'updated', '')),
                    "summary": getattr(entry, 'summary', getattr(entry, 'description', '')),
                    "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
                existing_data.append(news_item)
                existing_links.add(news_link)
                new_count += 1

    # 3. Save to JSON File
    with open(BACKUP_FILE, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)

    print(f"[+] සාර්ථකයි! අලුත් News {new_count}ක් එකතු විය. (Total: {len(existing_data)})")

if __name__ == "__main__":
    run_backup()
