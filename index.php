<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lanka News - ශ්‍රී ලංකාවේ ප්‍රමුඛතම පුවත් වෙබ් අඩවිය</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Header Section -->
    <header>
        <div class="container header-top">
            <a href="index.php" class="logo">LANKA NEWS</a>
            <button id="theme-toggle" class="theme-toggle">🌙 Dark Mode</button>
        </div>
        <nav>
            <div class="container">
                <ul class="nav-links">
                    <li><a href="#">මුල් පිටුව</a></li>
                    <li><a href="#">දේශීය</a></li>
                    <li><a href="#">ලෝක පුවත්</a></li>
                    <li><a href="#">ක්‍රීඩා</a></li>
                    <li><a href="#">තාක්ෂණය</a></li>
                    <li><a href="#">ව්‍යාපාරික</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <div class="container">
        <!-- Breaking News Bar -->
        <div class="breaking-bar">
            <div class="breaking-title">🔴 විශේෂ පුවත්</div>
            <div class="breaking-content">
                නව තාක්ෂණික ව්‍යාපෘතියක් ලෙස Lanka News CMS සාර්ථකව ආරම්භ කෙරේ.
            </div>
        </div>

        <!-- Main Layout -->
        <div class="main-layout">
            <!-- Left Column: Main News -->
            <main>
                <!-- Hero Section -->
                <div class="hero-card">
                    <img src="https://picsum.photos/800/400?random=1" alt="Main Headline">
                    <div class="hero-content">
                        <span class="badge">දේශීය</span>
                        <h1 class="hero-title">Lanka News CMS හරහා නවතම පුවත් ක්ෂණිකව ලබාගැනීමේ පහසුකම ක්‍රියාත්මකයි</h1>
                        <p style="color: var(--text-secondary);">නවීන තාක්ෂණය භාවිතයෙන් සකස් කළ මෙම පුවත් පද්ධතිය වේගවත් සහ පහසු පරිශීලක අත්දැකීමක් ලබා දෙයි...</p>
                    </div>
                </div>

                <!-- Latest News Section -->
                <h2 class="section-title">නවතම පුවත්</h2>
                <div class="news-grid">
                    <?php for($i = 2; $i <= 7; $i++): ?>
                    <div class="news-card">
                        <img src="https://picsum.photos/300/180?random=<?php echo $i; ?>" alt="News">
                        <div class="news-card-body">
                            <span class="badge">තාක්ෂණය</span>
                            <a href="#" class="news-card-title">කෘතිම බුද්ධිය (AI) මගින් පුවත් කලාව වෙනස් වන අයුරු පිළිබඳ විශේෂ වාර්තාවක්.</a>
                        </div>
                    </div>
                    <?php endfor; ?>
                </div>
            </main>

            <!-- Right Column: Sidebar -->
            <aside>
                <div class="sidebar-widget">
                    <h3 class="section-title">ජනප්‍රියම පුවත්</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                            <a href="#" style="color: var(--text-primary); text-decoration: none; font-size: 0.95rem;">
                                🔥 කොළඹ කොටස් වෙළඳපොළ වාර්තාගත ලෙස ඉහළට.
                            </a>
                        </li>
                        <li style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                            <a href="#" style="color: var(--text-primary); text-decoration: none; font-size: 0.95rem;">
                                🔥 ශ්‍රී ලංකා ක්‍රිකට් පිලට තීරණාත්මක ජයග්‍රහණයක්.
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Advertisement Unit -->
                <div class="sidebar-widget">
                    <div class="ad-box">
                        Advertisement (300 x 250)
                    </div>
                </div>
            </aside>
        </div>
    </div>

    <!-- Footer Section -->
    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Lanka News CMS. All Rights Reserved.</p>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>
