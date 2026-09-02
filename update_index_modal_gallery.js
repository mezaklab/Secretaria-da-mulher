const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

// Update renderAcoes to pass item directly or pass galeria array to openMediaModal
const oldRenderAcoes = `        function renderAcoes(acoesData) {
            const container = document.getElementById('acoes-container');
            if (!container) return;

            container.innerHTML = '';
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10';

            acoesData.forEach(acao => {
                // Normaliza campos — suporta {title/titulo}, {image/imagem}, {category/categoria}
                const title    = acao.title       || acao.titulo    || '';
                const desc     = acao.description || acao.descricao || '';
                const image    = acao.image       || acao.imagem    || '';
                const category = acao.category    || acao.categoria || 'Ação';
                const date     = acao.date        || '';

                const safe = s => (s || '').replace(/\`/g, '\\\\\\\`').replace(/'/g, "\\\\'");

                const el = document.createElement('div');
                el.className = 'bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow';
                el.innerHTML = \`
                    <div onclick='openMediaModal({ titulo: \\\`\${safe(title)}\\\`, descricao: \\\`\${safe(desc)}\\\`, imagem: \\\`\${safe(image)}\\\`, categoria: \\\`\${safe(category)}\\\` })'>
                        <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                            <span class="absolute top-3 left-3 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full z-10">\${category}</span>
                            <img src="\${image}" alt="\${safe(title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'">
                        </div>
                        <span class="text-xs font-semibold text-purple-600 block mb-1">\${date}</span>
                        <h3 class="text-xl font-bold text-slate-800 mb-2 line-clamp-2">\${title}</h3>
                        <p class="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">\${desc}</p>
                    </div>
                    <button class="w-full py-3 rounded-full border border-purple-600 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all mt-auto"
                        onclick='openMediaModal({ titulo: \\\`\${safe(title)}\\\`, descricao: \\\`\${safe(desc)}\\\`, imagem: \\\`\${safe(image)}\\\`, categoria: \\\`\${safe(category)}\\\` })'>
                        Ver fotos
                    </button>
                \`;
                container.appendChild(el);
            });
        }`;

const newRenderAcoes = `        function renderAcoes(acoesData) {
            const container = document.getElementById('acoes-container');
            if (!container) return;

            container.innerHTML = '';
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10';

            acoesData.forEach(acao => {
                // Normaliza campos — suporta {title/titulo}, {image/imagem/fotoCapa}, {category/categoria}
                const title    = acao.title       || acao.titulo    || '';
                const desc     = acao.description || acao.descricao || '';
                const image    = acao.fotoCapa    || acao.image     || acao.imagem    || '';
                const category = acao.category    || acao.categoria || 'Ação';
                const date     = acao.date        || '';
                const galeria  = Array.isArray(acao.galeria) ? acao.galeria : [];

                const el = document.createElement('div');
                el.className = 'bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow';
                
                // Preparar dados do modal
                const modalData = {
                    titulo: title,
                    descricao: desc,
                    imagem: image,
                    categoria: category,
                    galeria: galeria
                };

                const cardHeader = document.createElement('div');
                cardHeader.innerHTML = \`
                    <div class="relative h-48 rounded-2xl overflow-hidden mb-4">
                        <span class="absolute top-3 left-3 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full z-10">\${category}</span>
                        <img src="\${image}" alt="\${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'">
                        \${galeria.length > 0 ? \`<span class="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5"><i class="fas fa-images"></i> +\${galeria.length} fotos</span>\` : ''}
                    </div>
                    <span class="text-xs font-semibold text-purple-600 block mb-1">\${date}</span>
                    <h3 class="text-xl font-bold text-slate-800 mb-2 line-clamp-2">\${title}</h3>
                    <p class="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">\${desc}</p>
                \`;
                cardHeader.onclick = () => openMediaModal(modalData);

                const btn = document.createElement('button');
                btn.className = 'w-full py-3 rounded-full border border-purple-600 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all mt-auto flex items-center justify-center gap-2';
                btn.innerHTML = galeria.length > 0 ? \`<i class="fas fa-images text-sm"></i> Ver fotos (\${galeria.length + 1})\` : 'Ver fotos';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    openMediaModal(modalData);
                };

                el.appendChild(cardHeader);
                el.appendChild(btn);
                container.appendChild(el);
            });
        }`;

// Replace renderAcoes
index = index.replace(oldRenderAcoes, newRenderAcoes);

