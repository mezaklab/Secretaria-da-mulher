<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$dataFile = __DIR__ . '/dados.json';

// Tratar requisição GET (Leitura Pública)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo json_encode([
            "acoes" => [],
            "galeria" => [],
            "agenda" => []
        ]);
    }
    exit;
}

// Tratar requisição POST (Escrita Protegida)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar sessão de segurança
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Não autorizado. Faça login no painel administrativo."]);
        exit;
    }

    // Verificar CSRF token
    $headers = getallheaders();
    $csrf_token = $headers['X-CSRF-Token'] ?? $headers['x-csrf-token'] ?? '';
    if (empty($csrf_token) || !isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrf_token)) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Falha de validação CSRF."]);
        exit;
    }

    // Tratar Upload de Arquivo FormData
    if (isset($_GET['upload'])) {
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Nenhum arquivo enviado."]);
            exit;
        }

        $file = $_FILES['file'];
        
        // Limite de 100MB
        if ($file['size'] > 104857600) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Arquivo muito grande. O limite é 100MB."]);
            exit;
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Erro interno no upload do arquivo."]);
            exit;
        }

        $uploadDir = __DIR__ . '/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safeName = uniqid('media_') . '.' . $ext;
        $dest = $uploadDir . '/' . $safeName;

        if (move_uploaded_file($file['tmp_name'], $dest)) {
            echo json_encode(["status" => "success", "path" => 'uploads/' . $safeName]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Falha ao salvar arquivo no servidor."]);
        }
        exit;
    }


    
    // Receber e validar os dados JSON enviados
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data !== null) {
        // Garantir que a estrutura exista antes de salvar
        $formattedData = [
            "acoes" => isset($data['acoes']) ? $data['acoes'] : [],
            "galeria" => isset($data['galeria']) ? $data['galeria'] : [],
            "agenda" => isset($data['agenda']) ? $data['agenda'] : [],
            "saude" => isset($data['saude']) ? $data['saude'] : [],
            "canindeDelas" => isset($data['canindeDelas']) ? $data['canindeDelas'] : new stdClass()
        ];
        
        // Salvar com permissões adequadas
        $result = file_put_contents($dataFile, json_encode($formattedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        if ($result !== false) {
            echo json_encode(["status" => "success", "message" => "Dados atualizados com sucesso."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Erro ao salvar no arquivo. Verifique as permissões do dados.json."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "JSON inválido enviado."]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Método não permitido."]);
?>
