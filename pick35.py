import os
import random
import shutil

source_folder = "temp/bbox/chimie/cap8_glucide/grile/done"
destination_folder = "simulare8/chimie"
number_of_images = 15
range_max = 125

os.makedirs(destination_folder, exist_ok=True)

selected_numbers = random.sample(range(1, range_max + 1), number_of_images)

for num in selected_numbers:
    filename = f"{num}.png"
    source_path = os.path.join(source_folder, filename)
    destination_path = os.path.join(destination_folder, filename)

    if os.path.exists(source_path):
        shutil.copy(source_path, destination_path)
        print(f"S-a copiat cu succes: {filename}")
    else:
        print(f"Fisierul nu exista: {filename}")

print("\nSelectarea si copierea imaginilor s-a terminat.")
