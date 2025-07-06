import cv2

def extract_barem(selector):
    if selector == 1:  # bio
        for i in range(1, 14):
            img = cv2.imread(f"baremuri/bio/cap{i}_barem.png")

            img_grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blur_img = cv2.GaussianBlur(img_grayscale, (7, 7), 0)
            thresh = cv2.threshold(
                blur_img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
            dilate = cv2.dilate(thresh, kernel, iterations=2)
            cv2.imwrite(f"temp_barem/bio/cap{i}_barem_dilate.png", dilate)

            # find contours
            cnts = cv2.findContours(
                dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            cnts = cnts[0] if len(cnts) == 2 else cnts[1]
            cnts = sorted(cnts, key=lambda x: cv2.boundingRect(x)[0])

            index = 1
            for c in cnts:
                x, y, w, h = cv2.boundingRect(c)
                if h > 150 and w > 75:
                    roi = img[y:y+h, x:x+w]
                    cv2.imwrite(f"temp_barem/bio/{i}/{index}.png", roi)
                    index += 1
                    cv2.rectangle(img, (x, y), (x + w, y + h),
                                  (36, 255, 12), 2)

            cv2.imwrite(f"temp_barem/bio/cap{i}_barem_temp.png", img)
            print(f"Gata cu pagina_{i}.png")

    elif selector == 2:  # chimie
        for i in range(1, 12):
            img = cv2.imread(f"baremuri/chimie/cap{i}_barem.png")

            img_grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blur_img = cv2.GaussianBlur(img_grayscale, (7, 7), 0)
            thresh = cv2.threshold(
                blur_img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
            dilate = cv2.dilate(thresh, kernel, iterations=2)
            cv2.imwrite(f"temp_barem/chimie/cap{i}_barem_dilate.png", dilate)

            # find contours
            cnts = cv2.findContours(
                dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            cnts = cnts[0] if len(cnts) == 2 else cnts[1]
            cnts = sorted(cnts, key=lambda x: cv2.boundingRect(x)[0])

            index = 1
            for c in cnts:
                x, y, w, h = cv2.boundingRect(c)
                if h > 100 and w > 75:
                    roi = img[y:y+h, x:x+w]
                    cv2.imwrite(f"temp_barem/chimie/{i}/{index}.png", roi)
                    index += 1
                    cv2.rectangle(img, (x, y), (x + w, y + h),
                                  (36, 255, 12), 2)

            cv2.imwrite(f"temp_barem/chimie/cap{i}_barem_temp.png", img)
            print(f"Gata cu pagina_{i}.png")


extract_barem(1)
# extract_barem(2)      #nu merge pt ca sunt despartite de o linie neagra, nu de spatiu, ca la bio
