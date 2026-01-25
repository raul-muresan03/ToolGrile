import fitz
import os
import settings

INPUT_PDF_DIR = os.path.join(settings.BASE_DIR, "input_pdf")
PDF_FILENAME = "culegere_bio_cluj.pdf"
in_path = os.path.join(INPUT_PDF_DIR, PDF_FILENAME)

# Using a generic output path or specific bio one
out_path = os.path.join(settings.BASE_DIR, "pdf2images", "bio")
os.makedirs(out_path, exist_ok=True)

doc = fitz.open(in_path)
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    pix = page.get_pixmap(dpi=300)
    filename = f"pagina_{page_num + 1}.png"
    pix.save(os.path.join(out_path, filename), "PNG")

print("Imaginile au fost salvate in folderul:", out_path)
