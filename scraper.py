import feedparser
import json
import os
from datetime import datetime

# Ada Derana Sinhala RSS Feed URL
RSS_URL = "http://sinhala.adaderana.lk/rss.php"
BACKUP_FILE = "derana_news.json"

def run_backup():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching news from Ada Derana...")
    
    # 1. RSS Feed එක Fetch කරගැනීම
    feed = feedparser.parse(RSS_URL)
    if not feed.entries:
        print("[-] RSS feed එකෙන් Data ලබාගැනීමට නොහැකි විය.")
        return

    # 2. දැනට තියෙන `derana_news.json` එක Read කිරීම
    existing_data = []
    if os.path.exists(BACKUP_FILE):
        try:
            with open(BACKUP_FILE, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except (json.JSONDecodeError, ValueError):
            # File එක empty නම් හෝ invalid නම් empty list එකක් ගනී
            existing_data = []

    # Duplicate news එකතු වීම වැලැක්වීමට තියෙන Links ටික Set එකකට ගැනීම
    existing_links = {item.get('link') for item in existing_data if isinstance(item, dict) and 'link' in item}
    new_count = 0

    # 3. අලුත් News ටික සොයා List එකට Append කිරීම
    for entry in feed.entries:
        news_link = getattr(entry, 'link', '')
        
        if news_link and news_link not in existing_links:
            news_item = {
                "id": len(existing_data) + 1,
                "title": getattr(entry, 'title', ''),
                "link": news_link,
                "published": getattr(entry, 'published', ''),
                "summary": getattr(entry, 'summary', ''),
                "fetched_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            existing_data.append(news_item)
            existing_links.add(news_link)
            new_count += 1

    # 4. JSON File එකට අලුත් Data සමඟ Save කිරීම
    with open(BACKUP_FILE, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)

    if new_count > 0:
        print(f"[+] සාර්ථකයි! අලුත් News {new_count}ක් එකතු විය. (Total: {len(existing_data)})")
    else:
        print("[i] අලුත් News කිසිවක් හමු වූයේ නැත.")

if __name__ == "__main__":
    run_backup()
