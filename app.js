document.addEventListener('DOMContentLoaded', function () {
    const statusMsg = document.getElementById('status-msg');
    const newsContainer = document.getElementById('news-container');

    // Display start status
    if (statusMsg) statusMsg.innerText = "JSON එක Fetch කරමින් පවතී...";

    fetch('derana_news.json?v=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP Error " + response.status + " - File එක හමු වූයේ නැත.");
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                if (statusMsg) statusMsg.innerText = "derana_news.json එකේ Data කිසිවක් නැත (Empty Array).";
                return;
            }

            if (statusMsg) statusMsg.style.display = 'none';

            let html = '';
            // Data ටික Reverse කර පෙන්නීම
            data.slice().reverse().forEach(item => {
                html += `
                    <div style="background:#ffffff; border:1px solid #ddd; padding:15px; margin-bottom:12px; border-radius:8px;">
                        ${item.image ? `<img src="${item.image}" style="width:100%; max-height:250px; object-fit:cover; border-radius:6px; margin-bottom:10px;" />` : ''}
                        <h3 style="margin:0 0 8px 0;"><a href="${item.link || '#'}" target="_blank" style="color:#0066cc; text-decoration:none;">${item.title || 'මාතෘකාවක් නැත'}</a></h3>
                        <p style="font-size:12px; color:#666; margin-bottom:8px;">📅 ${item.published || item.fetched_at || ''}</p>
                        <p style="font-size:14px; color:#333; margin:0;">${item.summary || ''}</p>
                    </div>
                `;
            });

            if (newsContainer) newsContainer.innerHTML = html;
        })
        .catch(err => {
            console.error("Fetch failure:", err);
            if (statusMsg) {
                statusMsg.style.color = "red";
                statusMsg.innerText = "Error: " + err.message;
            }
        });
});
