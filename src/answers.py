import cv2
import pytesseract
import json
import re
from pathlib import Path
import numpy as np
from configs.config import *

def extract_answers_from_page(image_path):
    img = cv2.imread(str(image_path))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    vertical_sum = np.sum(255 - binary, axis=0)

    list_indeces = [i for i, val in enumerate(vertical_sum) if val > img.shape[0] * 0.5 * 255]

    separators = [0]
    for i in range(len(list_indeces) - 1):
        if list_indeces[i+1] - list_indeces[i] > 10:
            separators.append(list_indeces[i])

    if list_indeces:
        separators.append(list_indeces[-1])
    separators.append(img.shape[1])

    all_extracted_matches = []

    for i in range(len(separators) - 1):
        x1, x2 = separators[i], separators[i+1]

        strip = binary[:, x1 : x2]
        if strip.shape[1] < 15: continue

        padded = cv2.copyMakeBorder(strip, 50, 50, 50, 50, cv2.BORDER_CONSTANT, value=255)

        text_ocr = pytesseract.image_to_string(padded, config='--psm 6')

        replacements = {
            'l': '1', 'I': '1', '|': '1', 'i': '1', 'L': '1',
            'S': '5', 's': '5', 'G': '6', 'Z': '2', 'o': '0', 'O': '0'
        }
        for char, num in replacements.items():
            text_ocr = text_ocr.replace(char, num)

        pattern = r'(\d+)\s*[^\w]*\s*([A-Ea-e])'
        matches = re.findall(pattern, text_ocr)
        all_extracted_matches.extend(matches)

    return {int(num): letter.upper() for num, letter in all_extracted_matches}

def solve_all_answers():
    all_keys = {}
    start, end = ANSWERS_PAGES

    for page_num in range(start, end + 1):
        img_path = PAGES_DIR / f"page_{page_num}.png"
        if img_path.exists():
            print(f"Processing answer page {page_num}...")
            page_results = extract_answers_from_page(img_path)
            all_keys.update(page_results)

    return all_keys

if __name__ == "__main__":
    answers = solve_all_answers()
    sorted_answers = dict(sorted(answers.items()))

    output_path = PROCESSED_DIR / "final_answers.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(sorted_answers, f, indent=4)

    print(f"Done! Extracted {len(sorted_answers)} answers to {output_path}")
