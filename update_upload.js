const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// The JS block to inject
const uploadLogic = `
            // Upload de Imagem Preview Logic
            let currentBase64Image = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80';
            
            const actionImageInput = document.getElementById('action-image-input');
            const uploadPlaceholder = document.getElementById('upload-placeholder');
            const uploadPreview = document.getElementById('upload-preview');
            const imagePreview = document.getElementById('image-preview');
            const removeImageBtn = document.getElementById('remove-image-btn');

            if(actionImageInput) {
                actionImageInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            currentBase64Image = event.target.result;
                            imagePreview.src = currentBase64Image;
                            uploadPlaceholder.classList.add('hidden');
                            uploadPreview.classList.remove('hidden');
                        }
                        reader.readAsDataURL(file);
                    }
                });

                removeImageBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Previne o clique de abrir a janela de arquivo de novo
                    actionImageInput.value = '';
                    currentBase64Image = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80';
                    uploadPreview.classList.add('hidden');
                    uploadPlaceholder.classList.remove('hidden');
                });
            }
`;

// Insert it inside the DOMContentLoaded block
html = html.replace('// Initialization Render', uploadLogic + '\n            // Initialization Render');

// Update the save block
html = html.replace(
    "adminAcoes.push({ id: Date.now(), category, date, title, description, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' });",
    "adminAcoes.push({ id: Date.now(), category, date, title, description, image: currentBase64Image });"
);
html = html.replace(
    "adminGaleria.push({ id: Date.now()+1, type: 'foto', title, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' });",
    "adminGaleria.push({ id: Date.now()+1, type: 'foto', title, image: currentBase64Image });"
);

// Reset image on save
html = html.replace(
    "modal.classList.add('hidden');",
    "modal.classList.add('hidden'); if(removeImageBtn) removeImageBtn.click();"
);

fs.writeFileSync('admin.html', html);
