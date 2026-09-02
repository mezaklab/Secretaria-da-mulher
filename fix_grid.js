const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const htmlFallback = `<div id="acoes-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                <!-- Card 1: Saúde -->
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer">
                    <div>
                    <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                        <span class="absolute top-3 left-3 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full z-10">Saúde e Bem-estar</span>
                        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80" alt="Ação" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <span class="text-xs font-semibold text-purple-600 block mb-1">24 Out 2024</span>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Palestra sobre prevenção e cuidados</h3>
                    <p class="text-slate-600 text-sm line-clamp-3 mb-6">Uma tarde dedicada a orientações preventivas com especialistas, focando na saúde integral da mulher.</p>
                    </div>
                    <button class="w-full py-3 rounded-full border border-purple-600 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all mt-auto">Ver fotos</button>
                </div>

                <!-- Card 2: Apoio Jurídico -->
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer">
                    <div>
                    <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                        <span class="absolute top-3 left-3 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full z-10">Apoio Jurídico</span>
                        <img src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80" alt="Ação" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <span class="text-xs font-semibold text-purple-600 block mb-1">15 Out 2024</span>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Mutirão de Documentação</h3>
                    <p class="text-slate-600 text-sm line-clamp-3 mb-6">Ação para emissão gratuita de documentos e orientação legal para mulheres da comunidade rural.</p>
                    </div>
                    <button class="w-full py-3 rounded-full border border-purple-600 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all mt-auto">Ver fotos</button>
                </div>

                <!-- Card 3: Ações Comunitárias -->
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer">
                    <div>
                    <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                        <span class="absolute top-3 left-3 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full z-10">Ações Comunitárias & Rua</span>
                        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Ação" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <span class="text-xs font-semibold text-purple-600 block mb-1">01 Set 2026</span>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Caminhada Agosto Lilás</h3>
                    <p class="text-slate-600 text-sm line-clamp-3 mb-6">Mobilização e conscientização nas ruas pelo fim da violência e garantia dos direitos.</p>
                    </div>
                    <button class="w-full py-3 rounded-full border border-purple-600 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all mt-auto">Ver fotos</button>
                </div>
            </div>`;

// Replace the carousel element
const carouselRegex = /<div id="carousel"[\s\S]*?<!-- Injetado via JS -->\n            <\/div>/;
html = html.replace(carouselRegex, htmlFallback);

// Replace renderAcoes function logic
const oldRenderRegex = /function renderAcoes\(acoesData\) \{[\s\S]*?carousel\.appendChild\(el\);\n            \}\);\n        \}/;

const newRenderAcoes = `function renderAcoes(acoesData) {
            const container = document.getElementById('acoes-container') || document.getElementById('carousel');
            if(!container) return;
            if(!acoesData || acoesData.length === 0) return; // MANTÉM OS CARDS PADRÃO SE VAZIO

            container.innerHTML = ''; // Limpa o fallback apenas se houver itens válidos
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10'; // Garante o grid

            acoesData.forEach(acao => {
                const el = document.createElement('div');
                el.className = "bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer";
                const imgStr = (acao.image || '').replace(/'/g, "\\\\'");
                const titleStr = (acao.title || '').replace(/'/g, "\\\\'");
                const descStr = (acao.description || '').replace(/'/g, "\\\\'");
                const categoryStr = acao.category || acao.categoria || "Ação";
                
                el.innerHTML = \`
                    <div onclick='openMediaModal({ titulo: \`\${titleStr}\`, descricao: \`\${descStr}\`, imagem: \`\${imgStr}\`, categoria: \`\${categoryStr}\` })'>
                    <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                        <span class="absolute top-3 left-3 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full z-10">\${categoryStr}</span>
                        <img src="\${acao.image}" alt="\${acao.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <span class="text-xs font-semibold text-purple-600 block mb-1">\${acao.date || ''}</span>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">\${acao.title}</h3>
                    <p class="text-slate-600 text-sm line-clamp-3 mb-6">\${acao.description || ''}</p>
                    </div>
                    <button class="w-full py-3 rounded-full border border-purple-600 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all mt-auto" onclick='openMediaModal({ titulo: \`\${titleStr}\`, descricao: \`\${descStr}\`, imagem: \`\${imgStr}\`, categoria: \`\${categoryStr}\` })'>Ver fotos</button>
                \`;
                container.appendChild(el);
            });
        }`;

html = html.replace(oldRenderRegex, newRenderAcoes);

fs.writeFileSync('index.html', html);
