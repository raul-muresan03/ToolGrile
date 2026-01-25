import os
import re
from pathlib import Path

def find_missing_numbers(folder: Path):
    pattern = re.compile(r"^(\d+)(?:\.\w+)?$")
    nums = set()

    for p in folder.iterdir():
        if not p.is_file():
            continue
        m = pattern.match(p.name)
        if m:
            nums.add(int(m.group(1)))

    if not nums:
        print("Nu s-a găsit niciun fișier numerotat doar cu cifre.")
        return

    maxim = max(nums)
    missing = [i for i in range(1, maxim + 1) if i not in nums]

    print(f"Cel mai mare număr: {maxim}")
    if missing:
        print(f"Numerele care lipsesc: {missing}")
    else:
        print("Nu lipsesc numere între 1 și", maxim)

    # Scriem rezultatul într-un fișier .txt
    output_file = folder / "missing_grile.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        if missing:
            f.write("Grilele care lipsesc:\n")
            f.write(", ".join(str(i) for i in missing))
            f.write("\n")
        else:
            f.write(f"Toate grilele de la 1 la {maxim} există.\n")

    print(f"Lista grilelor lipsă a fost salvată în: {output_file}")

if __name__ == "__main__":
    import settings
    
    # Use dynamic traversal instead of hardcoded list
    folders = []
    
    # Helper to find all 'done' folders
    if os.path.exists(settings.QUIZ_INPUT_DIR):
        for subject in os.listdir(settings.QUIZ_INPUT_DIR):
            subject_path = os.path.join(settings.QUIZ_INPUT_DIR, subject)
            if not os.path.isdir(subject_path): continue
            
            for chapter in os.listdir(subject_path):
                chapter_path = os.path.join(subject_path, chapter)
                if not os.path.isdir(chapter_path): continue
                
                done_path = os.path.join(chapter_path, "grile", "done")
                if os.path.exists(done_path):
                    folders.append(done_path)
    
    if not folders:
        print(f"Nu s-au găsit foldere 'done' în {settings.QUIZ_INPUT_DIR}")

    for folder_path in folders:
        folder = Path(folder_path)
        print(f"\n=== Se proceseaza folderul: {folder} ===")
        find_missing_numbers(folder)
