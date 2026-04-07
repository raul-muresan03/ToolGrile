from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.parent
DATA_DIR = ROOT_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
TEMP_DIR = DATA_DIR / "temp"
PAGES_DIR = TEMP_DIR / "pages"
PROCESSED_DIR = DATA_DIR / "processed"
OUTPUT_DIR = ROOT_DIR / "outputs"

RAW_PDF_PATH = RAW_DIR / "culegere_grile_utcn.pdf"

DPI = 300
MATH_CHAPTERS = {
    "algebra": PROCESSED_DIR / "algebra",
    "analiza": PROCESSED_DIR / "analiza",
    "geometrie": PROCESSED_DIR / "geometrie",
    "trigonometrie": PROCESSED_DIR / "trigonometrie",
    "subiecte_admitere_simulare": PROCESSED_DIR / "subiecte_admitere_simulare"
}

for path in [PAGES_DIR, PROCESSED_DIR, OUTPUT_DIR] + list(MATH_CHAPTERS.values()):
    path.mkdir(parents=True, exist_ok=True)


BINARY_THRESHOLD = 240
HPP_THRESHOLD = 3000

MIN_CIRCLE_SIZE = 80
ASPECT_RATIO_MIN = 0.85
ASPECT_RATIO_MAX = 1.15
MAX_CIRCLE_X = 350