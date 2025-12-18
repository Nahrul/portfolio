<?php
/**
 * API untuk AJAX requests dari dashboard
 */
require_once '../includes/auth.php';

// Check login untuk semua requests
$auth->requireLogin();

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$response = ['success' => false, 'message' => 'Invalid action'];

try {
    if ($action === 'get_projects') {
        $stmt = $conn->prepare("SELECT * FROM projects ORDER BY created_at DESC");
        $stmt->execute();
        $projects = $stmt->fetchAll();
        
        $response = [
            'success' => true,
            'projects' => $projects
        ];
    } 
    elseif ($action === 'delete') {
        $id = (int)($_GET['id'] ?? 0);
        
        if ($id <= 0) {
            $response['message'] = 'ID tidak valid';
        } else {
            $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() > 0) {
                $response = [
                    'success' => true,
                    'message' => 'Project berhasil dihapus'
                ];
            } else {
                $response['message'] = 'Project tidak ditemukan';
            }
        }
    }
} catch (PDOException $e) {
    $response = [
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ];
}

echo json_encode($response);
?>
