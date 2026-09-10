import re

with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

old_overlay = """<div class="absolute top-0 bottom-[60px] left-[20%] right-[20%] z-10 cursor-pointer" style="touch-action: manipulation;" onclick="handleVideoOverlayClick()"></div>"""
new_overlay = """<div class="absolute top-0 bottom-[80px] left-[15%] right-[15%] z-[50]" style="touch-action: none;" ontouchend="handleVideoOverlayClick(event)" onclick="handleVideoOverlayClick(event)"></div>"""

old_js = """        let lastVideoTap = 0;
        let videoTapTimeout = null;
        window.handleVideoOverlayClick = function() {
            const now = new Date().getTime();
            const timeDiff = now - lastVideoTap;
            
            if (timeDiff < 400 && timeDiff > 0) {
                clearTimeout(videoTapTimeout);
                if(window.toggleModalFullscreen) toggleModalFullscreen();
                lastVideoTap = 0;
            } else {
                lastVideoTap = now;
                videoTapTimeout = setTimeout(() => {
                    const v = document.getElementById('modalMainVideo'); 
                    if(v){ v.paused ? v.play() : v.pause(); }
                }, 300);
            }
        };"""

new_js = """        let lastVideoTap = 0;
        let videoTapTimeout = null;
        window.handleVideoOverlayClick = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const now = new Date().getTime();
            const timeDiff = now - lastVideoTap;
            
            if (timeDiff < 400 && timeDiff > 0) {
                clearTimeout(videoTapTimeout);
                if(window.toggleModalFullscreen) toggleModalFullscreen();
                lastVideoTap = 0;
            } else {
                lastVideoTap = now;
                videoTapTimeout = setTimeout(() => {
                    const v = document.getElementById('modalMainVideo'); 
                    if(v){ v.paused ? v.play() : v.pause(); }
                }, 300);
            }
        };"""

if old_overlay in index:
    index = index.replace(old_overlay, new_overlay)
    print("Overlay updated")
else:
    print("Could not find old overlay")

if old_js in index:
    index = index.replace(old_js, new_js)
    print("JS updated")
else:
    print("Could not find old JS")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index)
