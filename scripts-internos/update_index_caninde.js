const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

// 1. Inserir a nova seção "Canindé + Delas" entre #saude e #direitos
const saudeEnd = `    </section>

    <!-- Direitos e Apoio -->`;

const canindeDelasSectionHTML = `    </section>

    <!-- Canindé + Delas -->
    <section id="caninde-delas" class="py-24 bg-purple-50/50 border-t border-brand-borderMuted relative overflow-hidden" style="z-index: 10;">
        <!-- Elemento Decorativo Sutil de Fundo -->
        <div class="w-72 h-72 bg-brand-secondary/10 rounded-full blur-3xl absolute -top-20 -left-20 pointer-events-none"></div>
        <div class="w-72 h-72 bg-purple-200/20 rounded-full blur-3xl absolute -bottom-20 -right-20 pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <!-- Cabeçalho da Seção -->
            <div class="text-center mb-16 max-w-3xl mx-auto">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                    <i class="fas fa-heart text-brand-secondary"></i> Projeto Estruturante
                </div>
                <h2 id="caninde-delas-titulo" class="font-display text-4xl md:text-5xl text-brand-textDark mb-4 tracking-tight">Canindé + Delas</h2>
                <p id="caninde-delas-subtitulo" class="text-lg md:text-xl font-sans text-brand-textMuted leading-relaxed">Mais autonomia, protagonismo e oportunidades reais para transformar a vida de cada mulher de Canindé.</p>
            </div>

            <!-- Bloco de Texto Institucional / Descrição do Projeto -->
            <div class="bg-white border border-brand-cardBorder rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-16 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-purple-100/40 rounded-bl-[4rem] pointer-events-none"></div>
                
                <div class="flex flex-col lg:flex-row gap-8 items-center lg:items-start relative z-10">
                    <div class="w-16 h-16 rounded-2xl bg-purple-100 text-brand-primary flex items-center justify-center text-3xl shrink-0 shadow-sm">
                        <i class="fas fa-female"></i>
                    </div>
                    <div class="flex-grow text-center lg:text-left">
                        <h3 class="font-display text-2xl md:text-3xl text-brand-textDark font-bold mb-4">Sobre o Programa</h3>
                        <div id="caninde-delas-descricao" class="font-sans text-slate-700 text-base md:text-lg leading-relaxed space-y-4">
                            <p>O <strong>Canindé + Delas</strong> é o grande programa integrado de emancipação feminina, qualificação profissional e garantia de direitos do município de Canindé de São Francisco.</p>
                            <p>Articulando ações de geração de renda, capacitação profissional, apoio a microempreendedoras, mutirões de saúde integral e rodas de cidadania, o programa atua diretamente nos bairros e comunidades rurais, levando oportunidades transformadoras a quem mais precisa.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Galeria de Fotos do Projeto -->
            <div>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                    <div>
                        <h3 class="font-display text-2xl md:text-3xl text-brand-textDark font-bold">Galeria de Registros</h3>
                        <p class="text-sm font-sans text-brand-textMuted">Momentos e conquistas do programa Canindé + Delas</p>
                    </div>
                    <span id="caninde-delas-badge-count" class="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-brand-primary">
                        Fotos do Projeto
                    </span>
                </div>

                <!-- Grid Responsivo de Fotos -->
                <div id="caninde-delas-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    <!-- Foto 1 -->
                    <div class="relative rounded-3xl overflow-hidden aspect-square bg-slate-900 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-purple-100/60" onclick="openCanindeDelasGallery(0)">
                        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80" alt="Canindé + Delas 1" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span class="text-white text-xs font-semibold flex items-center gap-1.5">
                                <i class="fas fa-search-plus"></i> Ampliar foto
                            </span>
                        </div>
                    </div>
                    <!-- Foto 2 -->
                    <div class="relative rounded-3xl overflow-hidden aspect-square bg-slate-900 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-purple-100/60" onclick="openCanindeDelasGallery(1)">
                        <img src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80" alt="Canindé + Delas 2" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span class="text-white text-xs font-semibold flex items-center gap-1.5">
                                <i class="fas fa-search-plus"></i> Ampliar foto
                            </span>
                        </div>
                    </div>
                    <!-- Foto 3 -->
                    <div class="relative rounded-3xl overflow-hidden aspect-square bg-slate-900 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-purple-100/60" onclick="openCanindeDelasGallery(2)">
                        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Canindé + Delas 3" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span class="text-white text-xs font-semibold flex items-center gap-1.5">
                                <i class="fas fa-search-plus"></i> Ampliar foto
                            </span>
                        </div>
                    </div>
                    <!-- Foto 4 -->
                    <div class="relative rounded-3xl overflow-hidden aspect-square bg-slate-900 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-purple-100/60" onclick="openCanindeDelasGallery(3)">
                        <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80" alt="Canindé + Delas 4" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span class="text-white text-xs font-semibold flex items-center gap-1.5">
                                <i class="fas fa-search-plus"></i> Ampliar foto
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Direitos e Apoio -->`;

