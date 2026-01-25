import os
import numpy as np

# ==============================================================================
#                               CONFIG PATHS
# ==============================================================================

# Directorul de bază al proiectului (se calculează automat relativ la acest fișier)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Directorul care conține structura de grile organizată pe materii (ex: "final/bio/cap1...")
# Acesta trebuie să conțină subfolderele "bio" și "chimie".
QUIZ_INPUT_DIR_NAME = "final"
QUIZ_INPUT_DIR = os.path.join(BASE_DIR, QUIZ_INPUT_DIR_NAME)

# Directorul unde vor fi salvate simulările generate (Word, PDF, txt)
OUTPUT_SIMULATION_DIR_NAME = "simulari_generate"
OUTPUT_SIMULATION_DIR = os.path.join(BASE_DIR, OUTPUT_SIMULATION_DIR_NAME)

# Directorul unde se află imaginile cu baremuri (trebuie să conțină "bio" și "chimie")
BAREM_DIR_NAME = "baremuri"
BAREM_DIR = os.path.join(BASE_DIR, BAREM_DIR_NAME)

# Director temporar pentru procesări intermediare (ex: eliminare degete, OCR)
TEMP_DIR_NAME = "temp"
TEMP_DIR = os.path.join(BASE_DIR, TEMP_DIR_NAME)


# ==============================================================================
#                               CONFIG SIMULATION
# ==============================================================================

# Numărul de grile de selectat pentru fiecare categorie în generarea simulării
NUM_BIO_QUIZZES = 35
NUM_CHIMIE_TEORIE_QUIZZES = 10
NUM_CHIMIE_PROBLEME_QUIZZES = 5

# Ponderi pentru capitolele de BIOLOGIE
# Cheia este numărul capitolului, valoarea este ponderea (1 = standard, 2 = șanse duble, 0.5 = jumătate)
# Dacă un capitol lipsește, se asumă ponderea 1.0 implicit.


BIOLOGY_CHAPTER_WEIGHTS = {
    1: 1, # Cap 1 - Corpul uman, celula
    2: 1, # Cap 2 - Oasele, articulatiile
    3: 1, # Cap 3 - Tesuturi excitabile
    4: 1, # Cap 4 - Sistemul nervos
    5: 1, # Cap 5 - Organe de simt
    6: 1, # Cap 6 - Sistemul endocrin, metabolism
    7: 1, # Cap 7 - Sangele
    8: 1, # Cap 8 - Sistemul circulator
    9: 1, # Cap 9 - Sistemul respirator
    10: 1, # Cap 10 - Sistemul digestiv
    11: 1, # Cap 11 - Sistemul urinar
    12: 1, # Cap 12 - Sistemul reproducator
    13: 1, # Cap 13 - Grile asociative recapitulative
}

# Ponderi pentru capitolele de CHIMIE (TEORIE)

CHEMISTRY_CHAPTER_WEIGHTS_TEORIE = {
    1: 1, # Cap 1 - Solutii, acizi, baze
    2: 1, # Cap 2 - Compozitia, structura compusilor organici
    3: 1, # Cap 3 - Compusi hidroxilici
    4: 1, # Cap 4 - Amine
    5: 1, # Cap 5 - Aldehide, cetone
    6: 1, # Cap 6 - Acizi carboxilici
    7: 1, # Cap 7 - Proteine
    8: 1, # Cap 8 - Glucide
    9: 1, # Cap 9 - Medicamente, droguri
    10: 1, # Cap 10 - Izomerie
    11: 1, # Cap 11 - Grile asociative recapitulative
}

# Ponderi pentru capitolele de CHIMIE (PROBLEME)

CHEMISTRY_CHAPTER_WEIGHTS_PROBLEME = {
    1: 1, # Cap 1 - Solutii, acizi, baze
    2: 1, # Cap 2 - Compozitia, structura compusilor organici
    3: 1, # Cap 3 - Compusi hidroxilici
    4: 1, # Cap 4 - Amine
    5: 1, # Cap 5 - Aldehide, cetone
    6: 1, # Cap 6 - Acizi carboxilici
    7: 1, # Cap 7 - Proteine
    8: 1, # Cap 8 - Glucide
    9: 1, # Cap 9 - Medicamente, droguri
    10: 1, # Cap 10 - Izomerie
    11: 1, # Cap 11 - Grile asociative recapitulative
}

# ==============================================================================
#                       IMAGE PROCESSING (Finger Removal)
# ==============================================================================

# Praguri HSV pentru detectarea culorii pielii (tonuri deschise)
# Hue (0-179), Saturation (0-255), Value (0-255)
HSV_SKIN_LOWER = np.array([0, 48, 80], dtype=np.uint8)
HSV_SKIN_UPPER = np.array([20, 255, 255], dtype=np.uint8)

# Dimensiunea nucleului pentru operații morfologice (eroziune/dilatare) la curățarea măștii
MORPH_KERNEL_SIZE = (15, 15)


# ==============================================================================
#                           EXTRACT BAR (OCR/Crop)
# ==============================================================================

# Setări pentru pre-procesarea imaginii baremului înainte de conturare
BAREM_BLUR_KERNEL = (7, 7)         # Kernel pentru Gaussian Blur
BAREM_MORPH_KERNEL = (5, 5)        # Kernel pentru morph rect
BAREM_DILATE_ITERATIONS = 2        # Iteratii de dilatare pentru unirea caracterelor

# Dimensiuni minime pentru a considera un contur valid ca fiind o coloană de barem
# Aceste valori depind de rezoluția scanării.
BAREM_ROI_MIN_WIDTH = 75
BAREM_ROI_MIN_HEIGHT_BIO = 150
BAREM_ROI_MIN_HEIGHT_CHIMIE = 100


# ==============================================================================
#                                   OCR
# ==============================================================================

# Limbile folosite de Tesseract (română + engleză)
OCR_LANG = 'ron+eng'

# Configurare mod segmentare pagină (PSM)
# 6 = Assume a single uniform block of text.
OCR_CONFIG_PSM6 = '--psm 6'

# Model regex pentru identificarea numărului grilei la început de linie (ex: "12.")
# Model regex pentru identificarea numărului grilei la început de linie (ex: "12.")
OCR_GRID_NUMBER_PATTERN = r'^\s*(\d+)\.\s*'


# ==============================================================================
#                      SEGMENTATION (Grid Extraction)
# ==============================================================================

# Kernel pentru blurare înainte de thresholding
SEGMENT_BLUR_KERNEL = (7, 7)

# Dimensiunea kernelului morfologic pentru dilatare (pentru a uni contururile)
# Aceasta este valoarea specifică identificată în bio.py și chimie.py
SEGMENT_MORPH_KERNEL_SIZE = (27, 23)

# Praguri minime pentru a considera un contur valid (grilă)
# Bio: h > 150, w > 75
SEGMENT_MIN_HEIGHT_BIO = 150
SEGMENT_MIN_WIDTH_BIO = 75

# Chimie: h > 150, w > 150
SEGMENT_MIN_HEIGHT_CHIMIE = 150
SEGMENT_MIN_WIDTH_CHIMIE = 150

