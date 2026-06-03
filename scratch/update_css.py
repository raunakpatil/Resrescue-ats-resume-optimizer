import os

templates_dir = r"c:\Users\Raunak Patil\Desktop\Resume Tailor\Backup\ats-resume-optimizer\src\templates"

for filename in os.listdir(templates_dir):
    if not filename.endswith('.jsx'): continue
    filepath = os.path.join(templates_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to find the main content block. 
    if 'content: {' in content:
        content = content.replace('content: {', 'content: {\n    justifyContent: "space-between",\n    paddingBottom: 10,')
    elif 'page: {' in content:
        content = content.replace('page: {', 'page: {\n    justifyContent: "space-between",\n    paddingBottom: 10,')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {filename}')
