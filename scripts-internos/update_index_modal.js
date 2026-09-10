const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update openModal to openMediaModal with object
html = html.replace(
    /function openModal\(imgSrc, title, desc\) \{[\s\S]*?body\.classList\.add\('modal-active'\);\n        \}/,
    `function openMediaModal(data) {
            const titulo = data.titulo || data.title || '';
            const descricao = data.descricao || data.description || '';
            const imagem = data.imagem || data.image || '';
            const categoria = data.categoria || data.category || 'Galeria';

            modalContent.innerHTML = \`
                <div class="flex flex-col md:flex-row h-full max-h-[85vh]">
                    <div class="md:w-1/2 p-0 relative">
                        <img src="\${imagem}" class="w-full h-full object-cover" alt="\${titulo}">
                        <div class="absolute top-4 left-4 bg-brand-badgeBg text-brand-badgeText px-4 py-1.5 rounded-full font-display font-bold text-sm shadow-sm">
                            \${categoria}
                        </div>
                    </div>
                    <div class="md:w-1/2 p-10 md:p-12 flex flex-col justify-center bg-white">
                        <h4 class="font-display text-3xl text-brand-textDark mb-6" id="modalTitle">\${titulo}</h4>
                        \${descricao ? \`<p class="font-sans text-brand-textMuted text-xl leading-relaxed" id="modalDesc">\${descricao}</p>\` : ''}
                    </div>
                </div>
            \`;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            body.classList.add('modal-active');
        }`
);

// Update calls to openModal in renderAcoes
html = html.replace(
    /onclick="openModal\('\$\{imgStr\}', '\$\{titleStr\}', '\$\{descStr\}'\)"/g,
    `onclick='openMediaModal({ titulo: \`\${titleStr}\`, descricao: \`\${descStr}\`, imagem: \`\${imgStr}\`, categoria: \`\${acao.category || "Ação"}\` })'`
);

// Update renderGaleria description logic
html = html.replace(
    /const descStr = isVideo \? 'Vídeo demonstrativo' : 'Foto da galeria';/g,
    `const descStr = (item.description || item.descricao || "Registro das ações da Secretaria da Mulher").replace(/'/g, "\\\\'");`
);

// Update call to openModal in renderGaleria
html = html.replace(
    /onclick="openModal\('\$\{imgStr\}', '\$\{titleStr\}', '\$\{descStr\}'\)"/g,
    `onclick='openMediaModal({ titulo: \`\${titleStr}\`, descricao: \`\${descStr}\`, imagem: \`\${imgStr}\`, categoria: \`\${item.category || item.categoria || "Galeria"}\` })'`
);

fs.writeFileSync('index.html', html);
