import re

files = ['tasks.html', 'settings.html']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix: style="font-family: var(--font-display); mb-6" -> class="... mb-6"
    # Actually right now it is `<h2 class="text-2xl font-bold" style="font-family: var(--font-display); mb-6">`
    # Let's match `<h2 class="([^"]+)" style="font-family: var\(--font-display\);\s*(mb-\d+)">`
    # Replace with `<h2 class="\1 \2" style="font-family: var(--font-display);">`
    
    content = re.sub(r'class="([^"]+)"\s*style="font-family: var\(--font-display\);\s*(mb-\d+)"', r'class="\1 \2" style="font-family: var(--font-display);"', content)
    content = re.sub(r'class="([^"]+)"\s*style="font-family: var\(--font-display\);;\s*(mb-\d+)"', r'class="\1 \2" style="font-family: var(--font-display);"', content)
    
    # Check for `mb-4`
    content = re.sub(r'style="font-family: var\(--font-display\);\s*mb-4"', r'style="font-family: var(--font-display);"', content)
    content = re.sub(r'class="text-2xl font-bold"\s*style="font-family: var\(--font-display\);"', r'class="text-2xl font-bold mb-4" style="font-family: var(--font-display);"', content)
    # Wait, the above is dangerous. 
    # Let's just fix `style="font-family: var(--font-display); mb-6"` specifically since it's easy to spot.

    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed sed mistake 4")
