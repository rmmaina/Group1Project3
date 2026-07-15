from config import db


class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    external_id = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(200))
    author = db.Column(db.String(200))
    cover_url = db.Column(db.String(500))

    __table_args__ = (
        db.UniqueConstraint("user_id", "external_id", name="uq_user_external_favorite"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "external_id": self.external_id,
            "title": self.title,
            "author": self.author,
            "cover_url": self.cover_url,
        }