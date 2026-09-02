const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

// 1. Atualizar Google Fonts (importando Cormorant Garamond em italic e Playfair Display) e regras CSS
const oldFontStyles = `    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Poppins:wght@700;800&display=swap" rel="stylesheet">
    
    <style>
        .titulo-caninde-delas {
            font-family: 'Playfair Display', Georgia, serif;
            letter-spacing: -0.02em;
        }
        .brush-plus-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            position: relative;
        }
    </style>`;

const newFontStyles = `    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Cormorant+Garamond:ital,wght@1,600;1,700&family=Playfair+Display:ital,wght@1,600;1,700;1,800&family=Poppins:wght@700;800&display=swap" rel="stylesheet">
    
    <style>
        .titulo-caninde-delas {
            font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
            font-style: italic;
            font-weight: 700;
            letter-spacing: -0.01em;
        }
        .brush-plus-stroke {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            transform: rotate(-4deg);
            transition: transform 0.3s ease;
        }
        .brush-plus-stroke:hover {
            transform: rotate(2deg) scale(1.08);
        }
    </style>`;

index = index.replace(oldFontStyles, newFontStyles);

// 2. Corrigir a estrutura vertical do cabeçalho da seção Canindé + Delas
const oldSectionHeader = `            <!-- Cabeçalho da Seção -->
            <div class="text-center mb-16 max-w-3xl mx-auto">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                    <i class="fas fa-heart text-brand-secondary"></i> Projeto Estruturante
                </div>
                <h2 id="caninde-delas-titulo" class="titulo-caninde-delas text-4xl sm:text-5xl md:text-6xl text-brand-textDark mb-4 tracking-tight inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 leading-none font-bold">
                    <span>Canindé</span>
                    <span class="brush-plus-icon text-brand-primary inline-block mx-0.5 sm:mx-1 transform hover:rotate-6 transition-transform duration-300" title="+" aria-label="+">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="brushPlusGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stop-color="#9C4EC4"/>
                                    <stop offset="50%" stop-color="#7A3E9D"/>
                                    <stop offset="100%" stop-color="#552473"/>
                                </linearGradient>
                            </defs>
                            <!-- Traço Vertical de Pincelada com textura e bordas orgânicas -->
                            <path d="M48.5 12C45.8 12.5 44.2 16.1 44.8 21.3C45.4 26.5 43.9 33.8 44.2 41.2C44.4 46.1 43.7 48.9 44.0 54.5C44.4 62.8 43.8 71.4 45.1 79.2C45.8 83.5 47.9 87.8 51.5 88.0C54.8 88.2 56.9 84.6 56.4 79.5C55.9 74.4 56.8 66.2 56.5 58.8C56.2 51.4 57.1 45.8 56.8 38.2C56.4 28.5 57.5 19.8 55.2 14.5C53.6 10.9 50.8 11.6 48.5 12Z" fill="url(#brushPlusGrad)"/>
                            <!-- Traço Horizontal de Pincelada com extremidades expressivas e orgânicas -->
                            <path d="M12.5 51.2C12.8 47.9 16.2 45.8 22.4 46.2C28.6 46.6 37.1 45.2 45.8 45.5C51.5 45.7 57.2 44.9 63.8 45.3C72.9 45.8 81.6 44.9 86.8 47.8C90.2 49.7 89.9 53.8 86.2 55.4C82.1 57.2 73.8 56.1 65.2 56.5C56.5 56.9 48.1 57.8 39.5 57.2C30.8 56.6 20.4 57.9 15.5 55.5C13.2 54.4 12.3 52.8 12.5 51.2Z" fill="url(#brushPlusGrad)"/>
                            <!-- Salpico/Textura sutil de tinta -->
                            <circle cx="58" cy="18" r="2" fill="#9C4EC4" opacity="0.6"/>
                            <circle cx="82" cy="43" r="1.5" fill="#7A3E9D" opacity="0.5"/>
                            <circle cx="18" cy="58" r="1.8" fill="#7A3E9D" opacity="0.5"/>
                            <circle cx="43" cy="82" r="1.5" fill="#552473" opacity="0.6"/>
                        </svg>
                    </span>
                    <span>Delas</span>
                </h2>
                <p id="caninde-delas-subtitulo" class="text-lg md:text-xl font-sans text-brand-textMuted leading-relaxed">Mais autonomia, protagonismo e oportunidades reais para transformar a vida de cada mulher de Canindé.</p>
            </div>`;

