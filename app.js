// Global News Data Store
let allNews = [];

// 1. Fetch News Data
function fetchNews() {
    const statusMsg = document.getElementById('status-msg');
    const timeStamp = Date.now();

    fetch('./derana_news.json?t=' + timeStamp)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (!Array.isArray(data) || data.length === 0) {
                if (statusMsg) statusMsg.innerText = "පුවත් කිසිවක් හමු වූයේ නැත.";
                return;
            }

            allNews = data.slice().reverse(); // Reverse array without mutating original

            if (statusMsg) {
                statusMsg.style.display = 'none';
            }

            renderNews(allNews);
        })
        .catch(function (error) {
            console.error('Fetch Error:', error);
            if (statusMsg) {
                statusMsg.innerText = "පුවත් Load කරගැනීමට නොහැකි විය: " + error.message;
                statusMsg.style.color = "red";
            }
        });
}

// 2. Render News Items Safely
function renderNews(newsList) {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    newsContainer.innerHTML = '';

    if (newsList.length === 0) {
        newsContainer.innerHTML = '<p style="text-align:center;">සෙවීමට අදාළ පුවත් කිසිවක් නැත.</p>';
        return;
    }

    // Fragment භාවිතයෙන් Performance සහ CSP Safety වැඩි කිරීම
    const fragment = document.createDocumentFragment();

    newsList.forEach(function (item) {
        const card = document.createElement('div');
        card.className = 'news-card';

        // Image Tag
        if (item.image && typeof item.image === 'string' && item.image.trim() !== '') {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title || 'Ada Derana News';
            img.style.width = '100%';
            img.style.maxHeight = '280px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.marginBottom = '12px';
            img.onerror = function () {
                this.style.display = 'none';
            };
            card.appendChild(img);
        }

        // Title Element
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        a.href = item.link || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.title || 'මාතෘකාවක් නොමැත';
        h3.appendChild(a);
        card.appendChild(h3);

        // Date Element
        const dateDiv = document.createElement('div');
        dateDiv.className = 'news-date';
        dateDiv.textContent = '📅 ' + (item.published || item.fetched_at || '');
        card.appendChild(dateDiv);

        // Summary Element
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'news-summary';
        summaryDiv.textContent = item.summary || '';
        card.appendChild(summaryDiv);

        fragment.appendChild(card);
    });

    newsContainer.appendChild(fragment);
}

// 3. Setup Event Listeners after DOM Loads
document.addEventListener('DOMContentLoaded', function () {
    // Initial Fetch
    fetchNews();

    // Search Box Logic
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filtered = allNews.filter(function (news) {
                const titleMatch = news.title && news.title.toLowerCase().includes(searchTerm);
                const summaryMatch = news.summary && news.summary.toLowerCase().includes(searchTerm);
                return titleMatch || summaryMatch;
            });
            renderNews(filtered);
        });
    }

    // Dark Mode Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeBtn.innerText = isDark ? 'Light Mode' : 'Dark Mode';
        });
    }
});
