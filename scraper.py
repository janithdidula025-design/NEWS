import feedparser
import json
import os
from datetime import datetime

# Ada Derana Sinhala RSS Feed URL
SINHALA_RSS_URL = "http://sinhala.adaderana.lk/rss.php"
BACKUP_FILE = "derana_news.json"

def run_backup():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching Sinhala news from Ada Derana...")
    
    # User-Agent එකක් සමඟ Sinhala Feed එක Fetch කරගැනීම
    feed = feedparser.parse(
        SINHALA_RSS_URL, 
        request_headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    
    if not feed.entries:
        print("[-] සිංහල RSS feed එකෙන් Data ලබාගැනීමට නොහැකි විය.")
        return

    # දැනට තියෙන `derana_news.json` එක Read කිරීම
    existing_data = []
    if os.path.exists(BACKUP_FILE):
        try:
            with open(BACKUP_FILE, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except (json.JSONDecodeError, ValueError):
            existing_data = []

    # Duplicate news එකතු වීම වැලැක්වීමට Links ටික ලබාගැනීම
    existing_links = {item.get('link') for item in existing_data if isinstance(item, dict) and 'link' in item}
    new_count = 0

    # News එකින් එක Check කර එකතු කිරීම
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

    # `derana_news.json` එකට Save කිරීම
    with open(BACKUP_FILE, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)

    print(f"[+] සාර්ථකයි! අලුත් සිංහල පුවත් {new_count}ක් එකතු විය. (Total: {len(existing_data)})")

if __name__ == "__main__":
    run_backup()
