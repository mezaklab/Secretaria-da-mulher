import json

with open('dados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data.get('saude', []):
    if item.get('imagem', '').startswith('https://images.unsplash.com/'):
        item['imagem'] = ''

with open('dados.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
print("dados.json cleaned!")
