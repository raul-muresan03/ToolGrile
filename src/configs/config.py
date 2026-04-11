from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.parent
DATA_DIR = ROOT_DIR / "data"
OUTPUT_DIR = ROOT_DIR / "outputs"

RAW_DIR = DATA_DIR / "raw"
TEMP_DIR = DATA_DIR / "temp"
PROCESSED_DIR = DATA_DIR / "processed"

PAGES_DIR = TEMP_DIR / "pages"
RAW_QUIZZES_DIR = TEMP_DIR / "raw_quizzes"
INDEXED_QUIZZES_DIR = TEMP_DIR / "indexed_quizzes"

RAW_PDF_PATH = RAW_DIR / "culegere_grile_utcn.pdf"

DPI = 300
MATH_CHAPTERS = {
    "algebra": PROCESSED_DIR / "algebra",
    "analiza": PROCESSED_DIR / "analiza",
    "geometrie": PROCESSED_DIR / "geometrie",
    "trigonometrie": PROCESSED_DIR / "trigonometrie",
    "subiecte_admitere_simulare": PROCESSED_DIR / "subiecte_admitere_simulare",
    "unknown_chapter": PROCESSED_DIR / "unknown"
}

CHAPTER_PAGES = {
    "algebra": (7, 37),
    "analiza": (39, 77),
    "geometrie": (79, 83),
    "trigonometrie": (85, 94),
    "subiecte_admitere_simulare": (95, 148)
}

def get_chapter_by_page(page_num):
    for chapter, (start, end) in CHAPTER_PAGES.items():
        if start <= page_num <= end:
            return chapter
    return "unknown_chapter"


for path in [PAGES_DIR, PROCESSED_DIR, OUTPUT_DIR] + list(MATH_CHAPTERS.values()):
    path.mkdir(parents=True, exist_ok=True)


BINARY_THRESHOLD = 240
HPP_THRESHOLD = 3000

MIN_CIRCLE_SIZE = 50
MAX_CIRCLE_SIZE = 150
ASPECT_RATIO_MIN = 0.85
ASPECT_RATIO_MAX = 1.15
MAX_CIRCLE_X = 350

MIN_CONTOUR_AREA = 10000