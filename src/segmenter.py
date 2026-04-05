import cv2
import numpy as np
from pathlib import Path
from configs.config import *

def preprocess_image(image_path):
    original = cv2.imread(image_path)
    gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, BINARY_THRESHOLD, 255, cv2.THRESH_BINARY_INV)
    
    # kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
    # binary = cv2.dilate(binary, kernel, iterations=1)
    
    return original, binary


def get_horizontal_projection(binary_image):
    return np.sum(binary_image, axis=1)

def find_segments(hpp_profile, min_height=50):
    segments = []
    start_y = None
    in_text = False

    for i in range(len(hpp_profile)):
        if hpp_profile[i] > HPP_THRESHOLD and in_text == False:
            start_y = i
            in_text = True
        elif hpp_profile[i] <= HPP_THRESHOLD and in_text == True:
            block_size = i - start_y
            if block_size >= min_height:
                segments.append((start_y, i))
            in_text = False

    if in_text == True:
        last_index = len(hpp_profile) - 1
        block_size = last_index - start_y
        if block_size >= min_height:
            segments.append((start_y, last_index))

    return segments

def crop_and_save_segments(original_image, segments, output_dir, page_index):
    out_path = Path(output_dir)
    for i, (start_y, end_y) in enumerate(segments):
        quiz_image = original_image[start_y : end_y, :]
        filename = out_path / f"page_{page_index}_grid_{i + 1}.png"
        cv2.imwrite(str(filename), quiz_image)


if __name__ == "__main__":
    test_image_path = "data/temp/pages/page_007.png"
    
    # 1. Preprocess
    original, binary = preprocess_image(test_image_path)

    # cv2.namedWindow("Original", cv2.WINDOW_NORMAL)
    # cv2.namedWindow("Binary", cv2.WINDOW_NORMAL)
    
    # cv2.imshow("Original", original)
    # cv2.imshow("Binary", binary)

    # 2. HPP
    histo_array = get_horizontal_projection(binary)
    # print(histo_array)

    # 3. Segments
    segments = find_segments(histo_array)
    # print(segments)

    # 4. Cut
    crop_and_save_segments(original, segments, "data/temp", 7)

    copy = original.copy()
    width = copy.shape[1]
    for i, (start_y, end_y) in enumerate(segments):
        cv2.rectangle(copy, (0, start_y), (width, end_y), (0, 0, 255), 2)
    
    # cv2.namedWindow("Original", cv2.WINDOW_NORMAL)
    cv2.namedWindow("Copy - BBOX", cv2.WINDOW_NORMAL)
    
    # cv2.imshow("Original", original)
    cv2.imshow("Copy - BBOX", copy)

    cv2.waitKey(0)