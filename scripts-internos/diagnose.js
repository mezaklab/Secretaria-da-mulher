const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');
const admin = fs.readFileSync('admin.html', 'utf8');

console.log('=== CHAVES LOCALSTORAGE em index.html ===');
const indexKeys = index.match(/localStorage\.getItem\(['"]([^'"]+)['"]\)/g);
indexKeys && indexKeys.forEach(k => console.log(' INDEX:', k));

console.log('\n=== CHAVES LOCALSTORAGE em admin.html ===');
const adminKeys = admin.match(/localStorage\.(getItem|setItem)\(['"]([^'"]+)['"]/g);
adminKeys && adminKeys.forEach(k => console.log(' ADMIN:', k));

console.log('\n=== CAMPOS DOS OBJETOS SALVOS no admin ===');
const adminPushes = admin.match(/adminAcoes\.(push|unshift)\(\{[^}]+\}\)/g);
adminPushes && adminPushes.forEach(p => console.log(' ', p));

console.log('\n=== CAMPOS LIDOS no renderAcoes (index.html) ===');
const renderFields = index.match(/item\.\w+|acao\.\w+/g);
const unique = [...new Set(renderFields)];
unique.forEach(f => console.log(' ', f));

console.log('\n=== FALLBACK DEFAULT em index.html ===');
const fallback = index.match(/const defaultAcoes = \[[\s\S]*?\];/);
if(fallback) console.log(fallback[0].substring(0, 300) + '...');

console.log('\n=== LINHA CONDICIONAL DE RENDERIZAÇÃO ===');
const renderCond = index.match(/if\(!acoesData.*return.*/g);
renderCond && renderCond.forEach(l => console.log(' ', l));
