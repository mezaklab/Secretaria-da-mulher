const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Replace population in edit block
const editPopulateRegex = /\/\/ Populando os campos[\s\S]*?\/\/ Tentando preencher descrição[\s\S]*?modal\.querySelector\('textarea'\)\.value = item\.description \|\| item\.descricao;\n                        \}/;
const newEditPopulate = `// Populando os campos
                        if (document.getElementById('input-titulo')) document.getElementById('input-titulo').value = item.title || item.titulo || '';
                        
                        // Tentando preencher a categoria
                        const select = document.getElementById('input-categoria');
                        if (select && (item.category || item.categoria)) {
                            Array.from(select.options).forEach(opt => {
                                if (opt.text.toLowerCase() === (item.category || item.categoria).toLowerCase()) opt.selected = true;
                            });
                        }
                        
                        // Tentando preencher descrição
                        if (document.getElementById('input-descricao') && (item.description || item.descricao)) {
                            document.getElementById('input-descricao').value = item.description || item.descricao;
                        }

                        // Converter string de data para formato YYYY-MM-DD
                        if (document.getElementById('input-data') && (item.date || item.data)) {
                             // tenta reverter "24 Out 2024" para "YYYY-MM-DD" se possível, senao deixa em branco para o html5 date input. 
                             // Como é complexo tratar locale em uma linha, usaremos um map basico
                             const dStr = item.date || item.data;
                             const months = { 'Jan':'01', 'Fev':'02', 'Mar':'03', 'Abr':'04', 'Mai':'05', 'Jun':'06', 'Jul':'07', 'Ago':'08', 'Set':'09', 'Out':'10', 'Nov':'11', 'Dez':'12' };
                             const parts = dStr.split(' ');
                             if(parts.length === 3) {
                                document.getElementById('input-data').value = \`\${parts[2]}-\${months[parts[1]]}-\${parts[0].padStart(2, '0')}\`;
                             }
                        }`;

html = html.replace(editPopulateRegex, newEditPopulate);

// Replace reading in save block
const saveReadRegex = /const title = modal\.querySelectorAll\('input'\)\[0\]\.value;\n                        const category = modal\.querySelector\('select'\)\.value;\n                        const description = modal\.querySelector\('textarea'\)\.value;/;

const newSaveRead = `const title = document.getElementById('input-titulo').value;
                        const category = document.getElementById('input-categoria').value;
                        const description = document.getElementById('input-descricao').value;`;

html = html.replace(saveReadRegex, newSaveRead);

// Update date logic in save block to use the input-data instead of current date
const dateSaveRegex = /const date = new Date\(\)\.toLocaleDateString\('pt-BR', \{ day: '2-digit', month: 'short', year: 'numeric' \}\)\.replace\('\.',''\);/;
const newDateSave = `
                        let date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.','');
                        const inputDataVal = document.getElementById('input-data').value;
                        if(inputDataVal) {
                            const d = new Date(inputDataVal + 'T12:00:00');
                            const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                            date = \`\${String(d.getDate()).padStart(2, '0')} \${months[d.getMonth()]} \${d.getFullYear()}\`;
                        }`;
html = html.replace(dateSaveRegex, newDateSave);

fs.writeFileSync('admin.html', html);
