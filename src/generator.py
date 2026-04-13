import random
import re
import json
from configs.config import PROCESSED_DIR, MATH_CHAPTERS

def load_answers():
    answers_path = PROCESSED_DIR / "final_answers.json"
    if not answers_path.exists():
        print(f"Warning: {answers_path} not found. Some answers may be missing.")
        return {}
    with open(answers_path, "r", encoding="utf-8") as f:
        return json.load(f)

def scan_inventory():
    inventory = []
    answers = load_answers()

    for chapter_name, chapter_path in MATH_CHAPTERS.items():
        if chapter_name == "unknown_chapter":
            continue

        if not chapter_path.exists():
            continue

        for file in chapter_path.glob("*.png"):
            match = re.search(r'quiz_([\d_]+)\.png', file.name)
            if not match:
                continue

            ids_str = match.group(1).split('_')
            grid_ids = [s for s in ids_str if s]

            if all(str(gid) in answers for gid in grid_ids):
                inventory.append({
                    "chapter": chapter_name,
                    "path": str(file.relative_to(PROCESSED_DIR.parent.parent)),
                    "ids": grid_ids,
                    "answers": {gid: answers[str(gid)] for gid in grid_ids}
                })

    return inventory

def generate_quiz_session(total_needed, chapter_weights=None):
    inventory = scan_inventory()
    if not inventory:
        return []

    by_chapter = {}
    for item in inventory:
        cat = item["chapter"]
        if cat not in by_chapter:
            by_chapter[cat] = []
        by_chapter[cat].append(item)

    available_chapters = list(by_chapter.keys())

    if not chapter_weights:
        chapter_weights = {c: 1 for c in available_chapters}

    active_weights = {c: w for c, w in chapter_weights.items() if c in available_chapters}

    if not active_weights:
        return []

    selected_items = []
    collected_count = 0

    for cat in by_chapter:
        random.shuffle(by_chapter[cat])

    weighted_pool = []
    for chapter, weight in active_weights.items():
        weighted_pool.extend([chapter] * int(weight * 10))

    used_paths = set()

    while collected_count < total_needed and weighted_pool:
        target_chapter = random.choice(weighted_pool)

        if not by_chapter[target_chapter]:
            weighted_pool = [c for c in weighted_pool if c != target_chapter]
            continue

        candidate = by_chapter[target_chapter].pop(0)

        if candidate["path"] in used_paths:
            continue

        selected_items.append(candidate)
        used_paths.add(candidate["path"])
        collected_count += len(candidate["ids"])

    return selected_items

if __name__ == "__main__":
    session = generate_quiz_session(total_needed=10, chapter_weights={"algebra": 1, "analiza": 1})

    for i, item in enumerate(session):
        print(f"{i+1}. [{item['chapter']}] Quizzes: {', '.join(item['ids'])} -> Answers: {item['answers']}")
        print(f"   Path: {item['path']}")