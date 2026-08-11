from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from auth import create_access_token, get_current_user
from database import SessionLocal, engine
from models import Base, User
from schemas import UserCreate, UserLogin
from auth import create_access_token
from auth import create_access_token, get_current_user
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
def search_problems(query: dict, current_user: str = Depends(get_current_user)):
    search_term = query.get("query", "")
    
    # Placeholder — real data collection comes in Stage 2
    return {
        "query": search_term,
        "status": "received",
        "message": f"Searching for problems related to '{search_term}'... (results coming soon)"
    }