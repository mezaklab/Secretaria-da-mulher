const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf8');

// Definição dos dados padrões de Serviços de Saúde
const oldDefaults = `            // Puxar do LocalStorage
            let adminAcoes = JSON.parse(localStorage.getItem('sec_mulher_acoes')) || defaultAcoes;
            let adminGaleria = JSON.parse(localStorage.getItem('sec_mulher_galeria')) || defaultGaleria;
            let adminAgenda = JSON.parse(localStorage.getItem('sec_mulher_agenda')) || defaultAgenda;`;

const newDefaults = `            // Dados Padrão de Serviços de Saúde
            const defaultServicosSaude = [
                {
                    id: 1,
                    titulo: 'Seu preventivo',
                    icone: 'fa-droplet',
                    descricaoCurta: 'Sem espera, sem burocracia. Disponível em todas as UBS do município com entrega rápida do resultado.',
                    descricaoCompleta: 'O exame citopatológico (preventivo ou Papanicolau) é a principal estratégia para detectar precocemente lesões no colo do útero antes que se tornem câncer. Em Canindé de São Francisco, o atendimento é humanizado, sem filas e com profissionais capacitados para oferecer o melhor acolhimento.',
                    local: 'Todas as Unidades Básicas de Saúde (UBS) de Canindé de São Francisco',
                    horario: 'Segunda a Sexta, das 08h às 13h (Campanhas noturnas até 21h)',
                    publico: 'Mulheres de 25 a 64 anos ou que já iniciaram a vida sexual',
                    documentos: 'Cartão do SUS, RG e Comprovante de Residência',
                    imagem: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80'
                },
                {
                    id: 2,
                    titulo: 'Proteção HPV',
                    icone: 'fa-shield-virus',
                    descricaoCurta: 'Vacinação de rotina para adolescentes e público-alvo nas unidades de saúde. A principal proteção começa cedo.',
                    descricaoCompleta: 'A vacina contra o Papilomavírus Humano (HPV) previne contra os tipos de vírus responsáveis por mais de 70% dos casos de câncer de colo de útero. A imunização é segura, altamente eficaz e gratuita nas salas de vacina do município.',
                    local: 'Salas de Vacina de todas as UBSs do município',
                    horario: 'Segunda a Sexta, das 08h às 13h',
                    publico: 'Meninas e meninos de 9 a 14 anos, e imunossuprimidos até 45 anos',
                    documentos: 'Caderneta de Vacinação, Cartão do SUS e Documento com foto',
                    imagem: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80'
                },
                {
                    id: 3,
                    titulo: 'Horário noturno',
                    icone: 'fa-moon',
                    descricaoCurta: 'Trabalha o dia todo? Nossas equipes estarão a postos após as 18h em postos estratégicos da campanha.',
                    descricaoCompleta: 'Para garantir que nenhuma trabalhadora, autônoma ou estudante fique sem atendimento preventivo, a Secretaria da Mulher em parceria com a Secretaria de Saúde disponibiliza plantões noturnos com exames preventivos, vacinação, testes rápidos e acolhimento psicológico.',
                    local: 'UBS Sede e Postos Estratégicos Itinerantes',
                    horario: 'Plantões especiais das 18h às 21h (consulte cronograma da Agenda)',
                    publico: 'Trabalhadoras e mulheres que não podem comparecer em horário comercial',
                    documentos: 'Documento oficial com foto e Cartão do SUS',
                    imagem: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80'
                }
            ];

            // Puxar do LocalStorage
            let adminAcoes = JSON.parse(localStorage.getItem('sec_mulher_acoes')) || defaultAcoes;
            let adminGaleria = JSON.parse(localStorage.getItem('sec_mulher_galeria')) || defaultGaleria;
            let adminAgenda = JSON.parse(localStorage.getItem('sec_mulher_agenda')) || defaultAgenda;
            let adminServicosSaude = JSON.parse(localStorage.getItem('sec_mulher_saude')) || defaultServicosSaude;`;

admin = admin.replace(oldDefaults, newDefaults);

// Adicionar a função renderAdminSaude
const oldRenderAgenda = `            function renderAdminAgenda() {`;

