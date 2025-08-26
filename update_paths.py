import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all remaining .jpg references that don't already have images/ prefix
content = re.sub(r'src="(?!images/)([^"]*\.jpg)"', r'src="images/\1"', content)

# Write back to file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated all image paths to use images/ folder")