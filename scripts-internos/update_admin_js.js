const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf8');

// We want to add the gallery JS logic right along with currentBase64Image:
// Array to store additional gallery photos for the active action
// let currentActionGallery = [];

const oldUploadLogic = `            // Upload de Imagem Preview Logic
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
            }`;

const newUploadLogic = `            // Upload de Imagem Capa & Galeria Preview Logic
            let currentBase64Image = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80';
            let currentActionGallery = []; // Array de Base64 das fotos adicionais (até 10)
            
            const actionImageInput = document.getElementById('action-image-input');
            const uploadPlaceholder = document.getElementById('upload-placeholder');
            const uploadPreview = document.getElementById('upload-preview');
            const imagePreview = document.getElementById('image-preview');
            const removeImageBtn = document.getElementById('remove-image-btn');

            // Galeria
            const actionGalleryInput = document.getElementById('action-gallery-input');
            const galleryThumbnailsGrid = document.getElementById('gallery-thumbnails-grid');
            const galleryCountBadge = document.getElementById('gallery-count-badge');
            const galleryErrorMsg = document.getElementById('gallery-error-msg');
            const galleryErrorText = document.getElementById('gallery-error-text');

            function showGalleryError(msg) {
                if (!galleryErrorMsg || !galleryErrorText) return;
                galleryErrorText.innerText = msg;
                galleryErrorMsg.classList.remove('hidden');
                setTimeout(() => { galleryErrorMsg.classList.add('hidden'); }, 5000);
            }

            function renderGalleryThumbnails() {
                if (!galleryThumbnailsGrid) return;
                galleryThumbnailsGrid.innerHTML = '';
                
                if (galleryCountBadge) {
                    galleryCountBadge.innerText = \`\${currentActionGallery.length} / 10 fotos\`;
                    if (currentActionGallery.length >= 10) {
                        galleryCountBadge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700';
                    } else {
                        galleryCountBadge.className = 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-brand-primary';
                    }
                }

                currentActionGallery.forEach((imgBase64, index) => {
                    const thumb = document.createElement('div');
                    thumb.className = 'relative rounded-xl overflow-hidden aspect-square border border-purple-200 bg-gray-100 group shadow-sm';
                    thumb.innerHTML = \`
                        <img src="\${imgBase64}" class="w-full h-full object-cover" alt="Foto \${index + 1}">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md transform hover:scale-110 active:scale-95 transition-all" onclick="window.removeGalleryPhoto(\${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <span class="absolute bottom-1 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">#\${index + 1}</span>
                    \`;
                    galleryThumbnailsGrid.appendChild(thumb);
                });
            }

            window.removeGalleryPhoto = function(index) {
                currentActionGallery.splice(index, 1);
                renderGalleryThumbnails();
            };

            if(actionImageInput) {
                actionImageInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        if (!file.type.startsWith('image/')) {
                            showGalleryError('O arquivo selecionado para a capa não é uma imagem válida.');
                            return;
                        }
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

            if(actionGalleryInput) {
                actionGalleryInput.addEventListener('change', function(e) {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;

                    const nonImages = files.filter(f => !f.type.startsWith('image/'));
                    if (nonImages.length > 0) {
                        showGalleryError('Um ou mais arquivos selecionados não são imagens válidas.');
                    }

                    const validImages = files.filter(f => f.type.startsWith('image/'));
                    const availableSlots = 10 - currentActionGallery.length;

                    if (validImages.length > availableSlots) {
                        showGalleryError(\`Você só pode adicionar mais \${availableSlots} foto(s). O limite total é de 10 fotos por ação.\`);
                    }

                    const imagesToProcess = validImages.slice(0, availableSlots);
                    if (!imagesToProcess.length) {
                        actionGalleryInput.value = '';
                        return;
                    }

                    let loadedCount = 0;
                    imagesToProcess.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = function(evt) {
                            currentActionGallery.push(evt.target.result);
                            loadedCount++;
                            if (loadedCount === imagesToProcess.length) {
                                renderGalleryThumbnails();
                                actionGalleryInput.value = '';
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                });
            }`;

if (admin.includes(oldUploadLogic)) {
    admin = admin.replace(oldUploadLogic, newUploadLogic);
    console.log('Upload Logic substituído com sucesso!');
} else {
    console.error('Não encontrou oldUploadLogic');
}

fs.writeFileSync('admin.html', admin);
