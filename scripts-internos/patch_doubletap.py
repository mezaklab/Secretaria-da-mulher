import re

with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

# 1. Inject the handleVideoOverlayClick function right inside the `<script>` block, near toggleModalFullscreen
old_js = """        window.toggleModalFullscreen = function() {"""
new_js = """        let lastVideoTap = 0;
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
        };

        window.toggleModalFullscreen = function() {"""

if old_js in index:
    index = index.replace(old_js, new_js)
    print("Injected JS logic")
else:
    print("Could not find toggleModalFullscreen")

# 2. Update the overlay div to use this function
old_overlay = """<div class="absolute top-0 bottom-[60px] left-[20%] right-[20%] z-10" style="touch-action: manipulation;" onclick="const v=document.getElementById('modalMainVideo'); if(v){ v.paused ? v.play() : v.pause(); }" ondblclick="if(window.toggleModalFullscreen) toggleModalFullscreen()"></div>"""
new_overlay = """<div class="absolute top-0 bottom-[60px] left-[20%] right-[20%] z-10 cursor-pointer" style="touch-action: manipulation;" onclick="handleVideoOverlayClick()"></div>"""

if old_overlay in index:
    index = index.replace(old_overlay, new_overlay)
    print("Patched overlay div")
else:
    print("Could not find old overlay")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index)
