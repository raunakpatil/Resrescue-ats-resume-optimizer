import os
import re

templates_dir = r"c:\Users\Raunak Patil\Desktop\Resume Tailor\Backup\ats-resume-optimizer\src\templates"

for filename in os.listdir(templates_dir):
    if not filename.endswith('.jsx'):
        continue
    filepath = os.path.join(templates_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Revert .ttf.js to .ttf
    content = re.sub(r'(\.ttf)\.js', r'\1', content)
    
    # 2. Fix broken bullet characters
    # Look for >?</Text> or ></Text> and replace with >-</Text>
    content = re.sub(r'>\?</Text>', '>-</Text>', content)
    content = re.sub(r'></Text>', '>-</Text>', content)

    # 3. For TemplateModern, remove the Helvetica hack and restore DMSans
    if filename == "TemplateModern.jsx":
        content = content.replace('// import font_dmsans', 'import font_dmsans')
        content = content.replace('// Font.register', 'Font.register')
        content = content.replace('//   family: "DMSans"', '  family: "DMSans"')
        content = content.replace('//   fonts:', '  fonts:')
        content = content.replace('//     {', '    {')
        content = content.replace('//       src: font_dmsans', '      src: font_dmsans')
        content = content.replace('//       fontWeight:', '      fontWeight:')
        content = content.replace('//     },', '    },')
        content = content.replace('//   ],', '  ],')
        content = content.replace('// });', '});')
        # restore font family in styles
        content = content.replace('fontFamily: "Helvetica",\n    fontSize: 9,', 'fontFamily: "DMSans",\n    fontSize: 9,')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filename}")
