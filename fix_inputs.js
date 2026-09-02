const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Adicionar IDs aos inputs no modal de ações
html = html.replace(
    /<input type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary\/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Roda de Conversa...">/,
    '<input type="text" id="input-titulo" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow" placeholder="Ex: Roda de Conversa...">'
);

html = html.replace(
    /<select class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary\/50 focus:border-brand-primary bg-white transition-shadow">/,
    '<select id="input-categoria" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary bg-white transition-shadow">'
);

html = html.replace(
    /<input type="date" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary\/50 focus:border-brand-primary transition-shadow">/,
    '<input type="date" id="input-data" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow">'
);

html = html.replace(
    /<textarea rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary\/50 focus:border-brand-primary transition-shadow resize-none" placeholder="Descreva os detalhes da ação..."><\/textarea>/,
    '<textarea id="input-descricao" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow resize-none" placeholder="Descreva os detalhes da ação..."></textarea>'
);

fs.writeFileSync('admin.html', html);
