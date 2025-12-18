<?php
require_once '../includes/auth.php';

// Check login
$auth->requireLogin();

// Logout
$auth->logout();
session_destroy();

// Redirect ke login
header("Location: /portfolio/admin/login.php");
exit;
?>
