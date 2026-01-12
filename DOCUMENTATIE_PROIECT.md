# Documentație Tehnică: Pipeline de Digitalizare și Generare Simulări Examen (Computer Vision)

## 1. Introducere și Obiective
Scopul principal al acestei aplicații este digitalizarea și automatizarea procesului de pregătire pentru examenul de admitere la Medicină (UMF Cluj). Metodele tradiționale de studiu implică rezolvarea repetitivă a acelorași grile din culegeri tipărite sau PDF-uri statice, ceea ce poate duce la memorarea mecanică a poziției răspunsurilor, nu a logicii din spate.

Aplicația dezvoltată propune o schimbare de paradigmă: transformarea unei resurse statice (culegerea de grile scanată) într-o resursă dinamică. Sistemul extrage întrebările individuale sub formă de imagini și le reasamblează în teste de simulare unice, generate aleatoriu, respectând structura oficială a examenului.

**Obiectivele tehnice principale:**
*   Procesarea imaginilor provenite din scanări de calitate variabilă (telefoane mobile).
*   Segmentarea automată a paginilor pentru izolarea fiecărei întrebări (Computer Vision).
*   Generarea documentelor de ieșire (PDF și DOCX) gata de printat, incluzând baremele de corectare.

**Diagramă de Flux a Sistemului**
* PDF Sursă -> pdf2image.py -> Curățare (remove_fingers.py) -> Segmentare (main.ipynb) -> Baza de date (final/) -> Generator (generate_simulare.py) -> Output final.

---

## 2. Tehnologii Utilizate
Pentru dezvoltarea soluției s-a optat pentru ecosistemul Python 3.13, datorită bibliotecilor puternice pentru procesare de imagine și manipulare de documente.

*   **OpenCV (cv2):** Nucleul aplicației. Este utilizat pentru toate operațiile de preprocesare, filtrare culori, detecție de contururi și decupare (cropping).
*   **NumPy:** Folosit pentru manipularea matricelor de pixeli, esențial în operațiile de mascare a culorilor.
*   **PyMuPDF (fitz):** Asigură conversia rapidă a paginilor din PDF-ul sursă în imagini de înaltă rezoluție.
*   **ReportLab & python-docx:** Biblioteci folosite pentru generarea documentelor finale. ReportLab permite poziționarea exactă a imaginilor în PDF, iar python-docx oferă o variantă editabilă.
*   **Tesseract OCR:** Utilizat strict pentru indexare (recunoașterea numărului întrebării dintr-un crop), asigurând astfel că textul și formulele chimice rămân sub formă de imagine pentru fidelitate maximă.

---

## 3. Pipeline-ul de Procesare a Imaginilor

Procesul de transformare a datelor brute în grile utilizabile este împărțit în mai multe etape distincte.

### 3.1. Achiziția și Preprocesarea
Datele de intrare sunt adesea imperfecte. Fiind scanate manual, paginile pot conține umbre sau degete pe margini. Primul pas este conversia PDF-ului în PNG. Ulterior, se aplică un algoritm de curățare bazat pe spațiul de culoare **HSV (Hue, Saturation, Value)**. S-a definit un interval specific de nuanțe pentru culoarea pielii, iar pixelii identificați sunt înlocuiți automat cu alb.

> **[INSERARE IMAGINE 2: Rezultatul Curățării HSV]**
> *Sugestie: O imagine de tip "Înainte și După" care să arate cum un deget de pe marginea paginii a fost înlocuit cu fundal alb prin scriptul remove_fingers.py.*
> ![before]({4B2C4EE6-0406-43A4-AE47-1B6745E6CBC3}.png)
> ![after]({6DB19D4F-61F5-4A02-AEC5-FE839D34E959}.png)

