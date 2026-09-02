const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

// 1. Atualizar seção HTML #saude com id="saude-container" e dados padrão com onclick
const oldSaudeGrid = `        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="w-20 h-20 rounded-full bg-brand-iconBg text-brand-primary flex items-center justify-center mb-6">
                    <i class="fas fa-droplet text-3xl"></i>
                </div>
                <h3 class="font-display text-2xl text-brand-textDark mb-3">Seu preventivo</h3>
                <p class="font-sans text-brand-textMuted text-lg">Sem espera, sem burocracia. Disponível em todas as UBS do município com entrega rápida do resultado.</p>
            </div>

            <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="w-20 h-20 rounded-full bg-brand-iconBg text-brand-primary flex items-center justify-center mb-6">
                    <i class="fas fa-shield-virus text-3xl"></i>
                </div>
                <h3 class="font-display text-2xl text-brand-textDark mb-3">Proteção HPV</h3>
                <p class="font-sans text-brand-textMuted text-lg">Vacinação de rotina para adolescentes e público-alvo nas unidades de saúde. A principal proteção começa cedo.</p>
            </div>

            <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="w-20 h-20 rounded-full bg-brand-iconBg text-brand-primary flex items-center justify-center mb-6">
                    <i class="fas fa-moon text-3xl"></i>
                </div>
                <h3 class="font-display text-2xl text-brand-textDark mb-3">Horário noturno</h3>
                <p class="font-sans text-brand-textMuted text-lg">Trabalha o dia todo? Nossas equipes estarão a postos após as 18h em postos estratégicos da campanha.</p>
            </div>
        </div>`;

const newSaudeGrid = `        <div id="saude-container" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Card 1: Seu preventivo -->
            <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group" onclick="openSaudeModal({
                titulo: 'Seu preventivo',
                icone: 'fa-droplet',
                descricaoCurta: 'Sem espera, sem burocracia. Disponível em todas as UBS do município com entrega rápida do resultado.',
                descricaoCompleta: 'O exame citopatológico (preventivo ou Papanicolau) é a principal estratégia para detectar precocemente lesões no colo do útero antes que se tornem câncer. Em Canindé de São Francisco, o atendimento é humanizado, sem filas e com profissionais capacitados para oferecer o melhor acolhimento e suporte a cada mulher.',
                local: 'Todas as Unidades Básicas de Saúde (UBS) de Canindé de São Francisco',
                horario: 'Segunda a Sexta, das 08h às 13h (Plantões noturnos em datas especiais)',
                publico: 'Mulheres de 25 a 64 anos ou que já iniciaram a vida sexual ativa',
                documentos: 'Cartão do SUS, RG e Comprovante de Residência',
                imagem: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80'
            })">
                <div class="w-20 h-20 rounded-full bg-brand-iconBg text-brand-primary flex items-center justify-center mb-6 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                    <i class="fas fa-droplet text-3xl"></i>
                </div>
                <h3 class="font-display text-2xl text-brand-textDark mb-3 group-hover:text-brand-primary transition-colors">Seu preventivo</h3>
                <p class="font-sans text-brand-textMuted text-lg mb-6">Sem espera, sem burocracia. Disponível em todas as UBS do município com entrega rápida do resultado.</p>
                <span class="mt-auto inline-flex items-center text-brand-primary font-bold text-sm group-hover:underline">
                    Ver detalhes do atendimento <i class="fas fa-arrow-right ml-2 text-xs transition-transform group-hover:translate-x-1"></i>
                </span>
            </div>

            <!-- Card 2: Proteção HPV -->
            <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group" onclick="openSaudeModal({
                titulo: 'Proteção HPV',
                icone: 'fa-shield-virus',
                descricaoCurta: 'Vacinação de rotina para adolescentes e público-alvo nas unidades de saúde. A principal proteção começa cedo.',
                descricaoCompleta: 'A vacina contra o Papilomavírus Humano (HPV) previne contra os tipos de vírus responsáveis por mais de 70% dos casos de câncer de colo de útero. A imunização é segura, altamente eficaz e gratuita nas salas de vacina do município.',
                local: 'Salas de Vacina de todas as UBSs do município',
                horario: 'Segunda a Sexta, das 08h às 13h',
                publico: 'Meninas e meninos de 9 a 14 anos, e imunossuprimidos até 45 anos',
                documentos: 'Caderneta de Vacinação, Cartão do SUS e Documento com foto',
                imagem: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80'
            })">
                <div class="w-20 h-20 rounded-full bg-brand-iconBg text-brand-primary flex items-center justify-center mb-6 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                    <i class="fas fa-shield-virus text-3xl"></i>
                </div>
                <h3 class="font-display text-2xl text-brand-textDark mb-3 group-hover:text-brand-primary transition-colors">Proteção HPV</h3>
                <p class="font-sans text-brand-textMuted text-lg mb-6">Vacinação de rotina para adolescentes e público-alvo nas unidades de saúde. A principal proteção começa cedo.</p>
                <span class="mt-auto inline-flex items-center text-brand-primary font-bold text-sm group-hover:underline">
                    Ver detalhes do atendimento <i class="fas fa-arrow-right ml-2 text-xs transition-transform group-hover:translate-x-1"></i>
                </span>
            </div>

            <!-- Card 3: Horário noturno -->
            <div class="bg-white border border-brand-cardBorder rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group" onclick="openSaudeModal({
                titulo: 'Horário noturno',
                icone: 'fa-moon',
                descricaoCurta: 'Trabalha o dia todo? Nossas equipes estarão a postos após as 18h em postos estratégicos da campanha.',
                descricaoCompleta: 'Para garantir que nenhuma trabalhadora, autônoma ou estudante fique sem atendimento preventivo, a Secretaria da Mulher em parceria com a Secretaria de Saúde disponibiliza plantões noturnos com exames preventivos, vacinação, testes rápidos e acolhimento psicológico.',
                local: 'UBS Sede e Postos Estratégicos Itinerantes',
                horario: 'Plantões especiais das 18h às 21h (consulte cronograma da Agenda)',
                publico: 'Trabalhadoras e mulheres que não podem comparecer em horário comercial',
                documentos: 'Documento oficial com foto e Cartão do SUS',
                imagem: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80'
            })">
                <div class="w-20 h-20 rounded-full bg-brand-iconBg text-brand-primary flex items-center justify-center mb-6 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                    <i class="fas fa-moon text-3xl"></i>
                </div>
                <h3 class="font-display text-2xl text-brand-textDark mb-3 group-hover:text-brand-primary transition-colors">Horário noturno</h3>
                <p class="font-sans text-brand-textMuted text-lg mb-6">Trabalha o dia todo? Nossas equipes estarão a postos após as 18h em postos estratégicos da campanha.</p>
                <span class="mt-auto inline-flex items-center text-brand-primary font-bold text-sm group-hover:underline">
                    Ver detalhes do atendimento <i class="fas fa-arrow-right ml-2 text-xs transition-transform group-hover:translate-x-1"></i>
                </span>
            </div>
        </div>`;

