const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf8');

// 1. Atualizar sidebar navigation
const oldNav = `<nav class="flex-grow p-4 space-y-2 overflow-y-auto" id="sidebar-nav">
            <a href="#" data-target="visao-geral" class="nav-item flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-medium transition-colors">
                <i class="fas fa-chart-line w-5 text-center"></i> Visão Geral
            </a>
            <a href="#" data-target="acoes-fotos" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-images w-5 text-center"></i> Ações & Fotos
            </a>
            <a href="#" data-target="agenda" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-calendar-alt w-5 text-center"></i> Agenda
            </a>
            <a href="#" data-target="configuracoes" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-cog w-5 text-center"></i> Configurações
            </a>
        </nav>`;

const newNav = `<nav class="flex-grow p-4 space-y-2 overflow-y-auto" id="sidebar-nav">
            <a href="#" data-target="visao-geral" class="nav-item flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-medium transition-colors">
                <i class="fas fa-chart-line w-5 text-center"></i> Visão Geral
            </a>
            <a href="#" data-target="acoes-fotos" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-images w-5 text-center"></i> Ações & Fotos
            </a>
            <a href="#" data-target="servicos-saude" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-heartbeat w-5 text-center"></i> Serviços de Saúde
            </a>
            <a href="#" data-target="agenda" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-calendar-alt w-5 text-center"></i> Agenda
            </a>
            <a href="#" data-target="configuracoes" class="nav-item flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors">
                <i class="fas fa-cog w-5 text-center"></i> Configurações
            </a>
        </nav>`;

admin = admin.replace(oldNav, newNav);

// 2. Adicionar a aba tab-content "servicos-saude"
const oldTabAgenda = `            <!-- Agenda -->
            <div id="agenda" class="tab-content hidden">`;

const newTabSaudeAndAgenda = `            <!-- Serviços de Saúde -->
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

            <!-- Agenda -->
            <div id="agenda" class="tab-content hidden">`;

admin = admin.replace(oldTabAgenda, newTabSaudeAndAgenda);

// 3. Adicionar Modal de Saúde
const oldModalAgenda = `    <!-- Modal de Agenda -->`;

const newModalSaude = `    <!-- Modal de Serviço de Saúde -->
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
                            <input type="file" id="input-saude-imagem-file" accept="image/*" class="hidden">
                            <div id="saude-upload-area" class="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between gap-4 text-gray-500 hover:bg-gray-50 hover:border-brand-primary transition-colors cursor-pointer" onclick="document.getElementById('input-saude-imagem-file').click()">
                                <div class="flex items-center gap-3 pointer-events-none">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                                        <i class="fas fa-image"></i>
                                    </div>
                                    <div>
                                        <p id="saude-image-name" class="text-sm font-medium text-gray-700">Clique para anexar foto explicativa</p>
                                        <p class="text-xs text-gray-400">PNG, JPG até 5MB</p>
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

    <!-- Modal de Agenda -->`;

admin = admin.replace(oldModalAgenda, newModalSaude);

fs.writeFileSync('admin.html', admin);
console.log('HTML estrutural de saúde no admin inserido com sucesso!');
