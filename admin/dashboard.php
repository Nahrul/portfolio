<?php
require_once '../includes/auth.php';

// Check login
$auth->requireLogin();

$user = $auth->getCurrentUser();
?>
<?php require_once '../includes/header.php'; ?>

<div class="dashboard">
    <h1>Dashboard</h1>
    <p class="welcome">Selamat datang, <strong><?php echo htmlspecialchars($user['username']); ?></strong></p>
    
    <div class="dashboard-stats">
        <div class="stat-card">
            <h3>Total Project</h3>
            <p class="stat-number" id="total-projects">-</p>
        </div>
    </div>
    
    <div class="dashboard-actions">
        <a href="/portfolio/admin/add.php" class="btn btn-success">+ Tambah Project</a>
    </div>
    
    <?php if (isset($_GET['message'])): ?>
        <div class="alert alert-success">
            <span class="close-alert" onclick="this.parentElement.style.display='none';">&times;</span>
            <?php echo htmlspecialchars(urldecode($_GET['message'])); ?>
        </div>
    <?php endif; ?>
    
    <div class="projects-table">
        <h2>Daftar Project</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Judul</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody id="projects-tbody">
                <tr>
                    <td colspan="5" style="text-align: center;">Loading...</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<script>
// Load projects dari server
document.addEventListener('DOMContentLoaded', function() {
    fetch('/portfolio/admin/api.php?action=get_projects')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProjects(data.projects);
                document.getElementById('total-projects').textContent = data.projects.length;
            } else {
                document.getElementById('projects-tbody').innerHTML = 
                    '<tr><td colspan="5" style="text-align: center;">Gagal memuat data</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('projects-tbody').innerHTML = 
                '<tr><td colspan="5" style="text-align: center;">Error memuat data</td></tr>';
        });
});

function displayProjects(projects) {
    const tbody = document.getElementById('projects-tbody');
    
    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada project</td></tr>';
        return;
    }
    
    let html = '';
    projects.forEach((project, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(project.title)}</td>
                <td>${escapeHtml(project.description.substring(0, 50))}...</td>
                <td>
                    <a href="/portfolio/admin/edit.php?id=${project.id}" class="btn btn-sm btn-warning">Edit</a>
                    <button onclick="deleteProject(${project.id})" class="btn btn-sm btn-danger">Hapus</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function deleteProject(id) {
    if (confirm('Apakah Anda yakin ingin menghapus project ini?')) {
        fetch('/portfolio/admin/api.php?action=delete&id=' + id, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.href = '/portfolio/admin/dashboard.php?message=' + encodeURIComponent('Project berhasil dihapus!');
            } else {
                alert('Gagal menghapus project: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error menghapus project');
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
</script>

<?php require_once '../includes/footer.php'; ?>
