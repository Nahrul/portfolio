<?php
require_once '../includes/auth.php';

// Check login
$auth->requireLogin();

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $image_url = '';
    
    // Validasi basic fields
    if (empty($title) || empty($description)) {
        $error = 'Judul dan deskripsi harus diisi!';
    } else if (empty($_FILES['image']) || $_FILES['image']['error'] == UPLOAD_ERR_NO_FILE) {
        $error = 'Silakan upload gambar project!';
    } else {
        // Handle file upload
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
                $image_url = '/portfolio/assets/img/' . $filename;
                
                try {
                    $stmt = $conn->prepare("
                        INSERT INTO projects (title, description, image_url, created_at) 
                        VALUES (?, ?, ?, NOW())
                    ");
                    $stmt->execute([$title, $description, $image_url]);
                    
                    $success = 'Project berhasil ditambahkan!';
                    header("Refresh: 1; url=/portfolio/admin/dashboard.php?message=" . urlencode($success));
                } catch (PDOException $e) {
                    unlink($filepath); // Delete uploaded file if DB insert fails
                    $error = 'Database error: ' . $e->getMessage();
                }
            } else {
                $error = 'Gagal upload file. Periksa folder permissions!';
            }
        }
    }
}
?>
<?php require_once '../includes/header.php'; ?>

<div class="form-container">
    <div class="form-box">
        <h1>Tambah Project Baru</h1>
        
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
        
        <form method="POST" class="project-form" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Judul Project *</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    required
                    placeholder="Masukkan judul project"
                    value="<?php echo htmlspecialchars($_POST['title'] ?? ''); ?>"
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
                ><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="image">Upload Gambar Project *</label>
                <input 
                    type="file" 
                    id="image" 
                    name="image" 
                    required
                    accept="image/jpeg,image/png,image/gif,image/webp"
                >
                <small>Format: JPG, PNG, GIF, WebP (Max 5MB)</small>
                <div id="image-preview" style="margin-top: 10px; display: none;">
                    <img id="preview-img" src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                </div>
            </div>
            
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Tambah Project</button>
                <a href="/portfolio/admin/dashboard.php" class="btn btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>

<script>
// Image preview
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('preview-img').src = event.target.result;
            document.getElementById('image-preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
</script>

<?php require_once '../includes/footer.php'; ?>
