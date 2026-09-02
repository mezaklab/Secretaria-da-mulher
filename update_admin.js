// Script to inject robust CRUD logic into admin.html
const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf8');

const cmsLogic = `
            // ==========================================
            // CMS LOCALSTORAGE LOGIC (Sincronização)
            // ==========================================
            
            // Dados Padrões
            const defaultAcoes = [
                { id: 1, category: 'Saúde e Bem-estar', date: '24 Out 2024', title: 'Palestra sobre prevenção e cuidados', description: 'Uma tarde dedicada a orientações preventivas com especialistas, focando na saúde integral da mulher.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' },
                { id: 2, category: 'Apoio Jurídico', date: '15 Out 2024', title: 'Mutirão de Documentação', description: 'Ação para emissão gratuita de documentos e orientação legal para mulheres da comunidade rural.', image: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80' }
            ];
            
            const defaultGaleria = [
                { id: 1, type: 'foto', title: 'Ação na Comunidade', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' }
            ];

            const defaultAgenda = [
                { id: 1, date: '20', month: 'Out', title: 'Mutirão de saúde e acolhimento', time: '08h - 13h', location: 'Clube Altemar Dutra', status: 'Realizado' }
            ];

            // Puxar do LocalStorage
            let adminAcoes = JSON.parse(localStorage.getItem('sec_mulher_acoes')) || defaultAcoes;
            let adminGaleria = JSON.parse(localStorage.getItem('sec_mulher_galeria')) || defaultGaleria;
            let adminAgenda = JSON.parse(localStorage.getItem('sec_mulher_agenda')) || defaultAgenda;

            // Renderizar Tabelas
            function renderAdminAcoes() {
                const tbody = document.querySelector('#visao-geral tbody');
                if(!tbody) return;
                tbody.innerHTML = '';
                adminAcoes.forEach(item => {
                    tbody.innerHTML += \`
                        <tr class="hover:bg-gray-50/50 transition-colors group" data-id="\${item.id}">
                            <td class="px-6 py-4 font-medium text-gray-800">\${item.title}</td>
                            <td class="px-6 py-4"><span class="px-3 py-1 bg-purple-100 text-brand-primary text-xs font-bold rounded-full">\${item.category}</span></td>
                            <td class="px-6 py-4 text-gray-500">\${item.date}</td>
                            <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Publicado</span></td>
                            <td class="px-6 py-4 text-right">
                                <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>\`;
                });
            }

            function renderAdminGaleria() {
                const container = document.querySelector('#acoes-fotos .grid');
                if(!container) return;
                container.innerHTML = '';
                adminGaleria.forEach(item => {
                    container.innerHTML += \`
                        <div class="border border-gray-200 rounded-xl overflow-hidden group relative" data-id="\${item.id}">
                            <div class="h-40 bg-gray-200 relative">
                                <img src="\${item.image}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button title="Editar" class="btn-edit w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-brand-primary cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                    <button title="Excluir" class="btn-delete w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="p-4">
                                <h4 class="font-bold text-gray-800 mb-1">\${item.title}</h4>
                                <p class="text-xs text-gray-500">\${item.type === 'video' ? 'Vídeo' : 'Foto'}</p>
                            </div>
                        </div>\`;
                });
            }

            function renderAdminAgenda() {
                const tbody = document.querySelector('#agenda tbody');
                if(!tbody) return;
                tbody.innerHTML = '';
                adminAgenda.forEach(item => {
                    let color = item.status === 'Realizado' ? 'bg-green-100 text-green-700' : (item.status === 'Confirmado' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700');
                    tbody.innerHTML += \`
                        <tr class="hover:bg-gray-50/50 transition-colors group" data-id="\${item.id}">
                            <td class="px-6 py-4 font-bold text-brand-primary">\${item.date} \${item.month}</td>
                            <td class="px-6 py-4 font-medium text-gray-800">\${item.title}</td>
                            <td class="px-6 py-4 text-gray-500">\${item.time}</td>
                            <td class="px-6 py-4 text-gray-500">\${item.location}</td>
                            <td class="px-6 py-4"><span class="px-3 py-1 \${color} text-xs font-bold rounded-full">\${item.status}</span></td>
                            <td class="px-6 py-4 text-right">
                                <button title="Editar" class="btn-edit text-brand-secondary hover:text-brand-primary mr-3 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-edit"></i></button>
                                <button title="Excluir" class="btn-delete text-red-400 hover:text-red-600 p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>\`;
                });
            }

            // Initialization Render
            renderAdminAcoes();
            renderAdminGaleria();
            renderAdminAgenda();

            // Intercepting Saves
            document.querySelectorAll('button').forEach(btn => {
                if(btn.innerText.includes('Salvar Evento')) {
                    btn.addEventListener('click', () => {
                        const modal = document.getElementById('modal-agenda');
                        const title = modal.querySelectorAll('input')[0].value;
                        const dateVal = modal.querySelectorAll('input')[1].value; // yyyy-mm-dd
                        const time = modal.querySelectorAll('input')[2].value;
                        const location = modal.querySelectorAll('input')[3].value;
                        const status = modal.querySelector('select').value;
                        
                        let date = "20", month = "Out";
                        if(dateVal) {
                            const d = new Date(dateVal);
                            date = String(d.getDate()).padStart(2, '0');
                            const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                            month = months[d.getMonth()];
                        }

                        adminAgenda.push({ id: Date.now(), date, month, title, time, location, status });
                        localStorage.setItem('sec_mulher_agenda', JSON.stringify(adminAgenda));
                        renderAdminAgenda();
                        modal.classList.add('hidden');
                    });
                }
                
                if(btn.innerText.includes('Salvar e Publicar')) {
                    btn.addEventListener('click', () => {
                        const modal = document.getElementById('modal');
                        const title = modal.querySelectorAll('input')[0].value;
                        const category = modal.querySelector('select').value;
                        const description = modal.querySelector('textarea').value;
                        const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.','');
                        
                        adminAcoes.push({ id: Date.now(), category, date, title, description, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' });
                        localStorage.setItem('sec_mulher_acoes', JSON.stringify(adminAcoes));
                        
                        adminGaleria.push({ id: Date.now()+1, type: 'foto', title, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' });
                        localStorage.setItem('sec_mulher_galeria', JSON.stringify(adminGaleria));
                        
                        renderAdminAcoes();
                        renderAdminGaleria();
                        modal.classList.add('hidden');
                    });
                }
                
                if(btn.innerText.includes('Salvar Alterações')) {
                    btn.addEventListener('click', () => {
                        alert('Configurações salvas com sucesso no localStorage!');
                    });
                }
            });

            // Make global functions so standard click handlers work (overriding previous DOM events)
            window.deleteItem = function(id, type) {
                if(type === 'acoes') {
                    adminAcoes = adminAcoes.filter(i => i.id != id);
                    localStorage.setItem('sec_mulher_acoes', JSON.stringify(adminAcoes));
                    renderAdminAcoes();
                } else if(type === 'galeria') {
                    adminGaleria = adminGaleria.filter(i => i.id != id);
                    localStorage.setItem('sec_mulher_galeria', JSON.stringify(adminGaleria));
                    renderAdminGaleria();
                } else if(type === 'agenda') {
                    adminAgenda = adminAgenda.filter(i => i.id != id);
                    localStorage.setItem('sec_mulher_agenda', JSON.stringify(adminAgenda));
                    renderAdminAgenda();
                }
            }
`;

// Insert the CMS logic right before closing }); in the existing script
adminHtml = adminHtml.replace('// --- LÓGICA DE AÇÕES (EDITAR / EXCLUIR) ---', cmsLogic + '\n            // --- LÓGICA DE AÇÕES (EDITAR / EXCLUIR) ---');

// Adjust the existing delete handler to use window.deleteItem
adminHtml = adminHtml.replace(
    'setTimeout(() => row.remove(), 400);',
    `setTimeout(() => {
                                const id = row.getAttribute('data-id');
                                if (isAgenda) window.deleteItem(id, 'agenda');
                                else if (isGallery) window.deleteItem(id, 'galeria');
                                else window.deleteItem(id, 'acoes');
                            }, 400);`
);

fs.writeFileSync('admin.html', adminHtml);
