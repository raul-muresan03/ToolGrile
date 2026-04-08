import cv2
import pytesseract
import re
import shutil
from pathlib import Path
from configs.config import *

def extract_circle_ROIs(image_path):
    original = cv2.imread(image_path)
    gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, BINARY_THRESHOLD, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(binary, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    # bbox_img = original.copy()

    ROI_list = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if w > MIN_CIRCLE_SIZE and h > MIN_CIRCLE_SIZE:
            aspect_ratio = float(w) / h
            print(f"Found big contour at x={x}, y={y}, w={w}, h={h}, with Ratio: {aspect_ratio}")
            if ASPECT_RATIO_MIN < aspect_ratio < ASPECT_RATIO_MAX:
                if x < MAX_CIRCLE_X:
                    # cv2.rectangle(bbox_img, (x, y), (x + w, y + h), (0, 0, 255), 5)
                    ROI = original[y:y+h, x:x+w]
                    ROI_list.append(ROI)

    # cv2.namedWindow("BBOX Cercuri", cv2.WINDOW_NORMAL)
    # cv2.imshow("BBOX Cercuri", bbox_img)

    return ROI_list


def extract_quiz_numbers(image_path):
    ROIs = extract_circle_ROIs(image_path)
    numbers = []
    for ROI in ROIs:
        ocr_text = pytesseract.image_to_string(ROI, config='--psm 10')
        clean_num = re.sub(r'\D', '', ocr_text)
        numbers.append(clean_num)

    return numbers


def rename_and_move_image(original_image_path, grid_numbers, destination_folder):
    """
    Construiește noul nume al fișierului unind membrii listei `grid_numbers`.
    Exemplu: dacă grid_numbers = ['482', '483', '484'], noul nume trebuie să fie "grid_482_483_484.png"
    Dacă are un singur număr, ex: ['15'], devine "grid_15.png".

    Mută/Copiază fișierul original de la `original_image_path` la destinația nouă.
    """
    pass

def process_all_images(source_folder):
    """
    Iterează prin toate imaginile .png din source_folder (ex: TEMP_DIR / "processed").
    Pentru fiecare imagine:
      1. Apelează extract_grid_numbers()
      2. Dacă lista are elemente, în funcție de intervalul acelor numere, alege din MATH_CHAPTERS.
      3. Apelează rename_and_move_image() trimițând folderul ales.
    """
    pass

if __name__ == "__main__":
    test_image_path = "data/temp/page_69_grid_1.png"

    # 1. Poți testa doar decuparea pentru început (Descomentează când îl implementezi):
    # circles = extract_circle_ROIs(test_image_path)
    # for i, c in enumerate(circles):
        # cv2.imshow(f"Cerc {i}", c)
    # cv2.waitKey(0)

    # 2. Testare cap-coadă
    numbers = extract_quiz_numbers(test_image_path)
    print(f"Numere din cercuri gasite: {numbers}")
