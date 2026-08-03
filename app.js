let allNews = [];

// 1. Fetch News Data safely
async function fetchNews() {
    const statusMsg = document.getElementById('status-msg');
    const timeStamp = new Date().getTime();

    // Try multiple possible relative paths for derana_news.json
    const pathsToTry = [
        `./derana_news.json?t=${timeStamp}`,
        `derana_news.json?t=${timeStamp}`,
        `../derana_news.json?t=${timeStamp}`
    ];

    let response = null;
    let fetchedData = null;

    for (const path of pathsToTry) {
        try {
            const res = await fetch(path);
            if (res.ok) {
                response = res;
                fetchedData = await res.json();
                break; // Stop loop if successful
            }
        } catch (e) {
            console.warn(`Failed to fetch from ${path}`, e);
        }
    }

    if (!fetchedData) {
        if (statusMsg) {
            statusMsg.innerText = "පුවත් Load කරගැනීමට නොහැකි විය (derana_news.json හමු නොවීය).";
            statusMsg.style.color = "red";
        }
        return;
    }

    allNews = fetchedData;

    if (!Array.isArray(allNews) || allNews.length === 0) {
        if (statusMsg) statusMsg.innerText = "පුවත් කිසිවක් හමු වූයේ නැත.";
        return;
    }

    // News ටික අලුත්ම එක උඩට එනසේ Reverse කිරීම
    allNews.reverse();

    if (statusMsg) statusMsg.style.display = 'none';
    renderNews(allNews);
}

// 2. Render News
function renderNews(newsList) {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '';

    if (newsList.length === 0) {
        newsContainer.innerHTML = '<p style="text-align:center;">සෙවීමට අදාළ පුවත් කිසිවක් නැත.</p>';
        return;
    }

    newsList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';

        // Check if valid image exists
        const imageHtml = (item.image && item.image.trim() !== '') 
            ? `<img src="${item.image}" alt="${item.title || 'News'}" style="width:100%; max-height:280px; object-fit:cover; border-radius:8px; margin-bottom:12px;" onerror="this.style.display='none'" />` 
            : '';

        card.innerHTML = `
            ${imageHtml}
            <h3><a href="${item.link || '#'}" target="_blank" rel="noopener">${item.title || 'නොදන්නා මාතෘකාවක්'}</a></h3>
            <div class="news-date">📅 ${item.published || item.fetched_at || ''}</div>
            <div class="news-summary">${item.summary || ''}</div>
        `;

        newsContainer.appendChild(card);
    });
}

// 3. Search
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredNews = allNews.filter(news => 
            (news.title && news.title.toLowerCase().includes(searchTerm)) ||
            (news.summary && news.summary.toLowerCase().includes(searchTerm))
        );
        renderNews(filteredNews);
    });
}

// 4. Dark Mode
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerText = isDark ? 'Light Mode' : 'Dark Mode';
    });
}

// Start
document.addEventListener('DOMContentLoaded', fetchNews);
