const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// GALERIA HTML FALLBACK
const galeriaFallback = `<div id="galeria-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
  <!-- Item 1: Vídeo Depoimento -->
  <div class="relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 group cursor-pointer shadow-sm" onclick="openMediaModal({titulo: 'Depoimento: Dona Maria', descricao: 'Relato emocionante sobre o acolhimento recebido na secretaria.', imagem: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80', categoria: 'Vídeo'})">
    <img src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&q=80" alt="Depoimento" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90">
    <div class="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-black/20 flex flex-col justify-between p-4">
      <div class="self-center my-auto w-12 h-12 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <svg class="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div class="flex items-center justify-between text-white text-xs font-semibold">
        <span>Depoimento: Dona Maria</span>
        <span class="bg-black/40 px-2 py-0.5 rounded-full">02:15</span>
      </div>
    </div>
  </div>

  <!-- Item 2: Foto Caminhada -->
  <div class="relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 group cursor-pointer shadow-sm" onclick="openMediaModal({titulo: 'Caminhada de abertura', descricao: 'Mobilização nas ruas de Canindé reunindo dezenas de mulheres.', imagem: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80', categoria: 'Foto'})">
    <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80" alt="Caminhada" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90">
    <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow">
      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 9a3 3 0 100 6 3 3 0 000-6zm0-2a5 5 0 110 10 5 5 0 010-10zm7.5-3H17l-1.5-2h-7L7 4H4.5A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0019.5 4z"/></svg>
    </div>
    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-950/80 to-transparent p-4 text-white text-xs font-semibold">
      Caminhada de abertura
    </div>
  </div>

  <!-- Item 3: Vídeo Preventivo -->
  <div class="relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 group cursor-pointer shadow-sm" onclick="openMediaModal({titulo: 'Como é o preventivo?', descricao: 'Explicativo com a equipe médica desmistificando o exame.', imagem: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', categoria: 'Vídeo'})">
    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Preventivo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90">
    <div class="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-black/20 flex flex-col justify-between p-4">
      <div class="self-center my-auto w-12 h-12 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <svg class="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div class="flex items-center justify-between text-white text-xs font-semibold">
        <span>Como é o preventivo?</span>
        <span class="bg-black/40 px-2 py-0.5 rounded-full">05:30</span>
      </div>
    </div>
  </div>

  <!-- Item 4: Nossas Oficinas -->
  <div class="relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 group cursor-pointer shadow-sm flex items-end p-4" onclick="openMediaModal({titulo: 'Nossas oficinas', descricao: 'Capacitação prática em artesanato e empreendedorismo local.', imagem: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80', categoria: 'Foto'})">
    <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80" alt="Nossas Oficinas" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90">
    <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow z-10">
      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 9a3 3 0 100 6 3 3 0 000-6zm0-2a5 5 0 110 10 5 5 0 010-10zm7.5-3H17l-1.5-2h-7L7 4H4.5A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0019.5 4z"/></svg>
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-purple-950/70 to-transparent"></div>
    <span class="relative z-10 text-white text-xs font-semibold">Nossas oficinas</span>
  </div>
</div>`;

const galeriaRegex = /<div id="carousel-galeria"[\s\S]*?<!-- Galeria items injetados via JS -->\n        <\/div>/;
html = html.replace(galeriaRegex, galeriaFallback);


// AGENDA HTML FALLBACK
const agendaFallback = `<div id="agenda-container" class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row p-6 md:p-8 bg-white border border-brand-cardBorder rounded-[2rem] gap-6 items-center md:items-start text-center md:text-left shadow-sm hover:shadow-md transition-shadow">
                <div class="shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-brand-iconBg rounded-2xl text-brand-primary shadow-sm border border-brand-cardBorder">
                    <span class="font-display text-4xl leading-none">20</span>
                    <span class="font-display text-lg font-bold">Out</span>
                </div>
                <div class="flex-grow flex flex-col justify-center">
                    <h4 class="font-display text-2xl text-brand-textDark mb-3">Mutirão de saúde e acolhimento</h4>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <span class="inline-flex items-center text-base font-sans font-bold bg-brand-iconBg text-brand-primary px-4 py-2 rounded-full border border-brand-cardBorder">
                            <i class="fas fa-clock mr-2 text-brand-secondary"></i> 08h - 13h
                        </span>
                        <span class="inline-flex items-center text-base font-sans font-bold bg-brand-iconBg text-brand-primary px-4 py-2 rounded-full border border-brand-cardBorder">
                            <i class="fas fa-map-marker-alt mr-2 text-brand-secondary"></i> Clube Altemar Dutra
                        </span>
                    </div>
                </div>
                <div class="flex flex-col justify-center">
                    <span class="inline-block px-5 py-2.5 bg-green-100 text-green-700 rounded-full font-bold text-sm tracking-wide border border-green-200">
                        Realizado
                    </span>
                </div>
            </div>
            
            <div class="flex flex-col md:flex-row p-6 md:p-8 bg-white border border-brand-cardBorder rounded-[2rem] gap-6 items-center md:items-start text-center md:text-left shadow-sm hover:shadow-md transition-shadow">
                <div class="shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-brand-iconBg rounded-2xl text-brand-primary shadow-sm border border-brand-cardBorder">
                    <span class="font-display text-4xl leading-none">22</span>
                    <span class="font-display text-lg font-bold">Out</span>
                </div>
                <div class="flex-grow flex flex-col justify-center">
                    <h4 class="font-display text-2xl text-brand-textDark mb-3">Roda de conversa sobre direitos</h4>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <span class="inline-flex items-center text-base font-sans font-bold bg-brand-iconBg text-brand-primary px-4 py-2 rounded-full border border-brand-cardBorder">
                            <i class="fas fa-clock mr-2 text-brand-secondary"></i> 18h - 21h
                        </span>
                        <span class="inline-flex items-center text-base font-sans font-bold bg-brand-iconBg text-brand-primary px-4 py-2 rounded-full border border-brand-cardBorder">
                            <i class="fas fa-map-marker-alt mr-2 text-brand-secondary"></i> Assentamento Cuiabá
                        </span>
                    </div>
                </div>
                <div class="flex flex-col justify-center">
                    <span class="inline-block px-5 py-2.5 bg-blue-100 text-blue-700 rounded-full font-bold text-sm tracking-wide border border-blue-200">
                        Confirmado
                    </span>
                </div>
            </div>
        </div>`;

