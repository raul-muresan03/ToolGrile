import fitz
import os

in_path = "input_pdf/culegere_bio_cluj.pdf"
out_path = "pdf2images/bio"
os.makedirs(out_path, exist_ok=True)

doc = fitz.open(in_path)
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    pix = page.get_pixmap(dpi=300)
    filename = f"pagina_{page_num + 1}.png"
    pix.save(os.path.join(out_path, filename), "PNG")

print("Imaginile au fost salvate in folderul:", out_path)
