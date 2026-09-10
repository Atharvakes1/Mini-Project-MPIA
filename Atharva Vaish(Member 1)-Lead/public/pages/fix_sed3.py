import re

files = ['tasks.html', 'settings.html']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # First, let's fix the class="foo; font-family:..." and id="foo; ..." 
    # Actually, we messed up by replacing inside style!
    # Let's fix multiple style attributes by combining them.
    # style="a" style="b" -> style="a; b"
    
    # We will repeatedly combine adjacent style attributes
    while True:
        new_content = re.sub(r'style="([^"]*?)"\s*style="([^"]*?)"', r'style="\1; \2"', content)
        if new_content == content:
            break
        content = new_content
        
    # Some class might have been corrupted: class="abc; xyz"
    # Actually right now tasks.html has `class="text-xl font-bold" style="font-family: var(--font-display)" style="color: ..."`
    # Which will be combined into `style="font-family: var(--font-display); color: ..."` which is PERFECT!
    # The only problem is if there's any `id="abc; xyz"` left.
    # Let's clean up any `attr="value; prop: val"` EXCEPT style.
    
    def revert_bad_attr(m):
        attr = m.group(1)
        if attr == 'style': return m.group(0)
        val = m.group(2)
        css = m.group(3)
        return f'{attr}="{val}" style="{css}"'

    content = re.sub(r'([a-zA-Z0-9_-]+)="([^";]+?);\s*([a-zA-Z-]+:[^"]*)"', revert_bad_attr, content)

    # remove double semicolons inside style
    content = re.sub(r';\s*;', ';', content)

    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed sed mistake 3")
