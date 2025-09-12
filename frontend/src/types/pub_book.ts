import { getPubBookDetails, getPubBooks } from "@/actions/books.actions";

export interface PubAuthor {
  name: string;
  birth_year: number | null;
  death_year: number | null;
}

export interface PubFormat {
  [key: string]: string;
}

export interface PubBookDetailsResponse {
  id: number;
  title: string;
  authors: PubAuthor[];
  summaries: string[];
  translators: PubAuthor[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: PubFormat;
  download_count: number;
}

export type PubBook = Awaited<ReturnType<typeof getPubBookDetails>>;

export type BooksDetails = Awaited<ReturnType<typeof getPubBooks>>;

export interface PubBooksResponse {
  data: PubBook[]
  meta: {
    total_count: number
    limit: number
    offset: number
  }
}