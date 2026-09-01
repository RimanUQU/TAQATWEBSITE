"use client";

import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/actions/favorites";

export function FavoriteButton({
  programId,
  slug,
  favorited,
}: {
  programId: string;
  slug: string;
  favorited: boolean;
}) {
  return (
    <form action={toggleFavoriteAction.bind(null, programId, slug)}>
      <button
        type="submit"
        className="favorite-toggle-btn"
        aria-label={favorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        <Heart size={18} fill={favorited ? "currentColor" : "none"} />
      </button>
    </form>
  );
}