index = index.replace(oldSaudeGrid, newSaudeGrid);

// 2. Atualizar loadAndRender() e storage listener no index.html
const oldLoadAndRender = `            function loadAndRender() {
                let acoesRaw = null, galeriaRaw = null, agendaRaw = null;
                try { acoesRaw   = JSON.parse(localStorage.getItem('sec_mulher_acoes'));   } catch(e) {}
                try { galeriaRaw = JSON.parse(localStorage.getItem('sec_mulher_galeria')); } catch(e) {}
                try { agendaRaw  = JSON.parse(localStorage.getItem('sec_mulher_agenda'));  } catch(e) {}

                // Só renderiza dinamicamente se houver dados reais no localStorage.
                // Se localStorage vazio/nulo → o HTML estático (fallback) permanece visível.
                if (Array.isArray(acoesRaw)   && acoesRaw.length   > 0) renderAcoes(acoesRaw);
                if (Array.isArray(galeriaRaw) && galeriaRaw.length > 0) renderGaleria(galeriaRaw);
                if (Array.isArray(agendaRaw)  && agendaRaw.length  > 0) renderAgenda(agendaRaw);
            }`;

const newLoadAndRender = `            function loadAndRender() {
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

index = index.replace(oldLoadAndRender, newLoadAndRender);

// Atualizar o storage listener
index = index.replace(
    `if (['sec_mulher_acoes', 'sec_mulher_galeria', 'sec_mulher_agenda'].includes(e.key)) {`,
    `if (['sec_mulher_acoes', 'sec_mulher_galeria', 'sec_mulher_agenda', 'sec_mulher_saude'].includes(e.key)) {`
);

// 3. Adicionar renderSaude e openSaudeModal
const oldRenderAcoesFunction = `        function renderAcoes(acoesData) {`;

const newRenderSaudeAndAcoes = `        function renderSaude(saudeData) {
            const container = document.getElementById('saude-container');
            if (!container) return;

            container.innerHTML = '';
            container.className = 'grid grid-cols-1 md:grid-cols-3 gap-8';

            saudeData.forEach(item => {
                const el = document.createElement('div');
                el.className = 'bg-white border border-brand-cardBorder rounded-[2rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group';
                el.onclick = () => openSaudeModal(item);

                const iconeClass = item.icone || 'fa-droplet';
                const titulo = item.titulo || 'Serviço de Saúde';
                const descCurta = item.descricaoCurta || item.descricao || '';

                el.innerHTML = \`
                    <div class="w-20 h-20 rounded-full bg-brand-iconBg text-brand-primary flex items-center justify-center mb-6 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                        <i class="fas \${iconeClass} text-3xl"></i>
                    </div>
                    <h3 class="font-display text-2xl text-brand-textDark mb-3 group-hover:text-brand-primary transition-colors">\${titulo}</h3>
                    <p class="font-sans text-brand-textMuted text-lg mb-6">\${descCurta}</p>
                    <span class="mt-auto inline-flex items-center text-brand-primary font-bold text-sm group-hover:underline">
                        Ver detalhes do atendimento <i class="fas fa-arrow-right ml-2 text-xs transition-transform group-hover:translate-x-1"></i>
                    </span>
                \`;
                container.appendChild(el);
            });
        }

        function openSaudeModal(item) {
            const modal = document.getElementById('mediaModal');
            const modalContent = document.getElementById('modalContent');
            const body = document.body;
            if (!modal || !modalContent) return;

            const titulo = item.titulo || 'Serviço de Saúde';
            const icone = item.icone || 'fa-heartbeat';
            const descCurta = item.descricaoCurta || '';
            const descCompleta = item.descricaoCompleta || item.descricao || descCurta;
            const local = item.local || 'Unidades Básicas de Saúde (UBS) do Município';
            const horario = item.horario || 'Segunda a Sexta, das 08h às 13h';
            const publico = item.publico || 'Mulheres do município de Canindé de São Francisco';
            const documentos = item.documentos || 'Cartão do SUS e Documento oficial com foto';
            const imagem = item.imagem || '';

            modalContent.innerHTML = \`
                <div class="flex flex-col lg:flex-row h-full max-h-[90vh]">
                    \${imagem ? \`
                    <!-- Coluna da Foto (quando houver imagem) -->
                    <div class="lg:w-5/12 p-0 relative bg-slate-950 flex flex-col justify-center min-h-[260px] lg:min-h-[480px]">
                        <img src="\${imagem}" class="w-full h-full object-cover" alt="\${titulo}">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-full bg-white/90 text-brand-primary flex items-center justify-center text-xl shadow-lg">
                                    <i class="fas \${icone}"></i>
                                </div>
                                <span class="text-white font-display font-bold text-lg">\${titulo}</span>
                            </div>
                        </div>
                    </div>
                    \` : ''}

                    <!-- Coluna com os Detalhes Completos -->
                    <div class="\${imagem ? 'lg:w-7/12' : 'w-full'} p-8 lg:p-12 flex flex-col justify-between bg-white overflow-y-auto">
                        <div>
                            <!-- Header do Serviço -->
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-14 h-14 rounded-2xl bg-purple-100 text-brand-primary flex items-center justify-center text-2xl shrink-0 shadow-sm">
                                    <i class="fas \${icone}"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                        <span class="text-xs font-bold uppercase tracking-wider text-purple-700">Saúde Preventiva Municipal</span>
                                    </div>
                                    <h3 class="font-display text-2xl lg:text-3xl font-extrabold text-brand-textDark leading-tight mt-1">\${titulo}</h3>
                                </div>
                            </div>

                            <!-- Descrição Completa -->
                            <div class="mb-8">
                                <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-display">Sobre o Serviço</h4>
                                <p class="font-sans text-slate-700 text-base lg:text-lg leading-relaxed bg-purple-50/50 p-5 rounded-2xl border border-purple-100/60">\${descCompleta}</p>
                            </div>

                            <!-- Grid com Informações Práticas -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <!-- Local -->
                                <div class="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-start gap-3.5">
                                    <div class="w-10 h-10 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div>
                                        <h5 class="text-xs font-bold uppercase tracking-wider text-gray-500">Onde Realizar</h5>
                                        <p class="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">\${local}</p>
                                    </div>
                                </div>

                                <!-- Horário -->
                                <div class="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-start gap-3.5">
                                    <div class="w-10 h-10 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div>
                                        <h5 class="text-xs font-bold uppercase tracking-wider text-gray-500">Horários de Atendimento</h5>
                                        <p class="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">\${horario}</p>
                                    </div>
                                </div>

                                <!-- Público-alvo -->
                                <div class="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-start gap-3.5">
                                    <div class="w-10 h-10 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div>
                                        <h5 class="text-xs font-bold uppercase tracking-wider text-gray-500">Público-Alvo</h5>
                                        <p class="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">\${publico}</p>
                                    </div>
                                </div>

                                <!-- Documentos -->
                                <div class="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-start gap-3.5">
                                    <div class="w-10 h-10 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <i class="fas fa-id-card"></i>
                                    </div>
                                    <div>
                                        <h5 class="text-xs font-bold uppercase tracking-wider text-gray-500">Documentos Necessários</h5>
                                        <p class="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">\${documentos}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Rodapé do Modal -->
                        <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div class="flex items-center gap-2 text-xs text-purple-700 font-medium">
                                <i class="fas fa-shield-alt text-brand-primary"></i> Atendimento 100% gratuito e garantido pelo SUS
                            </div>
                            <button type="button" class="w-full sm:w-auto px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-full text-sm transition-all shadow-sm" onclick="closeModal()">
                                Fechar Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            \`;

            modal.classList.remove('opacity-0', 'pointer-events-none');
            body.classList.add('modal-active');
        }

        function renderAcoes(acoesData) {`;

index = index.replace(oldRenderAcoesFunction, newRenderSaudeAndAcoes);

fs.writeFileSync('index.html', index);
console.log('index.html atualizado com suporte completo a Serviços de Saúde e Modal Detalhado!');
