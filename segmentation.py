import cv2
import os
import settings

def extract_grids(subject_name, page_range, input_base_dir, output_base_dir, min_h, min_w, input_filename_fmt="pagina_{}.png", output_filename_fmt="pagina_{}_grila_{}.png", page_offset=0):
    """
    Extracts grid images (ROIs) from pages using identifying counters.
    
    Args:
        subject_name (str): 'bio' or 'chimie' (used for logging/logic).
        page_range (range): Range of page numbers to process.
        input_base_dir (str): Directory containing input images.
        output_base_dir (str): Directory where 'done' or 'bbox' folders will be created.
        min_h (int): Minimum height for a contour to be considered a grid.
        min_w (int): Minimum width for a contour to be considered a grid.
        input_filename_fmt (str): Format string for input filenames (default: "pagina_{}.png").
        output_filename_fmt (str): Format string for output filenames (default: "pagina_{}_grila_{}.png").
        page_offset (int): number to subtract from page index for output naming (e.g. i-6).
    """
    
    # Ensure output directory exists (following the pattern temp/bbox/subject)
    # The output_base_dir passed should probably be the specific subject folder 
    # (e.g. temp/bbox/bio) to be flexible.
    os.makedirs(output_base_dir, exist_ok=True)

    processed_count = 0
    
    for i in page_range:
        # Format filename. if format has {} it uses format, else assumes simple append
        # Adapting to the specific needs:
        # bio: "pagina_{i}.png"
        # chimie: "pagina_{i}_without_fingers.png"
        
        filename = input_filename_fmt.format(i)
        input_path = os.path.join(input_base_dir, filename)
        
        img = cv2.imread(input_path)
        if img is None:
            # print(f"Warning: Could not read {input_path}")
            continue

        img_grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur_img = cv2.GaussianBlur(img_grayscale, settings.SEGMENT_BLUR_KERNEL, 0)
        thresh = cv2.threshold(blur_img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
        
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, settings.SEGMENT_MORPH_KERNEL_SIZE)
        dilate = cv2.dilate(thresh, kernel, iterations=2) # Hardcoded as in originals

        # find contours
        cnts = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cnts = cnts[0] if len(cnts) == 2 else cnts[1]
        cnts = sorted(cnts, key=lambda x: cv2.boundingRect(x)[0])

        grila_index = 1
        
        for c in cnts:
            x, y, w, h = cv2.boundingRect(c)
            if h > min_h and w > min_w:
                roi = img[y:y+h, x:x+w]
                
                # Output naming: pagina_{i-offset}_grila_{index}.png
                output_page_num = i - page_offset
                output_filename = output_filename_fmt.format(output_page_num, grila_index)
                
                output_path = os.path.join(output_base_dir, output_filename)
                
                cv2.imwrite(output_path, roi)
                grila_index += 1
                
                # Draw rect for debug (optional, but was in original scripts)
                # But we don't save the debug image in the original scripts anymore?
                # Wait, original scripts commented out the bbox save:
                # # cv2.imwrite(f"temp/bbox/bio/pagina_{i-6}_bbox.png", img)
                # But they DID draw the rectangle in memory 'img'.
                cv2.rectangle(img, (x, y), (x + w, y + h), (36, 255, 12), 2)
                
        print(f"Gata cu {filename}")
        processed_count += 1
    
    print(f"[{subject_name}] Procesare finalizată. Pagini procesate: {processed_count}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python segmentation.py [bio|chimie]")
        sys.exit(1)
        
    subject = sys.argv[1].lower()
    
    if subject == "bio":
        print("--- Starting Bio Segmentation ---")
        input_dir = os.path.join(settings.BASE_DIR, "pdf2images", "bio")
        output_dir = os.path.join(settings.TEMP_DIR, "bbox", "bio")
        
        extract_grids(
            subject_name="bio",
            page_range=range(7, 259), # Original range
            input_base_dir=input_dir,
            output_base_dir=output_dir,
            min_h=settings.SEGMENT_MIN_HEIGHT_BIO,
            min_w=settings.SEGMENT_MIN_WIDTH_BIO,
            input_filename_fmt="pagina_{}.png",
            output_filename_fmt="pagina_{}_grila_{}.png",
            page_offset=6
        )
        
    elif subject == "chimie":
        print("--- Starting Chimie Segmentation ---")
        input_dir = os.path.join(settings.TEMP_DIR, "without_fingers", "chimie")
        output_dir = os.path.join(settings.TEMP_DIR, "bbox", "chimie")
        
        extract_grids(
            subject_name="chimie",
            page_range=range(6, 191), # Original range
            input_base_dir=input_dir,
            output_base_dir=output_dir,
            min_h=settings.SEGMENT_MIN_HEIGHT_CHIMIE,
            min_w=settings.SEGMENT_MIN_WIDTH_CHIMIE,
            input_filename_fmt="pagina_{}_without_fingers.png",
            output_filename_fmt="pagina_{}_grila_{}.png",
            page_offset=5
        )
    else:
        print(f"Unknown subject: {subject}. Use 'bio' or 'chimie'.")