index = index.replace(saudeEnd, canindeDelasSectionHTML);

// 2. Atualizar loadAndRender() no index.html
const oldLoadAndRender = `            function loadAndRender() {
                let acoesRaw = null, galeriaRaw = null, agendaRaw = null, saudeRaw = null;
                try { acoesRaw   = JSON.parse(localStorage.getItem('sec_mulher_acoes'));   } catch(e) {}
                try { galeriaRaw = JSON.parse(localStorage.getItem('sec_mulher_galeria')); } catch(e) {}
                try { agendaRaw  = JSON.parse(localStorage.getItem('sec_mulher_agenda'));  } catch(e) {}
                try { saudeRaw   = JSON.parse(localStorage.getItem('sec_mulher_saude'));   } catch(e) {}

                // Só renderiza dinamicamente se houver dados reais no localStorage.
                // Se localStorage vazio/nulo → o HTML estático (fallback) permanece visível.
                if (Array.isArray(acoesRaw)   && acoesRaw.length   > 0) renderAcoes(acoesRaw);
                if (Array.isArray(galeriaRaw) && galeriaRaw.length > 0) renderGaleria(galeriaRaw);
                if (Array.isArray(agendaRaw)  && agendaRaw.length  > 0) renderAgenda(agendaRaw);
                if (Array.isArray(saudeRaw)   && saudeRaw.length   > 0) renderSaude(saudeRaw);
            }`;

const newLoadAndRender = `            function loadAndRender() {
                let acoesRaw = null, galeriaRaw = null, agendaRaw = null, saudeRaw = null, canindeRaw = null;
                try { acoesRaw   = JSON.parse(localStorage.getItem('sec_mulher_acoes'));   } catch(e) {}
                try { galeriaRaw = JSON.parse(localStorage.getItem('sec_mulher_galeria')); } catch(e) {}
                try { agendaRaw  = JSON.parse(localStorage.getItem('sec_mulher_agenda'));  } catch(e) {}
                try { saudeRaw   = JSON.parse(localStorage.getItem('sec_mulher_saude'));   } catch(e) {}
                try { canindeRaw = JSON.parse(localStorage.getItem('sec_mulher_caninde_delas')); } catch(e) {}

                // Só renderiza dinamicamente se houver dados reais no localStorage.
                // Se localStorage vazio/nulo → o HTML estático (fallback) permanece visível.
                if (Array.isArray(acoesRaw)   && acoesRaw.length   > 0) renderAcoes(acoesRaw);
                if (Array.isArray(galeriaRaw) && galeriaRaw.length > 0) renderGaleria(galeriaRaw);
                if (Array.isArray(agendaRaw)  && agendaRaw.length  > 0) renderAgenda(agendaRaw);
                if (Array.isArray(saudeRaw)   && saudeRaw.length   > 0) renderSaude(saudeRaw);
                if (canindeRaw && typeof canindeRaw === 'object') renderCanindeDelas(canindeRaw);
            }`;

