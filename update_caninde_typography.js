const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

// 1. Adicionar import do Google Fonts para "Playfair Display" (serifada feminina sofisticada) e estilo CSS customizado
const oldFontsImport = `    <!-- Google Fonts: Poppins para Títulos, Atkinson para Textos -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet">`;

const newFontsImport = `    <!-- Google Fonts: Poppins para Títulos, Atkinson para Textos, Playfair Display para Canindé + Delas -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Poppins:wght@700;800&display=swap" rel="stylesheet">
    
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

index = index.replace(oldFontsImport, newFontsImport);

// 2. Substituir o h2 de "Canindé + Delas" com a nova tipografia e o símbolo "+" estilizado em pincelada SVG
const oldH2 = `                <h2 id="caninde-delas-titulo" class="font-display text-4xl md:text-5xl text-brand-textDark mb-4 tracking-tight">Canindé + Delas</h2>`;

const newH2 = `                <h2 id="caninde-delas-titulo" class="titulo-caninde-delas text-4xl sm:text-5xl md:text-6xl text-brand-textDark mb-4 tracking-tight inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 leading-none font-bold">
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
                </h2>`;

index = index.replace(oldH2, newH2);

fs.writeFileSync('index.html', index);
console.log('Tipografia Playfair Display e SVG de pincelada aplicados com sucesso no index.html!');
