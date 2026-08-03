import feedparser
import json
import re
import urllib.request
from datetime import datetime

RSS_URL = "http://sinhala.adaderana.lk/rss.php"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

def clean_html(raw_html):
    if not raw_html:
        return ""
    return re.sub(r'<[^>]+>', '', raw_html).strip()

def extract_image(entry):
    if 'media_content' in entry and len(entry.media_content) > 0:
        return entry.media_content[0].get('url', '')
    
    content = entry.get('summary', '') + entry.get('description', '')
    match = re.search(r'src=["\'](https?://[^"\']+\.(?:jpg|png|jpeg))["\']', content, re.IGNORECASE)
    if match:
        return match.group(1)
    
    match_any = re.search(r'src=["\']([^"\']+)["\']', content)
    return match_any.group(1) if match_any else ""

def main():
    print("Fetching news from Ada Derana RSS...")
    req = urllib.request.Request(RSS_URL, headers=HEADERS)

    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            xml_data = response.read().decode('utf-8')
            feed = feedparser.parse(xml_data)

            news_items = []
            for entry in feed.entries:
                title = entry.get('title', '').strip()
                link = entry.get('link', '').strip()
                summary = clean_html(entry.get('summary', '') or entry.get('description', ''))
                image = extract_image(entry)
                pub_date = entry.get('published', '') or datetime.now().strftime("%Y-%m-%d %H:%M")

                if title and link:
                    news_items.append({
                        "title": title,
                        "link": link,
                        "published": pub_date,
                        "summary": summary,
                        "image": image
                    })

            if len(news_items) > 0:
                with open('derana_news.json', 'w', encoding='utf-8') as f:
                    json.dump(news_items, f, ensure_ascii=False, indent=4)
                print(f"✅ Success! Saved {len(news_items)} news items to derana_news.json")
            else:
                print("⚠️ No news items found in feed.")

    except Exception as e:
        print(f"❌ Error fetching feed: {e}")

if __name__ == "__main__":
    main()
