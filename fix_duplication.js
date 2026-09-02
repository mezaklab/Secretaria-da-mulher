const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// 1. Populate the hidden input on Edit
html = html.replace(
    '// Trocar o título do Modal para simular Edição\n                        modal.querySelector(\'h3\').innerText = "Editar Evento na Agenda";',
    `document.getElementById('edit-id-agenda').value = row.getAttribute('data-id');
                        // Trocar o título do Modal para simular Edição
                        modal.querySelector('h3').innerText = "Editar Evento na Agenda";`
);

html = html.replace(
    '// Trocar o título do Modal para simular Edição\n                        modal.querySelector(\'h3\').innerText = "Editar Ação";',
    `document.getElementById('edit-id-acoes').value = row.getAttribute('data-id');
                        // Trocar o título do Modal para simular Edição
                        modal.querySelector('h3').innerText = "Editar Ação";`
);

// 2. Clear hidden inputs when clicking "Novo" button
html = html.replace(
    'onclick="document.getElementById(\'modal\').classList.remove(\'hidden\')"',
    'onclick="document.getElementById(\'modal\').classList.remove(\'hidden\'); document.getElementById(\'edit-id-acoes\').value=\'\'; document.getElementById(\'modal\').querySelector(\'h3\').innerText=\'Cadastrar Nova Ação\';"'
);

html = html.replace(
    'onclick="document.getElementById(\'modal-agenda\').classList.remove(\'hidden\')"',
    'onclick="document.getElementById(\'modal-agenda\').classList.remove(\'hidden\'); document.getElementById(\'edit-id-agenda\').value=\'\'; document.getElementById(\'modal-agenda\').querySelector(\'h3\').innerText=\'Novo Evento na Agenda\';"'
);


// 3. Update Save logic for Agenda
html = html.replace(
    'adminAgenda.push({ id: Date.now(), date, month, title, time, location, status });',
    `const editId = document.getElementById('edit-id-agenda').value;
                        if(editId) {
                            const index = adminAgenda.findIndex(item => item.id == editId);
                            if(index > -1) {
                                adminAgenda[index] = { ...adminAgenda[index], date, month, title, time, location, status };
                            }
                        } else {
                            adminAgenda.push({ id: Date.now(), date, month, title, time, location, status });
                        }`
);

// 4. Update Save logic for Ações
html = html.replace(
    'adminAcoes.push({ id: Date.now(), category, date, title, description, image: currentBase64Image });\n                        localStorage.setItem(\'sec_mulher_acoes\', JSON.stringify(adminAcoes));\n                        \n                        adminGaleria.push({ id: Date.now()+1, type: \'foto\', title, image: currentBase64Image });',
    `const editId = document.getElementById('edit-id-acoes').value;
                        const isPlaceholder = currentBase64Image.includes('unsplash.com');
                        
                        if (editId) {
                            const acaoIndex = adminAcoes.findIndex(item => item.id == editId);
                            if (acaoIndex > -1) {
                                const oldImage = adminAcoes[acaoIndex].image;
                                const newImage = isPlaceholder ? oldImage : currentBase64Image;
                                adminAcoes[acaoIndex] = { ...adminAcoes[acaoIndex], category, date, title, description, image: newImage };
                            }
                            // Também atualizar na Galeria (se existir correspondência)
                            const galIndex = adminGaleria.findIndex(item => item.title === title || item.id == editId);
                            if (galIndex > -1) {
                                const oldImage = adminGaleria[galIndex].image;
                                const newImage = isPlaceholder ? oldImage : currentBase64Image;
                                adminGaleria[galIndex] = { ...adminGaleria[galIndex], title, image: newImage };
                            }
                        } else {
                            const newImg = isPlaceholder ? 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80' : currentBase64Image;
                            adminAcoes.push({ id: Date.now(), category, date, title, description, image: newImg });
                            adminGaleria.push({ id: Date.now()+1, type: 'foto', title, image: newImg });
                        }`
);

fs.writeFileSync('admin.html', html);
