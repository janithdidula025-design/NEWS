-- Database එක සෑදීම
CREATE DATABASE IF NOT EXISTS `lankanews_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lankanews_db`;

-- 1. USERS TABLE (Admin / Editors)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'editor', 'reporter') DEFAULT 'editor',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. NEWS TABLE
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content` LONGTEXT NOT NULL,
  `summary` TEXT NULL,
  `category_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `image` VARCHAR(255) NULL,
  `caption` VARCHAR(255) NULL,
  `is_breaking` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'published',
  `view_count` INT DEFAULT 0,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `ai_generated` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX (`slug`),
  INDEX (`is_breaking`),
  INDEX (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `news_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `comment` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ADS TABLE (Advertisement Manager)
CREATE TABLE IF NOT EXISTS `ads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `position` ENUM('header', 'sidebar', 'in_article', 'footer') NOT NULL,
  `ad_code` TEXT NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `link_url` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Default Admin User (Password: admin123)
INSERT INTO `users` (`username`, `email`, `password`, `full_name`, `role`) VALUES
('admin', 'admin@lankanews.lk', '$2y$10$wT8KskY6aG.WJkM7hB4Qce0mN9BfW3k4pB/d9G5C3A5N5S1X0E2tK', 'Main Administrator', 'admin');

-- Categories
INSERT INTO `categories` (`name`, `slug`) VALUES
('දේශීය', 'local'),
('ලෝක පුවත්', 'world'),
('ක්‍රීඩා', 'sports'),
('තාක්ෂණය', 'technology'),
('ව්‍යාපාරික', 'business');
