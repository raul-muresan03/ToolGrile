import cv2
import pytesseract
import re
import shutil
from pathlib import Path
from multiprocessing import Pool
from configs.config import *

def extract_circle_ROIs(image_path):
    original = cv2.imread(image_path)
    gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, BINARY_THRESHOLD, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(binary, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    ROI_list = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if w > MIN_CIRCLE_SIZE and h > MIN_CIRCLE_SIZE:
            aspect_ratio = float(w) / h
            if ASPECT_RATIO_MIN < aspect_ratio < ASPECT_RATIO_MAX:
                if x < MAX_CIRCLE_X:
                    ROI = original[y:y+h, x:x+w]
                    ROI_list.append(ROI)

    return ROI_list


def extract_quiz_numbers(image_path):
    ROIs = extract_circle_ROIs(image_path)
    numbers = []
    for ROI in ROIs:
        h, w = ROI.shape[:2]
        margin = 15
        inner = ROI[margin:h-margin, margin:w-margin]
        inner = cv2.resize(inner, (300, 300), interpolation=cv2.INTER_CUBIC)

        ocr_text = pytesseract.image_to_string(inner, config='--psm 8 -c tessedit_char_whitelist=0123456789')
        clean_num = re.sub(r'\D', '', ocr_text)
        if clean_num:
            numbers.append(clean_num)

    return numbers


def rename_and_move_image(original_image_path, quiz_numbers, destination_folder):
    original_path = Path(original_image_path)
    original_stem = original_path.stem

    page_prefix = "_".join(original_stem.split("_")[:2])

    if not quiz_numbers:
        unknown_folder = Path(destination_folder) / "unknown_quizzes"
        unknown_folder.mkdir(parents=True, exist_ok=True)
        new_image_path = unknown_folder / f"{original_stem}_unknown.png"
    else:
        dest_folder = Path(destination_folder)
        dest_folder.mkdir(parents=True, exist_ok=True)
        quiz_numbers.sort(key=int)
        joined_numbers = "_".join(quiz_numbers)
        new_image_path = dest_folder / f"{page_prefix}_quiz_{joined_numbers}.png"

    shutil.copy(original_image_path, new_image_path)


def process_single_quiz(image_path):
    quiz_numbers = extract_quiz_numbers(str(image_path))
    rename_and_move_image(str(image_path), quiz_numbers, INDEXED_QUIZZES_DIR)


if __name__ == "__main__":
    images = list(RAW_QUIZZES_DIR.glob("*.png"))
    print(f"Processing {len(images)} quizzes...")

    with Pool() as pool:
        pool.map(process_single_quiz, images)

    indexed = len(list(INDEXED_QUIZZES_DIR.glob("*.png")))
    unknowns = len(list((INDEXED_QUIZZES_DIR / "unknown_quizzes").glob("*.png")))

    print("Done!")
    print(f"Total processed: {total_total}")
    print(f"Successfully indexed: {indexed}")
    print(f"Unknowns: {unknowns} (check subfolder)")
