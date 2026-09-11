from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from database import Base



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Problem(Base):
    __tablename__ = "problems"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    query = Column(String, index=True)
    first_seen = Column(DateTime, nullable=True)
    last_seen = Column(DateTime, nullable=True)
    source_count = Column(Integer, default=0)
    severity_score = Column(Integer, default=0)
    summary = Column(String, nullable=True)
    embedding = Column(String, nullable=True)

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    source = Column(String, nullable=True)

    url = Column(String, unique=True)
    published_at = Column(String, nullable=True)
    source_type = Column(String, nullable=True)  # "newsapi" or "hackernews"
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)