export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const CHAPTER_LABELS: Record<string, string> = {
  algebra: "Algebră",
  analiza: "Analiză Matematică",
  geometrie: "Geometrie",
  trigonometrie: "Trigonometrie",
  admitere: "Admitere",
};

export const TIMEFRAME_OPTIONS = [
  { label: "7 zile", value: 7 },
  { label: "30 zile", value: 30 },
  { label: "3 luni", value: 90 },
  { label: "6 luni", value: 180 },
  { label: "Tot", value: null },
];
