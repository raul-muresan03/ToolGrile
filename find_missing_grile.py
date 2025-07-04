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

    # print(f"Numere găsite: {sorted(nums)}")
    print(f"Cel mai mare număr: {maxim}")
    if missing:
        print(f"Numerele care lipsesc: {missing}")
    else:
        print("Nu lipsesc numere între 1 și", maxim)

if __name__ == "__main__":
    folder = Path("temp/bbox/bio/cap1_corpul_uman_celula/grile")
    find_missing_numbers(folder)
