const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');
const admin = fs.readFileSync('admin.html', 'utf8');

// The REAL issue: does admin.html save WITH data from the form, or does it
// read from a localStorage key that may have the OLD default data written by index.html?

console.log('=== ADMIN: como le o array de Ações ANTES de salvar ===');
const adminReadAcoes = admin.match(/let adminAcoes.+/);
adminReadAcoes && console.log(adminReadAcoes[0]);

console.log('\n=== INDEX: renderização de acoes - bloco de LEITURA ===');
const dataBlock = index.match(/const data = \{[\s\S]*?\};/);
dataBlock && console.log(dataBlock[0]);

// The KEY ISSUE: does index.html write to localStorage its defaults, or just use in memory?
console.log('\n=== INDEX: index.html ESCREVE no localStorage? ===');
const indexWrites = index.match(/localStorage\.setItem.+/g);
indexWrites ? indexWrites.forEach(l => console.log(' YES:', l)) : console.log(' NÃO escreve');

// Check if admin reads the localStorage with the correct keys
console.log('\n=== ADMIN: objeto sendo salvo com .unshift ===');
const m = admin.match(/adminAcoes\.unshift\(\{[\s\S]*?\}\)/);
m && console.log(m[0]);

console.log('\n=== ADMIN: objeto sendo salvo com .findIndex update ===');
const m2 = admin.match(/adminAcoes\[acaoIndex\] = \{[\s\S]*?\};/);
m2 && console.log(m2[0]);

console.log('\n=== INDEX: condição que permite render (não retorna early) ===');
const cond = index.match(/if\(!acoesData.+/g);
cond && cond.forEach(l => console.log(l));
