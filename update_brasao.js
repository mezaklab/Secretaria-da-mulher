const fs = require('fs');

// 1. Atualizar index.html (Navbar e Rodapé)
let index = fs.readFileSync('index.html', 'utf8');

const oldIndexNavbarLogo = `                    <!-- Wordmark -->
                    <a href="#" class="font-display hover:opacity-80 transition-opacity">
                        <div class="flex flex-col leading-none">
                            <span class="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                                Secretaria da Mulher
                            </span>
                            <span class="text-[10px] md:text-xs font-medium text-white/80 tracking-wider uppercase mt-1">
                                Canindé de São Francisco
                            </span>
                        </div>
                    </a>`;

const newIndexNavbarLogo = `                    <!-- Wordmark com Brasão -->
                    <a href="#" class="flex items-center gap-3.5 group hover:opacity-90 transition-opacity" aria-label="Secretaria da Mulher - Canindé de São Francisco">
                        <img 
                            src="/brasao.png" 
                            alt="Brasão de Canindé de São Francisco" 
                            class="h-11 md:h-14 w-auto object-contain shrink-0 filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        <div class="flex flex-col leading-none">
                            <span class="text-lg md:text-2xl font-extrabold text-white tracking-tight font-display">
                                Secretaria da Mulher
                            </span>
                            <span class="text-[10px] md:text-xs font-medium text-white/80 tracking-wider uppercase mt-1">
                                Canindé de São Francisco
                            </span>
                        </div>
                    </a>`;

if (index.includes(oldIndexNavbarLogo)) {
    index = index.replace(oldIndexNavbarLogo, newIndexNavbarLogo);
    console.log('Navbar de index.html atualizada com o brasão!');
} else {
    console.error('Não encontrou oldIndexNavbarLogo');
}

// Atualizar também no rodapé para máxima elegância e consistência institucional
const oldIndexFooterLogo = `                    <div class="flex flex-col leading-none mb-6 font-display">
                        <span class="text-3xl font-extrabold text-white tracking-tight">
                            Secretaria da Mulher
                        </span>
                        <span class="text-sm font-medium text-white/80 tracking-wider uppercase mt-2">
                            Canindé de São Francisco
                        </span>
                    </div>`;

const newIndexFooterLogo = `                    <div class="flex items-center gap-4 mb-6">
                        <img 
                            src="/brasao.png" 
                            alt="Brasão de Canindé de São Francisco" 
                            class="h-14 md:h-16 w-auto object-contain shrink-0 filter drop-shadow-md"
                        />
                        <div class="flex flex-col leading-none font-display">
                            <span class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Secretaria da Mulher
                            </span>
                            <span class="text-xs md:text-sm font-medium text-white/80 tracking-wider uppercase mt-1.5">
                                Canindé de São Francisco
                            </span>
                        </div>
                    </div>`;

if (index.includes(oldIndexFooterLogo)) {
    index = index.replace(oldIndexFooterLogo, newIndexFooterLogo);
    console.log('Rodapé de index.html atualizado com o brasão!');
}

fs.writeFileSync('index.html', index);

// 2. Atualizar admin.html (Sidebar Header)
let admin = fs.readFileSync('admin.html', 'utf8');

const oldAdminSidebarLogo = `        <div class="p-6 border-b border-white/10 flex flex-col items-center text-center">
            <h1 class="font-display font-bold text-2xl tracking-tight leading-tight">Secretaria da Mulher</h1>
            <p class="text-xs uppercase tracking-wider text-white/80 mt-1">Canindé de São Francisco</p>
        </div>`;

const newAdminSidebarLogo = `        <div class="p-6 border-b border-white/10 flex items-center gap-3.5">
            <img 
                src="/brasao.png" 
                alt="Brasão de Canindé de São Francisco" 
                class="h-11 w-auto object-contain shrink-0 filter drop-shadow-md"
            />
            <div class="flex flex-col leading-none text-left">
                <h1 class="font-display font-bold text-xl tracking-tight text-white leading-tight">Secretaria da Mulher</h1>
                <p class="text-[10px] uppercase tracking-wider text-white/80 mt-1">Canindé de São Francisco</p>
            </div>
        </div>`;

if (admin.includes(oldAdminSidebarLogo)) {
    admin = admin.replace(oldAdminSidebarLogo, newAdminSidebarLogo);
    console.log('Sidebar de admin.html atualizada com o brasão!');
    fs.writeFileSync('admin.html', admin);
}

