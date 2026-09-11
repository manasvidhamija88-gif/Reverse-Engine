from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from grouping import group_into_problems, get_problems_with_articles
from auth import create_access_token, get_current_user
from database import SessionLocal, engine
from models import Base, User
from schemas import UserCreate, UserLogin
from collectors.news import fetch_news
from collectors.hackernews import fetch_hackernews

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return {"error": "Email already registered"}

    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        return {"error": "Invalid email or password"}

    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me")
def read_current_user(current_user: str = Depends(get_current_user)):
    return {"email": current_user}


@app.post("/search")
def search(query: dict, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    search_term = query["query"]

    news_articles = fetch_news(search_term)
    hn_articles = fetch_hackernews(search_term)

    all_articles = news_articles + hn_articles
    group_into_problems(search_term, db)

    problems = get_problems_with_articles(search_term, db)

    return {
        "query": search_term,
        "status": "ok",
        "problem_count": len(problems),
        "problems": problems
    }