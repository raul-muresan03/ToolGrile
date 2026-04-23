import json
import random
import re
import uvicorn
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, List

ROOT_DIR = Path(__file__).parent.parent
PROCESSED_DIR = ROOT_DIR / "data" / "processed"
ANSWERS_PATH = PROCESSED_DIR / "final_answers.json"

CHAPTER_DIRS = {
    "algebra": PROCESSED_DIR / "algebra",
    "analiza": PROCESSED_DIR / "analiza",
    "geometrie": PROCESSED_DIR / "geometrie",
    "trigonometrie": PROCESSED_DIR / "trigonometrie",
    "admitere": PROCESSED_DIR / "subiecte_admitere_simulare",
}

app = FastAPI(
    title="ToolGrile API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load_answers() -> dict:
    if not ANSWERS_PATH.exists():
        return {}
    with open(ANSWERS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _scan_inventory():
    answers = _load_answers()
    inventory = []

    for chapter_name, chapter_path in CHAPTER_DIRS.items():
        if not chapter_path.exists():
            continue

        for file in sorted(chapter_path.glob("*.png")):
            match = re.search(r'quiz_([\d_]+)\.png', file.name)
            if not match:
                continue

            ids_str = match.group(1).split('_')
            grid_ids = [s for s in ids_str if s]
            has_answers = all(str(gid) in answers for gid in grid_ids)

            inventory.append({
                "chapter": chapter_name,
                "filename": file.name,
                "ids": grid_ids,
                "answers": {gid: answers.get(str(gid), None) for gid in grid_ids},
                "has_all_answers": has_answers,
            })

    return inventory


class ChapterWeight(BaseModel):
    weight: float

class SimulationConfig(BaseModel):
    total_quizzes: int
    chapters: Dict[str, ChapterWeight]

class StudentAnswer(BaseModel):
    grid_id: str
    answer: str

class SimulationResult(BaseModel):
    session_id: str
    answers: List[StudentAnswer]


_active_sessions: Dict[str, list] = {}


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/chapters")
async def list_chapters():
    result = {}
    for chapter_name, chapter_path in CHAPTER_DIRS.items():
        if not chapter_path.exists():
            result[chapter_name] = {"total_grids": 0}
            continue
        total_grids = 0
        for f in sorted(chapter_path.glob("*.png")):
            match = re.search(r'quiz_([\d_]+)\.png', f.name)
            if match:
                ids = [s for s in match.group(1).split('_') if s]
                total_grids += len(ids)
        result[chapter_name] = {"total_grids": total_grids}
    return {"chapters": result}


@app.post("/api/simulation/generate")
async def generate_simulation(config: SimulationConfig):
    inventory = _scan_inventory()
    if not inventory:
        raise HTTPException(status_code=500, detail="No quiz data found on disk.")

    by_chapter: Dict[str, list] = {}
    for item in inventory:
        if not item["has_all_answers"]:
            continue
        ch = item["chapter"]
        if ch not in by_chapter:
            by_chapter[ch] = []
        by_chapter[ch].append(item)

    active_weights = {}
    for ch_name, ch_cfg in config.chapters.items():
        if ch_name in by_chapter and by_chapter[ch_name]:
            active_weights[ch_name] = ch_cfg.weight

    if not active_weights:
        raise HTTPException(
            status_code=400,
            detail="None of the selected chapters have available quizzes with answers."
        )

    for ch in by_chapter:
        random.shuffle(by_chapter[ch])

    weighted_pool = []
    for chapter, weight in active_weights.items():
        weighted_pool.extend([chapter] * int(weight * 10))

    selected = []
    collected = 0
    used_files = set()

    while collected < config.total_quizzes and weighted_pool:
        target = random.choice(weighted_pool)

        if not by_chapter.get(target):
            weighted_pool = [c for c in weighted_pool if c != target]
            continue

        candidate = by_chapter[target].pop(0)
        if candidate["filename"] in used_files:
            continue

        selected.append(candidate)
        used_files.add(candidate["filename"])
        collected += len(candidate["ids"])

    session_id = f"sim_{random.randint(100000, 999999)}"
    _active_sessions[session_id] = selected

    grids = []
    for item in selected:
        grids.append({
            "chapter": item["chapter"],
            "filename": item["filename"],
            "grid_ids": item["ids"],
            "image_url": f"/api/grid/{item['chapter']}/{item['filename']}",
        })

    return {
        "session_id": session_id,
        "total_grids": collected,
        "grids": grids,
    }


@app.post("/api/simulation/grade")
async def grade_simulation(result: SimulationResult):
    session = _active_sessions.get(result.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or expired.")

    correct_answers = {}
    for item in session:
        for gid, ans in item["answers"].items():
            correct_answers[str(gid)] = ans

    total = len(correct_answers)
    correct = 0
    details = []

    for sub in result.answers:
        expected = correct_answers.get(str(sub.grid_id))
        is_correct = expected is not None and sub.answer.upper() == expected.upper()
        if is_correct:
            correct += 1
        details.append({
            "grid_id": sub.grid_id,
            "submitted": sub.answer,
            "expected": expected,
            "is_correct": is_correct,
        })

    score = round((correct / total) * 10, 2) if total > 0 else 0

    del _active_sessions[result.session_id]

    return {
        "score": score,
        "correct": correct,
        "total": total,
        "details": details,
    }


@app.get("/api/grid/{chapter}/{filename}")
async def serve_grid_image(chapter: str, filename: str):
    if chapter not in CHAPTER_DIRS:
        raise HTTPException(status_code=400, detail=f"Unknown chapter: {chapter}")

    image_path = CHAPTER_DIRS[chapter] / filename

    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found.")

    return FileResponse(str(image_path), media_type="image/png")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
