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
            # print(f"Found big contour at x={x}, y={y}, w={w}, h={h}, with Ratio: {aspect_ratio}")
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
        if clean_num:
            numbers.append(clean_num)

    return numbers


def rename_and_move_image(original_image_path, grid_numbers, destination_folder):
    dest_folder = Path(destination_folder)
    dest_folder.mkdir(parents=True, exist_ok=True)

    grid_numbers.sort(key=int)

    if not grid_numbers:
        joined_numbers = "unknown"
    else:
        joined_numbers = "_".join(grid_numbers)

    new_image_path = dest_folder / f"grid_{joined_numbers}.png"
    shutil.copy(original_image_path, new_image_path)
    # print(f"Succees: File moved to -> {new_image_path}")


def process_all_images(source_folder):
    source_images = Path(source_folder).glob("*.png")
    test_dest = Path("data/temp/indexed_test")
    for index, i in enumerate(source_images):
        if index == 50:
            break
        quiz_numbers = extract_quiz_numbers(str(i))
        rename_and_move_image(str(i), quiz_numbers, test_dest)


if __name__ == "__main__":
    # test_image_path = "data/temp/page_69_grid_1.png"

    # circles = extract_circle_ROIs(test_image_path)
    # for i, c in enumerate(circles):
        # cv2.imshow(f"Cerc {i}", c)
    # cv2.waitKey(0)

    # numbers = extract_quiz_numbers(test_image_path)
    # print(f"Numbers found (from circles): {numbers}")

    process_all_images("data/temp")
