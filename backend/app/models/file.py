from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    object_name = Column(String, unique=True, index=True, nullable=False)
    content_type = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
