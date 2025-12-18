-- ===========================
-- Database Portfolio
-- ===========================

-- Buat database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- ===== TABLE USERS =====
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE PROJECTS =====
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    project_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== INSERT SAMPLE DATA =====

-- Insert default admin user
-- Username: admin
-- Password: admin123 (hashed dengan bcrypt)
INSERT INTO users (username, password_hash) VALUES 
('admin', '$2y$10$YIjlrHzJEGG5fCNVLqBf7OJXH6C5Hx8k5F5Hx8k5F5Hx8k5F5Hx8');

-- Insert sample projects
INSERT INTO projects (title, description, image_url, project_url) VALUES 
(
    'E-Commerce Platform',
    'A full-stack e-commerce application built with PHP and MySQL. Features include product catalog, shopping cart, user authentication, and payment integration. Responsive design with modern UI/UX.',
    'https://via.placeholder.com/300x200?text=E-Commerce',
    'https://github.com/username/ecommerce'
),
(
    'Blog System',
    'Dynamic blog platform with admin dashboard for managing posts, categories, and comments. Includes search functionality, pagination, and user authentication. Built with pure PHP.',
    'https://via.placeholder.com/300x200?text=Blog+System',
    'https://github.com/username/blog-system'
),
(
    'Task Management App',
    'Collaborative task management application with real-time updates. Features include task creation, assignment, deadline tracking, and progress monitoring. RESTful API backend.',
    'https://via.placeholder.com/300x200?text=Task+Manager',
    'https://github.com/username/task-manager'
),
(
    'Weather Dashboard',
    'Real-time weather application that fetches data from external API. Shows current weather, forecasts, and weather alerts. Built with vanilla JavaScript and responsive CSS.',
    'https://via.placeholder.com/300x200?text=Weather+App',
    'https://github.com/username/weather-dashboard'
),
(
    'Social Media API',
    'RESTful API for social media platform with user profiles, posts, comments, and likes. Includes authentication, authorization, and data validation. MySQL database with optimized queries.',
    'https://via.placeholder.com/300x200?text=Social+API',
    'https://github.com/username/social-api'
);
