<?php
session_start();
require_once __DIR__ . '/config.php';

if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username']) && isset($_POST['password'])) {
    $time_now = time();

    // Verifica se a sessão está bloqueada
    if (isset($_SESSION['lockout_time']) && $time_now < $_SESSION['lockout_time']) {
        $error = "Muitas tentativas falhas. Tente novamente em 10 minutos.";
    } else {
        // Desbloqueia se o tempo passou
        if (isset($_SESSION['lockout_time']) && $time_now >= $_SESSION['lockout_time']) {
            unset($_SESSION['lockout_time']);
            $_SESSION['login_attempts'] = 0;
        }

        if ($_POST['username'] === ADMIN_USER && password_verify($_POST['password'], ADMIN_PASS_HASH)) {
            session_regenerate_id(true);
            $_SESSION['logged_in'] = true;
            $_SESSION['login_attempts'] = 0;
            unset($_SESSION['lockout_time']);
        } else {
            $_SESSION['login_attempts']++;
            if ($_SESSION['login_attempts'] >= 5) {
                $_SESSION['lockout_time'] = $time_now + 600;
                $error = "Muitas tentativas falhas. Tente novamente em 10 minutos.";
            } else {
                $error = "Usuário ou senha incorretos.";
            }
        }
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
?>
<?php if (!$isLoggedIn): ?>
<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta name="csrf-token" content="<?php echo $_SESSION['csrf_token'] ?? ''; ?>">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesso Restrito — Secretaria da Mulher</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Atkinson Hyperlegible"', 'sans-serif'],
                        display: ['"Poppins"', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            hero: '#F5EEFB',
                            textDark: '#3B284C',
                            textMuted: '#6B5E78',
                            primary: '#7A3E9D',
                            primaryHover: '#682F87',
                            cardBorder: '#EFE8F5',
                            iconBg: '#F3EBF9',
                        }
                    }
                }
            }
        }
    </script>

    <style>
        body { background-color: #f6f2f8; -webkit-font-smoothing: antialiased; }
        h1,h2,h3,h4,h5,h6,.font-display { font-family: 'Poppins', sans-serif; letter-spacing: -0.02em; }

        [vw],[vw-access-button],.access-button,div[vw] {
            z-index: 99999 !important; display: block !important;
            visibility: visible !important; position: fixed !important;
        }

        .login-card {
            background: rgba(255,255,255,0.93);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }

        .input-field:focus {
            outline: none;
            border-color: #7A3E9D;
            box-shadow: 0 0 0 3px rgba(122,62,157,0.18);
        }

        body.high-contrast { background-color: #000 !important; color: #fff !important; }
        body.high-contrast .login-card { background: #111 !important; border-color: #fff !important; color: #fff !important; }
        body.high-contrast input { background: #222 !important; color: #fff !important; border-color: #fff !important; }
        body.high-contrast label { color: #fff !important; }
        body.high-contrast #accessibility-bar { background-color: #000 !important; border-bottom-color: #fff !important; }
        body.high-contrast #accessibility-bar button { background-color: #333 !important; color: #fff !important; border: 1px solid #fff !important; }

        @media (max-width: 767px) { html,body { overflow-x: hidden !important; max-width: 100vw; } }
    </style>
</head>

<body class="font-sans leading-relaxed relative overflow-x-hidden w-full max-w-full min-h-screen">

    <!-- Barra de Acessibilidade Institucional -->
    <aside id="accessibility-bar" aria-label="Barra de Acessibilidade Institucional"
        class="w-full bg-[#3b1d54] text-purple-100 py-[6px] px-[16px] z-50 relative border-b border-purple-900/30"
        style="font-size: 12px !important;">
        <div class="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-[8px]">
            <div class="flex items-center gap-[8px]">
                <span class="font-semibold tracking-wide flex items-center gap-[6px] text-purple-100 text-[12px]">
                    <i class="fas fa-universal-access text-[14px] text-purple-300" aria-hidden="true"></i>
                    Acessibilidade
                </span>
                <span class="hidden sm:inline text-purple-400/60 text-[12px]">|</span>
                <span class="hidden sm:inline text-purple-200/90 text-[11px]">Prefeitura Municipal de Canindé de São Francisco</span>
            </div>
            <div class="flex items-center gap-[4px] sm:gap-[8px]">
                <button type="button" onclick="changeFontSize(-10)"
                    class="bg-purple-900/60 hover:bg-purple-800 text-purple-100 px-[8px] py-[2px] rounded-[4px] border border-purple-700/50 transition-colors text-[11px] font-bold"
                    title="Diminuir tamanho do texto" aria-label="Diminuir fonte"><span>A-</span></button>
                <button type="button" onclick="resetFontSize()"
                    class="bg-purple-900/60 hover:bg-purple-800 text-purple-100 px-[8px] py-[2px] rounded-[4px] border border-purple-700/50 transition-colors text-[11px] font-bold"
                    title="Redefinir tamanho do texto" aria-label="Redefinir fonte"><span>A</span></button>
                <button type="button" onclick="changeFontSize(10)"
                    class="bg-purple-900/60 hover:bg-purple-800 text-purple-100 px-[8px] py-[2px] rounded-[4px] border border-purple-700/50 transition-colors text-[11px] font-bold"
                    title="Aumentar tamanho do texto" aria-label="Aumentar fonte"><span>A+</span></button>
                <button type="button" onclick="toggleHighContrast()" id="btn-contrast"
                    class="ml-[4px] sm:ml-[8px] bg-purple-900/60 hover:bg-purple-800 text-purple-100 px-[10px] py-[2px] rounded-[4px] border border-purple-700/50 transition-colors text-[11px] font-semibold flex items-center gap-[6px]"
                    title="Alternar Alto Contraste" aria-label="Alternar Alto Contraste" aria-pressed="false">
                    <i class="fas fa-circle-half-stroke text-[14px] text-purple-300" aria-hidden="true"></i>
                    <span class="hidden sm:inline text-[11px]">Alto Contraste</span>
                </button>
            </div>
        </div>
    </aside>

    <!-- Fundo gradiente idêntico ao Hero da index.html -->
    <div class="relative w-full min-h-[calc(100vh-36px)] bg-gradient-to-br from-[#9782AD] via-[#7F6A96] to-[#5C4573] flex flex-col">

        <!-- Efeitos decorativos -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
            <div class="absolute -top-24 -right-24 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 -left-24 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <!-- Header: brasão + nome da Secretaria -->
        <header class="relative z-10 w-full pt-6 pb-4 px-4 sm:px-8">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <a href="index.html" class="inline-flex items-center gap-3 group hover:opacity-90 transition-opacity"
                    aria-label="Voltar para a página inicial da Secretaria da Mulher">
                    <img src="/public/brasao.png" alt="Brasão de Canindé de São Francisco"
                        class="h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0 filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 bg-transparent"/>
                    <div class="flex flex-col justify-center leading-none">
                        <span class="text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-tight font-display leading-none drop-shadow-sm">
                            Secretaria da Mulher
                        </span>
                        <span class="text-[10px] sm:text-xs font-semibold text-white/80 tracking-wider uppercase mt-1 leading-none">
                            Canindé de São Francisco
                        </span>
                    </div>
                </a>
                <a href="index.html" class="hidden sm:inline-flex items-center gap-2 text-white/75 hover:text-white text-sm font-semibold transition-colors">
                    <i class="fas fa-arrow-left text-xs"></i> Voltar ao site
                </a>
            </div>
        </header>

        <!-- Card de Login centralizado -->
        <main class="relative z-10 flex-grow flex items-center justify-center px-4 py-10 sm:py-12">
            <div class="w-full max-w-md">

                <!-- Badge área restrita -->
                <div class="flex justify-center mb-6">
                    <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white rounded-full text-xs font-semibold tracking-wide border border-white/20 shadow-sm">
                        <i class="fas fa-lock text-purple-200 text-[10px]"></i>
                        Área de Acesso Restrito
                    </span>
                </div>

                <!-- Card -->
                <div class="login-card rounded-[2rem] shadow-2xl border border-white/40 px-8 py-10 sm:px-10">

                    <!-- Ícone de usuário -->
                    <div class="flex justify-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#7A3E9D] to-[#5C4573] flex items-center justify-center shadow-lg ring-4 ring-white/40">
                            <i class="fas fa-user-shield text-white text-2xl"></i>
                        </div>
                    </div>

                    <h1 class="font-display text-2xl sm:text-3xl text-brand-textDark text-center mb-1">Painel de Gestão</h1>
                    <p class="text-center text-brand-textMuted text-sm mb-8 font-sans leading-relaxed">
                        Secretaria da Mulher<br><span class="text-xs">Canindé de São Francisco</span>
                    </p>

                    <!-- Alerta de erro -->
                    
                    <?php if (isset($error)): ?>
                    <div id="login-error"
                        class="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium"
                        role="alert" aria-live="assertive">
                        <i class="fas fa-exclamation-circle text-red-400 shrink-0"></i>
                        <span><?= htmlspecialchars($error) ?></span>
                    </div>
                    <?php endif; ?>


                    <form id="login-form" method="POST" action="">

                        <!-- Usuário -->
                        <div class="mb-5">
                            <label for="login-user" class="block text-sm font-semibold text-brand-textDark mb-2">
                                <i class="fas fa-user text-brand-primary mr-1.5 text-xs"></i>Usuário
                            </label>
                            <input type="text" id="login-user" name="username" autocomplete="username"
                                placeholder="Digite seu usuário" required
                                class="input-field w-full border border-brand-cardBorder rounded-xl px-4 py-3 text-brand-textDark placeholder-brand-textMuted/50 bg-brand-hero/50 text-sm transition-all duration-200 focus:bg-white">
                        </div>

                        <!-- Senha -->
                        <div class="mb-5">
                            <label for="login-senha" class="block text-sm font-semibold text-brand-textDark mb-2">
                                <i class="fas fa-lock text-brand-primary mr-1.5 text-xs"></i>Senha
                            </label>
                            <div class="relative">
                                <input type="password" id="login-senha" name="password" autocomplete="current-password"
                                    placeholder="Digite sua senha" required
                                    class="input-field w-full border border-brand-cardBorder rounded-xl px-4 py-3 pr-12 text-brand-textDark placeholder-brand-textMuted/50 bg-brand-hero/50 text-sm transition-all duration-200 focus:bg-white">
                                <button type="button" onclick="toggleSenha()"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textMuted hover:text-brand-primary transition-colors p-1.5"
                                    aria-label="Mostrar ou ocultar senha">
                                    <i id="icon-senha" class="fas fa-eye text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Manter Conectado -->
                        <div class="flex items-center mb-7">
                            <label class="flex items-center gap-3 cursor-pointer select-none group" for="manter-conectado">
                                <div class="relative shrink-0">
                                    <input type="checkbox" id="manter-conectado" name="manter_conectado" class="sr-only">
                                    <div id="checkbox-box"
                                        class="w-5 h-5 border-2 border-brand-cardBorder rounded-md bg-white transition-all duration-200 flex items-center justify-center cursor-pointer"
                                        onclick="toggleCheckbox()">
                                        <i id="check-icon" class="fas fa-check text-white text-[10px] opacity-0 transition-opacity duration-150"></i>
                                    </div>
                                </div>
                                <span class="text-sm text-brand-textMuted group-hover:text-brand-textDark transition-colors font-medium">
                                    Manter conectado
                                </span>
                            </label>
                        </div>

                        <!-- Botão Entrar -->
                        <button type="submit" id="btn-entrar"
                            class="w-full bg-brand-primary hover:bg-brand-primaryHover active:scale-[0.98] text-white font-display font-bold text-base py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5">
                            <i class="fas fa-sign-in-alt text-sm"></i> Entrar
                        </button>
                    </form>

                    <!-- Rodapé do card -->
                    <div class="mt-8 pt-6 border-t border-brand-cardBorder text-center">
                        <a href="index.html" class="inline-flex items-center gap-1.5 text-brand-textMuted hover:text-brand-primary text-xs font-medium transition-colors">
                            <i class="fas fa-arrow-left text-[10px]"></i> Voltar ao site da Secretaria
                        </a>
                    </div>
                </div>

                <p class="text-center text-white/40 text-xs mt-6 font-sans">
                    © 2026 Prefeitura Municipal de Canindé de São Francisco
                </p>
            </div>
        </main>
    </div>

    <!-- Widget VLibras -->
    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    </div>
    <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
    <script>new window.VLibras.Widget('https://vlibras.gov.br/app');</script>

    <script>
        // ── Checkbox visual personalizado ────────────────────────────
        let isChecked = false;
        function toggleCheckbox() {
            isChecked = !isChecked;
            const box  = document.getElementById('checkbox-box');
            const icon = document.getElementById('check-icon');
            document.getElementById('manter-conectado').checked = isChecked;
            if (isChecked) {
                box.style.backgroundColor = '#7A3E9D';
                box.style.borderColor = '#7A3E9D';
                icon.style.opacity = '1';
            } else {
                box.style.backgroundColor = '#fff';
                box.style.borderColor = '#EFE8F5';
                icon.style.opacity = '0';
            }
        }

        // ── Mostrar/Ocultar senha ────────────────────────────────────
        function toggleSenha() {
            const input = document.getElementById('login-senha');
            const icon  = document.getElementById('icon-senha');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }

        // ── Tamanho de Fonte ──────────────────────────────────────────
        let currentFontSize = 100;
        function changeFontSize(delta) {
            currentFontSize = Math.min(130, Math.max(80, currentFontSize + delta));
            document.documentElement.style.fontSize = currentFontSize + '%';
        }
        function resetFontSize() {
            currentFontSize = 100;
            document.documentElement.style.fontSize = '100%';
        }

        // ── Alto Contraste ────────────────────────────────────────────
        function toggleHighContrast() {
            document.body.classList.toggle('high-contrast');
            const btn    = document.getElementById('btn-contrast');
            const active = document.body.classList.contains('high-contrast');
            btn.setAttribute('aria-pressed', active);
        }
    </script>
</body>
</html>

<?php else: ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta name="csrf-token" content="<?php echo $_SESSION['csrf_token'] ?? ''; ?>">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="referrer" content="no-referrer">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <title>Painel de Gestão - Secretaria da Mulher</title>

    

    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            primary: '#4A3260',
                            secondary: '#8E79A5',
                            bg: '#F8F9FA',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Playfair Display', 'serif'],
                    }
                }
            }
        }
    </script>
    <style>
      @media (max-width: 1023px) {
        header#admin-header-not-exists-placeholder { } /* ignorar, apenas reserva */
        main .p-8 { padding: 1.25rem !important; }
        header.bg-white.px-8 { padding-left: 1rem !important; padding-right: 1rem !important; }
        #header-title { font-size: 1.25rem !important; }
      }
    </style>
</head>
<body class="bg-brand-bg font-sans text-gray-800 flex h-screen overflow-hidden">

    <!-- Overlay do Sidebar -->
    <div id="admin-sidebar-overlay" class="fixed inset-0 bg-black/40 z-30 hidden lg:hidden"></div>

    <!-- Sidebar -->
    <aside id="admin-sidebar" class="w-64 bg-brand-primary text-white flex flex-col h-full shadow-xl z-40 shrink-0 fixed lg:static inset-y-0 left-0 -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
        <div class="p-6 border-b border-white/10 flex items-center gap-3.5">
            <img 
                src="/public/brasao.png" 
                alt="Brasão de Canindé de São Francisco" 
                class="h-11 w-auto object-contain shrink-0 filter drop-shadow-md"
            />
            <div class="flex flex-col leading-none text-left">
                <h1 class="font-display font-bold text-xl tracking-tight text-white leading-tight">Secretaria da Mulher</h1>
                <p class="text-[10px] uppercase tracking-wider text-white/80 mt-1">Canindé de São Francisco</p>
            </div>
        </div>
        
        <nav class="flex-grow p-4 space-y-2 overflow-y-auto" id="sidebar-nav">
            <a href="#" data-target="visao-geral" class="nav-item flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-medium transition-colors">
                <i class="fas fa-chart-line w-5 text-center"></i> Nossas Ações nas Ruas
            </a>
            <a href="#" data-target="acoes-fotos" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-video w-5 text-center"></i> Nossos Vídeos
            </a>
            <a href="#" data-target="servicos-saude" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-heartbeat w-5 text-center"></i> Saúde Preventiva
            </a>
            <a href="#" data-target="caninde-delas" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-female w-5 text-center"></i> Canindé + Delas
            </a>
            <a href="#" data-target="agenda" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-calendar-alt w-5 text-center"></i> Agenda
            </a>
            <a href="#" data-target="configuracoes" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-cog w-5 text-center"></i> Configurações
            </a>
        </nav>

        <div class="p-4 border-t border-white/10 space-y-2">
            <a href="index.html" class="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white text-sm transition-colors">
                <i class="fas fa-external-link-alt w-5 text-center"></i> Portal Público
            </a>
            <button onclick="fazerLogout()" class="flex items-center gap-3 px-4 py-2 text-red-300 hover:text-red-100 text-sm transition-colors w-full text-left">
                <i class="fas fa-sign-out-alt w-5 text-center"></i> Sair
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col h-full overflow-y-auto relative bg-brand-bg">
        <!-- Header -->
        <header class="bg-white px-8 py-5 shadow-sm flex justify-between items-center z-10 sticky top-0">
            <div class="flex items-center">
                <button type="button" id="admin-menu-toggle" class="lg:hidden mr-3 text-brand-primary p-2 -ml-2" aria-label="Abrir menu">
                    <i class="fas fa-bars text-xl"></i>
                </button>
                <h2 id="header-title" class="text-2xl font-display font-semibold text-brand-primary">Nossas Ações nas Ruas</h2>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div class="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-primary">
                    <i class="fas fa-user"></i>
                </div>
                <div class="text-sm">
                    <p id="admin-display-name" class="font-bold text-gray-800">Administrador</p>
                    <p id="admin-display-role" class="text-gray-500">Gestor Institucional</p>
                </div>
            </div>
        </header>

        <!-- Dashboard Content -->
        <div class="p-8 max-w-7xl mx-auto w-full">
            <!-- Visão Geral -->
            <div id="visao-geral" class="tab-content block">

                <!-- Módulo de Gestão de Ações -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 class="text-lg font-bold text-gray-800">Gerenciar Ações nas Ruas</h3>
                        <button class="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm" onclick="document.getElementById('modal').classList.remove('hidden'); document.getElementById('edit-id-acoes').value=''; document.getElementById('modal-context').value='acoes'; document.getElementById('modal').querySelector('h3').innerText='Cadastrar Nova Ação'; document.getElementById('label-capa-midia').innerText='Mídia da Capa (Foto ou Vídeo)'; document.getElementById('upload-placeholder-text').innerText='Clique ou arraste uma imagem/vídeo'; document.getElementById('galeria-adicional-wrapper').classList.remove('hidden'); if(typeof removeImageBtn !== 'undefined' && removeImageBtn) removeImageBtn.click(); currentActionGallery = []; if(typeof renderGalleryThumbnails === 'function') renderGalleryThumbnails();">
                            <i class="fas fa-plus mr-2"></i> Nova Ação
                        </button>
                    </div>
                    <div class="overflow-x-auto w-full">
                        <table class="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr class="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th class="px-6 py-4 font-semibold">Título</th>
                                    <th class="px-6 py-4 font-semibold">Categoria</th>
                                    <th class="px-6 py-4 font-semibold">Data</th>
                                    <th class="px-6 py-4 font-semibold">Status</th>
                                    <th class="px-6 py-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 text-sm">
                                <tr class="hover:bg-gray-50/50 transition-colors group">
                                    <td class="px-6 py-4 font-medium text-gray-800">Palestra sobre prevenção</td>
                                    <td class="whitespace-nowrap px-4 py-2"><span class="inline-block px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-purple-100 text-brand-primary">Saúde</span></td>
                                    <td class="px-6 py-4 text-gray-500">24 Out 2024</td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Publicado</span></td>
                                    <td class="px-6 py-4 text-right">
                                        <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                        <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50/50 transition-colors group">
                                    <td class="px-6 py-4 font-medium text-gray-800">Mutirão de Documentação Feminina</td>
                                    <td class="whitespace-nowrap px-4 py-2"><span class="inline-block px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-blue-100 text-blue-700">Apoio Legal</span></td>
                                    <td class="px-6 py-4 text-gray-500">15 Out 2024</td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Publicado</span></td>
                                    <td class="px-6 py-4 text-right">
                                        <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                        <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50/50 transition-colors group">
                                    <td class="px-6 py-4 font-medium text-gray-800">Caminhada Agosto Lilás</td>
                                    <td class="whitespace-nowrap px-4 py-2"><span class="inline-block px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-purple-100 text-brand-primary">Ações Comunitárias</span></td>
                                    <td class="px-6 py-4 text-gray-500">01 Set 2026</td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Publicado</span></td>
                                    <td class="px-6 py-4 text-right">
                                        <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                        <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Ações & Fotos -->
            <div id="acoes-fotos" class="tab-content hidden">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 class="text-lg font-bold text-gray-800">Nossos Vídeos</h3>
                        <button class="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm" onclick="document.getElementById('modal').classList.remove('hidden'); document.getElementById('edit-id-acoes').value=''; document.getElementById('modal-context').value='galeria'; document.getElementById('modal').querySelector('h3').innerText='Cadastrar Novo Vídeo'; document.getElementById('label-capa-midia').innerText='Arquivo de Mídia (Vídeo)'; document.getElementById('upload-placeholder-text').innerText='Clique ou arraste um vídeo'; document.getElementById('galeria-adicional-wrapper').classList.add('hidden'); if(typeof removeImageBtn !== 'undefined' && removeImageBtn) removeImageBtn.click(); currentActionGallery = []; if(typeof renderGalleryThumbnails === 'function') renderGalleryThumbnails();">
                            <i class="fas fa-upload mr-2"></i> Adicionar Mídia
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div class="border border-gray-200 rounded-xl overflow-hidden group">
                            <div class="h-40 bg-gray-200 relative">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button title="Editar" class="btn-edit w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-brand-primary cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                    <button title="Excluir" class="btn-delete w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="p-4">
                                <h4 class="font-bold text-gray-800 mb-1">Palestra sobre prevenção</h4>
                                <p class="text-xs text-gray-500">Publicado em 24/10/2024</p>
                            </div>
                        </div>
                        <div class="border border-gray-200 rounded-xl overflow-hidden group">
                            <div class="h-40 bg-gray-200 relative">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button title="Editar" class="btn-edit w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-brand-primary cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                    <button title="Excluir" class="btn-delete w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="p-4">
                                <h4 class="font-bold text-gray-800 mb-1">Mutirão de Documentação</h4>
                                <p class="text-xs text-gray-500">Publicado em 15/10/2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Serviços de Saúde -->
            <div id="servicos-saude" class="tab-content hidden">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">Serviços Preventivos de Saúde</h3>
                            <p class="text-xs text-gray-400 mt-0.5">Gerencie os serviços exibidos na seção "Sua Saúde em Primeiro Lugar"</p>
                        </div>
                        <button class="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm whitespace-nowrap" onclick="openNovoSaudeModal()">
                            <i class="fas fa-plus mr-2"></i> Novo Serviço de Saúde
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[750px]">
                            <thead>
                                <tr class="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th class="px-6 py-4 font-semibold">Ícone / Serviço</th>
                                    <th class="px-6 py-4 font-semibold">Descrição Curta</th>
                                    <th class="px-6 py-4 font-semibold">Local / Horário</th>
                                    <th class="px-6 py-4 font-semibold">Público-alvo</th>
                                    <th class="px-6 py-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 text-sm">
                                <!-- Preenchido via JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Canindé + Delas -->
            <div id="caninde-delas" class="tab-content hidden">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
                                <i class="fas fa-female"></i> Programa Estruturante
                            </div>
                            <h3 class="text-2xl font-display font-bold text-gray-800">Gestão: Canindé + Delas</h3>
                            <p class="text-xs text-gray-500 mt-1">Configure o texto institucional, subtítulo e a galeria de fotos exibidos na página inicial.</p>
                        </div>
                        <button type="button" id="btn-salvar-caninde" class="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md text-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95">
                            <i class="fas fa-save"></i> Salvar e Publicar
                        </button>
                    </div>

                    <form id="form-caninde-delas" class="space-y-6">
                        <div class="grid grid-cols-1 gap-6">
                            <!-- Subtítulo -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1.5">Subtítulo / Chamada Curta</label>
                                <input type="text" id="input-caninde-subtitulo" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow text-sm" placeholder="Ex: Mais autonomia, protagonismo e oportunidades reais para transformar a vida de cada mulher de Canindé.">
                            </div>

                            <!-- Descrição Longa: Canindé + Delas -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1.5">Descrição: Canindé + Delas</label>
                                <textarea id="input-caninde-descricao" rows="4" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow resize-y text-sm leading-relaxed" placeholder="Descreva os objetivos do programa Canindé + Delas..."></textarea>
                            </div>

                            <!-- Descrição Longa: Defesa Delas -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1.5">Descrição: Defesa Delas</label>
                                <textarea id="input-defesa-descricao" rows="4" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow resize-y text-sm leading-relaxed" placeholder="Descreva a rede de proteção Defesa Delas..."></textarea>
                            </div>

                            <!-- Descrição Longa: Empreender Delas -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1.5">Descrição: Empreender Delas</label>
                                <textarea id="input-empreender-descricao" rows="4" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow resize-y text-sm leading-relaxed" placeholder="Descreva o programa Empreender Delas..."></textarea>
                            </div>

                            <!-- Galeria de Fotos Múltiplas -->
                            <div class="border-t border-gray-100 pt-6">
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700">Galeria de Fotos do Projeto</label>
                                        <p class="text-xs text-gray-400">Adicione até 100 mídias em alta qualidade (PNG, JPG, MP4 até 100MB)</p>
                                    </div>
                                    <span id="caninde-gallery-badge" class="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-brand-primary">0 / 100 fotos</span>
                                </div>

                                <!-- Input & Botão de Selecionar -->
                                <input type="file" id="input-caninde-fotos" accept="image/*,video/*" multiple class="hidden">
                                <div id="caninde-drop-area" class="border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 hover:bg-purple-50/80 hover:border-brand-primary transition-colors cursor-pointer" onclick="document.getElementById('input-caninde-fotos').click()">
                                    <div class="flex items-center gap-4 pointer-events-none">
                                        <div class="w-12 h-12 rounded-2xl bg-purple-100 text-brand-primary flex items-center justify-center text-xl shrink-0">
                                            <i class="fas fa-camera"></i>
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold text-gray-800">Clique para selecionar múltiplas fotos</p>
                                            <p class="text-xs text-gray-400">Você pode selecionar várias imagens de uma vez só</p>
                                        </div>
                                    </div>
                                    <button type="button" class="px-5 py-2.5 bg-white border border-purple-200 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm pointer-events-none whitespace-nowrap flex items-center gap-1.5">
                                        <i class="fas fa-plus"></i> Escolher Fotos
                                    </button>
                                </div>

                                <!-- Alerta amigável -->
                                <div id="caninde-error-msg" class="hidden mt-3 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                                    <i class="fas fa-exclamation-circle text-sm shrink-0"></i>
                                    <span id="caninde-error-text"></span>
                                </div>

                                <!-- Grid de Miniaturas com opção de excluir -->
                                <div id="caninde-thumbnails-grid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 mt-4">
                                    <!-- Preenchido via JS -->
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Agenda -->
            <div id="agenda" class="tab-content hidden">
                 <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 class="text-lg font-bold text-gray-800">Agenda de Ações & Serviços</h3>
                        <button class="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm whitespace-nowrap" onclick="document.getElementById('modal-agenda').classList.remove('hidden'); document.getElementById('edit-id-agenda').value=''; document.getElementById('modal-agenda').querySelector('h3').innerText='Novo Evento na Agenda';">
                            <i class="fas fa-plus mr-2"></i> Novo Evento / Ação na Agenda
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr class="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th class="px-6 py-4 font-semibold">Dia/Mês</th>
                                    <th class="px-6 py-4 font-semibold">Título do Evento</th>
                                    <th class="px-6 py-4 font-semibold">Horário</th>
                                    <th class="px-6 py-4 font-semibold">Local</th>
                                    <th class="px-6 py-4 font-semibold">Status</th>
                                    <th class="px-6 py-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 text-sm">
                                <tr class="hover:bg-gray-50/50 transition-colors group">
                                    <td class="px-6 py-4 font-bold text-brand-primary">20 Out</td>
                                    <td class="px-6 py-4 font-medium text-gray-800">Mutirão de saúde e acolhimento</td>
                                    <td class="px-6 py-4 text-gray-500">08h - 13h</td>
                                    <td class="px-6 py-4 text-gray-500">Clube Altemar Dutra</td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Realizado</span></td>
                                    <td class="px-6 py-4 text-right">
                                        <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                        <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50/50 transition-colors group">
                                    <td class="px-6 py-4 font-bold text-brand-primary">22 Out</td>
                                    <td class="px-6 py-4 font-medium text-gray-800">Roda de conversa sobre direitos</td>
                                    <td class="px-6 py-4 text-gray-500">18h - 21h</td>
                                    <td class="px-6 py-4 text-gray-500">Assentamento Cuiabá</td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Confirmado</span></td>
                                    <td class="px-6 py-4 text-right">
                                        <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                        <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50/50 transition-colors group">
                                    <td class="px-6 py-4 font-bold text-brand-primary">25 Out</td>
                                    <td class="px-6 py-4 font-medium text-gray-800">Preventivo noturno para trabalhadoras</td>
                                    <td class="px-6 py-4 text-gray-500">18h - 21h</td>
                                    <td class="px-6 py-4 text-gray-500">UBS Sede</td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Em Planejamento</span></td>
                                    <td class="px-6 py-4 text-right">
                                        <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                        <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Configurações -->
            <div id="configuracoes" class="tab-content hidden">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                    <h3 class="text-lg font-bold text-gray-800 mb-6">Dados Institucionais</h3>
                    <form class="space-y-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Endereço da Secretaria</label>
                            <input type="text" value="Rua Principal, 123, Centro" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow">
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                <input type="text" value="(79) 99999-9999" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">E-mail Institucional</label>
                                <input type="email" value="contato@secretaria.gov.br" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Link do Instagram</label>
                            <input type="url" value="https://instagram.com/secretariadamulher" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow">
                        </div>
                        <div class="pt-4 flex justify-end">
                            <button type="button" class="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>

    <!-- Modal de Cadastro -->
    <div id="modal" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 class="text-lg font-bold text-gray-800">Cadastrar Nova Ação</h3>
                <button class="text-gray-400 hover:text-gray-600 transition-colors p-1" onclick="document.getElementById('modal').classList.add('hidden')">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
                <form class="space-y-5">
                    <input type="hidden" id="edit-id-acoes">
                    <input type="hidden" id="modal-context" value="acoes">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Título da Ação</label>
                            <input type="text" id="input-titulo" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Roda de Conversa...">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select id="input-categoria" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary bg-white transition-shadow">
                                <option>Saúde da Mulher</option>
                                <option>Rede de Apoio & Proteção</option>
                                <option>Geração de Renda & Capacitação</option>
                                <option>Ações Comunitárias & Rua</option>
                                <option>Direitos & Cidadania</option>
                                <option>Cultura & Bem-estar</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input type="date" id="input-data" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow">
                        </div>
                        

                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <textarea id="input-descricao" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow resize-none" placeholder="Descreva os detalhes da ação..."></textarea>
                        </div>
                        


                        
                        <div class="col-span-1 md:col-span-2">
                            <label id="label-capa-midia" class="block text-sm font-medium text-gray-700 mb-1">Mídia da Capa (Foto ou Vídeo)</label>
                            <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-brand-primary transition-colors cursor-pointer group relative overflow-hidden" onclick="document.getElementById('action-image-input').click()">
                                <input type="file" id="action-image-input" accept="image/*,video/*" class="hidden">
                                
                                <!-- Estado Inicial (Ícone) -->
                                <div id="upload-placeholder" class="flex flex-col items-center pointer-events-none p-8 text-center">
                                    <i class="fas fa-cloud-upload-alt text-4xl mb-3 text-brand-secondary group-hover:text-brand-primary transition-colors"></i>
                                    <p id="upload-placeholder-text" class="text-sm font-medium text-gray-600">Clique ou arraste uma imagem/vídeo</p>
                                    <p class="text-xs mt-1 text-gray-400">PNG, JPG ou MP4 (até 100MB)</p>
                                </div>

                                <!-- Estado Preenchido (Preview) -->
                                <div id="upload-preview" class="hidden absolute inset-0 bg-black/5 flex items-center justify-center">
                                    <!-- A mídia renderizada será ajustada dinamicamente via JS (img ou video) -->
                                    <div id="media-preview-container" class="w-full h-full flex items-center justify-center">
                                        <img id="image-preview" src="" class="w-full h-full object-cover" alt="Preview">
                                    </div>
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" id="remove-image-btn" class="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 shadow-lg transform hover:scale-110 transition-all pointer-events-auto">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Galeria Adicional -->
                        <div id="galeria-adicional-wrapper" class="col-span-1 md:col-span-2 mt-2">
                            <div class="flex items-center justify-between mb-1">
                                <label class="block text-sm font-medium text-gray-700">Galeria de Mídias (até 30 adicionais)</label>
                                <span id="gallery-count-badge" class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-brand-primary">0 / 30 mídias</span>
                            </div>
                            
                            <!-- Input & Botão de Selecionar -->
                            <input type="file" id="action-gallery-input" accept="image/*,video/*" multiple class="hidden">
                            <div id="gallery-drop-area" class="border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 hover:bg-purple-50/80 hover:border-brand-primary transition-colors cursor-pointer" onclick="document.getElementById('action-gallery-input').click()">
                                <div class="flex items-center gap-3 pointer-events-none">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                                        <i class="fas fa-images"></i>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">Adicionar mídias à galeria desta ação</p>
                                        <p class="text-xs text-gray-400">Selecione imagens ou vídeos MP4</p>
                                    </div>
                                </div>
                                <button type="button" class="px-4 py-2 bg-white border border-purple-200 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm pointer-events-none whitespace-nowrap">
                                    <i class="fas fa-plus mr-1"></i> Escolher Mídias
                                </button>
                            </div>

                            <!-- Mensagem de Validação / Erro Amigável -->
                            <div id="gallery-error-msg" class="hidden mt-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                                <i class="fas fa-exclamation-circle text-sm shrink-0"></i>
                                <span id="gallery-error-text"></span>
                            </div>

                            <!-- Grade de Miniaturas / Thumbnails -->
                            <div id="gallery-thumbnails-grid" class="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3"></div>
                        </div>
                    </div>
                </form>
            </div>
            
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
                <button type="button" class="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors" onclick="document.getElementById('modal').classList.add('hidden')">
                    Cancelar
                </button>
                <button type="button" class="px-5 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-lg transition-colors shadow-sm">
                    Salvar e Publicar
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de Serviço de Saúde -->
    <div id="modal-saude" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 id="modal-saude-title" class="text-lg font-bold text-gray-800">Novo Serviço de Saúde</h3>
                <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors p-1" onclick="document.getElementById('modal-saude').classList.add('hidden')">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
                <form id="form-saude" class="space-y-5">
                    <input type="hidden" id="edit-id-saude">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Serviço <span class="text-red-500">*</span></label>
                            <input type="text" id="input-saude-titulo" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Seu preventivo" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ícone (FontAwesome)</label>
                            <select id="input-saude-icone" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary bg-white transition-shadow">
                                <option value="fa-droplet">Gota / Sangue (fa-droplet)</option>
                                <option value="fa-shield-virus">Proteção Vacina (fa-shield-virus)</option>
                                <option value="fa-moon">Lua / Noite (fa-moon)</option>
                                <option value="fa-heartbeat">Coração / Saúde (fa-heartbeat)</option>
                                <option value="fa-user-nurse">Enfermagem / Saúde (fa-user-nurse)</option>
                                <option value="fa-notes-medical">Prontuário / Exame (fa-notes-medical)</option>
                                <option value="fa-ribbon">Laço Rosa (fa-ribbon)</option>
                                <option value="fa-hospital">Posto / Hospital (fa-hospital)</option>
                            </select>
                        </div>

                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição Curta (exibida no card) <span class="text-red-500">*</span></label>
                            <input type="text" id="input-saude-descricao-curta" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Sem espera, sem burocracia. Disponível em todas as UBS..." required>
                        </div>

                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição Completa e Detalhada (exibida no modal) <span class="text-red-500">*</span></label>
                            <textarea id="input-saude-descricao-completa" rows="4" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow resize-none" placeholder="Explique detalhadamente como funciona o exame, preparação necessária, importância e benefícios para a saúde da mulher..." required></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Local de Atendimento</label>
                            <input type="text" id="input-saude-local" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Todas as UBSs do Município">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Horário de Atendimento</label>
                            <input type="text" id="input-saude-horario" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Seg a Sex, 08h às 13h (Noturno após 18h)">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Público-Alvo</label>
                            <input type="text" id="input-saude-publico" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Mulheres de 25 a 64 anos">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Documentos Necessários</label>
                            <input type="text" id="input-saude-documentos" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: RG, CPF e Cartão do SUS">
                        </div>

                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Foto Ilustrativa (Opcional)</label>
                            <input type="file" id="input-saude-imagem-file" accept="image/*,video/*" class="hidden">
                            <div id="saude-upload-area" class="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between gap-4 text-gray-500 hover:bg-gray-50 hover:border-brand-primary transition-colors cursor-pointer" onclick="document.getElementById('input-saude-imagem-file').click()">
                                <div class="flex items-center gap-3 pointer-events-none">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                                        <i class="fas fa-image"></i>
                                    </div>
                                    <div>
                                        <p id="saude-image-name" class="text-sm font-medium text-gray-700">Clique para anexar foto explicativa</p>
                                        <p class="text-xs text-gray-400">PNG, JPG até 100MB</p>
                                    </div>
                                </div>
                                <div id="saude-image-preview-wrapper" class="hidden flex items-center gap-2">
                                    <img id="saude-image-preview" src="" class="w-12 h-12 rounded-lg object-cover border border-purple-200" alt="Preview">
                                    <button type="button" id="remove-saude-image-btn" class="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs" onclick="event.stopPropagation(); removeSaudeImage();">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
                <button type="button" class="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors" onclick="document.getElementById('modal-saude').classList.add('hidden')">
                    Cancelar
                </button>
                <button type="button" id="btn-salvar-saude" class="px-5 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-lg transition-colors shadow-sm">
                    Salvar Serviço
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de Agenda -->
    <div id="modal-agenda" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 class="text-lg font-bold text-gray-800">Novo Evento na Agenda</h3>
                <button class="text-gray-400 hover:text-gray-600 transition-colors p-1" onclick="document.getElementById('modal-agenda').classList.add('hidden')">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
                <form class="space-y-5">
                    <input type="hidden" id="edit-id-agenda">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label>
                            <input type="text" id="agenda-title" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Mutirão de saúde e acolhimento">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input type="date" id="agenda-date" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Horário (Início e Fim)</label>
                            <input type="text" id="agenda-time" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: 08h - 13h">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Local / Bairro</label>
                            <input type="text" id="agenda-location" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Clube Altemar Dutra">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select id="agenda-status" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary bg-white transition-shadow">
                                <option>Confirmado</option>
                                <option>Em Planejamento</option>
                                <option>Realizado</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
                <button type="button" class="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors" onclick="document.getElementById('modal-agenda').classList.add('hidden')">
                    Cancelar
                </button>
                <button type="button" class="px-5 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-lg transition-colors shadow-sm">
                    Salvar Evento
                </button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const navItems = document.querySelectorAll('.nav-item');
            const tabContents = document.querySelectorAll('.tab-content');
            const headerTitle = document.getElementById('header-title');

            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remove estado ativo de todos
                    navItems.forEach(nav => {
                        nav.classList.remove('bg-white/10', 'text-white');
                        nav.classList.add('text-white/70');
                    });
                    
                    // Adiciona estado ativo no clicado
                    item.classList.add('bg-white/10', 'text-white');
                    item.classList.remove('text-white/70');

                    // Atualiza o título do Dashboard
                    if(headerTitle) {
                        headerTitle.textContent = item.textContent.trim();
                    }

                    // Esconde todas as abas
                    tabContents.forEach(tab => {
                        tab.classList.add('hidden');
                        tab.classList.remove('block');
                    });

                    // Mostra a aba correta
                    const targetId = item.getAttribute('data-target');
                    if (targetId) {
                        document.getElementById(targetId).classList.remove('hidden');
                        document.getElementById(targetId).classList.add('block');
                    }
                });
            });

            
            // ==========================================
            // CMS LOCALSTORAGE LOGIC (Sincronização)
            // ==========================================
            
            // Dados Padrões
            const defaultAcoes = [];
            
            const defaultGaleria = [];

            const defaultAgenda = [];

            // Dados Padrão de Serviços de Saúde
            const defaultServicosSaude = [];


            async function saveData(acoes, galeria, agenda, saude, canindeDelas) {
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                try {
                    const response = await fetch('api.php', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken
                        },
                        body: JSON.stringify({ acoes, galeria, agenda, saude, canindeDelas })
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.message || 'Erro desconhecido ao salvar.');
                    }
                    return result;
                } catch (e) {
                    console.error("Erro na API:", e);
                    alert("Erro ao salvar no servidor: " + e.message);
                    throw e; // Repassa o erro para abortar o fluxo da interface
                }
            }


            // Variáveis de Estado
            let adminAcoes = [...defaultAcoes];
            let adminGaleria = [...defaultGaleria];
            let adminAgenda = [...defaultAgenda];
            let adminServicosSaude = [...defaultServicosSaude];

            const defaultCanindeDelas = {
                titulo: 'Canindé + Delas',
                subtitulo: 'Mais autonomia, protagonismo e oportunidades reais para transformar a vida de cada mulher de Canindé.',
                descricao: 'O Canindé + Delas é o grande programa integrado de emancipação feminina, qualificação profissional e garantia de direitos do município de Canindé de São Francisco.\n\nArticulando ações de geração de renda, capacitação profissional, apoio a microempreendedoras, mutirões de saúde integral e rodas de cidadania, o programa atua diretamente nos bairros e comunidades rurais, levando oportunidades transformadoras a quem mais precisa.',
                defesaDescricao: 'O Defesa Delas é a nossa rede de proteção e acolhimento para mulheres em situação de violência, oferecendo suporte jurídico, psicológico e social gratuito.\n\nCom profissionais capacitadas e atendimento humanizado, garantimos que nenhuma mulher precise enfrentar o ciclo de violência sozinha. Juntas somos mais fortes e protegidas.',
                empreenderDescricao: 'O Empreender Delas foca na independência financeira das mulheres através de capacitação, mentoria e acesso a microcrédito.\n\nApoiamos ideias inovadoras e negócios locais liderados por mulheres, oferecendo as ferramentas necessárias para que cada empreendedora possa transformar seus sonhos em realidade sustentável e lucrativa.',
                fotos: [
                    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
                    'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80',
                    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
                    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80'
                ]
            };

            let adminCanindeDelas = JSON.parse(JSON.stringify(defaultCanindeDelas));
            let currentCanindePhotos = [];

            // Buscar dados reais do servidor em vez do localStorage
            fetch('api.php')
                .then(res => res.json())
                .then(data => {
                    if (data.acoes) adminAcoes = data.acoes;
                    if (data.galeria) adminGaleria = data.galeria;
                    if (data.agenda) {
                        adminAgenda = data.agenda.map(item => {
                            if (item.status === 'Confirmado' && item.fullDate) {
                                const eventDate = new Date(item.fullDate + 'T23:59:59');
                                if (new Date() > eventDate) {
                                    item.status = 'Realizado';
                                }
                            }
                            return item;
                        });
                    }
                    if (data.saude) adminServicosSaude = data.saude;
                    if (data.canindeDelas) adminCanindeDelas = data.canindeDelas;
                    
                    currentCanindePhotos = Array.isArray(adminCanindeDelas.fotos) ? [...adminCanindeDelas.fotos] : [];
                    
                    // Renderiza a interface apenas depois que os dados carregarem
                    renderAdminAcoes();
                    renderAdminGaleria();
                    renderAdminAgenda();
                    renderAdminSaude();
                    renderAdminCanindeDelas();
                })
                .catch(err => {
                    console.error("Erro ao carregar os dados:", err);
                    alert("Não foi possível carregar os dados do servidor. Usando dados padrão.");
                    renderAdminAcoes();
                    renderAdminGaleria();
                    renderAdminAgenda();
                    renderAdminSaude();
                    renderAdminCanindeDelas();
                });

            // ── Sanitização: escapa HTML para prevenir XSS ──────────────
            function safe(str) {
                if (str === null || str === undefined) return '';
                return String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;');
            }

            // Renderizar Tabelas
            function renderAdminAcoes() {
                const tbody = document.querySelector('#visao-geral tbody');
                if(!tbody) return;
                tbody.innerHTML = '';
                adminAcoes.forEach(item => {
                    tbody.innerHTML += `
                        <tr class="hover:bg-gray-50/50 transition-colors group" data-id="${safe(String(item.id))}">
                            <td class="px-6 py-4 font-medium text-gray-800">${safe(item.title)}</td>
                            <td class="whitespace-nowrap px-4 py-2"><span class="inline-block px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-purple-100 text-brand-primary">${safe(item.category)}</span></td>
                            <td class="px-6 py-4 text-gray-500">${safe(item.date)}</td>
                            <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Publicado</span></td>
                            <td class="px-6 py-4 text-right">
                                <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
                });
            }

            function renderAdminGaleria() {
                const container = document.querySelector('#acoes-fotos .grid');
                if(!container) return;
                container.innerHTML = '';
                adminGaleria.forEach(item => {
                    const isVideo = item.image && item.image.toLowerCase().endsWith('.mp4');
                    const mediaHtml = isVideo 
                        ? `<video src="${item.image}" class="w-full h-full object-cover" muted playsinline></video>
                           <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0"><i class="fas fa-play-circle text-4xl text-white/80 shadow-sm"></i></div>`
                        : `<img src="${item.image}" class="w-full h-full object-cover">`;

                    container.innerHTML += `
                        <div class="border border-gray-200 rounded-xl overflow-hidden group relative" data-id="${item.id}">
                            <div class="h-40 bg-gray-200 relative">
                                ${mediaHtml}
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                                    <button title="Editar" class="btn-edit w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-brand-primary cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                    <button title="Excluir" class="btn-delete w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="p-4">
                                <h4 class="font-bold text-gray-800 mb-1">${item.title}</h4>
                                <p class="text-xs text-gray-500">${item.type === 'video' ? 'Vídeo' : 'Foto'}</p>
                            </div>
                        </div>`;
                });
            }

            function renderAdminCanindeDelas() {
                const subInput = document.getElementById('input-caninde-subtitulo');
                const descInput = document.getElementById('input-caninde-descricao');
                const defesaInput = document.getElementById('input-defesa-descricao');
                const empInput = document.getElementById('input-empreender-descricao');
                const badgeEl = document.getElementById('caninde-gallery-badge');
                const gridEl = document.getElementById('caninde-thumbnails-grid');

                if (subInput) subInput.value = adminCanindeDelas.subtitulo || '';
                if (descInput) descInput.value = adminCanindeDelas.descricao || '';
                if (defesaInput) defesaInput.value = adminCanindeDelas.defesaDescricao || '';
                if (empInput) empInput.value = adminCanindeDelas.empreenderDescricao || '';
                
                if (badgeEl) {
                    badgeEl.innerText = `${currentCanindePhotos.length} / 100 fotos`;
                    badgeEl.className = currentCanindePhotos.length >= 100 
                        ? 'text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700' 
                        : 'text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-brand-primary';
                }

                if (gridEl) {
                    gridEl.innerHTML = '';
                    currentCanindePhotos.forEach((imgBase64, idx) => {
                        const thumb = document.createElement('div');
                        thumb.className = 'relative rounded-2xl overflow-hidden aspect-square border border-purple-200 bg-gray-100 group shadow-sm';
                        const isVid = imgBase64.startsWith('data:video/') || imgBase64.match(/\.(mp4|webm|ogg)$/i);
                        const mediaTag = isVid 
                            ? `<video src="${imgBase64}" class="w-full h-full object-cover" muted></video><div class="absolute inset-0 flex items-center justify-center"><i class="fas fa-play-circle text-white text-3xl opacity-80"></i></div>` 
                            : `<img src="${imgBase64}" class="w-full h-full object-cover" alt="Mídia ${idx + 1}">`;

                        thumb.innerHTML = `
                            ${mediaTag}
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <button type="button" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md transform hover:scale-110 active:scale-95 transition-all" onclick="window.removeCanindePhoto(${idx})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <span class="absolute bottom-1.5 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono z-10">#${idx + 1}</span>
                        `;
                        gridEl.appendChild(thumb);
                    });
                }
            }

            window.removeCanindePhoto = function(index) {
                currentCanindePhotos.splice(index, 1);
                renderAdminCanindeDelas();
            };

            function showCanindeError(msg) {
                const errBox = document.getElementById('caninde-error-msg');
                const errText = document.getElementById('caninde-error-text');
                if (errBox && errText) {
                    errText.innerText = msg;
                    errBox.classList.remove('hidden');
                    setTimeout(() => { errBox.classList.add('hidden'); }, 5000);
                }
            }

            // Input File listener de fotos do Canindé + Delas
            const inputCanindeFotos = document.getElementById('input-caninde-fotos');
            if (inputCanindeFotos) {
                inputCanindeFotos.addEventListener('change', function(e) {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;

                    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
                    if (validFiles.length < files.length) {
                        showCanindeError('Alguns arquivos não foram adicionados por não serem imagens ou vídeos válidos.');
                    }

                    const availableSlots = 100 - currentCanindePhotos.length;
                    if (validFiles.length > availableSlots) {
                        showCanindeError(`Você só pode adicionar mais ${availableSlots} arquivo(s). O limite é de 100 fotos/vídeos.`);
                    }

                    const toProcess = validFiles.slice(0, availableSlots);
                    if (!toProcess.length) {
                        inputCanindeFotos.value = '';
                        return;
                    }

                    // Faz upload imediato para o servidor ao invés de usar Base64 na memória
                    const uploadButton = document.querySelector('#caninde-drop-area');
                    const originalHTML = uploadButton.innerHTML;
                    uploadButton.innerHTML = '<div class="text-center w-full py-4"><i class="fas fa-spinner fa-spin text-brand-primary text-2xl mb-2"></i><p>Enviando...</p></div>';
                    uploadButton.style.pointerEvents = 'none';
                    
                    Promise.all(toProcess.map(file => uploadFile(file)))
                        .then(paths => {
                            paths.forEach(path => {
                                if (path) currentCanindePhotos.push(path);
                            });
                            renderAdminCanindeDelas();
                        })
                        .catch(err => {
                            showCanindeError('Erro no upload de uma ou mais mídias.');
                        })
                        .finally(() => {
                            uploadButton.innerHTML = originalHTML;
                            uploadButton.style.pointerEvents = 'auto';
                            inputCanindeFotos.value = '';
                        });
                });
            }

            // Botão Salvar Canindé + Delas
            const btnSalvarCaninde = document.getElementById('btn-salvar-caninde');
            if (btnSalvarCaninde) {
                btnSalvarCaninde.addEventListener('click', async function() {
                    try {
                        btnSalvarCaninde.innerText = 'Salvando...';
                        btnSalvarCaninde.disabled = true;

                        // 1. Fazer upload de todas as fotos/vídeos selecionados
                        const inputCanindeFotos = document.getElementById('input-caninde-fotos');
                        let uploadedPaths = [];
                        if (inputCanindeFotos.files && inputCanindeFotos.files.length > 0) {
                            const validFiles = Array.from(inputCanindeFotos.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
                            uploadedPaths = await Promise.all(validFiles.map(file => uploadFile(file)));
                        }

                        // Filtra os previews base64 e adiciona os novos paths
                        const finalFotos = [...currentCanindePhotos.filter(p => !p.startsWith('data:')), ...uploadedPaths];

                        const subtitulo = document.getElementById('input-caninde-subtitulo').value.trim();
                        const descricao = document.getElementById('input-caninde-descricao').value.trim();
                        const defesaDesc = document.getElementById('input-defesa-descricao').value.trim();
                        const empDesc = document.getElementById('input-empreender-descricao').value.trim();

                        adminCanindeDelas = {
                            titulo: 'Canindé + Delas',
                            subtitulo: subtitulo || defaultCanindeDelas.subtitulo,
                            descricao: descricao || defaultCanindeDelas.descricao,
                            defesaDescricao: defesaDesc || defaultCanindeDelas.defesaDescricao,
                            empreenderDescricao: empDesc || defaultCanindeDelas.empreenderDescricao,
                            fotos: finalFotos
                        };

                        await saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas);
                        
                        // Reseta inputs e estado
                        inputCanindeFotos.value = '';
                        currentCanindePhotos = [...finalFotos];
                        
                        alert('Seção "Canindé + Delas" atualizada e publicada com sucesso!');
                        renderAdminCanindeDelas();
                    } catch (e) {
                        alert('Erro ao salvar Canindé + Delas: ' + e.message);
                    } finally {
                        btnSalvarCaninde.innerText = 'Salvar Alterações';
                        btnSalvarCaninde.disabled = false;
                    }
                });
            }

            function renderAdminSaude() {
                const tbody = document.querySelector('#servicos-saude tbody');
                if(!tbody) return;
                tbody.innerHTML = '';
                adminServicosSaude.forEach(item => {
                    tbody.innerHTML += `
                        <tr class="hover:bg-gray-50/50 transition-colors group" data-id="${item.id}">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center text-lg shrink-0">
                                        <i class="fas ${item.icone || 'fa-heartbeat'}"></i>
                                    </div>
                                    <div>
                                        <p class="font-bold text-gray-800">${item.titulo}</p>
                                        <p class="text-xs text-purple-600">${item.icone || 'fa-heartbeat'}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-600 max-w-xs">
                                <p class="line-clamp-2 text-xs">${item.descricaoCurta}</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500 text-xs">
                                <p class="font-semibold text-gray-700">${item.local || 'Todas as UBSs'}</p>
                                <p class="text-gray-400">${item.horario || 'Seg a Sex'}</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500 text-xs">
                                <span class="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">${item.publico || 'Geral'}</span>
                            </td>
                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                <button title="Editar" class="btn-edit-saude text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all" onclick="editSaudeItem(${item.id})"><i class="fas fa-edit"></i></button>
                                <button title="Excluir" class="btn-delete-saude text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all" onclick="deleteSaudeItem(${item.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
                });
            }

            function renderAdminAgenda() {
                const tbody = document.querySelector('#agenda tbody');
                if(!tbody) return;
                tbody.innerHTML = '';
                adminAgenda.forEach(item => {
                    let color = item.status === 'Realizado' ? 'bg-green-100 text-green-700' : (item.status === 'Confirmado' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700');
                    tbody.innerHTML += `
                        <tr class="hover:bg-gray-50/50 transition-colors group" data-id="${item.id}">
                            <td class="px-6 py-4 font-bold text-brand-primary">${item.date} ${item.month}</td>
                            <td class="px-6 py-4 font-medium text-gray-800">${item.title}</td>
                            <td class="px-6 py-4 text-gray-500">${item.time}</td>
                            <td class="px-6 py-4 text-gray-500">${item.location}</td>
                            <td class="px-6 py-4"><span class="px-3 py-1 ${color} text-xs font-bold rounded-full">${item.status}</span></td>
                            <td class="px-6 py-4 text-right">
                                <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
                });
            }

            
            // Upload de Imagem Capa & Galeria Preview Logic
            let currentBase64Image = '';
            let currentActionGallery = []; // Array de Base64 das fotos adicionais (até 10)
            
            const actionImageInput = document.getElementById('action-image-input');
            const uploadPlaceholder = document.getElementById('upload-placeholder');
            const uploadPreview = document.getElementById('upload-preview');
            const imagePreview = document.getElementById('image-preview');
            const removeImageBtn = document.getElementById('remove-image-btn');

            // Galeria
            const actionGalleryInput = document.getElementById('action-gallery-input');
            const galleryThumbnailsGrid = document.getElementById('gallery-thumbnails-grid');
            const galleryCountBadge = document.getElementById('gallery-count-badge');
            const galleryErrorMsg = document.getElementById('gallery-error-msg');
            const galleryErrorText = document.getElementById('gallery-error-text');

            function showGalleryError(msg) {
                if (!galleryErrorMsg || !galleryErrorText) return;
                galleryErrorText.innerText = msg;
                galleryErrorMsg.classList.remove('hidden');
                setTimeout(() => { galleryErrorMsg.classList.add('hidden'); }, 5000);
            }

            function renderGalleryThumbnails() {
                if (!galleryThumbnailsGrid) return;
                galleryThumbnailsGrid.innerHTML = '';
                
                if (galleryCountBadge) {
                    galleryCountBadge.innerText = `${currentActionGallery.length} / 30 fotos`;
                    if (currentActionGallery.length >= 30) {
                        galleryCountBadge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700';
                    } else {
                        galleryCountBadge.className = 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-brand-primary';
                    }
                }

                currentActionGallery.forEach((imgPath, index) => {
                    const isVideo = imgPath.startsWith('data:video') || imgPath.toLowerCase().endsWith('.mp4');
                    const mediaTag = isVideo 
                        ? `<video src="${imgPath}" class="w-full h-full object-cover" muted playsinline></video><div class="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"><i class="fas fa-play text-white text-sm"></i></div>` 
                        : `<img src="${imgPath}" class="w-full h-full object-cover" alt="Foto ${index + 1}">`;

                    const thumb = document.createElement('div');
                    thumb.className = 'relative rounded-xl overflow-hidden aspect-square border border-purple-200 bg-gray-100 group shadow-sm';
                    thumb.innerHTML = `
                        ${mediaTag}
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md transform hover:scale-110 active:scale-95 transition-all" onclick="window.removeGalleryPhoto(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <span class="absolute bottom-1 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">#${index + 1}</span>
                    `;
                    galleryThumbnailsGrid.appendChild(thumb);
                });
            }

            window.removeGalleryPhoto = function(index) {
                currentActionGallery.splice(index, 1);
                renderGalleryThumbnails();
            };

            if(actionImageInput) {
                const mediaPreviewContainer = document.getElementById('media-preview-container');
                actionImageInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                            showGalleryError('O arquivo selecionado não é uma mídia válida.');
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            currentBase64Image = event.target.result;
                            if (mediaPreviewContainer) {
                                mediaPreviewContainer.innerHTML = currentBase64Image.startsWith('data:video') 
                                    ? `<video src="${currentBase64Image}" class="w-full h-full object-cover" autoplay muted loop playsinline></video>`
                                    : `<img src="${currentBase64Image}" class="w-full h-full object-cover" alt="Preview">`;
                            }
                            uploadPlaceholder.classList.add('hidden');
                            uploadPreview.classList.remove('hidden');
                        }
                        reader.readAsDataURL(file);
                    }
                });

                removeImageBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Previne o clique de abrir a janela de arquivo de novo
                    actionImageInput.value = '';
                    currentBase64Image = '';
                    uploadPreview.classList.add('hidden');
                    uploadPlaceholder.classList.remove('hidden');
                });
            }

            if(actionGalleryInput) {
                actionGalleryInput.addEventListener('change', function(e) {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;

                    const nonMedia = files.filter(f => !f.type.startsWith('image/') && !f.type.startsWith('video/'));
                    if (nonMedia.length > 0) {
                        showGalleryError('Um ou mais arquivos selecionados não são mídias (foto/vídeo) válidas.');
                    }

                    const validMedia = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
                    const availableSlots = 30 - currentActionGallery.length;

                    if (validMedia.length > availableSlots) {
                        showGalleryError(`Você só pode adicionar mais ${availableSlots} mídia(s). O limite total é de 30 mídias por ação.`);
                    }

                    const mediaToProcess = validMedia.slice(0, availableSlots);
                    if (!mediaToProcess.length) {
                        actionGalleryInput.value = '';
                        return;
                    }

                    // Faz upload imediato dos arquivos selecionados
                    const uploadButton = document.querySelector('#gallery-drop-area button');
                    const originalBtnText = uploadButton.innerHTML;
                    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Carregando...';
                    
                    Promise.all(mediaToProcess.map(file => uploadFile(file)))
                        .then(paths => {
                            paths.forEach(path => {
                                if (path) currentActionGallery.push(path);
                            });
                            renderGalleryThumbnails();
                        })
                        .catch(err => {
                            showGalleryError('Erro no upload de uma ou mais mídias.');
                        })
                        .finally(() => {
                            uploadButton.innerHTML = originalBtnText;
                            actionGalleryInput.value = '';
                        });
                });
            }



            // Intercepting Saves
            document.querySelectorAll('button').forEach(btn => {
                if(btn.innerText.includes('Salvar Evento')) {
                    btn.addEventListener('click', async () => {
                        const modal = document.getElementById('modal-agenda');
                        const title = document.getElementById('agenda-title').value;
                        const dateVal = document.getElementById('agenda-date').value;
                        const time = document.getElementById('agenda-time').value;
                        const location = document.getElementById('agenda-location').value;
                        const status = document.getElementById('agenda-status') ? document.getElementById('agenda-status').value : '';
                        
                        if(!title || !dateVal || !time || !location) {
                            alert("Preencha todos os campos da agenda.");
                            return;
                        }

                        let date = "20", month = "Out";
                        if(dateVal) {
                            const d = new Date(dateVal + 'T12:00:00');
                            date = String(d.getDate()).padStart(2, '0');
                            const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                            month = months[d.getMonth()];
                        }

                        const editId = document.getElementById('edit-id-agenda').value;
                        if(editId) {
                            const index = adminAgenda.findIndex(item => item.id == editId);
                            if(index > -1) {
                                adminAgenda[index] = { ...adminAgenda[index], date, month, fullDate: dateVal, title, time, location, status };
                            }
                        } else {
                            adminAgenda.push({ id: Date.now(), date, month, fullDate: dateVal, title, time, location, status });
                        }
                        
                        try {
                            btn.innerText = 'Salvando...';
                            btn.disabled = true;
                            await saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas);
                            renderAdminAgenda();
                            modal.classList.add('hidden'); if(typeof removeImageBtn !== 'undefined' && removeImageBtn) removeImageBtn.click();
                        } catch (e) {
                            alert('Erro ao salvar Agenda: ' + e.message);
                        } finally {
                            btn.innerText = 'Salvar Evento';
                            btn.disabled = false;
                        }
                    });
                }
                
                if(btn.innerText.includes('Salvar e Publicar') && btn.id !== 'btn-salvar-caninde') {
                    btn.addEventListener('click', async () => {
                        try {
                            btn.innerText = "Salvando...";
                            btn.disabled = true;

                            const modal = document.getElementById('modal');
                            const title = document.getElementById('input-titulo').value;
                            const category = document.getElementById('input-categoria').value;
                            const description = document.getElementById('input-descricao').value;
                            
                            let date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.','');
                            const inputDataVal = document.getElementById('input-data').value;
                            if(inputDataVal) {
                                const d = new Date(inputDataVal + 'T12:00:00');
                                const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                                date = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
                            }
                            
                            const editId = document.getElementById('edit-id-acoes').value;
                            const context = document.getElementById('modal-context') ? document.getElementById('modal-context').value : 'acoes';
                            
                            // 1. Upload Capa
                            let finalImage = currentBase64Image;
                            const actionImageInput = document.getElementById('action-image-input');
                            if (actionImageInput.files && actionImageInput.files.length > 0) {
                                finalImage = await uploadFile(actionImageInput.files[0]);
                            }

                            // 2. Upload Galeria
                            const actionGalleryInput = document.getElementById('action-gallery-input');
                            let uploadedGalleryPaths = [];
                            if (actionGalleryInput.files && actionGalleryInput.files.length > 0) {
                                const validMedia = Array.from(actionGalleryInput.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
                                uploadedGalleryPaths = await Promise.all(validMedia.map(file => uploadFile(file)));
                            }
                            const finalGallery = [...currentActionGallery.filter(p => !p.startsWith("data:")), ...uploadedGalleryPaths];
                            
                            const isPlaceholder = finalImage.includes('unsplash.com');

                            if (editId) {
                                const isGaleria = context === 'galeria';
                                
                                if (!isGaleria) {
                                    const acaoIndex = adminAcoes.findIndex(item => item.id == editId);
                                    if (acaoIndex > -1) {
                                        const oldImage = adminAcoes[acaoIndex].image || adminAcoes[acaoIndex].imagem || adminAcoes[acaoIndex].fotoCapa;
                                        finalImage = (isPlaceholder && oldImage) ? oldImage : finalImage;
                                        adminAcoes[acaoIndex] = { 
                                            ...adminAcoes[acaoIndex], category, date, title, description, 
                                            image: finalImage, fotoCapa: finalImage, galeria: finalGallery
                                        };
                                    }
                                } else {
                                    const galIndex = adminGaleria.findIndex(item => item.id == editId);
                                    if (galIndex > -1) {
                                        const oldImage = adminGaleria[galIndex].image;
                                        finalImage = (isPlaceholder && oldImage) ? oldImage : finalImage;
                                        adminGaleria[galIndex] = { ...adminGaleria[galIndex], title, description, category, image: finalImage, type: finalImage.toLowerCase().endsWith('.mp4') ? 'video' : 'foto' };
                                    }
                                }
                            } else {
                                finalImage = isPlaceholder ? '' : finalImage;
                                const newId = Date.now();
                                
                                if (context === 'acoes') {
                                    adminAcoes.unshift({ 
                                        id: newId, category, date, title, description, 
                                        image: finalImage, fotoCapa: finalImage, galeria: finalGallery
                                    });
                                } else if (context === 'galeria') {
                                    adminGaleria.unshift({ 
                                        id: newId, type: finalImage.toLowerCase().endsWith('.mp4') ? 'video' : 'foto', 
                                        title, description, category, image: finalImage 
                                    });
                                }
                            }

                            // 3. Salvar no servidor (api.php)
                            await saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas);
                            
                            renderAdminAcoes();
                            renderAdminGaleria();
                            modal.classList.add('hidden');
                            if(typeof removeImageBtn !== 'undefined' && removeImageBtn) removeImageBtn.click();
                            currentActionGallery = [];
                            actionGalleryInput.value = '';
                            renderGalleryThumbnails();
                            
                            alert('Ação salva e publicada com sucesso!');
                        } catch (err) {
                            alert('Erro durante o salvamento: ' + err.message);
                        } finally {
                            btn.innerText = 'Salvar e Publicar';
                            btn.disabled = false;
                        }
                    });
                }
                
                if(btn.innerText.includes('Salvar Alterações')) {
                    btn.addEventListener('click', () => {
                        safeStorageSetItem("sec_mulher_config", JSON.stringify({ endereco: document.querySelectorAll("#configuracoes input")[0].value, telefone: document.querySelectorAll("#configuracoes input")[1].value, email: document.querySelectorAll("#configuracoes input")[2].value, instagram: document.querySelectorAll("#configuracoes input")[3].value })); alert('Configurações institucionais atualizadas com sucesso no localStorage!');
                    });
                }
            });

            // Variável para imagem do serviço de saúde
            let currentSaudeImage = '';

            const inputSaudeImagemFile = document.getElementById('input-saude-imagem-file');
            if (inputSaudeImagemFile) {
                inputSaudeImagemFile.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(evt) {
                            currentSaudeImage = evt.target.result;
                            document.getElementById('saude-image-preview').src = currentSaudeImage;
                            document.getElementById('saude-image-preview-wrapper').classList.remove('hidden');
                            document.getElementById('saude-image-name').innerText = file.name;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            window.removeSaudeImage = function() {
                currentSaudeImage = '';
                if(inputSaudeImagemFile) inputSaudeImagemFile.value = '';
                document.getElementById('saude-image-preview').src = '';
                document.getElementById('saude-image-preview-wrapper').classList.add('hidden');
                document.getElementById('saude-image-name').innerText = 'Clique para anexar foto explicativa';
            };

            window.openNovoSaudeModal = function() {
                document.getElementById('edit-id-saude').value = '';
                document.getElementById('input-saude-titulo').value = '';
                document.getElementById('input-saude-icone').value = 'fa-droplet';
                document.getElementById('input-saude-descricao-curta').value = '';
                document.getElementById('input-saude-descricao-completa').value = '';
                document.getElementById('input-saude-local').value = '';
                document.getElementById('input-saude-horario').value = '';
                document.getElementById('input-saude-publico').value = '';
                document.getElementById('input-saude-documentos').value = '';
                removeSaudeImage();
                document.getElementById('modal-saude-title').innerText = 'Novo Serviço de Saúde';
                document.getElementById('modal-saude').classList.remove('hidden');
            };

            window.editSaudeItem = function(id) {
                const item = adminServicosSaude.find(i => i.id == id);
                if (!item) return;

                document.getElementById('edit-id-saude').value = item.id;
                document.getElementById('input-saude-titulo').value = item.titulo || '';
                document.getElementById('input-saude-icone').value = item.icone || 'fa-droplet';
                document.getElementById('input-saude-descricao-curta').value = item.descricaoCurta || '';
                document.getElementById('input-saude-descricao-completa').value = item.descricaoCompleta || '';
                document.getElementById('input-saude-local').value = item.local || '';
                document.getElementById('input-saude-horario').value = item.horario || '';
                document.getElementById('input-saude-publico').value = item.publico || '';
                document.getElementById('input-saude-documentos').value = item.documentos || '';
                
                if (item.imagem) {
                    currentSaudeImage = item.imagem;
                    document.getElementById('saude-image-preview').src = currentSaudeImage;
                    document.getElementById('saude-image-preview-wrapper').classList.remove('hidden');
                    document.getElementById('saude-image-name').innerText = 'Foto anexada';
                } else {
                    removeSaudeImage();
                }

                document.getElementById('modal-saude-title').innerText = 'Editar Serviço de Saúde';
                document.getElementById('modal-saude').classList.remove('hidden');
            };

            window.deleteSaudeItem = function(id) {
                if (confirm('Deseja realmente remover este serviço de saúde?')) {
                    adminServicosSaude = adminServicosSaude.filter(i => i.id != id);
                    saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas).catch(e => console.error(e));
                    renderAdminSaude();
                }
            };

            // Salvar Serviço de Saúde
            const btnSalvarSaude = document.getElementById('btn-salvar-saude');
            if (btnSalvarSaude) {
                btnSalvarSaude.addEventListener('click', async function() {
                    const id = document.getElementById('edit-id-saude').value;
                    const titulo = document.getElementById('input-saude-titulo').value;
                    const icone = document.getElementById('input-saude-icone').value;
                    const descCurta = document.getElementById('input-saude-descricao-curta').value;
                    const descComp = document.getElementById('input-saude-descricao-completa').value;
                    const local = document.getElementById('input-saude-local').value;
                    const horario = document.getElementById('input-saude-horario').value;
                    const publico = document.getElementById('input-saude-publico').value;
                    const docs = document.getElementById('input-saude-documentos').value;

                    if(!titulo || !icone || !descCurta || !descComp) {
                        alert('Preencha os campos obrigatórios (*)');
                        return;
                    }

                    try {
                        btnSalvarSaude.innerText = 'Salvando...';
                        btnSalvarSaude.disabled = true;

                        let finalImage = currentSaudeImage;
                        const inputSaudeImagemFile = document.getElementById('input-saude-imagem-file');
                        if (inputSaudeImagemFile.files && inputSaudeImagemFile.files.length > 0) {
                            finalImage = await uploadFile(inputSaudeImagemFile.files[0]);
                        }

                        const isPlaceholder = finalImage.includes('unsplash.com') || finalImage === '';

                        if (id) {
                            const idx = adminServicosSaude.findIndex(s => s.id == id);
                            if (idx > -1) {
                                const oldImage = adminServicosSaude[idx].imagem;
                                finalImage = (isPlaceholder && oldImage) ? oldImage : (isPlaceholder ? '' : finalImage);
                                adminServicosSaude[idx] = { ...adminServicosSaude[idx], titulo, icone, descricaoCurta: descCurta, descricaoCompleta: descComp, local, horario, publicoAlvo: publico, documentos: docs, imagem: finalImage };
                            }
                        } else {
                            finalImage = isPlaceholder ? '' : finalImage;
                            adminServicosSaude.push({ id: Date.now(), titulo, icone, descricaoCurta: descCurta, descricaoCompleta: descComp, local, horario, publicoAlvo: publico, documentos: docs, imagem: finalImage });
                        }

                        await saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas);
                        renderAdminSaude();
                        document.getElementById('modal-saude').classList.add('hidden');
                        alert('Serviço de saúde salvo com sucesso!');
                    } catch (e) {
                        alert('Erro ao salvar Saúde: ' + e.message);
                    } finally {
                        btnSalvarSaude.innerText = 'Salvar Serviço';
                        btnSalvarSaude.disabled = false;
                    }
                });
            }

            // Make global functions so standard click handlers work (overriding previous DOM events)
            window.deleteItem = function(id, type) {
                if(type === 'acoes') {
                    adminAcoes = adminAcoes.filter(i => i.id != id);
                    saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas).catch(e => console.error(e));
                    renderAdminAcoes();
                } else if(type === 'galeria') {
                    adminGaleria = adminGaleria.filter(i => i.id != id);
                    saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas).catch(e => console.error(e));
                    renderAdminGaleria();
                } else if(type === 'agenda') {
                    adminAgenda = adminAgenda.filter(i => i.id != id);
                    saveData(adminAcoes, adminGaleria, adminAgenda, adminServicosSaude, adminCanindeDelas).catch(e => console.error(e));
                    renderAdminAgenda();
                }
            }

            // --- LÓGICA DE AÇÕES (EDITAR / EXCLUIR) ---
            document.body.addEventListener('click', function(e) {
                // EXCLUIR
                const btnDelete = e.target.closest('.btn-delete');
                if (btnDelete) {
                    if (confirm('Deseja realmente remover este registro?')) {
                        // Encontra a linha da tabela ou o card da galeria
                        const row = btnDelete.closest('tr') || btnDelete.closest('.group');
                        if (row) {
                            row.style.transition = 'all 0.4s ease';
                            row.style.opacity = '0';
                            row.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                const id = row.getAttribute('data-id');
                                const agendaRow = row.closest('#agenda') !== null; const galRow = row.tagName.toLowerCase() !== 'tr'; if (agendaRow) window.deleteItem(id, 'agenda');
                                else if (galRow) window.deleteItem(id, 'galeria');
                                else window.deleteItem(id, 'acoes');
                            }, 400);
                        }
                    }
                    return; // Para não disparar mais nada
                }

                // EDITAR
                const btnEdit = e.target.closest('.btn-edit');
                if (btnEdit) {
                    const row = btnEdit.closest('tr') || btnEdit.closest('.group');
                    if (!row) return;

                    const id = row.getAttribute('data-id');
                    const isAgenda = row.closest('#agenda') !== null;
                    const isGallery = row.tagName.toLowerCase() !== 'tr';

                    if (isAgenda) {
                        const item = adminAgenda.find(i => i.id == id);
                        if(!item) return;
                        
                        document.getElementById('edit-id-agenda').value = id;
                        document.getElementById('agenda-title').value = item.title;
                        document.getElementById('agenda-date').value = ''; // Original date object not saved in YYYY-MM-DD
                        document.getElementById('agenda-time').value = item.time;
                        document.getElementById('agenda-location').value = item.location;
                        
                        const select = document.getElementById('agenda-status');
                        Array.from(select.options).forEach(opt => {
                            if (opt.text.toLowerCase() === item.status.toLowerCase()) opt.selected = true;
                        });

                        modal.querySelector('h3').innerText = "Editar Evento na Agenda";
                        modal.classList.remove('hidden');

                    } else {
                        const item = isGallery ? adminGaleria.find(i => i.id == id) : adminAcoes.find(i => i.id == id);
                        if(!item) return;

                        document.getElementById('edit-id-acoes').value = id;
                        const modal = document.getElementById('modal');
                        
                        // Populando os campos
                        if (document.getElementById('input-titulo')) document.getElementById('input-titulo').value = item.title || item.titulo || '';
                        
                        // Tentando preencher a categoria
                        const select = document.getElementById('input-categoria');
                        if (select && (item.category || item.categoria)) {
                            Array.from(select.options).forEach(opt => {
                                if (opt.text.toLowerCase() === (item.category || item.categoria).toLowerCase()) opt.selected = true;
                            });
                        }
                        
                        // Tentando preencher descrição
                        if (document.getElementById('input-descricao') && (item.description || item.descricao)) {
                            document.getElementById('input-descricao').value = item.description || item.descricao;
                        }

                        // Converter string de data para formato YYYY-MM-DD
                        if (document.getElementById('input-data') && (item.date || item.data)) {
                             // tenta reverter "24 Out 2024" para "YYYY-MM-DD" se possível, senao deixa em branco para o html5 date input. 
                             // Como é complexo tratar locale em uma linha, usaremos um map basico
                             const dStr = item.date || item.data;
                             const months = { 'Jan':'01', 'Fev':'02', 'Mar':'03', 'Abr':'04', 'Mai':'05', 'Jun':'06', 'Jul':'07', 'Ago':'08', 'Set':'09', 'Out':'10', 'Nov':'11', 'Dez':'12' };
                             const parts = dStr.split(' ');
                             if(parts.length === 3) {
                                document.getElementById('input-data').value = `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2, '0')}`;
                             }
                        }

                        // Preservando e exibindo a imagem atual do item
                        const itemCapa = item.fotoCapa || item.image || item.imagem;
                        if (itemCapa) {
                            currentBase64Image = itemCapa;
                            if (imagePreview) {
                                imagePreview.src = currentBase64Image;
                                if(uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
                                if(uploadPreview) uploadPreview.classList.remove('hidden');
                            }
                        }

                        // Carregar galeria de fotos existente
                        currentActionGallery = Array.isArray(item.galeria) ? [...item.galeria] : [];
                        renderGalleryThumbnails();

                        modal.querySelector('h3').innerText = isGallery ? "Editar Vídeo" : "Editar Ação"; 
                        document.getElementById('modal-context').value = isGallery ? "galeria" : "acoes";
                        if (isGallery) {
                            document.getElementById('label-capa-midia').innerText = 'Arquivo de Mídia (Vídeo)';
                            document.getElementById('upload-placeholder-text').innerText = 'Clique ou arraste um vídeo';
                            document.getElementById('galeria-adicional-wrapper').classList.add('hidden');
                        } else {
                            document.getElementById('label-capa-midia').innerText = 'Mídia da Capa (Foto ou Vídeo)';
                            document.getElementById('upload-placeholder-text').innerText = 'Clique ou arraste uma imagem/vídeo';
                            document.getElementById('galeria-adicional-wrapper').classList.remove('hidden');
                        }
                        modal.classList.remove('hidden');
                    }
                }
            });
        });
    </script>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
      const sidebar = document.getElementById('admin-sidebar');
      const overlay = document.getElementById('admin-sidebar-overlay');
      const toggleBtn = document.getElementById('admin-menu-toggle');
    
      function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
      }
      function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      }
    
      if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
      if (overlay) overlay.addEventListener('click', closeSidebar);
    
      // Fecha a gaveta automaticamente ao clicar em qualquer item do menu (mobile)
      document.querySelectorAll('#sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth < 1024) closeSidebar();
        });
      });
    
      // Se a tela for redimensionada para desktop, garante que a gaveta não
      // fique com transform residual escondendo a sidebar fixa
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
          sidebar.classList.remove('-translate-x-full');
          overlay.classList.add('hidden');
        }
      });
    });
    </script>

    <script>
        

        // ── Exibe nome do usuário logado no header ──────────────────────
        (function exibirUsuario() {
            const usuario = "super.admin";

            const nameEl = document.getElementById('admin-display-name');
            const roleEl = document.getElementById('admin-display-role');
            if (nameEl) nameEl.textContent = usuario;
            if (roleEl) roleEl.textContent = 'Gestor Institucional';
        })();


        async function uploadFile(file) {
            const formData = new FormData();
            formData.append('file', file);
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            try {
                const response = await fetch('api.php?upload=1', {
                    method: 'POST',
                    headers: { 'X-CSRF-Token': csrfToken },
                    body: formData
                });
                const res = await response.json();
                if (res.status === "success") return res.path;
                throw new Error(res.message || 'Erro no upload.');
            } catch (e) {
                console.error("Erro de upload:", e);
                throw e;
            }
        }

        // ── Logout: limpa ambos os storages e redireciona para login ───
        function fazerLogout() {
            localStorage.removeItem('sec_mulher_auth');
            localStorage.removeItem('sec_mulher_usuario');
            sessionStorage.removeItem('sec_mulher_auth');
            sessionStorage.removeItem('sec_mulher_usuario');
            window.location.href = "?logout=1";
        }

        // ── Timeout por inatividade (30 min → logout automático) ───────
        (function sessaoTimeout() {
            const INATIVO_MS  = 30 * 60 * 1000; // 30 min
            const AVISO_MS    = 60 * 1000;       // aviso 60s antes
            let timerLogout, timerAviso;
            let avisoEl = null;

            function criarAviso() {
                if (avisoEl) return;
                avisoEl = document.createElement('div');
                avisoEl.id = 'sessao-aviso';
                avisoEl.style.cssText = [
                    'position:fixed','bottom:24px','right:24px','z-index:99999',
                    'background:#3B1D54','color:#fff','padding:14px 20px',
                    'border-radius:12px','font-size:14px','box-shadow:0 4px 20px rgba(0,0,0,.35)',
                    'max-width:320px','line-height:1.5'
                ].join(';');
                avisoEl.innerHTML = '⚠️ <strong>Sessão expirando</strong><br>Você será desconectado em 60 segundos por inatividade.';
                document.body.appendChild(avisoEl);
            }

            function removerAviso() {
                if (avisoEl) { avisoEl.remove(); avisoEl = null; }
            }

            function resetar() {
                clearTimeout(timerLogout);
                clearTimeout(timerAviso);
                removerAviso();
                timerAviso  = setTimeout(() => { criarAviso(); }, INATIVO_MS - AVISO_MS);
                timerLogout = setTimeout(() => { fazerLogout(); }, INATIVO_MS);
            }

            ['mousemove','keydown','click','scroll','touchstart'].forEach(ev => {
                document.addEventListener(ev, resetar, { passive: true });
            });

            resetar(); // inicia o timer
        })();
    </script>
</body>
</html>

<?php endif; ?>
