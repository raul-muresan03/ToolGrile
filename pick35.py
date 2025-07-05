import os
import random
import shutil

# === Setări ===
source_folder = "temp/bbox/chimie/cap8_glucide/grile/done"           # Folderul unde se află imaginile (ex: "imagini/32.png")
destination_folder = "simulare8/chimie"    # Folderul unde vor fi copiate imaginile selectate
number_of_images = 15               # Numărul de imagini de ales
range_max = 125                     # Intervalul maxim (de la 1 la 160)

# === Creează folderul de destinație dacă nu există ===
os.makedirs(destination_folder, exist_ok=True)

# === Alege aleatoriu 35 de numere unice între 1 și 160 ===
selected_numbers = random.sample(range(1, range_max + 1), number_of_images)

# === Copiază fișierele selectate ===
for num in selected_numbers:
    filename = f"{num}.png"
    source_path = os.path.join(source_folder, filename)
    destination_path = os.path.join(destination_folder, filename)

    if os.path.exists(source_path):
        shutil.copy(source_path, destination_path)
        print(f"✔ Copiat: {filename}")
    else:
        print(f"⚠ Fișierul nu există: {filename}")

print("\n✅ Selectarea și copierea imaginilor s-a încheiat.")