const newRenderSaudeAndAgenda = `            function renderAdminSaude() {
                const tbody = document.querySelector('#servicos-saude tbody');
                if(!tbody) return;
                tbody.innerHTML = '';
                adminServicosSaude.forEach(item => {
                    tbody.innerHTML += \`
                        <tr class="hover:bg-gray-50/50 transition-colors group" data-id="\${item.id}">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center text-lg shrink-0">
                                        <i class="fas \${item.icone || 'fa-heartbeat'}"></i>
                                    </div>
                                    <div>
                                        <p class="font-bold text-gray-800">\${item.titulo}</p>
                                        <p class="text-xs text-purple-600">\${item.icone || 'fa-heartbeat'}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-600 max-w-xs">
                                <p class="line-clamp-2 text-xs">\${item.descricaoCurta}</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500 text-xs">
                                <p class="font-semibold text-gray-700">\${item.local || 'Todas as UBSs'}</p>
                                <p class="text-gray-400">\${item.horario || 'Seg a Sex'}</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500 text-xs">
                                <span class="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">\${item.publico || 'Geral'}</span>
                            </td>
                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                <button title="Editar" class="btn-edit-saude text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all" onclick="editSaudeItem(\${item.id})"><i class="fas fa-edit"></i></button>
                                <button title="Excluir" class="btn-delete-saude text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all" onclick="deleteSaudeItem(\${item.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>\`;
                });
            }

            function renderAdminAgenda() {`;

admin = admin.replace(oldRenderAgenda, newRenderSaudeAndAgenda);

// Adicionar renderAdminSaude() na inicialização
admin = admin.replace('renderAdminAgenda();', 'renderAdminAgenda();\n            renderAdminSaude();');

// Adicionar lógica de imagem de Saúde, Modal e CRUD
const oldDeleteFunc = `            // Make global functions so standard click handlers work (overriding previous DOM events)
            window.deleteItem = function(id, type) {`;

const newSaudeLogic = `            // Variável para imagem do serviço de saúde
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
                    localStorage.setItem('sec_mulher_saude', JSON.stringify(adminServicosSaude));
                    renderAdminSaude();
                }
            };

            // Salvar Serviço de Saúde
            const btnSalvarSaude = document.getElementById('btn-salvar-saude');
            if (btnSalvarSaude) {
                btnSalvarSaude.addEventListener('click', function() {
                    const titulo = document.getElementById('input-saude-titulo').value.trim();
                    const descCurta = document.getElementById('input-saude-descricao-curta').value.trim();
                    const descCompleta = document.getElementById('input-saude-descricao-completa').value.trim();

                    if (!titulo || !descCurta || !descCompleta) {
                        alert('Por favor, preencha os campos obrigatórios: Título, Descrição Curta e Descrição Completa.');
                        return;
                    }

                    const editId = document.getElementById('edit-id-saude').value;
                    const icone = document.getElementById('input-saude-icone').value;
                    const local = document.getElementById('input-saude-local').value.trim();
                    const horario = document.getElementById('input-saude-horario').value.trim();
                    const publico = document.getElementById('input-saude-publico').value.trim();
                    const documentos = document.getElementById('input-saude-documentos').value.trim();

                    if (editId) {
                        const index = adminServicosSaude.findIndex(i => i.id == editId);
                        if (index > -1) {
                            adminServicosSaude[index] = {
                                ...adminServicosSaude[index],
                                titulo,
                                icone,
                                descricaoCurta: descCurta,
                                descricaoCompleta: descCompleta,
                                local,
                                horario,
                                publico,
                                documentos,
                                imagem: currentSaudeImage
                            };
                        }
                    } else {
                        adminServicosSaude.unshift({
                            id: Date.now(),
                            titulo,
                            icone,
                            descricaoCurta: descCurta,
                            descricaoCompleta: descCompleta,
                            local,
                            horario,
                            publico,
                            documentos,
                            imagem: currentSaudeImage
                        });
                    }

                    localStorage.setItem('sec_mulher_saude', JSON.stringify(adminServicosSaude));
                    renderAdminSaude();
                    document.getElementById('modal-saude').classList.add('hidden');
                });
            }

            // Make global functions so standard click handlers work (overriding previous DOM events)
            window.deleteItem = function(id, type) {`;

admin = admin.replace(oldDeleteFunc, newSaudeLogic);

fs.writeFileSync('admin.html', admin);
console.log('JS de Saúde no admin integrado com sucesso!');