index = index.replace(oldLoadAndRender, newLoadAndRender);

// 3. Atualizar o storage listener
index = index.replace(
    `if (['sec_mulher_acoes', 'sec_mulher_galeria', 'sec_mulher_agenda', 'sec_mulher_saude'].includes(e.key)) {`,
    `if (['sec_mulher_acoes', 'sec_mulher_galeria', 'sec_mulher_agenda', 'sec_mulher_saude', 'sec_mulher_caninde_delas'].includes(e.key)) {`
);

// 4. Inserir funções renderCanindeDelas e openCanindeDelasGallery
const oldRenderSaudeFunc = `        function renderSaude(saudeData) {`;

const newCanindeDelasFuncs = `        // Controle de fotos do Canindé + Delas para Lightbox
        let canindeDelasPhotosList = [
            'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
            'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80'
        ];

        function renderCanindeDelas(data) {
            if (!data) return;

            const subtituloEl = document.getElementById('caninde-delas-subtitulo');
            const descricaoEl = document.getElementById('caninde-delas-descricao');
            const gridEl = document.getElementById('caninde-delas-grid');
            const countBadge = document.getElementById('caninde-delas-badge-count');

            if (subtituloEl && data.subtitulo) {
                subtituloEl.innerText = data.subtitulo;
            }

            if (descricaoEl && data.descricao) {
                // Formata parágrafos se houver quebras de linha
                const paragraphs = data.descricao.split('\\n').filter(p => p.trim());
                if (paragraphs.length > 0) {
                    descricaoEl.innerHTML = paragraphs.map(p => \`<p>\${p}</p>\`).join('');
                } else {
                    descricaoEl.innerHTML = \`<p>\${data.descricao}</p>\`;
                }
            }

            if (Array.isArray(data.fotos) && data.fotos.length > 0) {
                canindeDelasPhotosList = [...data.fotos];
                if (countBadge) {
                    countBadge.innerText = \`\${canindeDelasPhotosList.length} Foto\${canindeDelasPhotosList.length > 1 ? 's' : ''} do Projeto\`;
                }

                if (gridEl) {
                    gridEl.innerHTML = '';
                    canindeDelasPhotosList.forEach((foto, idx) => {
                        const thumb = document.createElement('div');
                        thumb.className = 'relative rounded-3xl overflow-hidden aspect-square bg-slate-900 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-purple-100/60';
                        thumb.onclick = () => openCanindeDelasGallery(idx);
                        thumb.innerHTML = \`
                            <img src="\${foto}" alt="Canindé + Delas \${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95" onerror="this.src='https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span class="text-white text-xs font-semibold flex items-center gap-1.5">
                                    <i class="fas fa-search-plus"></i> Ampliar foto
                                </span>
                            </div>
                        \`;
                        gridEl.appendChild(thumb);
                    });
                }
            }
        }

        window.openCanindeDelasGallery = function(startIndex = 0) {
            const fotos = canindeDelasPhotosList.length > 0 ? canindeDelasPhotosList : [
                'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'
            ];
            
            const firstImg = fotos[startIndex] || fotos[0];
            const remaining = fotos.filter((_, idx) => idx !== startIndex);

            openMediaModal({
                titulo: 'Programa Canindé + Delas',
                descricao: 'Registro das ações, oficinas e capacitações do programa Canindé + Delas.',
                imagem: firstImg,
                categoria: 'Canindé + Delas',
                galeria: remaining
            });
        };

        function renderSaude(saudeData) {`;

index = index.replace(oldRenderSaudeFunc, newCanindeDelasFuncs);

fs.writeFileSync('index.html', index);
console.log('index.html atualizado com a seção Canindé + Delas!');
