import os
import re
import shutil
from datetime import datetime

# Configuration
SOURCE_DIR = r"f:\OneDrive\doc\vscode_proj\Yukari.online\myblog\content\ref"
DEST_DIR = r"f:\OneDrive\doc\vscode_proj\Yukari.online\myblog\content\post"

def get_title_and_clean_content(content, filename):
    """
    Extracts title from the first line if it's an H1 header (# Title).
    Removes the H1 line from the content.
    Returns: (title, cleaned_content)
    """
    lines = content.splitlines()
    if not lines:
        return os.path.splitext(filename)[0], content

    first_line = lines[0].strip()
    # Check for markdown H1 (# Title)
    match = re.match(r'^#\s+(.*)', first_line)
    if match:
        title = match.group(1).strip()
        # Remove the first line and any immediate following empty lines
        cleaned_lines = lines[1:]
        while cleaned_lines and not cleaned_lines[0].strip():
            cleaned_lines.pop(0)
        return title, '\n'.join(cleaned_lines)
    
    # Fallback: title from filename
    return os.path.splitext(filename)[0], content

def process_file(file_path, relative_path):
    filename = os.path.basename(file_path)
    
    # Read content
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    # Extract title and clean content
    title, clean_content = get_title_and_clean_content(content, filename)
    
    # Get file modification time for date
    mod_time = os.path.getmtime(file_path)
    date_str = datetime.fromtimestamp(mod_time).strftime('%Y-%m-%dT%H:%M:%S+08:00')
    
    # Determine categories from folder structure
    # relative_path is like "Meta/file.md" or "Category/Subcategory/file.md"
    # We want categories to be ["Category", "Subcategory"]
    path_parts = os.path.normpath(relative_path).split(os.sep)
    categories = path_parts[:-1] # Exclude filename
    
    # Prepare Front Matter
    front_matter = [
        "+++",
        f'title = "{title}"',
        f'date = {date_str}',
        "draft = false",
        f'categories = {categories}',
        "+++"
    ]
    
    # Combine content
    new_content = '\n'.join(front_matter) + '\n\n' + clean_content
    
    # Determine destination path
    # We preserve the subdirectory structure within post/
    # e.g. ref/Meta/file.md -> content/post/Meta/file.md
    dest_subdir = os.path.join(DEST_DIR, *categories)
    os.makedirs(dest_subdir, exist_ok=True)
    dest_path = os.path.join(dest_subdir, filename)
    
    # Write new file
    try:
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Processed: {relative_path} -> {dest_path}")
    except Exception as e:
        print(f"Error writing {dest_path}: {e}")

def main():
    if not os.path.exists(SOURCE_DIR):
        print(f"Source directory not found: {SOURCE_DIR}")
        return

    count = 0
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.lower().endswith('.md'):
                file_path = os.path.join(root, file)
                # relative path from SOURCE_DIR
                relative_path = os.path.relpath(file_path, SOURCE_DIR)
                process_file(file_path, relative_path)
                count += 1
    
    print(f"Migration complete. Processed {count} files.")

if __name__ == "__main__":
    main()
