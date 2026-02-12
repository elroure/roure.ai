#!/usr/bin/env python3
import os
import re
import json
import unicodedata
import glob

root = 'public/images'
mapping = {}
count = 0

# Step 1: Normalize filenames
for dirpath, dirs, files in os.walk(root):
    for f in files:
        old = os.path.join(dirpath, f)
        
        # Skip .DS_Store
        if f == '.DS_Store':
            continue
        
        # Normalize filename
        nf = unicodedata.normalize('NFKD', f)
        nf = nf.encode('ascii', 'ignore').decode('ascii')
        nf = nf.lower()
        nf = nf.replace(' ', '-')
        nf = nf.replace('\t', '-')
        nf = re.sub(r'[^a-z0-9._-]', '', nf)
        nf = re.sub(r'-+', '-', nf)
        nf = nf.strip('-')
        
        target = os.path.join(dirpath, nf)
        
        if os.path.abspath(old) == os.path.abspath(target):
            continue
        
        # Handle collisions
        base, ext = os.path.splitext(nf)
        i = 1
        temp_target = target
        while os.path.exists(temp_target) and os.path.abspath(temp_target) != os.path.abspath(old):
            temp_target = os.path.join(dirpath, f"{base}-{i}{ext}")
            i += 1
        target = temp_target
        
        try:
            os.rename(old, target)
            old_rel = os.path.relpath(old, '.').replace('\\', '/')
            new_rel = os.path.relpath(target, '.').replace('\\', '/')
            mapping[old_rel] = new_rel
            count += 1
            print(f"Renamed: {old_rel} → {new_rel}")
        except Exception as e:
            print(f"ERROR renaming {old} -> {target}: {e}")

with open('rename_map.json', 'w', encoding='utf-8') as g:
    json.dump(mapping, g, indent=2, ensure_ascii=False)

print(f"\n✓ RENAMED {count} files")

# Step 2: Update references in code and manifests
if count > 0:
    exts = ['.html', '.tsx', '.ts', '.js', '.json', '.css', '.md', '.jsx']
    files = []
    for e in exts:
        files.extend(glob.glob('**/*' + e, recursive=True))
    
    updated = 0
    for fp in files:
        try:
            with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                orig = f.read()
        except:
            continue
        
        updated_content = orig
        for old, new in mapping.items():
            old_basename = os.path.basename(old)
            new_basename = os.path.basename(new)
            
            # Replace by basename
            if old_basename in updated_content:
                updated_content = updated_content.replace(old_basename, new_basename)
            
            # Replace full web path variants
            old_web = ('/' + old).replace('public/', '/').replace('\\', '/')
            new_web = ('/' + new).replace('public/', '/').replace('\\', '/')
            
            if old_web in updated_content:
                updated_content = updated_content.replace(old_web, new_web)
        
        if updated_content != orig:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            updated += 1
            print(f"Updated references in: {fp}")
    
    print(f"\n✓ UPDATED {updated} files with new references")

print("\n✓ Normalization complete!")
