<?php
/**
 * Authentication Handler
 */

session_start();

class Auth {
    private $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    /**
     * Login user
     */
    public function login($username, $password) {
        try {
            $stmt = $this->conn->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                return true;
            }
            return false;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * Check if user is logged in
     */
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    /**
     * Logout user
     */
    public function logout() {
        session_destroy();
    }
    
    /**
     * Redirect if not logged in
     */
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            header("Location: /portfolio/admin/login.php");
            exit;
        }
    }
    
    /**
     * Redirect if already logged in
     */
    public function requireLogout() {
        if ($this->isLoggedIn()) {
            header("Location: /portfolio/admin/dashboard.php");
            exit;
        }
    }
    
    /**
     * Get current user info
     */
    public function getCurrentUser() {
        if ($this->isLoggedIn()) {
            return [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username']
            ];
        }
        return null;
    }
}

// Initialize Auth class
require_once __DIR__ . '/../config/db.php';
$auth = new Auth($conn);
?>
