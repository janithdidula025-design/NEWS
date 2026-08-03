import feedparser
import json
import re
import urllib.request
from datetime import datetime

RSS_URL = "http://sinhala.adaderana.lk/rss.php"

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean_text = re.sub(r'<[^>]+>', '', raw_html)
    return clean_text.strip()

def extract_image_url(entry):
    if 'media_content' in entry and len(entry.media_content) > 0:
        return entry.media_content[0].get('url', '')
    if 'media_thumbnail' in entry and len(entry.media_thumbnail) > 0:
        return entry.media_thumbnail[0].get('url', '')

    content_to_search = entry.get('summary', '') + entry.get('description', '')
    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content_to_search, re.IGNORECASE)
    if img_match:
        return img_match.group(1)

    return ""

def fetch_and_save_news():
    print("Fetching news from Ada Derana RSS...")
    
    # User-Agent header එකක් එකතු කිරීම (Server block වීම වැළැක්වීමට)
    req = urllib.request.Request(
        RSS_URL, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )

    try:
        response = urllib.request.urlopen(req, timeout=15)
        xml_data = response.read()
        feed = feedparser.parse(xml_data)
    except Exception as e:
        print(f"Error fetching RSS Feed: {e}")
        return

    news_list = []

    for entry in feed.entries:
        title = entry.get('title', '').strip()
        link = entry.get('link', '').strip()
        published = entry.get('published', '') or entry.get('updated', '')
        raw_summary = entry.get('summary', '') or entry.get('description', '')
        
        image_url = extract_image_url(entry)
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

    print(f"Successfully extracted {len(news_list)} news items.")

    # Data නැත්නම් පරණ JSON එක Overwrite වීම වැළැක්වීම
    if len(news_list) > 0:
        with open('derana_news.json', 'w', encoding='utf-8') as f:
            json.dump(news_list, f, ensure_ascii=False, indent=4)
        print("Updated derana_news.json with fresh data!")
    else:
        print("Warning: No news items found! Skipping JSON overwrite.")

if __name__ == "__main__":
    fetch_and_save_news()
