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
if (!in_array($tipo, ['juridico', 'psicologico', 'social'], true)) {
    responder(false, 'Tipo de solicitação inválido.');
}

// 4. Lê o destinatário ANTES de aplicar limite de reenvio
$arquivo_destinatarios = __DIR__ . '/destinatarios.json';
$email_destino = '';
if (file_exists($arquivo_destinatarios)) {
    $destinatarios = json_decode(file_get_contents($arquivo_destinatarios), true);
    $email_destino = $destinatarios['email_atendimentos'] ?? ($destinatarios[$tipo] ?? ''); // Fallback pro antigo
}

if (empty($email_destino)) {
    registrar_historico($tipo, $nome, 'falha_config');
    responder(false, 'Não foi possível processar seu pedido no momento. Tente novamente mais tarde.');
}

// 5. Limite de reenvio de 60 segundos por sessão
$session_key = 'ultimo_envio_' . $tipo;
if (isset($_SESSION[$session_key]) && (time() - $_SESSION[$session_key]) < 60) {
    responder(false, 'Aguarde um momento antes de enviar outra solicitação desse tipo.');
}
$_SESSION[$session_key] = time();

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

    // Embutindo o logo para uso no HTML
    if (file_exists(__DIR__ . '/public/brasao.png')) {
        $mail->addEmbeddedImage(__DIR__ . '/public/brasao.png', 'brasao_sm');
    }

    $mail->isHTML(true);
    $assunto_tipo = $tipo === 'juridico' ? 'Jurídico' : ($tipo === 'psicologico' ? 'Psicológico' : 'Assistência Social');
    $mail->Subject = "Nova Solicitacao de Atendimento - $assunto_tipo";
    
    // Fallback Texto Plano (AltBody)
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

    // Montagem do HTML com Escape de Segurança
    $cor_destaque = '#7A3E9D';
    $data_envio = date('d/m/Y H:i:s');

    $nome_safe = htmlspecialchars($nome, ENT_QUOTES, 'UTF-8');
    $cpf_safe = htmlspecialchars($cpf, ENT_QUOTES, 'UTF-8');
    $nascimento_safe = htmlspecialchars($nascimento, ENT_QUOTES, 'UTF-8');
    $endereco_safe = htmlspecialchars($endereco, ENT_QUOTES, 'UTF-8');
    $whatsapp_safe = htmlspecialchars($whatsapp, ENT_QUOTES, 'UTF-8');
    $telefone2_safe = htmlspecialchars($telefone2, ENT_QUOTES, 'UTF-8');
    $relato_safe = nl2br(htmlspecialchars($relato, ENT_QUOTES, 'UTF-8'));

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Solicitação de Atendimento - {$assunto_tipo}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; -webkit-font-smoothing: antialiased;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <tr>
            <td style="background-color: {$cor_destaque}; padding: 20px 30px; text-align: left; border-bottom: 4px solid #5d2f78;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td width="60" style="vertical-align: middle;">
                            <img src="cid:brasao_sm" alt="Brasão" width="50" style="display: block; max-width: 100%;">
                        </td>
                        <td style="vertical-align: middle;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 16px; font-weight: normal; letter-spacing: 0.5px;">Secretaria Municipal da Mulher</h1>
                            <h2 style="margin: 4px 0 0 0; color: #ffffff; font-size: 22px; font-weight: bold;">Atendimento {$assunto_tipo}</h2>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666;">
                    Uma nova solicitação foi recebida através do portal público. Seguem os dados preenchidos:
                </p>
                <table width="100%" cellpadding="12" cellspacing="0" border="0" style="font-size: 15px; border-collapse: collapse;">
                    <tr>
                        <td width="35%" style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Nome Completo:</td>
                        <td width="65%" style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee; color: #111111;">{$nome_safe}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #ffffff; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">CPF:</td>
                        <td style="background-color: #ffffff; border-bottom: 1px solid #eeeeee; color: #111111;">{$cpf_safe}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Nascimento:</td>
                        <td style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee; color: #111111;">{$nascimento_safe}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #ffffff; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Endereço:</td>
                        <td style="background-color: #ffffff; border-bottom: 1px solid #eeeeee; color: #111111;">{$endereco_safe}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">WhatsApp:</td>
                        <td style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee; color: #111111;">{$whatsapp_safe}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #ffffff; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Tel. Alternativo:</td>
                        <td style="background-color: #ffffff; border-bottom: 1px solid #eeeeee; color: #111111;">{$telefone2_safe}</td>
                    </tr>
                </table>
                <div style="margin-top: 30px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: {$cor_destaque}; border-bottom: 2px solid {$cor_destaque}; padding-bottom: 5px;">Relato / Necessidade</h3>
                    <div style="background-color: #fbfbfb; border-left: 4px solid {$cor_destaque}; padding: 15px; font-size: 15px; line-height: 1.6; color: #333333; margin: 0;">
                        {$relato_safe}
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f4f4f4; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0; font-size: 12px; color: #888888; line-height: 1.5;">
                    Enviado através do portal oficial da Secretaria Municipal da Mulher de Canindé de São Francisco - SE<br>
                    Data e Hora do Envio: <strong>{$data_envio}</strong>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    
    $mail->Body = $htmlBody;
    $mail->AltBody = $textoBody;

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
