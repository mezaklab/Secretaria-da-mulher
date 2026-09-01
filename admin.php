<?php
session_start();
$PASSWORD = 'secretaria2024';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if ($_POST['password'] === $PASSWORD) {
        $_SESSION['logged_in'] = true;
    } else {
        $error = "Senha incorreta.";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel - Secretaria da Mulher</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
                            borderMuted: '#F0E6F7',
                            textDark: '#3B284C',
                            textMuted: '#6B5E78',
                            textMenu: '#4A3E56',
                            primary: '#7A3E9D',
                            primaryHover: '#682F87',
                            badgeBg: '#EEDBFF',
                            badgeText: '#6A2B9A',
                            cardBorder: '#EFE8F5',
                            iconBg: '#F3EBF9',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #FFFFFF; color: #6B5E78; }
        .font-display { font-family: 'Poppins', sans-serif; letter-spacing: -0.02em; }
    </style>
</head>
<body class="font-sans antialiased bg-gradient-to-r from-[#9782AD] to-[#7F6A96] min-h-screen">

<?php if (!$isLoggedIn): ?>
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-10 w-full max-w-md shadow-lg text-center">
            <div class="w-20 h-20 bg-brand-iconBg rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
                <i class="fas fa-lock text-2xl"></i>
            </div>
            <h1 class="font-display text-3xl text-brand-textDark mb-4">Acesso Restrito</h1>
            <div class="flex flex-col leading-none mb-8 font-display">
                <span class="text-lg font-extrabold text-brand-textDark tracking-tight">
                    Secretaria da Mulher
                </span>
                <span class="text-[10px] font-bold text-brand-textMuted tracking-wider uppercase mt-1">
                    Canindé de São Francisco
                </span>
            </div>
            
            <?php if (isset($error)): ?>
                <div class="bg-red-50 text-red-600 p-3 rounded-lg mb-6 font-bold"><?= $error ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <input type="password" name="password" placeholder="Senha de Acesso" required 
                    class="w-full px-4 py-3 rounded-xl border border-brand-cardBorder focus:outline-none focus:border-brand-primary mb-6 bg-brand-hero/20">
                <button type="submit" class="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-primaryHover transition-colors">
                    Entrar
                </button>
            </form>
        </div>
    </div>
<?php else: ?>

    <div x-data="adminApp()" class="max-w-5xl mx-auto p-6 lg:p-8">
        
        <header class="flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] border border-brand-cardBorder shadow-sm">
            <div class="flex items-center gap-6">
                <!-- Marca Institucional no Admin -->
                <div class="flex flex-col leading-none border-r border-brand-cardBorder pr-6 hidden sm:flex">
                    <span class="text-xl font-extrabold text-brand-textDark tracking-tight font-display">
                        Secretaria da Mulher
                    </span>
                    <span class="text-[10px] font-bold text-brand-textMuted tracking-wider uppercase mt-1 font-display">
                        Canindé de São Francisco
                    </span>
                </div>
                <div>
                    <h1 class="font-display text-2xl md:text-3xl text-brand-textDark">Painel de Controle</h1>
                </div>
            </div>
            <div class="flex gap-4 items-center">
                <button @click="saveData()" class="bg-brand-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-primaryHover transition-colors shadow-md flex items-center">
                    <i class="fas fa-save mr-2"></i> Publicar Alterações
                </button>
                <a href="?logout=1" class="text-brand-textMuted hover:text-brand-textDark font-bold px-4">Sair</a>
            </div>
        </header>

        <!-- Status Message -->
        <div x-show="statusMessage" x-transition class="mb-8 p-4 rounded-xl font-bold text-center" 
             :class="statusError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'" 
             x-text="statusMessage" style="display: none;"></div>

        <!-- Seção Agenda -->
        <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-8 mb-10 shadow-sm">
            <div class="flex justify-between items-center mb-6">
                <h2 class="font-display text-2xl text-brand-textDark"><i class="fas fa-calendar-alt text-brand-primary mr-2"></i> Agenda de Eventos</h2>
                <button @click="addAgenda()" class="text-brand-primary font-bold hover:underline">+ Novo Evento</button>
            </div>
            
            <div class="space-y-4">
                <template x-for="(item, index) in data.agenda" :key="index">
                    <div class="flex gap-4 p-4 border border-brand-cardBorder rounded-xl items-start bg-brand-hero/10">
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 flex-grow">
                            <input x-model="item.date" placeholder="Dia (ex: 20)" class="border border-brand-cardBorder rounded p-2 text-sm w-full">
                            <input x-model="item.month" placeholder="Mês (ex: Out)" class="border border-brand-cardBorder rounded p-2 text-sm w-full">
                            <input x-model="item.title" placeholder="Título do Evento" class="border border-brand-cardBorder rounded p-2 text-sm w-full md:col-span-2">
                            <input x-model="item.time" placeholder="Horário (ex: 08h - 13h)" class="border border-brand-cardBorder rounded p-2 text-sm w-full">
                            <input x-model="item.location" placeholder="Local" class="border border-brand-cardBorder rounded p-2 text-sm w-full md:col-span-5">
                        </div>
                        <button @click="removeAgenda(index)" class="text-red-500 hover:text-red-700 p-2"><i class="fas fa-trash"></i></button>
                    </div>
                </template>
            </div>
        </div>

        <!-- Seção Ações -->
        <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-8 shadow-sm">
            <div class="flex justify-between items-center mb-6">
                <h2 class="font-display text-2xl text-brand-textDark"><i class="fas fa-bullhorn text-brand-primary mr-2"></i> Ações nas Ruas (Carrossel)</h2>
                <button @click="addAcao()" class="text-brand-primary font-bold hover:underline">+ Nova Ação</button>
            </div>
            
            <div class="space-y-4">
                <template x-for="(item, index) in data.acoes" :key="index">
                    <div class="flex gap-4 p-4 border border-brand-cardBorder rounded-xl items-start bg-brand-hero/10">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                            <input x-model="item.title" placeholder="Título" class="border border-brand-cardBorder rounded p-2 text-sm w-full font-bold">
                            <input x-model="item.category" placeholder="Categoria (ex: Saúde)" class="border border-brand-cardBorder rounded p-2 text-sm w-full">
                            <input x-model="item.date" placeholder="Data (ex: 15 Out)" class="border border-brand-cardBorder rounded p-2 text-sm w-full">
                            <input x-model="item.image" placeholder="URL da Imagem (https://...)" class="border border-brand-cardBorder rounded p-2 text-sm w-full md:col-span-3">
                            <textarea x-model="item.description" placeholder="Descrição completa..." class="border border-brand-cardBorder rounded p-2 text-sm w-full md:col-span-3 h-20"></textarea>
                        </div>
                        <button @click="removeAcao(index)" class="text-red-500 hover:text-red-700 p-2"><i class="fas fa-trash"></i></button>
                    </div>
                </template>
            </div>
        </div>

    </div>

    <script>
        function adminApp() {
            return {
                data: {
                    acoes: [],
                    galeria: [],
                    agenda: []
                },
                statusMessage: '',
                statusError: false,
                
                async init() {
                    try {
                        const response = await fetch('api.php');
                        this.data = await response.json();
                        if(!this.data.acoes) this.data.acoes = [];
                        if(!this.data.agenda) this.data.agenda = [];
                    } catch (e) {
                        console.error('Failed to load data', e);
                    }
                },
                
                addAgenda() {
                    this.data.agenda.push({ date: '', month: '', time: '', title: '', location: '' });
                },
                
                removeAgenda(index) {
                    this.data.agenda.splice(index, 1);
                },

                addAcao() {
                    this.data.acoes.push({ title: '', category: '', date: '', image: '', description: '' });
                },

                removeAcao(index) {
                    this.data.acoes.splice(index, 1);
                },

                async saveData() {
                    try {
                        this.statusMessage = 'Salvando...';
                        this.statusError = false;
                        const response = await fetch('api.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(this.data)
                        });
                        
                        const result = await response.json();
                        if(result.status === 'success') {
                            this.statusMessage = 'As alterações foram publicadas com sucesso no site!';
                            setTimeout(() => this.statusMessage = '', 3000);
                        } else {
                            throw new Error(result.message);
                        }
                    } catch (e) {
                        this.statusError = true;
                        this.statusMessage = 'Erro ao salvar: ' + e.message;
                    }
                }
            }
        }
    </script>
<?php endif; ?>
</body>
</html>
