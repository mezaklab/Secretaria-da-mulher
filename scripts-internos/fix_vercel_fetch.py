import re

with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

old_fetch = """            function loadAndRender() {
                let acoesRaw = null, galeriaRaw = null, agendaRaw = null, saudeRaw = null, canindeRaw = null;
                fetch('api.php')
                    .then(res => res.json())
                    .then(data => {
                        if (data.acoes && Array.isArray(data.acoes)) renderAcoes(data.acoes);
                        if (data.galeria && Array.isArray(data.galeria)) renderGaleria(data.galeria);
                        if (data.agenda && Array.isArray(data.agenda)) {
                            const updatedAgenda = data.agenda.map(item => {
                                if (item.status === 'Confirmado' && item.fullDate) {
                                    const eventDate = new Date(item.fullDate + 'T23:59:59');
                                    if (new Date() > eventDate) {
                                        item.status = 'Realizado';
                                    }
                                }
                                return item;
                            });
                            renderAgenda(updatedAgenda);
                        }
                        if (data.saude && Array.isArray(data.saude)) renderSaude(data.saude);
                        if (data.canindeDelas && typeof data.canindeDelas === 'object') renderCanindeDelas(data.canindeDelas);
                    })
                    .catch(e => console.error("Erro ao carregar da API:", e));
            }"""

new_fetch = """            function loadAndRender() {
                const processData = (data) => {
                    if (data.acoes && Array.isArray(data.acoes)) renderAcoes(data.acoes);
                    if (data.galeria && Array.isArray(data.galeria)) renderGaleria(data.galeria);
                    if (data.agenda && Array.isArray(data.agenda)) {
                        const updatedAgenda = data.agenda.map(item => {
                            if (item.status === 'Confirmado' && item.fullDate) {
                                const eventDate = new Date(item.fullDate + 'T23:59:59');
                                if (new Date() > eventDate) {
                                    item.status = 'Realizado';
                                }
                            }
                            return item;
                        });
                        renderAgenda(updatedAgenda);
                    }
                    if (data.saude && Array.isArray(data.saude)) renderSaude(data.saude);
                    if (data.canindeDelas && typeof data.canindeDelas === 'object') renderCanindeDelas(data.canindeDelas);
                };

                fetch('api.php')
                    .then(res => {
                        const contentType = res.headers.get("content-type");
                        if (!res.ok || (contentType && contentType.indexOf("application/json") === -1)) {
                            throw new Error('Not a valid JSON response from API');
                        }
                        return res.json();
                    })
                    .then(data => processData(data))
                    .catch(e => {
                        console.warn("API PHP indisponível (possível Vercel). Buscando dados.json estático...", e);
                        fetch('dados.json')
                            .then(res => res.json())
                            .then(data => processData(data))
                            .catch(err => console.error("Erro fatal ao carregar dados:", err));
                    });
            }"""

if old_fetch in index:
    index = index.replace(old_fetch, new_fetch)
    print("Fetch patched for Vercel")
else:
    print("Could not find old_fetch")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index)

