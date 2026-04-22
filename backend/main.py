import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to ToolGrile API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# TODO: Add endpoints for generator.py integration
# TODO: Add endpoints for getting specific quiz images from data/processed
# TODO: Add endpoints for verifying answers against final_answers.json

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
