<?php
/**
 * Project Detail Page
 * Menampilkan detail lengkap dari sebuah project
 */
require_once 'config/db.php';

$project = null;
$error = '';

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    try {
        $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        $project = $stmt->fetch();
        
        if (!$project) {
            $error = 'Project tidak ditemukan.';
        }
    } catch (PDOException $e) {
        $error = 'Error loading project: ' . $e->getMessage();
    }
} else {
    $error = 'ID project tidak valid.';
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $project ? htmlspecialchars($project['title']) : 'Project Detail'; ?> - Portfolio</title>
    <link rel="stylesheet" href="/portfolio/asset/index.css">
    <link rel="stylesheet" href="/portfolio/assets/css/style.css">
    <style>
        /* Hamburger Menu */
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            gap: 5px;
            background: none;
            border: none;
            padding: 5px;
            margin-left: auto;
            z-index: 1001;
            position: relative;
            pointer-events: auto;
        }
        
        .hamburger span {
            width: 25px;
            height: 3px;
            background-color: #333;
            border-radius: 2px;
            transition: all 0.3s ease;
        }
        
        body.dark-theme .hamburger span {
            background-color: white;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(8px, 8px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
        
        .detail-page {
            min-height: 100vh;
            padding: 80px 20px;
            background: #f8f9fa;
        }
        
        .detail-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .detail-image {
            width: 100%;
            height: 400px;
            overflow: hidden;
            background: #f5f5f5;
        }
        
        .detail-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .detail-content {
            padding: 40px;
        }
        
        .detail-header {
            margin-bottom: 30px;
        }
        
        .detail-header h1 {
            font-size: 36px;
            color: #333;
            margin: 0 0 15px 0;
        }
        
        .detail-meta {
            display: flex;
            gap: 20px;
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }
        
        .detail-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .detail-description {
            font-size: 16px;
            line-height: 1.8;
            color: #555;
            margin-bottom: 40px;
            white-space: pre-wrap;
        }
        
        .detail-actions {
            display: flex;
            gap: 15px;
        }
        
        .btn-back {
            display: inline-block;
            padding: 12px 30px;
            background: #6c5ce7;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-size: 15px;
        }
        
        .btn-back:hover {
            background: #5f3dc4;
            transform: translateX(-4px);
        }
        
        .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .error-box {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .error-box h2 {
            color: #e74c3c;
            margin-bottom: 15px;
        }
        
        .error-box p {
            color: #666;
            margin-bottom: 25px;
        }
        
        @media (max-width: 768px) {
            .hamburger {
                display: flex;
                order: 10;
            }
            
            nav {
                position: relative;
                flex-wrap: nowrap;
                gap: 0;
            }
            
            nav .logo {
                margin-right: auto;
            }
            
            nav .cv {
                display: none;
            }
            
            .theme-toggle {
                display: none;
            }
            
            .detail-image {
                height: 250px;
            }
            
            .detail-content {
                padding: 25px;
            }
            
            .detail-header h1 {
                font-size: 28px;
            }
            
            .detail-meta {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">Nahdevl</div>
            <ul class="link" id="navLinks">
                <li><a href="/portfolio/#rewards">About</a></li>
                <li><a href="/portfolio/#skills">Skills</a></li>
                <li><a href="/portfolio/#portfolio">Portfolio</a></li>
                <li><a href="/portfolio/project.php">All Projects</a></li>
                <li><a href="/portfolio/#reviews">Testimonial</a></li>
            </ul>
            <a class="cv" href="https://drive.google.com/file/d/1Lna_iNaJOVzFS5K19kIP1yCjkQVYmnQJ/view?usp=sharing">Download CV</a>
            <a class="cv" href="/portfolio/admin/login.php">Admin</a>
            <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
                <span class="toggle-icon">🌙</span>
                <span class="toggle-text">Dark Mode</span>
            </button>
            <button class="hamburger" id="hamburger" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>
    
    <?php if ($error): ?>
        <div class="error-page">
            <div class="error-box">
                <h2>Oops!</h2>
                <p><?php echo htmlspecialchars($error); ?></p>
                <a href="/portfolio/project.php" class="btn-back">Kembali ke Projects</a>
            </div>
        </div>
    <?php else: ?>
        <main class="detail-page">
            <div class="detail-container">
                <div class="detail-image">
                    <img src="<?php echo htmlspecialchars($project['image_url']); ?>" 
                         alt="<?php echo htmlspecialchars($project['title']); ?>"
                         onerror="this.src='/portfolio/assets/img/placeholder.png'">
                </div>
                
                <div class="detail-content">
                    <div class="detail-header">
                        <h1><?php echo htmlspecialchars($project['title']); ?></h1>
                    </div>
                    
                    <div class="detail-meta">
                        <span>
                            📅 <?php echo date('d M Y', strtotime($project['created_at'])); ?>
                        </span>
                        <?php if ($project['updated_at'] && $project['updated_at'] != $project['created_at']): ?>
                        <span>
                            🔄 Updated: <?php echo date('d M Y', strtotime($project['updated_at'])); ?>
                        </span>
                        <?php endif; ?>
                    </div>
                    
                    <div class="detail-description">
                        <?php echo htmlspecialchars($project['description']); ?>
                    </div>
                    
                    <div class="detail-actions">
                        <a href="/portfolio/project.php" class="btn-back">← Kembali ke Projects</a>
                    </div>
                </div>
            </div>
        </main>
    <?php endif; ?>
    
    <footer>
        <p>&copy; 2024 My Portfolio. All rights reserved.</p>
    </footer>

    <script src="/portfolio/script.js"></script>
    <script>
        // Hamburger Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when link clicked
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }
    </script>
</body>
</html>
