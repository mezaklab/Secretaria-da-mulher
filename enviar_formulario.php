<?php
session_start();
header('Content-Type: application/json');

// Incluir configurações e PHPMailer
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/libs/PHPMailer/Exception.php';
require_once __DIR__ . '/libs/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/libs/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Funções utilitárias
function responder($sucesso, $mensagem) {
    echo json_encode(['success' => $sucesso, 'message' => $mensagem]);
    exit;
}

function registrar_historico($tipo, $nome, $status) {
    $arquivo_historico = __DIR__ . '/historico_solicitacoes.json';
    $historico = [];
    if (file_exists($arquivo_historico)) {
        $conteudo = file_get_contents($arquivo_historico);
        $historico = json_decode($conteudo, true) ?: [];
    }
    
    $novo_registro = [
        'id' => uniqid(),
        'tipo' => $tipo,
        'nome' => $nome,
        'data_hora' => date('c'), // Formato ISO 8601
        'status' => $status
    ];
    
    array_unshift($historico, $novo_registro); // Mais recentes primeiro
    file_put_contents($arquivo_historico, json_encode($historico, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Verifica se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método inválido.');
}

// 2. Validação do Honeypot (campo armadilha)
$honeypot = $_POST['website_url'] ?? '';
if (!empty($honeypot)) {
    // É um bot. Retorna sucesso falso silenciosamente.
    responder(true, 'Solicitação enviada com sucesso!');
}

// 3. Captura e validação de tamanho dos campos (Prevenção de abuso)
$tipo = $_POST['tipo'] ?? '';
$nome = trim(substr($_POST['nome'] ?? '', 0, 200));
$cpf = trim(substr($_POST['cpf'] ?? '', 0, 200));
$nascimento = trim(substr($_POST['nascimento'] ?? '', 0, 200));
$endereco = trim(substr($_POST['endereco'] ?? '', 0, 200));
$whatsapp = trim(substr($_POST['whatsapp'] ?? '', 0, 200));
$telefone2 = trim(substr($_POST['telefone2'] ?? '', 0, 200));
$relato = trim(substr($_POST['relato'] ?? '', 0, 5000));

// Validação de campos obrigatórios (Server-side)
if (empty($nome) || empty($cpf) || empty($nascimento) || empty($endereco) || empty($relato)) {
    responder(false, 'Por favor, preencha todos os campos obrigatórios.');
}

// Validação estrita do tipo (Whitelist)
if (!in_array($tipo, ['juridico', 'psicologico'], true)) {
    responder(false, 'Tipo de solicitação inválido.');
}

// 4. Limite de reenvio de 60 segundos por sessão
$session_key = 'ultimo_envio_' . $tipo;
if (isset($_SESSION[$session_key]) && (time() - $_SESSION[$session_key]) < 60) {
    responder(false, 'Aguarde um momento antes de enviar outra solicitação desse tipo.');
}
$_SESSION[$session_key] = time();

// 5. Lê o destinatário
$arquivo_destinatarios = __DIR__ . '/destinatarios.json';
$email_destino = '';
if (file_exists($arquivo_destinatarios)) {
    $destinatarios = json_decode(file_get_contents($arquivo_destinatarios), true);
    $email_destino = $destinatarios[$tipo] ?? '';
}

if (empty($email_destino)) {
    responder(false, 'Não foi possível processar seu pedido no momento. Tente novamente mais tarde.');
}

// 6. Monta e envia o e-mail via PHPMailer
$mail = new PHPMailer(true);
$status_envio = 'falha';

try {
    // Configurações do Servidor
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    // Remetente e Destinatário
    $mail->setFrom(SMTP_USER, 'Secretaria da Mulher');
    $mail->addAddress($email_destino);

    // Conteúdo - Usando apenas Texto Plano (Segurança e Simplicidade)
    $mail->isHTML(false);
    $assunto_tipo = $tipo === 'juridico' ? 'Jurídico' : 'Psicológico';
    $mail->Subject = "Nova Solicitacao de Atendimento - $assunto_tipo";
    
    // Corpo do E-mail (Texto Plano)
    $textoBody = "Nova Solicitação de Atendimento {$assunto_tipo}\n\n";
    $textoBody .= "Nome: {$nome}\n";
    $textoBody .= "CPF: {$cpf}\n";
    $textoBody .= "Nascimento: {$nascimento}\n";
    $textoBody .= "Endereço: {$endereco}\n";
    $textoBody .= "WhatsApp: {$whatsapp}\n";
    $textoBody .= "Telefone Alternativo: {$telefone2}\n\n";
    $textoBody .= "Relato/Problema:\n{$relato}\n\n";
    $textoBody .= "----------------------------------------\n";
    $textoBody .= "Enviado através do portal da Secretaria Municipal da Mulher.";
    
    $mail->Body = $textoBody;

    $mail->send();
    $status_envio = 'sucesso';
    
} catch (Exception $e) {
    $status_envio = 'falha';
}

// 7. Registra no Histórico
registrar_historico($tipo, $nome, $status_envio);

// 8. Responde ao Front-end
if ($status_envio === 'sucesso') {
    responder(true, 'Solicitação enviada com sucesso! Entraremos em contato em breve.');
} else {
    responder(false, 'Houve um erro ao enviar sua solicitação. Tente novamente mais tarde.');
}
