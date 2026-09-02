const fs = require('fs');
const admin = fs.readFileSync('admin.html', 'utf8');

// The critical bug: admin.html initialized adminAcoes from localStorage
// at DOMContentLoaded but DEFAULT values were set first.
// When Salvar e Publicar runs, btn.innerText check runs BEFORE render, right?
// Lets also verify which buttons the text check catches.

console.log('=== TEXT-based btn detection ===');
const btns = admin.match(/btn\.innerText\.includes\([^)]+\)/g);
btns && btns.forEach(b => console.log(' BTN CHECK:', b));

console.log('\n=== Salvar e Publicar btn - full save block ===');
const idx = admin.indexOf("Salvar e Publicar");
console.log(admin.substring(idx - 50, idx + 200));

console.log('\n=== FORM ID or No form? ===');
console.log(admin.match(/<form[^>]*>/g));

console.log('\n=== Admin opens #modal to save ===');
const m = admin.match(/const modal = document\.getElementById\('modal'\);[\s\S]{1,400}/);
m && console.log(m[0]);
