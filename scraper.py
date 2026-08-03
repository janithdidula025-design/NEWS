import feedparser
import json
import re
from datetime import datetime

# Ada Derana Sinhala RSS Feed URL
RSS_URL = "http://sinhala.adaderana.lk/rss.php"

def clean_html(raw_html):
    if not raw_html:
        return ""
    # Remove HTML tags using regex
    clean_text = re.sub(r'<[^>]+>', '', raw_html)
    return clean_text.strip()

def extract_image_url(entry):
    # 1. Try media_content or media_thumbnail from RSS
    if 'media_content' in entry and len(entry.media_content) > 0:
        return entry.media_content[0].get('url', '')
    if 'media_thumbnail' in entry and len(entry.media_thumbnail) > 0:
        return entry.media_thumbnail[0].get('url', '')

    # 2. Extract image src from summary or description using Regex
    content_to_search = entry.get('summary', '') + entry.get('description', '')
    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content_to_search, re.IGNORECASE)
    if img_match:
        return img_match.group(1)

    return ""

def fetch_and_save_news():
    print("Fetching news from Ada Derana RSS...")
    feed = feedparser.parse(RSS_URL)

    news_list = []

    for entry in feed.entries:
        title = entry.get('title', '').strip()
        link = entry.get('link', '').strip()
        published = entry.get('published', '') or entry.get('updated', '')
        
        # Get raw summary/description
        raw_summary = entry.get('summary', '') or entry.get('description', '')
        
        # Extract Image URL before cleaning summary
        image_url = extract_image_url(entry)
        
        # Clean HTML tags from summary
        clean_summary_text = clean_html(raw_summary)

        if title and link:
            news_list.append({
                'title': title,
                'link': link,
                'published': published,
                'summary': clean_summary_text,
                'image': image_url,
                'fetched_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

    print(f"Extracted {len(news_list)} news items.")

    # Save to JSON file
    with open('derana_news.json', 'w', encoding='utf-8') as f:
        json.dump(news_list, f, ensure_ascii=False, indent=4)

    print("Successfully updated derana_news.json!")

if __name__ == "__main__":
    fetch_and_save_news()
