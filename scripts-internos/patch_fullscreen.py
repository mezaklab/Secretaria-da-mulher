import re

with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

# 1. Remove the text "2 toques p/ tela cheia"
old_text = """                        ${!isFullscreenOnly ? `
                        <div class="absolute top-4 left-1/2 -translate-x-1/2 lg:hidden pointer-events-auto text-white/70 text-[10px] flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm z-10 select-none shadow-sm">
                            <i class="fas fa-expand"></i> 2 toques p/ tela cheia
                        </div>
                        ` : ''}"""
if old_text in index:
    index = index.replace(old_text, "")
    print("Removed text overlay")

# 2. Update ondblclick in modalImageColumn to allow desktop
old_dbl = """ondblclick="if(window.innerWidth < 1024 && !${isFullscreenOnly}) toggleModalFullscreen()\""""
new_dbl = """ondblclick="if(!${isFullscreenOnly}) toggleModalFullscreen()\""""
if old_dbl in index:
    index = index.replace(old_dbl, new_dbl)
    print("Updated ondblclick condition")

# 3. Add ondblclick to the actual media element just in case
old_media = """return `<video ${isMain ? 'id="modalMainVideo" controls autoplay loop playsinline' : 'muted'} src="${url}" class="${isMain ? mainClasses : 'w-full h-full object-cover'}"></video>`;"""
new_media = """return `<video ${isMain ? 'id="modalMainVideo" controls autoplay loop playsinline ondblclick="if(window.toggleModalFullscreen) toggleModalFullscreen()"' : 'muted'} src="${url}" class="${isMain ? mainClasses : 'w-full h-full object-cover'}"></video>`;"""
if old_media in index:
    index = index.replace(old_media, new_media)
    print("Added ondblclick to video")

old_media_img = """return `<img ${isMain ? 'id="modalMainImage"' : ''} src="${url}" class="${isMain ? 'max-w-full max-h-full rounded-xl shadow-2xl pointer-events-auto' : 'w-full h-full object-cover'} transition-all duration-300 select-none" alt="${titulo}">`;"""
new_media_img = """return `<img ${isMain ? 'id="modalMainImage" ondblclick="if(window.toggleModalFullscreen) toggleModalFullscreen()"' : ''} src="${url}" class="${isMain ? 'max-w-full max-h-full rounded-xl shadow-2xl pointer-events-auto' : 'w-full h-full object-cover'} transition-all duration-300 select-none" alt="${titulo}">`;"""
if old_media_img in index:
    index = index.replace(old_media_img, new_media_img)
    print("Added ondblclick to image")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index)

