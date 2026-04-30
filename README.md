# ToolGrile
**Full-Stack Math Simulation Platform & Automated Digitization Pipeline**

ToolGrile is an integrated solution for digitizing mathematical collections (UTCN) and providing a modern, interactive web platform for exam simulations. It combines a high-precision Computer Vision pipeline with a robust Next.js/FastAPI web application.

## Key Features

### Web Platform
- **Smart Simulations**: Generate custom tests with weighted chapters (Algebra, Analysis, Geometry, etc.).
- **Interactive Timer**: Countdown functionality with visual alerts and automated submission upon expiry.
- **Admin Dashboard**: Comprehensive user management and dynamic statistics visualized with Recharts.
- **AI Integration**: Built-in AI assistant to help students with grid-specific questions.
- **Clean Architecture**: Modular React components and centralized constant management for scalability.

### Digitization Pipeline (CV)
- **Contour-Based Segmentation**: Precise geometric extraction of mathematical grids using OpenCV.
- **Sequence-Aware OCR**: Robust indexing algorithm that ensures 100% numbering accuracy across the collection.
- **Parallel Processing**: High-speed processing using multi-core parallelization.
- **Automated Answer Mapping**: Efficient extraction of answer keys from dense tabular PDF data.

## Project Structure

```text
ToolGrile/
├── backend/            # FastAPI, SQLite, SQLAlchemy (Auth & Logic)
├── frontend/           # Next.js, TailwindCSS, Recharts (Modern UI)
├── pipeline/           # Computer Vision Digitization Pipeline
│   ├── src/            # Segmentation & OCR logic
│   └── run.py          # Pipeline orchestrator
├── data/               # Digitized assets and processed grids
└── README.md           # This file
```

## Installation & Setup

### Backend
1. Navigate to `backend/`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Start the server: `python main.py`.

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

### Pipeline
1. Navigate to `pipeline/`.
2. Install requirements: `pip install -r requirements.txt`.
3. Run orchestrator: `python run.py --all`.

## Results Summary
- **Digitization Accuracy**: 100% (959/959 grids identified).
- **Answer Key Accuracy**: 98.8% automated extraction.
- **Platform**: Fully responsive, clean UI, Docker-ready architecture.