// Update openMediaModal to support gallery + carousel/navigation
const oldOpenMediaModal = `        function openMediaModal(data) {
            const titulo = data.titulo || data.title || '';
            const descricao = data.descricao || data.description || '';
            const imagem = data.imagem || data.image || '';
            const categoria = data.categoria || data.category || 'Galeria';

            modalContent.innerHTML = \`
                <div class="flex flex-col md:flex-row h-full max-h-[85vh]">
                    <div class="md:w-1/2 p-0 relative">
                        <img src="\${imagem}" class="w-full h-full object-cover" alt="\${titulo}">
                        <div class="absolute top-4 left-4 bg-brand-badgeBg text-brand-badgeText px-4 py-1.5 rounded-full font-display font-bold text-sm shadow-sm">
                            \${categoria}
                        </div>
                    </div>
                    <div class="md:w-1/2 p-10 md:p-12 flex flex-col justify-center bg-white">
                        <h4 class="font-display text-3xl text-brand-textDark mb-6" id="modalTitle">\${titulo}</h4>
                        \${descricao ? \`<p class="font-sans text-brand-textMuted text-xl leading-relaxed" id="modalDesc">\${descricao}</p>\` : ''}
                    </div>
                </div>
            \`;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            body.classList.add('modal-active');
        }`;

const newOpenMediaModal = `        // Controle de Estado do Lightbox/Galeria Modal
        let activeGalleryImages = [];
        let currentGalleryIndex = 0;

        function updateModalImage(index) {
            if (!activeGalleryImages.length) return;
            currentGalleryIndex = (index + activeGalleryImages.length) % activeGalleryImages.length;
            
            const mainImg = document.getElementById('modalMainImage');
            const counter = document.getElementById('modalImageCounter');
            if (mainImg) {
                mainImg.src = activeGalleryImages[currentGalleryIndex];
            }
            if (counter) {
                counter.innerText = \`\${currentGalleryIndex + 1} / \${activeGalleryImages.length}\`;
            }

            // Atualiza borda das miniaturas ativas
            document.querySelectorAll('.modal-thumb-item').forEach((thumb, idx) => {
                if (idx === currentGalleryIndex) {
                    thumb.classList.add('ring-2', 'ring-purple-600', 'opacity-100', 'scale-105');
                    thumb.classList.remove('opacity-60');
                } else {
                    thumb.classList.remove('ring-2', 'ring-purple-600', 'opacity-100', 'scale-105');
                    thumb.classList.add('opacity-60');
                }
            });
        }

        window.modalPrevImage = function() {
            updateModalImage(currentGalleryIndex - 1);
        };

        window.modalNextImage = function() {
            updateModalImage(currentGalleryIndex + 1);
        };

        window.modalSelectImage = function(index) {
            updateModalImage(index);
        };

        function openMediaModal(data) {
            const titulo = data.titulo || data.title || '';
            const descricao = data.descricao || data.description || '';
            const capa = data.imagem || data.image || '';
            const categoria = data.categoria || data.category || 'Galeria';
            const extraPhotos = Array.isArray(data.galeria) ? data.galeria.filter(Boolean) : [];

            // Montar array completo com Capa + Galeria
            activeGalleryImages = [capa, ...extraPhotos].filter(Boolean);
            if (!activeGalleryImages.length) {
                activeGalleryImages = ['https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'];
            }
            currentGalleryIndex = 0;

            const hasMultiple = activeGalleryImages.length > 1;

            modalContent.innerHTML = \`
                <div class="flex flex-col lg:flex-row h-full max-h-[90vh]">
                    <!-- Coluna da Imagem / Carrossel -->
                    <div class="lg:w-7/12 p-0 relative bg-slate-950 flex flex-col justify-center min-h-[320px] lg:min-h-[480px]">
                        <!-- Imagem Principal -->
                        <div class="relative w-full h-[320px] lg:h-[480px] flex items-center justify-center overflow-hidden">
                            <img id="modalMainImage" src="\${activeGalleryImages[0]}" class="w-full h-full object-contain transition-all duration-300 select-none" alt="\${titulo}">
                            
                            <!-- Badge de Categoria -->
                            <div class="absolute top-4 left-4 bg-brand-badgeBg text-brand-badgeText px-3.5 py-1.5 rounded-full font-display font-bold text-xs shadow-md z-10">
                                \${categoria}
                            </div>

                            \${hasMultiple ? \`
                            <!-- Contador de Fotos -->
                            <div id="modalImageCounter" class="absolute top-4 right-16 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full font-mono text-xs font-semibold z-10">
                                1 / \${activeGalleryImages.length}
                            </div>

                            <!-- Botões de Navegação Anterior / Próxima -->
                            <button type="button" onclick="modalPrevImage()" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-brand-textDark flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-20 focus:outline-none" aria-label="Foto anterior">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button type="button" onclick="modalNextImage()" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-brand-textDark flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-20 focus:outline-none" aria-label="Próxima foto">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                            \` : ''}
                        </div>

                        \${hasMultiple ? \`
                        <!-- Grade de Miniaturas no Rodapé da Imagem -->
                        <div class="bg-black/80 px-4 py-2.5 overflow-x-auto flex gap-2 justify-center items-center scrollbar-none z-10">
                            \${activeGalleryImages.map((img, idx) => \`
                                <button type="button" onclick="modalSelectImage(\${idx})" class="modal-thumb-item flex-none w-12 h-12 rounded-lg overflow-hidden transition-all duration-200 \${idx === 0 ? 'ring-2 ring-purple-600 opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}">
                                    <img src="\${img}" class="w-full h-full object-cover" alt="Miniatura \${idx + 1}">
                                </button>
                            \`).join('')}
                        </div>
                        \` : ''}
                    </div>

                    <!-- Coluna de Informações -->
                    <div class="lg:w-5/12 p-8 lg:p-10 flex flex-col justify-between bg-white overflow-y-auto">
                        <div>
                            <div class="flex items-center gap-2 mb-3">
                                <span class="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                                <span class="text-xs font-bold uppercase tracking-wider text-purple-700">\${categoria}</span>
                            </div>
                            <h4 class="font-display text-2xl lg:text-3xl text-brand-textDark mb-4 leading-tight" id="modalTitle">\${titulo}</h4>
                            \${descricao ? \`<p class="font-sans text-slate-600 text-base leading-relaxed mb-6" id="modalDesc">\${descricao}</p>\` : ''}
                            
                            \${hasMultiple ? \`
                            <div class="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center gap-3 text-purple-900 text-xs">
                                <div class="w-8 h-8 rounded-full bg-purple-200/80 flex items-center justify-center shrink-0 text-purple-800">
                                    <i class="fas fa-camera"></i>
                                </div>
                                <div>
                                    <p class="font-bold">Galeria Completa</p>
                                    <p class="text-purple-700">Esta ação possui \${activeGalleryImages.length} fotos registradas.</p>
                                </div>
                            </div>
                            \` : ''}
                        </div>

                        <div class="pt-6 border-t border-gray-100 mt-6 flex justify-end">
                            <button type="button" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full text-sm transition-colors" onclick="closeModal()">
                                Fechar visualização
                            </button>
                        </div>
                    </div>
                </div>
            \`;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            body.classList.add('modal-active');
        }`;