### 3.2. Segmentarea (Decuparea Grilelor)
Provocarea majoră a fost identificarea limitelor fiecărei întrebări. Algoritmul implementat urmează pașii:
1.  **Grayscale & Blur:** Imaginea este convertită în nuanțe de gri și se aplică un filtru Gaussian pentru reducerea zgomotului.
2.  **Thresholding (Otsu):** Se separă textul de fundal.
3.  **Dilatare Morfologică:** Se aplică un kernel rectangular care "îngroașă" elementele de text până când acestea se unesc în blocuri rectangulare compacte.
4.  **Detecția Contururilor:** Se identifică dreptunghiurile de încadrare (Bounding Boxes).
5.  **Filtrare și Crop:** Se ignoră contururile care nu respectă dimensiunile unei întrebări standard și se salvează restul ca imagini individuale.

> **[INSERARE IMAGINE 3: Vizualizarea Procesului de Segmentare]**
> *Sugestie: O captură din main.ipynb care să arate imaginea cu dreptunghiurile verzi desenate de OpenCV în jurul fiecărei grile detectate.*

### 3.3. Indexare automată prin OCR
După decupare, scriptul `rename_grile_ocr.py` utilizează Tesseract pentru a citi începutul fiecărei imagini. Se caută pattern-uri numerice (ex: "15."). Dacă este găsit, fișierul este redenumit conform numărului oficial și mutat în folderul final de producție.

---

## 4. Logica de Generare a Simulărilor

Generatorul (`generate_simulare.py`) funcționează ca un motor de asamblare care respectă structura oficială de examen:
*   **Biologie:** 35 de întrebări.
*   **Chimie:** 15 întrebări (mix de teorie și probleme).

### Selecția Ponderată
Sistemul implementează un **algoritm de selecție cu ponderi**. Utilizatorul poate specifica în dicționarele de configurare dacă anumite capitole trebuie să aibă o frecvență mai mare (ex: pondere 2.0 pentru capitolele mai dificile). Algoritmul creează un "pool" de selecție unde capitolele cu pondere mare apar de mai multe ori, crescând șansa de a fi alese, dar menținând hazardul selecției.

### Asamblarea Finală
Generatorul nu doar pune imagini într-un fișier, ci:
1.  Verifică unicitatea (aceeași grilă nu apare de două ori).
2.  Gestionează layout-ul (previne tăierea imaginilor la final de pagină în PDF).
3.  **Atașează automat baremele:** Identifică capitolele folosite și copiază paginile de răspunsuri din `baremuri/` direct în folderul simulării.

> **[INSERARE IMAGINE 4: Structura Folderului de Ieșire]**
> *Sugestie: O captură de ecran cu folderul generat în simulari_generate/, conținând PDF-ul, DOCX-ul, fișierul de detalii și imaginile de barem.*

---

## 5. Provocări și Soluții Tehnice

### 5.1. Fidelitatea Formulelor Chimice
Abordările clasice de transformare a întregului document în text editabil eșuează la formulele chimice complexe. 
**Soluția:** Păstrarea grilelor ca imagini (crops) garantează că studentul vede exact simbolurile și legăturile chimice originale, fără erori de interpretare OCR.

> **[INSERARE IMAGINE 5: Exemplu Formulă Chimică Complexă]**
> *Sugestie: O imagine a unei grile de chimie organică cu structuri aromatice, explicând de ce formatul de imagine este superior textului în acest caz.*

### 5.2. Întrebările "Split" (Fragmentate)
O limitare curentă este reprezentată de întrebările care se întind pe două coloane sau pagini. În prezent, acestea necesită intervenție manuală sau sunt ignorate.
**Direcție Viitoare:** Implementarea unui modul de **Visual Stitching** care să detecteze proximitatea bounding box-urilor față de marginile coloanelor și să le unească automat.

---

## 6. Concluzii
Proiectul reprezintă o soluție completă de tip "end-to-end" pentru digitalizarea materialelor educaționale. Prin utilizarea tehnicilor de Computer Vision, s-a reușit transformarea unei culegeri statice într-un sistem capabil să genereze mii de variante de testare unice. Arhitectura modulară permite adaptarea rapidă a pipeline-ului pentru orice alt tip de examen bazat pe grile, oferind un instrument de studiu modern și eficient.
