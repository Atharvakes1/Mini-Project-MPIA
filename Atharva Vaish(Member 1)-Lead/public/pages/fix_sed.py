import re

files = ['tasks.html', 'settings.html']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Revert the sed command: we need to find patterns like `<attr>="<value>; <style_content>"`
    # The attributes affected: class, data-lucide, section
    
    # Let's target anything like: attr="value; something:..."
    # A safe regex:
    # Look for: (class|data-lucide)="([^";]+?);\s*([a-zA-Z-]+:[^"]*)"
    # Replace with: \1="\2" style="\3"
    
    def replacer(m):
        attr = m.group(1)
        val = m.group(2)
        style_content = m.group(3)
        return f'{attr}="{val}" style="{style_content}"'

    # Run multiple times to catch cases that might have been cascaded, though there should only be one substitution per tag that we messed up.
    for _ in range(3):
        content = re.sub(r'(class|data-lucide)="([^";]+?);\s*([a-zA-Z-]+:.*?)"', replacer, content)

    # Now fix the double semicolons caused by python script inserting `style="...;"` next to `style="..."`
    # `<h1 class="text-xl font-bold" style="font-family: var(--font-display);; color: ...`
    content = re.sub(r'style="([^"]*?);;\s*', r'style="\1; ', content)
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed sed mistake")
