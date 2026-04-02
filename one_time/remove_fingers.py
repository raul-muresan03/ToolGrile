import cv2
import numpy as np

LOWER_HSV = np.array([0,  48,  80], dtype=np.uint8)
UPPER_HSV = np.array([20, 255, 255], dtype=np.uint8)

KERNEL = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))

def remove_fingers_hsv(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    skin_mask = cv2.inRange(hsv, LOWER_HSV, UPPER_HSV)

    skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, KERNEL)
    skin_mask = cv2.dilate(skin_mask, KERNEL, iterations=1)

    res = img.copy()
    res[skin_mask > 0] = (255, 255, 255)
    return res

for i in range(1, 191):
    path = f"pdf2images/chimie/pagina_{i}.png"

