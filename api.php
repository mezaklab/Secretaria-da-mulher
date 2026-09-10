<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$dataFile = __DIR__ . '/dados.json';

// Tratar requisição GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retornar dados de administração (somente super_admin)
    if (isset($_GET['admin_data'])) {
        if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || !isset($_SESSION['papel']) || $_SESSION['papel'] !== 'super_admin') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Acesso negado."]);
            exit;
        }
        
        $usuarios = file_exists(__DIR__.'/usuarios.json') ? json_decode(file_get_contents(__DIR__.'/usuarios.json'), true)['usuarios'] ?? [] : [];
        $logs = file_exists(__DIR__.'/log_atividade.json') ? json_decode(file_get_contents(__DIR__.'/log_atividade.json'), true)['logs'] ?? [] : [];
        
        foreach($usuarios as &$u) { unset($u['senha_hash']); } // Ocultar hashes
        
        echo json_encode(['usuarios' => $usuarios, 'logs' => $logs]);
        exit;
    }

    // Leitura Pública
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

    // Gerenciar Usuários
    if (isset($_GET['gerenciar_usuarios'])) {
        if (!isset($_SESSION['papel']) || $_SESSION['papel'] !== 'super_admin') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Acesso negado."]);
            exit;
        }
        
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        $action = $data['action'] ?? '';
        
        $usuariosFile = __DIR__ . '/usuarios.json';
        $usuariosData = file_exists($usuariosFile) ? json_decode(file_get_contents($usuariosFile), true) : ['usuarios' => []];
        
        if ($action === 'create') {
            $senha = $data['senha'] ?? '';
            // Validação de senha forte no servidor
            if (strlen($senha) < 8 || !preg_match('/[A-Z]/', $senha) || !preg_match('/[0-9]/', $senha) || !preg_match('/[^a-zA-Z0-9]/', $senha)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, números e símbolos."]);
                exit;
            }
            
            if (!preg_match('/^[a-zA-Z0-9\._\-]+$/', $data['usuario'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "O nome de usuário possui caracteres inválidos. Use apenas letras, números, pontos e traços."]);
                exit;
            }
            
            foreach($usuariosData['usuarios'] as $u) {
                if ($u['usuario'] === $data['usuario']) {
                    http_response_code(400);
                    echo json_encode(["status" => "error", "message" => "Usuário já existe."]);
                    exit;
                }
            }
            
            $usuariosData['usuarios'][] = [
                "id" => uniqid('usr_'),
                "usuario" => $data['usuario'],
                "senha_hash" => password_hash($senha, PASSWORD_DEFAULT),
                "papel" => "operador",
                "nome_completo" => $data['nome'],
                "ativo" => true,
                "criado_em" => date('c')
            ];
            
            file_put_contents($usuariosFile, json_encode($usuariosData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(["status" => "success", "message" => "Operador criado com sucesso."]);
            exit;
            
        } else if ($action === 'toggle_status') {
            $targetId = $data['id'] ?? '';
            $found = false;
            foreach($usuariosData['usuarios'] as &$u) {
                if ($u['id'] === $targetId) {
                    if ($u['id'] === $_SESSION['usuario_id']) {
                        http_response_code(400);
                        echo json_encode(["status" => "error", "message" => "Você não pode desativar sua própria conta."]);
                        exit;
                    }
                    $u['ativo'] = !$u['ativo'];
                    $found = true;
                    break;
                }
            }
            if ($found) {
                file_put_contents($usuariosFile, json_encode($usuariosData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                echo json_encode(["status" => "success"]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Usuário não encontrado."]);
            }
            exit;
        }
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
            "canindeDelas" => isset($data['canindeDelas']) ? $data['canindeDelas'] : new stdClass(),
            "configuracoes" => isset($data['configuracoes']) ? $data['configuracoes'] : new stdClass()
        ];
        
        // Salvar com permissões adequadas
        $result = file_put_contents($dataFile, json_encode($formattedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        if ($result !== false) {
            // Gerar log de atividade
            $logFile = __DIR__ . '/log_atividade.json';
            $logsData = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : ['logs' => []];
            
            date_default_timezone_set('America/Sao_Paulo');
            array_unshift($logsData['logs'], [
                "usuario" => $_SESSION['usuario_nome'] ?? 'Desconhecido',
                "papel" => $_SESSION['papel'] ?? 'Desconhecido',
                "data_hora" => date('d/m/Y H:i:s'),
                "acao" => "salvou e publicou alterações no conteúdo do site"
            ]);
            
            // Manter apenas os últimos 200 logs
            $logsData['logs'] = array_slice($logsData['logs'], 0, 200);
            file_put_contents($logFile, json_encode($logsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

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
