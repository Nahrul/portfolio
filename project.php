<?php
/**
 * Projects Page
 * Menampilkan semua projects dari database dalam grid layout
 */
require_once 'config/db.php';

$projects = [];
$error = '';

try {
    $stmt = $conn->prepare("SELECT * FROM projects ORDER BY created_at DESC");
    $stmt->execute();
    $projects = $stmt->fetchAll();
} catch (PDOException $e) {
    $error = 'Error loading projects: ' . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - Projects</title>
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
        
        .projects-page {
            min-height: 100vh;
            padding: 60px 20px;
            background: white;
        }
        
        .projects-page .hero {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .projects-page .hero h1 {
            font-size: 48px;
            margin-bottom: 10px;
            color: #333;
        }
        
        .projects-page .hero p {
            font-size: 18px;
            color: #666;
        }
        
        .projects-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 0 20px;
        }
        
        .project-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .project-image {
            width: 100%;
            height: 200px;
            overflow: hidden;
            background: #f5f5f5;
        }
        
        .project-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .project-card:hover .project-image img {
            transform: scale(1.05);
        }
        
        .project-content {
            padding: 20px;
        }
        
        .project-content h3 {
            margin: 0 0 10px 0;
            font-size: 22px;
            color: #333;
        }
        
        .project-content p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 15px 0;
        }
        
        .btn-view {
            display: inline-block;
            padding: 10px 20px;
            background: #6c5ce7;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        
        .btn-view:hover {
            background: #5f3dc4;
            transform: translateX(4px);
        }
        
        .no-projects {
            grid-column: 1/-1;
            text-align: center;
            padding: 60px 20px;
            color: #999;
            font-size: 18px;
        }
        
        .alert {
            max-width: 1200px;
            margin: 0 auto 30px;
            padding: 15px 20px;
            background: #fee;
            color: #c00;
            border-radius: 6px;
            border-left: 4px solid #c00;
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
            
            .projects-grid {
                grid-template-columns: 1fr;
                padding: 0 15px;
                gap: 20px;
            }
            
            .projects-page {
                padding: 40px 10px;
            }
            
            .projects-page .hero h1 {
                font-size: 32px;
            }
            
            .projects-page .hero p {
                font-size: 16px;
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
    
    <main class="projects-page">
        <section class="hero">
            <h1>My Projects</h1>
            <p>Check out some of my latest works and creative solutions</p>
        </section>
        
        <?php if (!empty($error)): ?>
            <div class="alert">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <section class="projects-grid">
            <?php if (empty($projects)): ?>
                <div class="no-projects">
                    <p>No projects yet. Check back soon!</p>
                </div>
            <?php else: ?>
                <?php foreach ($projects as $project): ?>
                    <div class="project-card">
                        <div class="project-image">
                            <img src="<?php echo htmlspecialchars($project['image_url']); ?>" 
                                 alt="<?php echo htmlspecialchars($project['title']); ?>"
                                 onerror="this.src='/portfolio/assets/img/placeholder.png'">
                        </div>
                        <div class="project-content">
                            <h3><?php echo htmlspecialchars($project['title']); ?></h3>
                            <p><?php echo htmlspecialchars(substr($project['description'], 0, 100)); ?>...</p>
                            <a href="/portfolio/project-detail.php?id=<?php echo $project['id']; ?>" class="btn-view">
                                View Detail →
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </section>
    </main>
    
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
