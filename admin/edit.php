<?php
require_once '../includes/auth.php';

// Check login
$auth->requireLogin();

$project = null;
$error = '';
$success = '';

// Define upload directory
$upload_dir = '../assets/img/';
$max_file_size = 5 * 1024 * 1024; // 5MB
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Create directory if not exists
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    // Get project detail
    try {
        $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        $project = $stmt->fetch();
        
        if (!$project) {
            header("Location: /portfolio/admin/dashboard.php");
            exit;
        }
    } catch (PDOException $e) {
        $error = "Database error: " . $e->getMessage();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $image_url = $project['image_url']; // Keep old image by default
    
    // Validasi
    if (empty($title) || empty($description)) {
        $error = 'Judul dan deskripsi harus diisi!';
    } else {
        // Handle file upload if new image provided
        if (!empty($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $file = $_FILES['image'];
            
            // Validasi file
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $error = 'Error upload file: ' . $file['error'];
            } else if ($file['size'] > $max_file_size) {
                $error = 'Ukuran file terlalu besar (max 5MB)!';
            } else if (!in_array($file['type'], $allowed_types)) {
                $error = 'Tipe file tidak didukung. Gunakan: JPG, PNG, GIF, WebP';
            } else {
                // Generate unique filename
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = 'project_' . time() . '_' . uniqid() . '.' . $ext;
                $filepath = $upload_dir . $filename;
                
                // Move uploaded file
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    // Delete old image if exists
                    $old_image_path = str_replace('/portfolio/', '', $project['image_url']);
                    if (file_exists($old_image_path) && strpos($old_image_path, 'assets/img/') !== false) {
                        unlink($old_image_path);
                    }
                    
                    $image_url = '/portfolio/assets/img/' . $filename;
                } else {
                    $error = 'Gagal upload file. Periksa folder permissions!';
                }
            }
        }
        
        // Only update if no upload error
        if (empty($error)) {
            try {
                $id = (int)$_GET['id'];
                $stmt = $conn->prepare("
                    UPDATE projects 
                    SET title = ?, description = ?, image_url = ? 
                    WHERE id = ?
                ");
            $stmt->execute([$title, $description, $image_url, $id]);
            
            $success = 'Project berhasil diupdate!';
            header("Refresh: 1; url=/portfolio/admin/dashboard.php?message=" . urlencode($success));
        } catch (PDOException $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}
?>
<?php require_once '../includes/header.php'; ?>

<div class="form-container">
    <div class="form-box">
        <h1>Edit Project</h1>
        
        <?php if (!empty($error)): ?>
            <div class="alert alert-danger">
                <span class="close-alert" onclick="this.parentElement.style.display='none';">&times;</span>
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <?php if (!empty($success)): ?>
            <div class="alert alert-success">
                <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>
        
        <?php if ($project): ?>
        <form method="POST" class="project-form" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Judul Project *</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    required
                    placeholder="Masukkan judul project"
                    value="<?php echo htmlspecialchars($project['title']); ?>"
                >
            </div>
            
            <div class="form-group">
                <label for="description">Deskripsi *</label>
                <textarea 
                    id="description" 
                    name="description" 
                    required
                    placeholder="Masukkan deskripsi project"
                    rows="5"
                ><?php echo htmlspecialchars($project['description']); ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="image">Gambar Project *</label>
                <input 
                    type="file" 
                    id="image" 
                    name="image" 
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    placeholder="Pilih file gambar"
                >
                <small>Format: JPG, PNG, GIF, WebP (Maks 5MB). Biarkan kosong jika tidak ingin mengubah gambar.</small>
                
                <?php if (!empty($project['image_url'])): ?>
                <div style="margin-top: 15px;">
                    <p><strong>Gambar saat ini:</strong></p>
                    <img src="<?php echo htmlspecialchars($project['image_url']); ?>" alt="<?php echo htmlspecialchars($project['title']); ?>" style="max-width: 300px; max-height: 200px; border-radius: 8px;">
                </div>
                <?php endif; ?>
                
                <div id="image-preview" style="margin-top: 15px; display: none;">
                    <p><strong>Preview gambar baru:</strong></p>
                    <img id="preview-img" src="" alt="Preview" style="max-width: 300px; max-height: 200px; border-radius: 8px;">
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Project</button>
                <a href="/portfolio/admin/dashboard.php" class="btn btn-secondary">Batal</a>
            </div>
        </form>
        <?php else: ?>
            <p>Project tidak ditemukan.</p>
            <a href="/portfolio/admin/dashboard.php" class="btn btn-secondary">Kembali ke Dashboard</a>
        <?php endif; ?>
    </div>
</div>

<script>
document.getElementById('image').addEventListener('change', function(event) {
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    } else {
        preview.style.display = 'none';
    }
});
</script>

<?php require_once '../includes/footer.php'; ?>