// Replace openMediaModal
index = index.replace(oldOpenMediaModal, newOpenMediaModal);

// Also add ArrowLeft / ArrowRight keyboard navigation support
const oldKeydown = `        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && !modal.classList.contains('opacity-0')) closeModal();
        });`;

const newKeydown = `        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('opacity-0')) {
                if (e.key === "Escape") closeModal();
                if (e.key === "ArrowLeft" && typeof modalPrevImage === 'function') modalPrevImage();
                if (e.key === "ArrowRight" && typeof modalNextImage === 'function') modalNextImage();
            }
        });`;

index = index.replace(oldKeydown, newKeydown);

// Also update the static cards in index.html to have onclick calling openMediaModal
index = index.replace(
    /<!-- Card 1: Saúde -->\s*<div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer">/g,
    `<!-- Card 1: Saúde -->
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer" onclick="openMediaModal({ titulo: 'Palestra sobre prevenção e cuidados', descricao: 'Uma tarde dedicada a orientações preventivas com especialistas, focando na saúde integral da mulher.', imagem: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80', categoria: 'Saúde e Bem-estar' })">`
);

index = index.replace(
    /<!-- Card 2: Apoio Jurídico -->\s*<div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer">/g,
    `<!-- Card 2: Apoio Jurídico -->
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer" onclick="openMediaModal({ titulo: 'Mutirão de Documentação', descricao: 'Ação para emissão gratuita de documentos e orientação legal para mulheres da comunidade rural.', imagem: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80', categoria: 'Apoio Jurídico' })">`
);

index = index.replace(
    /<!-- Card 3: Ações Comunitárias -->\s*<div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer">/g,
    `<!-- Card 3: Ações Comunitárias -->
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col justify-between group cursor-pointer" onclick="openMediaModal({ titulo: 'Caminhada Agosto Lilás', descricao: 'Mobilização e conscientização nas ruas pelo fim da violência e garantia dos direitos.', imagem: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', categoria: 'Ações Comunitárias & Rua' })">`
);

fs.writeFileSync('index.html', index);
console.log('index.html atualizado com sucesso!');
