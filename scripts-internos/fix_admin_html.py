with open('admin.php', 'r', encoding='utf-8') as f:
    content = f.read()

# The dashboard starts after <?php else: ?>
try:
    dashboard_part = content.split('<?php else: ?>')[1]
    # The dashboard ends before <?php endif; ?>
    dashboard_html = dashboard_part.split('<?php endif; ?>')[0].strip()
    
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(dashboard_html)
    print("Dashboard extracted successfully!")
except Exception as e:
    print("Error:", e)
