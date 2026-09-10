<?php
// router.php — usado apenas com o servidor embutido do PHP (php -S)
// Bloqueia acesso HTTP direto a arquivos dentro de scripts-internos/
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if (strpos($uri, '/scripts-internos/') === 0) {
    http_response_code(404);
    echo "404 Not Found";
    return true;
}

// Deixa o servidor embutido tratar todo o resto normalmente
return false;
