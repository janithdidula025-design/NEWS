// Relative Path to derana_news.json
// (Same folder එකේ හෝ raw GitHub usercontent URL එකක්ද දිය හැක)
const JSON_URL = 'derana_news.json';

let allNews = [];

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    fetchNewsData();

    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

// JSON Data Fetch කිරීම
async function fetchNewsData() {
    const newsContainer = document.getElementById('newsContainer');
    const newsStats = document.getElementById('newsStats');

    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allNews = await response.json();
        
        // Latest news ප්‍රථමයෙන් පෙන්වීමට Reverse කිරිම
        allNews.reverse();

        updateStats(allNews.length);
        renderNews(allNews);

    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: #e11d48; margin-bottom: 10px;"></i>
                <h3>Failed to load news backup</h3>
                <p>Make sure 'derana_news.json' exists and GitHub Actions has generated it.</p>
            </div>
        `;
        newsStats.textContent = '0 news loaded';
    }
}

// News Cards Render කිරීම
function renderNews(newsList) {
    const newsContainer = document.getElementById('newsContainer');

    if (newsList.length === 0) {
        newsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-newspaper" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <h3>No news items found</h3>
                <p>Try searching for a different keyword.</p>
            </div>
        `;
        return;
    }

    newsContainer.innerHTML = newsList.map(item => `
        <article class="news-card">
            <div>
                <div class="news-meta">
                    <span><i class="fa-regular fa-clock"></i> ${formatDate(item.published || item.fetched_at)}</span>
                    <span>#${item.id || ''}</span>
                </div>
                <h2 class="news-title">${escapeHTML(item.title)}</h2>
                <p class="news-summary">${escapeHTML(stripHTML(item.summary || ''))}</p>
            </div>
            <a href="${item.link}" target="_blank" rel="noopener" class="read-more-btn">
                Read Full Story <i class="fa-solid fa-arrow-right"></i>
            </a>
        </article>
    `).join('');
}

// Real-time Search Handler
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    const filtered = allNews.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(query);
        const summaryMatch = item.summary && item.summary.toLowerCase().includes(query);
        return titleMatch || summaryMatch;
    });

    renderNews(filtered);
    updateStats(filtered.length, true);
}

// Stats Text Update කිරීම
function updateStats(count, isFiltered = false) {
    const newsStats = document.getElementById('newsStats');
    if (isFiltered) {
        newsStats.textContent = `Showing ${count} matching items`;
    } else {
        newsStats.textContent = `Total Backed-Up News: ${count}`;
    }
}

// Helper: Date Format කිරීම
function formatDate(dateString) {
    if (!dateString) return 'Recent';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('si-LK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
}

// Helper: HTML Injection වැලැක්වීම සහ HTML Tags Clean කිරීම
function stripHTML(htmlString) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Dark/Light Theme Switching Engine
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}
