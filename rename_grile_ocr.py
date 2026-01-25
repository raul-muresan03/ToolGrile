import os
import re
from PIL import Image
import pytesseract
import shutil
from pathlib import Path
import settings

def rename_images_by_ocr(folder_path):
    print(f"Starting OCR-based renaming and moving in: {folder_path}")

    done_folder_path = os.path.join(folder_path, "done")

    try:
        os.makedirs(done_folder_path, exist_ok=True)
        # print(f"Ensured 'done' folder exists at: {done_folder_path}")
    except OSError as e:
        print(f"Error creating 'done' folder: {e}")
        return

    number_pattern = re.compile(settings.OCR_GRID_NUMBER_PATTERN, re.MULTILINE)

    processed_files_count = 0
    renamed_and_moved_count = 0

    try:
        for filename in sorted(os.listdir(folder_path)):
            if filename == "done" or not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                # print(f"Skipping non-image file or 'done' folder: {filename}")
                continue

            original_full_path = os.path.join(folder_path, filename)
            print(f"Processing: {filename}")

            try:
                img = Image.open(original_full_path)
                img = img.convert('L')

                text = pytesseract.image_to_string(
                    img, config=settings.OCR_CONFIG_PSM6, lang=settings.OCR_LANG)

                match = number_pattern.search(text)

                if match:
                    grid_number = match.group(1)
                    new_filename = f"{grid_number}.png"
                    destination_full_path = os.path.join(done_folder_path, new_filename)

                    if os.path.exists(destination_full_path):
                        print(f"Warning: Destination '{new_filename}' already exists in 'done'. Skipping {filename}.")
                    else:
                        shutil.move(original_full_path, destination_full_path)
                        print(f"  Renamed and moved: {filename} -> {new_filename}")
                        renamed_and_moved_count += 1
                else:
                    print(f"  No grid number found in {filename}. File remains.")

            except pytesseract.TesseractNotFoundError:
                print("ERROR: Tesseract is not installed or not in your PATH.")
                return
            except Exception as e:
                print(f"Error processing {filename}: {e}")

            processed_files_count += 1

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return

    print(f"Folder finished. Processed: {processed_files_count}, Moved: {renamed_and_moved_count}")


def get_grile_folders(base_dir):
    """
    Traverse the directory structure to find all 'grile' folders.
    Structure: base_dir / subject / chapter / grile
    """
    grile_folders = []
    
    if not os.path.exists(base_dir):
        print(f"Error: Base directory '{base_dir}' does not exist.")
        return []

    # Iterate over subjects (bio, chimie)
    for subject in os.listdir(base_dir):
        subject_path = os.path.join(base_dir, subject)
        if not os.path.isdir(subject_path):
            continue
        
        # Iterate over chapters
        for chapter in os.listdir(subject_path):
            chapter_path = os.path.join(subject_path, chapter)
            if not os.path.isdir(chapter_path):
                continue
            
            # Check for 'grile' folder
            grile_path = os.path.join(chapter_path, "grile")
            if os.path.isdir(grile_path):
                grile_folders.append(grile_path)
                
    return grile_folders

if __name__ == "__main__":
    folders = get_grile_folders(settings.QUIZ_INPUT_DIR)
    
    if not folders:
        print(f"No 'grile' folders found in {settings.QUIZ_INPUT_DIR}")
    else:
        print(f"Found {len(folders)} folders to process.")
        for folder_path in folders:
            folder = Path(folder_path)
            print(f"\n=== Processing folder: {folder} ===")
            rename_images_by_ocr(folder)
