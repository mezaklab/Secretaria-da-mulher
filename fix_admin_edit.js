const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Update logic inside the btnEdit click handler for "isGallery" / Acoes
// I need to find the block handling EDITAR

const editBlockRegex = /\/\/ EDITAR[\s\S]*?modal\.classList\.remove\('hidden'\);\n                    \}/;

const newEditBlock = `// EDITAR
                const btnEdit = e.target.closest('.btn-edit');
                if (btnEdit) {
                    const row = btnEdit.closest('tr') || btnEdit.closest('.group');
                    if (!row) return;

                    const id = row.getAttribute('data-id');
                    const isAgenda = row.closest('#agenda') !== null;
                    const isGallery = row.tagName.toLowerCase() !== 'tr';

                    if (isAgenda) {
                        const item = adminAgenda.find(i => i.id == id);
                        if(!item) return;
                        
                        document.getElementById('edit-id-agenda').value = id;
                        const modal = document.getElementById('modal-agenda');
                        modal.querySelectorAll('input')[0].value = item.title;
                        modal.querySelectorAll('input')[1].value = ''; // A data original não era armazenada no formato YYYY-MM-DD
                        modal.querySelectorAll('input')[2].value = item.time;
                        modal.querySelectorAll('input')[3].value = item.location;
                        
                        const select = modal.querySelector('select');
                        Array.from(select.options).forEach(opt => {
                            if (opt.text.toLowerCase() === item.status.toLowerCase()) opt.selected = true;
                        });

                        modal.querySelector('h3').innerText = "Editar Evento na Agenda";
                        modal.classList.remove('hidden');

                    } else {
                        const item = isGallery ? adminGaleria.find(i => i.id == id) : adminAcoes.find(i => i.id == id);
                        if(!item) return;

                        document.getElementById('edit-id-acoes').value = id;
                        const modal = document.getElementById('modal');
                        
                        // Populando os campos
                        modal.querySelectorAll('input')[0].value = item.title || item.titulo || '';
                        
                        // Tentando preencher a categoria
                        const select = modal.querySelector('select');
                        if (select && (item.category || item.categoria)) {
                            Array.from(select.options).forEach(opt => {
                                if (opt.text.toLowerCase() === (item.category || item.categoria).toLowerCase()) opt.selected = true;
                            });
                        }
                        
                        // Tentando preencher descrição
                        if (item.description || item.descricao) {
                            modal.querySelector('textarea').value = item.description || item.descricao;
                        }

                        // Preservando e exibindo a imagem atual do item
                        if (item.image || item.imagem) {
                            currentBase64Image = item.image || item.imagem;
                            if (imagePreview) {
                                imagePreview.src = currentBase64Image;
                                if(uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
                                if(uploadPreview) uploadPreview.classList.remove('hidden');
                            }
                        }

                        modal.querySelector('h3').innerText = "Editar Ação";
                        modal.classList.remove('hidden');
                    }`;

html = html.replace(editBlockRegex, newEditBlock);

// Update Save Logic
const saveBlockRegex = /if\(btn\.innerText\.includes\('Salvar e Publicar'\)\) \{[\s\S]*?modal\.classList\.add\('hidden'\);\n                    \}\);/;

const newSaveBlock = `if(btn.innerText.includes('Salvar e Publicar')) {
                    btn.addEventListener('click', () => {
                        const modal = document.getElementById('modal');
                        const title = modal.querySelectorAll('input')[0].value;
                        const category = modal.querySelector('select').value;
                        const description = modal.querySelector('textarea').value;
                        const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.','');
                        
                        const editId = document.getElementById('edit-id-acoes').value;
                        const isPlaceholder = currentBase64Image.includes('unsplash.com');
                        
                        let finalImage = currentBase64Image;

                        if (editId) {
                            const acaoIndex = adminAcoes.findIndex(item => item.id == editId);
                            if (acaoIndex > -1) {
                                const oldImage = adminAcoes[acaoIndex].image;
                                finalImage = (isPlaceholder && oldImage) ? oldImage : currentBase64Image;
                                adminAcoes[acaoIndex] = { ...adminAcoes[acaoIndex], category, date, title, description, image: finalImage };
                            }
                            
                            const galIndex = adminGaleria.findIndex(item => item.id == editId || item.title === title);
                            if (galIndex > -1) {
                                const oldImage = adminGaleria[galIndex].image;
                                finalImage = (isPlaceholder && oldImage) ? oldImage : currentBase64Image;
                                adminGaleria[galIndex] = { ...adminGaleria[galIndex], title, description, category, image: finalImage };
                            }
                        } else {
                            finalImage = isPlaceholder ? 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' : currentBase64Image;
                            const newId = Date.now();
                            adminAcoes.unshift({ id: newId, category, date, title, description, image: finalImage });
                            adminGaleria.unshift({ id: newId, type: 'foto', title, description, category, image: finalImage });
                        }

                        localStorage.setItem('sec_mulher_acoes', JSON.stringify(adminAcoes));
                        localStorage.setItem('sec_mulher_galeria', JSON.stringify(adminGaleria));
                        
                        renderAdminAcoes();
                        renderAdminGaleria();
                        modal.classList.add('hidden');
                        if(removeImageBtn) removeImageBtn.click(); // Reseta o estado do uploader
                    });`;

html = html.replace(saveBlockRegex, newSaveBlock);

// Limpar o upload ao clicar em "Nova Ação" ou "Novo Evento"
// The user clicks on buttons to open the modal, we already injected something to clear edit-id.
// Let's also clear the preview image.
html = html.replace(
    /onclick="document.getElementById\('modal'\).classList.remove\('hidden'\); document.getElementById\('edit-id-acoes'\).value=''; document.getElementById\('modal'\).querySelector\('h3'\).innerText='Cadastrar Nova Ação';"/g,
    `onclick="document.getElementById('modal').classList.remove('hidden'); document.getElementById('edit-id-acoes').value=''; document.getElementById('modal').querySelector('h3').innerText='Cadastrar Nova Ação'; if(typeof removeImageBtn !== 'undefined' && removeImageBtn) removeImageBtn.click();"`
);

fs.writeFileSync('admin.html', html);
