import re

with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

# 1. Update the Galeria render block for the click animation
old_galeria = """                el.onclick = () => openMediaModal({ titulo: title, descricao: desc, imagem: image, categoria: category });

                el.innerHTML = `
                    ${image && image.toLowerCase().endsWith('.mp4') 
    ? `<video src="${image}" muted playsinline preload="metadata" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"></video>` 
    : `<img src="${image}" alt="${safe(title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" onerror="this.style.display='none'">`}
                    <div class="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-black/20 flex flex-col justify-between p-4 pointer-events-none">
                        <div class="self-center my-auto w-12 h-12 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">"""

new_galeria = """                el.onclick = function() {
                    const btn = this.querySelector('.play-btn-anim');
                    if (btn) {
                        btn.style.transform = 'scale(0.7)';
                        btn.style.opacity = '0';
                        setTimeout(() => {
                            openMediaModal({ titulo: title, descricao: desc, imagem: image, categoria: category });
                            setTimeout(() => {
                                btn.style.transform = '';
                                btn.style.opacity = '';
                            }, 500);
                        }, 200);
                    } else {
                        openMediaModal({ titulo: title, descricao: desc, imagem: image, categoria: category });
                    }
                };

                el.innerHTML = `
                    ${image && image.toLowerCase().endsWith('.mp4') 
    ? `<video src="${image}" muted playsinline preload="metadata" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"></video>` 
    : `<img src="${image}" alt="${safe(title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" onerror="this.style.display='none'">`}
                    <div class="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-black/20 flex flex-col justify-between p-4 pointer-events-none">
                        <div class="play-btn-anim self-center my-auto w-12 h-12 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">"""

if old_galeria in index:
    index = index.replace(old_galeria, new_galeria)
    print("Patched galeria play button animation")
else:
    print("Could not find galeria block to patch")

# 2. Update renderMediaElement to add the central double click overlay
old_render = """                return `<video ${isMain ? 'id="modalMainVideo" controls autoplay loop playsinline ondblclick="if(window.toggleModalFullscreen) toggleModalFullscreen()"' : 'muted'} src="${url}" class="${isMain ? mainClasses : 'w-full h-full object-cover'}"></video>`;"""

new_render = """                return `
                    <video ${isMain ? 'id="modalMainVideo" controls autoplay loop playsinline' : 'muted'} src="${url}" class="${isMain ? mainClasses + ' relative z-0' : 'w-full h-full object-cover'}"></video>
                    ${isMain ? `<div class="absolute top-0 bottom-[60px] left-[20%] right-[20%] z-10" style="touch-action: manipulation;" onclick="const v=document.getElementById('modalMainVideo'); if(v){ v.paused ? v.play() : v.pause(); }" ondblclick="if(window.toggleModalFullscreen) toggleModalFullscreen()"></div>` : ''}
                `;"""

if old_render in index:
    index = index.replace(old_render, new_render)
    print("Patched renderMediaElement overlay")
else:
    print("Could not find renderMediaElement to patch")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index)
