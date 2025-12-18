# Portfolio Web Application

Sistem portfolio berbasis PHP dengan fitur admin dashboard untuk CRUD project.

## 🚀 Fitur Utama

- **Public Pages**: Tampilkan project dari database
- **Admin Authentication**: Login dengan username & password
- **Dashboard**: CRUD project (Create, Read, Update, Delete)
- **Security**: Prepared Statement, Password Hashing (bcrypt), Session-based Auth
- **Responsive Design**: UI yang clean dan mobile-friendly

## 📋 Stack Teknologi

- **Backend**: PHP 8 (Native, tanpa framework)
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Security**: PDO, bcrypt, session

## 📁 Struktur Folder

```
portfolio/
├── admin/
│   ├── login.php           # Halaman login
│   ├── dashboard.php       # Dashboard admin
│   ├── add.php            # Tambah project
│   ├── edit.php           # Edit project
│   ├── logout.php         # Logout
│   └── api.php            # API untuk AJAX
├── public/
│   └── projects.php       # Halaman public projects
├── config/
│   └── db.php             # Konfigurasi database
├── includes/
│   ├── auth.php           # Class authentication
│   ├── header.php         # Header template
│   └── footer.php         # Footer template
├── assets/
│   ├── css/
│   │   ├── admin-style.css    # CSS admin dashboard
│   │   └── style.css          # CSS public pages
│   └── img/               # Folder untuk images
├── database.sql           # SQL script untuk database
├── .htaccess             # Apache rewrite rules
└── README.md             # Dokumentasi ini
```

## 🔧 Cara Instalasi

### 1. Persiapan
- Pastikan Apache dan MySQL sudah running
- Folder project harus di DocumentRoot Apache (biasanya `htdocs`)

### 2. Buat Database
```bash
# Option 1: Menggunakan command line
mysql -u root -p < database.sql

# Option 2: Import melalui phpMyAdmin
# - Buka phpMyAdmin
# - Buat database baru dengan nama `portfolio_db`
# - Import file `database.sql`
```

### 3. Update Konfigurasi Database (jika perlu)
Edit file `config/db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USER', 'root');
define('DB_PASS', '');  // Sesuaikan password MySQL
```

### 4. Akses Website
- **Public**: `http://localhost/portfolio/`
- **Public Projects**: `http://localhost/portfolio/public/projects.php`
- **Admin Login**: `http://localhost/portfolio/admin/login.php`

## 👤 Akun Demo

```
Username: admin
Password: admin123
```

## 📚 Penggunaan

### Login Admin
1. Buka `http://localhost/portfolio/admin/login.php`
2. Masukkan username dan password
3. Akan redirect ke dashboard

### Mengelola Project

#### Tambah Project
1. Di dashboard, klik tombol "Tambah Project"
2. Isi form dengan data project
3. Klik "Tambah Project"

#### Edit Project
1. Di dashboard, klik tombol "Edit" pada project
2. Ubah data yang diinginkan
3. Klik "Update Project"

#### Hapus Project
1. Di dashboard, klik tombol "Hapus"
2. Konfirmasi penghapusan
3. Project akan dihapus dari database

#### Logout
1. Klik "Logout" di navbar
2. Akan redirect ke halaman login

## 🔐 Keamanan

### Implementasi Keamanan:

1. **SQL Injection Prevention**
   ```php
   // Menggunakan prepared statement
   $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
   $stmt->execute([$id]);
   ```

2. **Password Hashing**
   ```php
   // Login
   if (password_verify($password, $user['password_hash'])) {
       // Login berhasil
   }
   ```

3. **Session-based Authentication**
   ```php
   // Check login di setiap halaman admin
   $auth->requireLogin();
   ```

4. **Input Validation**
   ```php
   // Validasi server-side
   if (empty($username) || empty($password)) {
       $error = 'Username dan password harus diisi!';
   }
   ```

5. **XSS Prevention**
   ```php
   // Menggunakan htmlspecialchars
   echo htmlspecialchars($project['title']);
   ```

## 📝 Database Schema

### Table: users
```sql
id           INT PRIMARY KEY AUTO_INCREMENT
username     VARCHAR(100) NOT NULL UNIQUE
password_hash VARCHAR(255) NOT NULL
created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Table: projects
```sql
id           INT PRIMARY KEY AUTO_INCREMENT
title        VARCHAR(255) NOT NULL
description  LONGTEXT NOT NULL
image_url    VARCHAR(255) NOT NULL
project_url  VARCHAR(255) NOT NULL
created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
```

## 🎨 Customization

### Mengubah Warna (CSS)
Edit file `assets/css/admin-style.css` dan `assets/css/style.css`:
```css
:root {
    --primary-color: #0DB760;      /* Warna utama */
    --secondary-color: #333;        /* Warna sekunder */
    --danger-color: #dc3545;        /* Warna danger */
}
```

### Menambah User Baru
Gunakan phpMyAdmin atau SQL:
```php
// Jika ingin menambah user baru secara manual
$password = password_hash('password123', PASSWORD_BCRYPT);
// Insert ke database dengan password yang sudah di-hash
```