import { LibraryBig, Star, UserPen } from "lucide-react";

export const BOOKS_DATA_FILTER_OPTIONS = [
  {
    value: "category",
    label_en: "Category",
    label_ja: "カテゴリー",
    icon: <LibraryBig className="h-4 w-4" />
  },
  {
    value: "author",
    label_en: "Author",
    label_ja: "著者",
    icon: <UserPen className="h-4 w-4" />
  },
  {
    value: "rating",
    label_en: "Rating",
    label_ja: "評価",
    icon: <Star className="h-4 w-4" />
  }
]
