import os
import re
from PIL import Image
import pytesseract
import shutil

def rename_images_by_ocr(folder_path):
    print(f"Starting OCR-based renaming and moving in: {folder_path}")

    done_folder_path = os.path.join(folder_path, "done")

    try:
        os.makedirs(done_folder_path, exist_ok=True)
        print(f"Ensured 'done' folder exists at: {done_folder_path}")
    except OSError as e:
        print(f"Error creating 'done' folder: {e}")
        return

    number_pattern = re.compile(r'^\s*(\d+)\.\s*', re.MULTILINE)

    processed_files_count = 0
    renamed_and_moved_count = 0

    try:
        for filename in sorted(os.listdir(folder_path)):
            if filename == "done" or not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                print(f"Skipping non-image file or 'done' folder: {filename}")
                continue

            original_full_path = os.path.join(folder_path, filename)
            print(f"\nProcessing: {filename}")

            try:
                img = Image.open(original_full_path)
                
                img = img.convert('L')
                
                text = pytesseract.image_to_string(img, config='--psm 6', lang='ron+eng')
                
                # print(f"Extracted text from {filename}:\n{text[:200]}...")

                match = number_pattern.search(text)

                if match:
                    grid_number = match.group(1) # Extrage numărul
                    new_filename = f"{grid_number}.png" # Noul nume al fisierului (asumand .png)
                    
                    # Calea completă pentru noul fișier în folderul 'done'
                    destination_full_path = os.path.join(done_folder_path, new_filename)

                    # Verifică dacă noul nume există deja în folderul 'done'
                    if os.path.exists(destination_full_path):
                        print(f"Warning: Destination filename '{new_filename}' already exists in 'done' folder. Skipping {filename}.")
                    else:
                        # Mută și redenumește fișierul
                        shutil.move(original_full_path, destination_full_path)
                        print(f"Renamed and moved: {filename} -> {new_filename} in 'done' folder.")
                        renamed_and_moved_count += 1
                else:
                    print(f"No grid number found in {filename} using pattern. File remains in original folder.")

            except pytesseract.TesseractNotFoundError:
                print("ERROR: Tesseract is not installed or not in your PATH. Please install it.")
                return
            except Exception as e:
                print(f"Error processing {filename}: {e}")
            
            processed_files_count += 1

    except FileNotFoundError:
        print(f"Error: The folder path does not exist: {folder_path}")
        return
    except PermissionError:
        print(f"Error: Permission denied to access folder: {folder_path}")
        return
    except Exception as e:
        print(f"An unexpected error occurred while listing directory: {e}")
        return

    print(f"\n--- Renaming and Moving process finished ---")
    print(f"Total files processed: {processed_files_count}")
    print(f"Total files renamed and moved: {renamed_and_moved_count}")
    print(f"Files that could not be processed/renamed/moved: {processed_files_count - renamed_and_moved_count}")


# folder_cu_grile = "C:\\proiecte_personale\\ToolGrile\\temp\\bbox\\bio\\cap13_intrebari_asociative_recap\\grile" 
folder_cu_grile = "C:\\proiecte_personale\\ToolGrile\\temp\\bbox\\chimie\\cap11_grile_asociative_recap\\grile" 

rename_images_by_ocr(folder_cu_grile)