const agendaRegex = /<div id="agenda-container" class="flex flex-col gap-6">[\s\S]*?<!-- Injetado via JS -->\n        <\/div>/;
html = html.replace(agendaRegex, agendaFallback);


// REPLACE renderGaleria
const oldRenderGaleriaRegex = /function renderGaleria\(galeriaData\) \{[\s\S]*?carouselGaleria\.appendChild\(el\);\n            \}\);\n        \}/;

const newRenderGaleria = `function renderGaleria(galeriaData) {
            const container = document.getElementById('galeria-container') || document.getElementById('carousel-galeria');
            if(!container) return;
            if(!galeriaData || galeriaData.length === 0) return; // MANTÉM OS CARDS PADRÃO SE VAZIO

            container.innerHTML = '';
            container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8';

            galeriaData.forEach(item => {
                const el = document.createElement('div');
                const isVideo = item.type === 'video';
                
                const imgStr = (item.image || '').replace(/'/g, "\\\\'");
                const titleStr = (item.title || '').replace(/'/g, "\\\\'");
                const descStr = (item.description || item.descricao || "Registro das ações da Secretaria da Mulher").replace(/'/g, "\\\\'");
                const duration = item.duration || '00:00';
                const catStr = item.category || item.categoria || (isVideo ? 'Vídeo' : 'Foto');
                
                el.className = "relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 group cursor-pointer shadow-sm";
                el.onclick = () => openMediaModal({ titulo: titleStr, descricao: descStr, imagem: imgStr, categoria: catStr });
                
                el.innerHTML = \`
                    <img src="\${item.image}" alt="\${titleStr}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90">
                    \${isVideo ? \`
                    <div class="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-black/20 flex flex-col justify-between p-4 pointer-events-none">
                        <div class="self-center my-auto w-12 h-12 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg class="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <div class="flex items-center justify-between text-white text-xs font-semibold">
                            <span>\${titleStr}</span>
                            <span class="bg-black/40 px-2 py-0.5 rounded-full">\${duration}</span>
                        </div>
                    </div>\` : \`
                    <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow pointer-events-none">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 9a3 3 0 100 6 3 3 0 000-6zm0-2a5 5 0 110 10 5 5 0 010-10zm7.5-3H17l-1.5-2h-7L7 4H4.5A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0019.5 4z"/></svg>
                    </div>
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-950/80 to-transparent p-4 text-white text-xs font-semibold pointer-events-none">
                        \${titleStr}
                    </div>\`}
                \`;
                container.appendChild(el);
            });
        }`;

html = html.replace(oldRenderGaleriaRegex, newRenderGaleria);

// REPLACE renderAgenda
const oldRenderAgendaRegex = /function renderAgenda\(agendaData\) \{[\s\S]*?agendaContainer\.appendChild\(el\);\n            \}\);\n        \}/;

const newRenderAgenda = `function renderAgenda(agendaData) {
            const agendaContainer = document.getElementById('agenda-container');
            if(!agendaContainer) return;
            if(!agendaData || agendaData.length === 0) return; // MANTÉM OS CARDS PADRÃO SE VAZIO

            agendaContainer.innerHTML = '';
            
            agendaData.forEach(item => {
                const el = document.createElement('div');
                el.className = 'flex flex-col md:flex-row p-6 md:p-8 bg-white border border-brand-cardBorder rounded-[2rem] gap-6 items-center md:items-start text-center md:text-left shadow-sm hover:shadow-md transition-shadow';
                let colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
                if(item.status === 'Realizado') colorClass = 'bg-green-100 text-green-700 border-green-200';
                if(item.status === 'Confirmado') colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
                
                el.innerHTML = \`
                    <div class="shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-brand-iconBg rounded-2xl text-brand-primary shadow-sm border border-brand-cardBorder">
                        <span class="font-display text-4xl leading-none">\${item.date || ''}</span>
                        <span class="font-display text-lg font-bold">\${item.month || ''}</span>
                    </div>
                    <div class="flex-grow flex flex-col justify-center">
                        <h4 class="font-display text-2xl text-brand-textDark mb-3">\${item.title}</h4>
                        <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <span class="inline-flex items-center text-base font-sans font-bold bg-brand-iconBg text-brand-primary px-4 py-2 rounded-full border border-brand-cardBorder">
                                <i class="fas fa-clock mr-2 text-brand-secondary"></i> \${item.time || ''}
                            </span>
                            <span class="inline-flex items-center text-base font-sans font-bold bg-brand-iconBg text-brand-primary px-4 py-2 rounded-full border border-brand-cardBorder">
                                <i class="fas fa-map-marker-alt mr-2 text-brand-secondary"></i> \${item.location || ''}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center">
                        <span class="inline-block px-5 py-2.5 rounded-full font-bold text-sm tracking-wide border \${colorClass}">
                            \${item.status || 'Pendente'}
                        </span>
                    </div>
                \`;
                agendaContainer.appendChild(el);
            });
        }`;

html = html.replace(oldRenderAgendaRegex, newRenderAgenda);

fs.writeFileSync('index.html', html);
