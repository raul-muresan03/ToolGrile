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
    folders = [
        #bio
        "final/bio/cap1_corpul_uman_celula/grile/done",
        "final/bio/cap2_oasele_articulatiile/grile/done",
        "final/bio/cap3_tesuturi_excitabile/grile/done",
        "final/bio/cap4_sistemul_nervos/grile/done",
        "final/bio/cap5_organe_de_simt/grile/done",
        "final/bio/cap6_sistemul_endocrin_metabolism/grile/done",
        "final/bio/cap7_sangele/grile/done",
        "final/bio/cap8_sistemul_circulator/grile/done",
        "final/bio/cap9_sistemul_respirator/grile/done",
        "final/bio/cap10_sistemul_digestiv/grile/done",
        "final/bio/cap11_sistemul_urinar/grile/done",
        "final/bio/cap12_sistemul_reproducator/grile/done",
        "final/bio/cap13_intrebari_asociative_recap/grile/done",

        #chimie
        "final/chimie/cap1_solutii_acizi_baze/grile/done",
        "final/chimie/cap2_compozitia_structura_compusilor_organici/grile/done",
        "final/chimie/cap3_compusi_hidroxilici/grile/done",
        "final/chimie/cap4_amine/grile/done",
        "final/chimie/cap5_aldehide_cetone/grile/done",
        "final/chimie/cap6_acizi_carboxilici/grile/done",
        "final/chimie/cap7_proteine/grile/done",
        "final/chimie/cap8_glucide/grile/done",
        "final/chimie/cap9_medicamente_droguri/grile/done",
        "final/chimie/cap10_izomerie/grile/done",
        "final/chimie/cap11_grile_asociative_recap/grile/done",
    ]

    for folder_path in folders:
        folder = Path(folder_path)
        print(f"\n=== Se proceseaza folderul: {folder} ===")
        find_missing_numbers(folder)
