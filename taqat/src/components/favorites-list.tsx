import Link from "next/link";
import { Heart } from "lucide-react";
import { removeFavoriteAction } from "@/actions/favorites";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui";

type FavoriteItem = {
  id: string;
  createdAt: Date;
  program: { title: string; slug: string };
};

export function FavoritesList({ favorites }: { favorites: FavoriteItem[] }) {
  if (!favorites.length) {
    return (
      <p className="favorites-empty">
        لا توجد برامج في مفضلتك بعد. <Link className="card-link" href="/programs">تصفحي البرامج ←</Link>
      </p>
    );
  }

  return (
    <div className="favorites-list">
      {favorites.map((f) => (
        <div className="favorite-item" key={f.id}>
          <span className="favorite-item-icon" aria-hidden="true">
            <Heart size={18} />
          </span>
          <div className="favorite-item-info">
            <Link href={`/programs/${f.program.slug}`}>
              <strong>{f.program.title}</strong>
            </Link>
            <small>أُضيفت في {formatDate(f.createdAt)}</small>
          </div>
          <div className="favorite-item-actions">
            <Link className="card-link" href={`/programs/${f.program.slug}`}>التفاصيل ←</Link>
            <form action={removeFavoriteAction.bind(null, f.id)}>
              <Button type="submit" variant="outline" size="sm">إزالة</Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
