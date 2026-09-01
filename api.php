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
        echo json_encode(["error" => "Não autorizado. Faça login no painel administrativo."]);
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
            "agenda" => isset($data['agenda']) ? $data['agenda'] : []
        ];
        
        // Salvar com permissões adequadas
        $result = file_put_contents($dataFile, json_encode($formattedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        if ($result !== false) {
            echo json_encode(["success" => true, "message" => "Dados atualizados com sucesso."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Erro ao salvar no arquivo. Verifique as permissões do dados.json."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "JSON inválido enviado."]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido."]);
?>