const newSectionHeader = `            <!-- Cabeçalho da Seção (Empilhamento Vertical Centralizado) -->
            <div class="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
                <!-- 1. Badge PROJETO ESTRUTURANTE -->
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-brand-primary text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
                    <i class="fas fa-heart text-brand-secondary"></i> Projeto Estruturante
                </div>

                <!-- 2. Título Canindé + Delas em Itálico Nobre -->
                <h2 id="caninde-delas-titulo" class="titulo-caninde-delas text-4xl sm:text-5xl md:text-6xl text-brand-textDark mb-4 tracking-tight w-full flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
                    <span>Canindé</span>
                    <span class="brush-plus-stroke text-brand-primary" title="+" aria-label="+">
                        <svg class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 drop-shadow-sm inline-block" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="brushPlusGradItalic" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stop-color="#9C4EC4"/>
                                    <stop offset="50%" stop-color="#7A3E9D"/>
                                    <stop offset="100%" stop-color="#552473"/>
                                </linearGradient>
                            </defs>
                            <!-- Traço Vertical com textura de pincel e inclinação harmônica -->
                            <path d="M49 10C46 11 44 15 45 21C46 27 44 34 45 42C45.5 47 45 50 45 55C45.5 63 45 72 46.5 80C47.2 84 49 88 52.5 88.5C56 88.5 58 84.5 57.5 79.5C57 74 58 66 57.5 58.5C57 51 58 45.5 57.5 38C57 28 58 19 55.5 13.5C54 10 51.5 10 49 10Z" fill="url(#brushPlusGradItalic)"/>
                            <!-- Traço Horizontal com extremidades fluidas -->
                            <path d="M12 50.5C12.5 47 16 45 22 45.5C28 46 37 44.5 46 45C52 45.2 57 44.5 64 45C73 45.5 82 44.5 87 47.5C90.5 49.5 90 53.5 86.5 55C82.5 57 74 55.8 65 56.2C56.5 56.6 48 57.5 39.5 57C30.5 56.4 20 57.8 15 55.2C12.8 54 11.8 52.2 12 50.5Z" fill="url(#brushPlusGradItalic)"/>
                            <!-- Salpicos Orgânicos de Tinta -->
                            <circle cx="58" cy="16" r="2" fill="#9C4EC4" opacity="0.6"/>
                            <circle cx="84" cy="42" r="1.5" fill="#7A3E9D" opacity="0.5"/>
                            <circle cx="16" cy="59" r="1.8" fill="#7A3E9D" opacity="0.5"/>
                            <circle cx="43" cy="84" r="1.5" fill="#552473" opacity="0.6"/>
                        </svg>
                    </span>
                    <span>Delas</span>
                </h2>

                <!-- 3. Subtítulo / Descrição Curta -->
                <p id="caninde-delas-subtitulo" class="text-lg md:text-xl font-sans text-brand-textMuted leading-relaxed max-w-2xl mx-auto">
                    Mais autonomia, protagonismo e oportunidades reais para transformar a vida de cada mulher de Canindé.
                </p>
            </div>`;

if (index.includes(oldSectionHeader)) {
    index = index.replace(oldSectionHeader, newSectionHeader);
    console.log('Estrutura vertical e tipografia itálica corrigidas com sucesso!');
} else {
    console.error('oldSectionHeader não encontrado');
}

fs.writeFileSync('index.html', index);
