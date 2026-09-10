import re

files = ['tasks.html', 'settings.html']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Revert the sed command for ALL attributes: (id|href|type|class|data-[a-z]+)="([^";]+?);\s*([a-zA-Z-]+:[^"]*)"
    # Actually, let's just use \w+ for attribute name
    
    def replacer(m):
        attr = m.group(1)
        val = m.group(2)
        style_content = m.group(3)
        return f'{attr}="{val}" style="{style_content}"'

    for _ in range(3):
        content = re.sub(r'([a-zA-Z0-9_-]+)="([^";]+?);\s*([a-zA-Z-]+:.*?)"', replacer, content)

    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed sed mistake 2")
