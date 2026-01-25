import cv2
import os
import settings

def _process_barem_chapter(subject_name, chapter_num, min_height):
    """
    Helper function to process a single barem chapter image.
    Encapsulates the common logic for reading, preprocessing, contour detection, and saving ROIs.
    """
    # Construiește calea către fișierul sursă: BAREM_DIR / subject_name / capX_barem.png
    # Ex: baremuri/bio/cap1_barem.png
    input_filename = f"cap{chapter_num}_barem.png"
    input_path = os.path.join(settings.BAREM_DIR, subject_name, input_filename)

    if not os.path.exists(input_path):
        # Dacă fișierul nu există, sărim peste el (similar cu comportamentul original implicit)
        return

    img = cv2.imread(input_path)
    if img is None:
        return

    # Creează structura de directoare de output în TEMP_DIR
    # Ex: temp/bio
    subject_temp_dir = os.path.join(settings.TEMP_DIR, subject_name)
    os.makedirs(subject_temp_dir, exist_ok=True)

    # 1. Pre-procesare Imagine
    img_grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur_img = cv2.GaussianBlur(img_grayscale, settings.BAREM_BLUR_KERNEL, 0)
    thresh = cv2.threshold(blur_img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, settings.BAREM_MORPH_KERNEL)
    dilate = cv2.dilate(thresh, kernel, iterations=settings.BAREM_DILATE_ITERATIONS)
    
    # Salvează varianta dilatată pentru debug
    cv2.imwrite(os.path.join(subject_temp_dir, f"cap{chapter_num}_barem_dilate.png"), dilate)

    # 2. Găsire contururi
    cnts = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    cnts = sorted(cnts, key=lambda x: cv2.boundingRect(x)[0])

    # Creează folder specific pentru grilele extrase din acest capitol
    # Ex: temp/bio/1/
    chapter_roi_dir = os.path.join(subject_temp_dir, str(chapter_num))
    os.makedirs(chapter_roi_dir, exist_ok=True)

    index = 1
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        # Filtrare după dimensiuni (înălțime minimă difera între materii)
        if h > min_height and w > settings.BAREM_ROI_MIN_WIDTH:
            roi = img[y:y+h, x:x+w]
            cv2.imwrite(os.path.join(chapter_roi_dir, f"{index}.png"), roi)
            index += 1
            cv2.rectangle(img, (x, y), (x + w, y + h), (36, 255, 12), 2)

    # Salvează imaginea debug cu dreptunghiurile identificate
    cv2.imwrite(os.path.join(subject_temp_dir, f"cap{chapter_num}_barem_temp.png"), img)
    print(f"Gata cu pagina_{chapter_num}.png")


def extract_barem(selector):
    """
    Funcția principală care iterează prin capitole în funcție de selector.
    1 = Biologie
    2 = Chimie
    """
    if selector == 1:  # bio
        # Biologie are 13 capitole (range 1-14)
        for i in range(1, 14):
            _process_barem_chapter("bio", i, settings.BAREM_ROI_MIN_HEIGHT_BIO)

    elif selector == 2:  # chimie
        # Chimie are 11 capitole (range 1-12)
        for i in range(1, 12):
            _process_barem_chapter("chimie", i, settings.BAREM_ROI_MIN_HEIGHT_CHIMIE)


if __name__ == "__main__":
    extract_barem(1)
    # extract_barem(2)
