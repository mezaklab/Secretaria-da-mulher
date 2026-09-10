const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf8');

// 1. Inserir botão na sidebar do admin
const navSaudeItem = `            <a href="#" data-target="servicos-saude" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-heartbeat w-5 text-center"></i> Serviços de Saúde
            </a>`;

const navCanindeItem = `            <a href="#" data-target="servicos-saude" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-heartbeat w-5 text-center"></i> Serviços de Saúde
            </a>
            <a href="#" data-target="caninde-delas" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-female w-5 text-center"></i> Canindé + Delas
            </a>`;

admin = admin.replace(navSaudeItem, navCanindeItem);

// 2. Inserir a aba <div id="caninde-delas" class="tab-content hidden"> no admin
const agendaTabStart = `            <!-- Agenda -->
            <div id="agenda" class="tab-content hidden">`;

const canindeDelasTabHTML = `            <!-- Canindé + Delas -->
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

                            <!-- Descrição Longa -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1.5">Descrição Institucional do Projeto (Texto Completo)</label>
                                <textarea id="input-caninde-descricao" rows="5" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow resize-y text-sm leading-relaxed" placeholder="Descreva os objetivos do programa, as frentes de atuação (cursos, mutirões, geração de renda) e o impacto para a comunidade..."></textarea>
                            </div>

                            <!-- Galeria de Fotos Múltiplas -->
                            <div class="border-t border-gray-100 pt-6">
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700">Galeria de Fotos do Projeto</label>
                                        <p class="text-xs text-gray-400">Adicione até 10 fotos em alta qualidade (PNG, JPG até 5MB)</p>
                                    </div>
                                    <span id="caninde-gallery-badge" class="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-brand-primary">0 / 10 fotos</span>
                                </div>

                                <!-- Input & Botão de Selecionar -->
                                <input type="file" id="input-caninde-fotos" accept="image/*" multiple class="hidden">
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
            <div id="agenda" class="tab-content hidden">`;

admin = admin.replace(agendaTabStart, canindeDelasTabHTML);

// 3. Adicionar Lógica JavaScript para Canindé + Delas no admin.html
const oldAdminSaudeInit = `            let adminServicosSaude = JSON.parse(localStorage.getItem('sec_mulher_saude')) || defaultServicosSaude;`;

const newAdminSaudeAndCanindeInit = `            let adminServicosSaude = JSON.parse(localStorage.getItem('sec_mulher_saude')) || defaultServicosSaude;

            // Dados Padrão Canindé + Delas
            const defaultCanindeDelas = {
                titulo: 'Canindé + Delas',
                subtitulo: 'Mais autonomia, protagonismo e oportunidades reais para transformar a vida de cada mulher de Canindé.',
                descricao: 'O Canindé + Delas é o grande programa integrado de emancipação feminina, qualificação profissional e garantia de direitos do município de Canindé de São Francisco.\\n\\nArticulando ações de geração de renda, capacitação profissional, apoio a microempreendedoras, mutirões de saúde integral e rodas de cidadania, o programa atua diretamente nos bairros e comunidades rurais, levando oportunidades transformadoras a quem mais precisa.',
                fotos: [
                    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
                    'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80',
                    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
                    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80'
                ]
            };

            let adminCanindeDelas = JSON.parse(localStorage.getItem('sec_mulher_caninde_delas')) || defaultCanindeDelas;
            let currentCanindePhotos = Array.isArray(adminCanindeDelas.fotos) ? [...adminCanindeDelas.fotos] : [];`;

admin = admin.replace(oldAdminSaudeInit, newAdminSaudeAndCanindeInit);

// Adicionar funções de renderização do formulário de Canindé + Delas
const oldRenderAdminSaude = `            function renderAdminSaude() {`;

const newCanindeAdminFunctions = `            function renderAdminCanindeDelas() {
                const subInput = document.getElementById('input-caninde-subtitulo');
                const descInput = document.getElementById('input-caninde-descricao');
                const badgeEl = document.getElementById('caninde-gallery-badge');
                const gridEl = document.getElementById('caninde-thumbnails-grid');

                if (subInput) subInput.value = adminCanindeDelas.subtitulo || '';
                if (descInput) descInput.value = adminCanindeDelas.descricao || '';
                
                if (badgeEl) {
                    badgeEl.innerText = \`\${currentCanindePhotos.length} / 10 fotos\`;
                    badgeEl.className = currentCanindePhotos.length >= 10 
                        ? 'text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700' 
                        : 'text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-brand-primary';
                }

                if (gridEl) {
                    gridEl.innerHTML = '';
                    currentCanindePhotos.forEach((imgBase64, idx) => {
                        const thumb = document.createElement('div');
                        thumb.className = 'relative rounded-2xl overflow-hidden aspect-square border border-purple-200 bg-gray-100 group shadow-sm';
                        thumb.innerHTML = \`
                            <img src="\${imgBase64}" class="w-full h-full object-cover" alt="Foto \${idx + 1}">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md transform hover:scale-110 active:scale-95 transition-all" onclick="window.removeCanindePhoto(\${idx})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <span class="absolute bottom-1.5 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">#\${idx + 1}</span>
                        \`;
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

                    const validFiles = files.filter(f => f.type.startsWith('image/'));
                    if (validFiles.length < files.length) {
                        showCanindeError('Alguns arquivos não foram adicionados por não serem imagens válidas.');
                    }

                    const availableSlots = 10 - currentCanindePhotos.length;
                    if (validFiles.length > availableSlots) {
                        showCanindeError(\`Você só pode adicionar mais \${availableSlots} foto(s). O limite é de 10 fotos.\`);
                    }

                    const toProcess = validFiles.slice(0, availableSlots);
                    if (!toProcess.length) {
                        inputCanindeFotos.value = '';
                        return;
                    }

                    let loaded = 0;
                    toProcess.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = function(evt) {
                            currentCanindePhotos.push(evt.target.result);
                            loaded++;
                            if (loaded === toProcess.length) {
                                renderAdminCanindeDelas();
                                inputCanindeFotos.value = '';
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                });
            }

            // Botão Salvar Canindé + Delas
            const btnSalvarCaninde = document.getElementById('btn-salvar-caninde');
            if (btnSalvarCaninde) {
                btnSalvarCaninde.addEventListener('click', function() {
                    const subtitulo = document.getElementById('input-caninde-subtitulo').value.trim();
                    const descricao = document.getElementById('input-caninde-descricao').value.trim();

                    adminCanindeDelas = {
                        titulo: 'Canindé + Delas',
                        subtitulo: subtitulo || defaultCanindeDelas.subtitulo,
                        descricao: descricao || defaultCanindeDelas.descricao,
                        fotos: [...currentCanindePhotos]
                    };

                    localStorage.setItem('sec_mulher_caninde_delas', JSON.stringify(adminCanindeDelas));
                    alert('Seção "Canindé + Delas" atualizada e publicada com sucesso!');
                    renderAdminCanindeDelas();
                });
            }

            function renderAdminSaude() {`;

admin = admin.replace(oldRenderAdminSaude, newCanindeAdminFunctions);

// Inicializar renderAdminCanindeDelas()
admin = admin.replace('renderAdminSaude();', 'renderAdminSaude();\n            renderAdminCanindeDelas();');

fs.writeFileSync('admin.html', admin);
console.log('admin.html atualizado com aba, formulário e lógica de Canindé + Delas!');
