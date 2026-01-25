import cv2
import numpy as np
import settings

def remove_fingers_hsv(img):
    """
    Remove fingers from the image using skin color detection in HSV.
    """
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Use thresholds from settings
    skin_mask = cv2.inRange(hsv, settings.HSV_SKIN_LOWER, settings.HSV_SKIN_UPPER)

    # Create kernel using size from settings
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, settings.MORPH_KERNEL_SIZE)

    # curățare & extindere
    skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)
    skin_mask = cv2.dilate(skin_mask, kernel, iterations=1)

    # peste mască, punem alb
    res = img.copy()
    res[skin_mask > 0] = (255, 255, 255)
    return res

#chimie
for i in range(1, 191):
    path = f"pdf2images/chimie/pagina_{i}.png"
    # img = cv2.imread(path)
    # out = remove_fingers_hsv(img)
    # cv2.imwrite(f"temp/without_fingers/chimie/pagina_{i}_without_fingers.png", out)
    # print(f"Gata pagina_{i}.png")