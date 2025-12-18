<?php
require_once '../includes/auth.php';

// Redirect jika sudah login
$auth->requireLogout();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Validasi input
    if (empty($username) || empty($password)) {
        $error = 'Username dan password harus diisi!';
    } else {
        if ($auth->login($username, $password)) {
            $success = 'Login berhasil! Redirecting...';
            header("Refresh: 1; url=/portfolio/admin/dashboard.php");
        } else {
            $error = 'Username atau password salah!';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Portfolio Admin</title>
    <link rel="stylesheet" href="/portfolio/assets/css/admin-style.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-box">
            <h1>Portfolio Admin</h1>
            <p class="subtitle">Masuk ke Dashboard</p>
            
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
            
            <form method="POST" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        required
                        placeholder="Masukkan username"
                        value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>"
                    >
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required
                        placeholder="Masukkan password"
                    >
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">Login</button>
            </form>
            
            <div class="login-footer">
                <p>Demo Account: <br>Username: <strong>admin</strong><br>Password: <strong>admin123</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
