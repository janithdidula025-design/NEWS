let allNews = [];

// 1. Fetch News Data
async function fetchNews() {
    const statusMsg = document.getElementById('status-msg');

    try {
        // Cache buster එකක් එකතු කර ඇත (නිරන්තරයෙන්ම අලුත් JSON data එක ලබාගැනීමට)
        const response = await fetch('./derana_news.json?t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allNews = await response.json();

        if (!Array.isArray(allNews) || allNews.length === 0) {
            if (statusMsg) statusMsg.innerText = "පුවත් කිසිවක් හමු වූයේ නැත.";
            return;
        }

        // News ටික අලුත්ම එක උඩට එනසේ Reverse කිරීම
        allNews.reverse();

        if (statusMsg) statusMsg.style.display = 'none';
        renderNews(allNews);

    } catch (error) {
        console.error("Error fetching news:", error);
        if (statusMsg) statusMsg.innerText = "පුවත් Load කරගැනීමට නොහැකි විය. (" + error.message + ")";
    }
}

// 2. Render News to HTML
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

        // Image එකක් තිබේ නම් පමණක් පෙන්නුම් කිරීමට
        const imageHtml = item.image 
            ? `<img src="${item.image}" alt="${item.title}" style="width:100%; max-height:280px; object-fit:cover; border-radius:8px; margin-bottom:12px;" onerror="this.style.display='none'" />` 
            : '';

        card.innerHTML = `
            ${imageHtml}
            <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
            <div class="news-date">📅 ${item.published || item.fetched_at}</div>
            <div class="news-summary">${item.summary || ''}</div>
        `;

        newsContainer.appendChild(card);
    });
}

// 3. Search Functionality
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

// 4. Dark Mode Toggle
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerText = isDark ? 'Light Mode' : 'Dark Mode';
    });
}

// Page එක Load වූ පසු News ගෙන්නවා ගැනීම
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});
