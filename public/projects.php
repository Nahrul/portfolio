<?php
require_once '../config/db.php';

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
    <link rel="stylesheet" href="/portfolio/assets/css/style.css">
</head>
<body>
    <header>
        <nav class="navbar-public">
            <div class="nav-container">
                <div class="nav-brand">
                    <h2>Portfolio</h2>
                </div>
                <ul class="nav-menu">
                    <li><a href="/portfolio/">Home</a></li>
                    <li><a href="/portfolio/public/projects.php">Projects</a></li>
                    <li><a href="/portfolio/admin/login.php" class="btn btn-sm">Admin</a></li>
                </ul>
            </div>
        </nav>
    </header>
    
    <main class="projects-page">
        <section class="hero">
            <h1>My Projects</h1>
            <p>Check out some of my latest works</p>
        </section>
        
        <?php if (!empty($error)): ?>
            <div class="alert alert-danger">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <section class="projects-grid">
            <?php if (empty($projects)): ?>
                <p style="grid-column: 1/-1; text-align: center;">No projects yet.</p>
            <?php else: ?>
                <?php foreach ($projects as $project): ?>
                    <div class="project-card fade-scale">
                        <div class="project-image">
                            <img src="<?php echo htmlspecialchars($project['image_url']); ?>" 
                                 alt="<?php echo htmlspecialchars($project['title']); ?>"
                                 onerror="this.src='/portfolio/assets/img/placeholder.png'">
                        </div>
                        <div class="project-content">
                            <h3><?php echo htmlspecialchars($project['title']); ?></h3>
                            <p><?php echo htmlspecialchars(substr($project['description'], 0, 100)); ?>...</p>
                            <a href="<?php echo htmlspecialchars($project['project_url']); ?>" 
                               target="_blank" 
                               class="btn btn-primary">
                                View Project
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
</body>
</html>
