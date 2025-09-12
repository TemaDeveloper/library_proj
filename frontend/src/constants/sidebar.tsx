import { LocaleDict } from "@/lib/locales";
import { Blocks, ScrollText } from "lucide-react";

export function getSidebarLinks(translations: LocaleDict) {
  const SIDEBAR_LINKS = [
    {
      name: translations.sidebar.navigation.my_books,
      href: "/",
      icon: <ScrollText className="w-5 h-5" />,
    },
    {
      name: translations.sidebar.navigation.books,
      href: "/books",
      icon: <Blocks className="w-5 h-5" />,
    },
  ];
  return SIDEBAR_LINKS;
}