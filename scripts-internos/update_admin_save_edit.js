const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf8');

// 1. Update Save button handler for Ações
// Make sure finalGaleria is saved into adminAcoes
const oldSaveAcoes = `                        if (editId) {
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
                        }`;

const newSaveAcoes = `                        if (editId) {
                            const acaoIndex = adminAcoes.findIndex(item => item.id == editId);
                            if (acaoIndex > -1) {
                                const oldImage = adminAcoes[acaoIndex].image || adminAcoes[acaoIndex].imagem || adminAcoes[acaoIndex].fotoCapa;
                                finalImage = (isPlaceholder && oldImage) ? oldImage : currentBase64Image;
                                adminAcoes[acaoIndex] = { 
                                    ...adminAcoes[acaoIndex], 
                                    category, 
                                    date, 
                                    title, 
                                    description, 
                                    image: finalImage,
                                    fotoCapa: finalImage,
                                    galeria: [...currentActionGallery]
                                };
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
                            adminAcoes.unshift({ 
                                id: newId, 
                                category, 
                                date, 
                                title, 
                                description, 
                                image: finalImage,
                                fotoCapa: finalImage,
                                galeria: [...currentActionGallery]
                            });
                            adminGaleria.unshift({ id: newId, type: 'foto', title, description, category, image: finalImage });
                        }`;

if (admin.includes(oldSaveAcoes)) {
    admin = admin.replace(oldSaveAcoes, newSaveAcoes);
    console.log('Save Ações atualizado com galeria!');
} else {
    console.error('Não encontrou oldSaveAcoes');
}

// 2. Update reset modal on save
const oldResetOnSave = `                        modal.classList.add('hidden');
                        if(removeImageBtn) removeImageBtn.click(); // Reseta o estado do uploader`;

const newResetOnSave = `                        modal.classList.add('hidden');
                        if(removeImageBtn) removeImageBtn.click(); // Reseta o estado do uploader
                        currentActionGallery = [];
                        renderGalleryThumbnails();`;

if (admin.includes(oldResetOnSave)) {
    admin = admin.replace(oldResetOnSave, newResetOnSave);
    console.log('Reset on save atualizado!');
} else {
    console.error('Não encontrou oldResetOnSave');
}

// 3. Update Edit button handler for Ações to load existing item.galeria
const oldEditItem = `                        // Preservando e exibindo a imagem atual do item
                        if (item.image || item.imagem) {
                            currentBase64Image = item.image || item.imagem;
                            if (imagePreview) {
                                imagePreview.src = currentBase64Image;
                                if(uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
                                if(uploadPreview) uploadPreview.classList.remove('hidden');
                            }
                        }

                        modal.querySelector('h3').innerText = "Editar Ação";
                        modal.classList.remove('hidden');`;

const newEditItem = `                        // Preservando e exibindo a imagem atual do item
                        const itemCapa = item.fotoCapa || item.image || item.imagem;
                        if (itemCapa) {
                            currentBase64Image = itemCapa;
                            if (imagePreview) {
                                imagePreview.src = currentBase64Image;
                                if(uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
                                if(uploadPreview) uploadPreview.classList.remove('hidden');
                            }
                        }

                        // Carregar galeria de fotos existente
                        currentActionGallery = Array.isArray(item.galeria) ? [...item.galeria] : [];
                        renderGalleryThumbnails();

                        modal.querySelector('h3').innerText = "Editar Ação";
                        modal.classList.remove('hidden');`;

if (admin.includes(oldEditItem)) {
    admin = admin.replace(oldEditItem, newEditItem);
    console.log('Edit item atualizado com galeria!');
} else {
    console.error('Não encontrou oldEditItem');
}

// 4. Update "Nova Foto / Ação" button reset to clear currentActionGallery
admin = admin.replace(
    /if\(typeof removeImageBtn !== 'undefined' && removeImageBtn\) removeImageBtn\.click\(\);/g,
    "if(typeof removeImageBtn !== 'undefined' && removeImageBtn) removeImageBtn.click(); currentActionGallery = []; if(typeof renderGalleryThumbnails === 'function') renderGalleryThumbnails();"
);

fs.writeFileSync('admin.html', admin);
