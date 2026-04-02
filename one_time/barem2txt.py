##########################
##### nefunctional
##########################





# import os
# import pytesseract
# from PIL import Image
# import re

# # Setul de baza al directorului unde se afla imaginile baremului segmentate
# TEMP_BAREM_BASE_DIR = "temp_barem"

# def convert_segmented_barem_images_to_txt(base_dir):
#     """
#     Parcurge directoarele, găsește imaginile baremelor segmentate,
#     extrage textul și le concatenează într-un singur fișier TXT per capitol.
#     """
#     print(f"Încep conversia imaginilor barem segmentate din: {base_dir}")

#     # Subiectele principale și numărul maxim de capitole pentru fiecare
#     subjects_info = {
#         "bio": 13,
#         "chimie": 11
#     }

#     for subject_folder_name, max_chapters in subjects_info.items():
#         subject_path = os.path.join(base_dir, subject_folder_name)

#         if not os.path.isdir(subject_path):
#             print(f"Directorul '{subject_path}' nu există. Sărit.")
#             continue

#         print(f"\n  Procesez subiectul: {subject_folder_name}")

#         for chapter_num in range(1, max_chapters + 1):
#             chapter_folder_path = os.path.join(subject_path, str(chapter_num))

#             if not os.path.isdir(chapter_folder_path):
#                 # print(f"    Directorul capitolului '{chapter_folder_path}' nu există. Sărit.")
#                 continue

#             print(f"    Procesez capitolul: {chapter_num}")
            
#             combined_text_for_chapter = []
            
#             # Colectează toate fișierele PNG din directorul capitolului și sortează-le numeric
#             barem_image_files = [f for f in os.listdir(chapter_folder_path) 
#                                   if f.lower().endswith(".png") and re.match(r"^\d+\.png$", f)]
            
#             # Sortează fișierele numeric pentru a asigura ordinea corectă a coloanelor
#             barem_image_files.sort(key=lambda f: int(f.split('.')[0]))

#             if not barem_image_files:
#                 # print(f"      Nu s-au găsit imagini barem PNG în '{chapter_folder_path}'. Sărit.")
#                 continue

#             for barem_filename in barem_image_files:
#                 barem_image_path = os.path.join(chapter_folder_path, barem_filename)
#                 # print(f"        Găsit imagine: {barem_image_path}")

#                 try:
#                     # Deschide imaginea
#                     img = Image.open(barem_image_path)
                    
#                     # Efectuează OCR pentru a extrage textul.
#                     # Configurația '--psm 6' (Assume a single uniform block of text)
#                     # este adesea bună pentru coloane. Puteți experimenta cu `--psm 7` (Treat the image as a single text line).
#                     # 'lang=ron' dacă aveți instalat pachetul de limbă română pentru Tesseract.
#                     text = pytesseract.image_to_string(img, lang='ron', config='--psm 7 --oem 1')
                    
#                     # Adaugă textul extras la lista pentru capitolul curent
#                     combined_text_for_chapter.append(text.strip())

#                 except pytesseract.TesseractNotFoundError:
#                     print("\nEroare: Tesseract OCR nu a fost găsit. Asigură-te că este instalat și în PATH.")
#                     print("Vezi https://tesseract-ocr.github.io/tessdoc/Downloads.html pentru instalare.")
#                     return # Oprim procesul dacă Tesseract nu este găsit
#                 except Exception as e:
#                     print(f"        Eroare la procesarea imaginii {barem_image_path}: {e}")
#                     # Continuăm cu următoarea imagine, dar arătăm eroarea
            
#             # Scrie textul combinat într-un fișier TXT pentru capitol
#             if combined_text_for_chapter:
#                 output_txt_filename = f"{subject_folder_name}_cap{chapter_num}_barem.txt"
#                 # Salvează fișierul TXT direct în folderul subiectului (ex: temp_barem/bio/)
#                 output_txt_path = os.path.join(subject_path, output_txt_filename) 

#                 with open(output_txt_path, "w", encoding="utf-8") as f:
#                     # Fiecare coloană de text pe o linie nouă, sau separate printr-un spațiu, depinde cum vrei să le vezi.
#                     # Dacă vrei fiecare coloană pe o linie nouă: '\n'.join(combined_text_for_chapter)
#                     # Dacă vrei pe aceeași linie, separate de un spațiu: ' '.join(combined_text_for_chapter)
#                     f.write('\n\n'.join(combined_text_for_chapter)) # Două linii noi pentru separare mai clară între coloane
                
#                 print(f"      Text combinat și salvat în: {output_txt_path}")
#             else:
#                 print(f"      Nu s-a putut extrage text din imaginile pentru capitolul {chapter_num}.")

#     print("\nConversia baremelor segmentate finalizată!")

# if __name__ == "__main__":
#     if not os.path.exists(TEMP_BAREM_BASE_DIR):
#         print(f"Eroare: Directorul de bază pentru bareme '{TEMP_BAREM_BASE_DIR}' nu există.")
#         print("Asigură-te că structura ta este 'temp_barem/bio/X/Y.png' și 'temp_barem/chimie/X/Y.png'.")
#     else:
#         convert_segmented_barem_images_to_txt(TEMP_BAREM_BASE_DIR)