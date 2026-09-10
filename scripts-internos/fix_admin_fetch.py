import re

files_to_fix = ['admin.php', 'admin.html']

old_fetch = """            // Buscar dados reais do servidor em vez do localStorage
            fetch('api.php')
                .then(res => res.json())
                .then(data => {
                    if (data.acoes) adminAcoes = data.acoes;
                    if (data.galeria) adminGaleria = data.galeria;
                    if (data.agenda) {
                        adminAgenda = data.agenda.map(item => {
                            if (item.status === 'Confirmado' && item.fullDate) {
                                const eventDate = new Date(item.fullDate + 'T23:59:59');
                                if (new Date() > eventDate) {
                                    item.status = 'Realizado';
                                }
                            }
                            return item;
                        });
                    }
                    if (data.saude) adminServicosSaude = data.saude;
                    if (data.canindeDelas) adminCanindeDelas = data.canindeDelas;
                    
                    currentCanindePhotos = Array.isArray(adminCanindeDelas.fotos) ? [...adminCanindeDelas.fotos] : [];
                    
                    // Renderiza a interface apenas depois que os dados carregarem
                    renderAdminAcoes();
                    renderAdminGaleria();
                    renderAdminAgenda();
                    renderAdminSaude();
                    renderAdminCanindeDelas();
                })
                .catch(err => {
                    console.error("Erro ao carregar os dados:", err);
                    alert("Não foi possível carregar os dados do servidor. Usando dados padrão.");
                    renderAdminAcoes();
                    renderAdminGaleria();
                    renderAdminAgenda();
                    renderAdminSaude();
                    renderAdminCanindeDelas();
                });"""

new_fetch = """            // Buscar dados reais do servidor em vez do localStorage
            const processData = (data) => {
                if (data.acoes) adminAcoes = data.acoes;
                if (data.galeria) adminGaleria = data.galeria;
                if (data.agenda) {
                    adminAgenda = data.agenda.map(item => {
                        if (item.status === 'Confirmado' && item.fullDate) {
                            const eventDate = new Date(item.fullDate + 'T23:59:59');
                            if (new Date() > eventDate) {
                                item.status = 'Realizado';
                            }
                        }
                        return item;
                    });
                }
                if (data.saude) adminServicosSaude = data.saude;
                if (data.canindeDelas) adminCanindeDelas = data.canindeDelas;
                
                currentCanindePhotos = Array.isArray(adminCanindeDelas.fotos) ? [...adminCanindeDelas.fotos] : [];
                
                renderAdminAcoes();
                renderAdminGaleria();
                renderAdminAgenda();
                renderAdminSaude();
                renderAdminCanindeDelas();
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
                .catch(err => {
                    console.warn("API indisponível (possível Vercel). Buscando dados estáticos...", err);
                    fetch('dados.json')
                        .then(res => res.json())
                        .then(data => processData(data))
                        .catch(e => {
                            console.error("Erro fatal ao carregar dados:", e);
                            alert("Não foi possível carregar os dados do servidor. Usando dados padrão.");
                            processData({}); // Fallback
                        });
                });"""

for file in files_to_fix:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_fetch in content:
        content = content.replace(old_fetch, new_fetch)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file}")
    else:
        print(f"Could not find fetch block in {file}")

