# ToolGrile
**Automated Computer Vision Pipeline for Math Quiz Digitization (UTCN Collection)**

ToolGrile is an advanced automation pipeline designed to digitize, segment, and index mathematical multiple-choice questions (MCQs) from PDF collections. It leverages OpenCV for precise geometric segmentation and Tesseract OCR with sequence-aware consensus logic to achieve perfect indexing accuracy.

## Key Features

*   **Contour-Based Segmentation**: Replaces traditional HPP slicing with intelligent contour masking (`cv2.findContours`) to handle irregular quiz shapes and maintain numbering integrity.
*   **Sequence-Aware OCR Voting**: A robust indexing algorithm that reconstructs question numbering across pages by checking for mathematical continuity, neutralizing OCR misreads.
*   **Parallel Processing**: High-speed execution using `multiprocessing.Pool` for multi-core page processing.
*   **Automated Answer Mapping**: Specialized OCR pipeline for extracting answer keys from dense tabular data.
*   **Interactive Session Engine**: A backend-ready generator that provides randomized, weighted quiz sets with integrated correct answers.

## Pipeline Overview

1.  **PDF-to-Image**: High-DPI rendering of source documents using PyMuPDF.
2.  **Segmentation**: Exterior contour detection and background isolation.
3.  **Indexing & Renaming**: OCR tagging, sequence validation, and chapter categorization.
4.  **Answer Extraction**: Generation of `final_answers.json` from dedicated answer pages.
5.  **Audit**: Automated integrity checks for gap detection in the final dataset.

## Usage

### Prerequisites
*   Python 3.10+
*   Tesseract OCR installed on the system.

### Installation
```bash
pip install -r requirements.txt
```

### Orchestrator Syntax
You can run the entire pipeline or specific stages using `main.py`:

*   **Run Everything**: 
    ```bash
    python main.py --all
    ```
*   **Run Specific Step**: 
    ```bash
    python main.py --step 1  # PDF Conversion
    python main.py --step 4  # Answer Extraction
    ```
*   **Clean Workspace**:
    ```bash
    python main.py --clean
    ```

## Project Structure

*   `src/`: Core implementation modules (segmenter, indexer, generator, etc.)
*   `configs/`: Global thresholds, page ranges, and path definitions.
*   `data/processed/`: Final digitized grids categorized by mathematical chapter.
*   `docs/`: Detailed technical observations and performance benchmarks.

## Results Summary
*   **Indexing Accuracy**: 100% (959/959 grids identified).
*   **Answer Key Accuracy**: 98.8% automated extraction.
*   **Performance**: ~7x speedup via parallelization.