import { getMyBookDetails, getMyBooks } from "@/actions/my_book.actions";
import { getBookReviews } from "@/actions/reviews.action";

export enum bookCategory {
  FICTION = "fiction",
  NON_FICTION = "non_fiction",
  SCIENCE = "science",
  HISTORY = "history",
  FANTASY = "fantasy",
  MYSTERY = "mystery",
  THRILLER = "thriller",
  COOKING = "cooking",
  TRAVEL = "travel",
  CLASSICS = "classics",
}

export interface Filters {
  publication_year?: string
  category?: string
  query?: string
  sort?: string
  pages?: string
  rating?: string
  page?: string

}

export type Book = Awaited<ReturnType<typeof getMyBookDetails>>;

export type BooksDetails = Awaited<ReturnType<typeof getMyBooks>>;

export type Reviews = Awaited<ReturnType<typeof getBookReviews>>;

export interface BooksResponse {
  data: Book[]
  meta: {
    total_count: number
    limit: number
    offset: number
  }
}

export interface BookDetailsResponse {
  id: number
  title: string
  authorName: string
  description: string
  category: bookCategory
  publicationYear: number
  pages: number
  isbn: string
  rating: number
  bookCoverUrl?: string
  createdAt?: string
  updatedAt?: string
  reviews?: Reviews
}

export interface ReviewsResponse {
  data: {
    id: number
    bookId: number
    name: string
    email: string
    content: string
    created_at: string
    updated_at: string
  }[]
  meta: {
    total_count: number
    limit: number
    offset: number
  }
}