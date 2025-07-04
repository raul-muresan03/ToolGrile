import cv2
import numpy as np

# praguri HSV specifice pielii (aprox. pentru tonuri deschise)
# hue 0–20, sat destul de ridicată, luminozitate moderată
LOWER_HSV = np.array([0,  48,  80], dtype=np.uint8)
UPPER_HSV = np.array([20, 255, 255], dtype=np.uint8)

KERNEL = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))


def remove_fingers_hsv(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    skin_mask = cv2.inRange(hsv, LOWER_HSV, UPPER_HSV)

    # curățare & extindere
    skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, KERNEL)
    skin_mask = cv2.dilate(skin_mask, KERNEL, iterations=1)

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