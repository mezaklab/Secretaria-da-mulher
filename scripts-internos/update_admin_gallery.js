const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf8');

// 1. Add "Galeria de Fotos" section in #modal below "Foto da Capa"
const oldCapaSection = `                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Foto da Capa</label>
                            <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-brand-primary transition-colors cursor-pointer group relative overflow-hidden" onclick="document.getElementById('action-image-input').click()">
                                <input type="file" id="action-image-input" accept="image/*" class="hidden">
                                
                                <!-- Estado Inicial (Ícone) -->
                                <div id="upload-placeholder" class="flex flex-col items-center pointer-events-none p-8">
                                    <i class="fas fa-cloud-upload-alt text-4xl mb-3 text-brand-secondary group-hover:text-brand-primary transition-colors"></i>
                                    <p class="text-sm font-medium text-gray-600">Clique para selecionar ou arraste uma imagem</p>
                                    <p class="text-xs mt-1 text-gray-400">PNG, JPG até 5MB</p>
                                </div>

                                <!-- Estado Preenchido (Preview) -->
                                <div id="upload-preview" class="hidden absolute inset-0 bg-black/5 flex items-center justify-center">
                                    <img id="image-preview" src="" class="w-full h-full object-cover" alt="Preview">
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" id="remove-image-btn" class="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 shadow-lg transform hover:scale-110 transition-all pointer-events-auto">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>`;

const newCapaAndGallerySection = `                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Foto da Capa</label>
                            <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-brand-primary transition-colors cursor-pointer group relative overflow-hidden" onclick="document.getElementById('action-image-input').click()">
                                <input type="file" id="action-image-input" accept="image/*" class="hidden">
                                
                                <!-- Estado Inicial (Ícone) -->
                                <div id="upload-placeholder" class="flex flex-col items-center pointer-events-none p-8">
                                    <i class="fas fa-cloud-upload-alt text-4xl mb-3 text-brand-secondary group-hover:text-brand-primary transition-colors"></i>
                                    <p class="text-sm font-medium text-gray-600">Clique para selecionar ou arraste uma imagem</p>
                                    <p class="text-xs mt-1 text-gray-400">PNG, JPG até 5MB</p>
                                </div>

                                <!-- Estado Preenchido (Preview) -->
                                <div id="upload-preview" class="hidden absolute inset-0 bg-black/5 flex items-center justify-center">
                                    <img id="image-preview" src="" class="w-full h-full object-cover" alt="Preview">
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" id="remove-image-btn" class="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 shadow-lg transform hover:scale-110 transition-all pointer-events-auto">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Galeria de Fotos Adicionais -->
                        <div class="col-span-1 md:col-span-2 mt-2">
                            <div class="flex items-center justify-between mb-1">
                                <label class="block text-sm font-medium text-gray-700">Galeria de Fotos (até 10 fotos adicionais)</label>
                                <span id="gallery-count-badge" class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-brand-primary">0 / 10 fotos</span>
                            </div>
                            
                            <!-- Input & Botão de Selecionar -->
                            <input type="file" id="action-gallery-input" accept="image/*" multiple class="hidden">
                            <div id="gallery-drop-area" class="border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 hover:bg-purple-50/80 hover:border-brand-primary transition-colors cursor-pointer" onclick="document.getElementById('action-gallery-input').click()">
                                <div class="flex items-center gap-3 pointer-events-none">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                                        <i class="fas fa-images"></i>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">Adicionar fotos à galeria desta ação</p>
                                        <p class="text-xs text-gray-400">Selecione uma ou mais fotos (PNG, JPG até 5MB)</p>
                                    </div>
                                </div>
                                <button type="button" class="px-4 py-2 bg-white border border-purple-200 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm pointer-events-none whitespace-nowrap">
                                    <i class="fas fa-plus mr-1"></i> Escolher Fotos
                                </button>
                            </div>

                            <!-- Mensagem de Validação / Erro Amigável -->
                            <div id="gallery-error-msg" class="hidden mt-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                                <i class="fas fa-exclamation-circle text-sm shrink-0"></i>
                                <span id="gallery-error-text"></span>
                            </div>

                            <!-- Grade de Miniaturas / Thumbnails -->
                            <div id="gallery-thumbnails-grid" class="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3"></div>
                        </div>`;

if (admin.includes(oldCapaSection)) {
    admin = admin.replace(oldCapaSection, newCapaAndGallerySection);
    console.log('Markup da Galeria inserido com sucesso!');
} else {
    console.error('Não encontrou oldCapaSection no admin.html');
}

fs.writeFileSync('admin.html', admin);
