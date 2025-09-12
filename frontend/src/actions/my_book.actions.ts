'use server'

import { BookFormData } from "@/components/my_books/BookForm";
import { BookDetailsResponse, BooksResponse, Filters } from "@/types/book"
import { revalidatePath } from "next/cache";
import { getBookReviews } from "./reviews.action";

const BACKEND_API_URL = process.env.BACKEND_API_URL

export async function getBooks(filters: Filters, pagination: { currentPage: number, limit: number }): Promise<BooksResponse | null> {
  try {
    const offset = (pagination.currentPage - 1) * pagination.limit;

    const URL = `${BACKEND_API_URL}/api/books/all?limit=${pagination.limit}&offset=${offset}&${new URLSearchParams(filters as Record<string, string>)}`;
    const res = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Fetched books data:', data);
      return data;
    } else {
      console.error('Error fetching books', res.statusText);
      return null
    }

  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

export async function getBookDetails(id: number): Promise<BookDetailsResponse | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/books/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const bookReviews = await getBookReviews(id);

    if (res.ok) {
      const bookDetails = await res.json();
      return { ...bookDetails, reviews: bookReviews };
    } else {
      console.error('Error fetching book:', res.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
}

export async function addBook(data: BookFormData, imageFile?: File) {
  try {
    const formData = new FormData();

    const bookData = new Blob([JSON.stringify(data)], {
      type: 'application/json'
    });
    formData.append('book', bookData);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const res = await fetch(`${BACKEND_API_URL}/api/books/addBook`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      revalidatePath('/');
      return {
        success: true,
        messageKey: 'actions.book.addSuccess',
      }
    } else {
      const errorData = await res.json();
      if (errorData.error.includes('A book with this ISBN already exists')) {
        return {
          success: false,
          messageKey: 'actions.book.isbnExists',
        }
      }
      if (res.status === 400) {
        return {
          success: false,
          messageKey: 'actions.book.invalidData',
        }
      } else if (res.status === 500) {
        return {
          success: false,
          messageKey: 'actions.book.serverError',
        }
      } else if (res.status === 409) {
        return {
          success: false,
          messageKey: 'actions.book.conflictError',
        }
      } else if (res.status === 404) {
        return {
          success: false,
          messageKey: 'actions.book.notFound',
        }
      } else {
        console.error('Unexpected error:', errorData);
        return {
          success: false,
          messageKey: 'actions.book.unexpectedError',
        }
      }
    }
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
}

export async function updateBook(data: Partial<BookFormData> & { id: number }, imageFile?: File) {
  try {
    const formData = new FormData();

   const updatePayload: Partial<BookFormData> = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.isbn !== undefined) updatePayload.isbn = data.isbn;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.authorName !== undefined) updatePayload.authorName = data.authorName;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.publicationYear !== undefined) updatePayload.publicationYear = data.publicationYear;
    if (data.pages !== undefined) updatePayload.pages = data.pages;
    if (data.rating !== undefined) updatePayload.rating = data.rating;

    formData.append('book', new Blob([JSON.stringify(updatePayload)], { type: 'application/json' }));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const res = await fetch(`${BACKEND_API_URL}/api/books/updateBook/${data.id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      revalidatePath(`/books/${data.id}`);
      return {
        success: true,
        messageKey: 'actions.book.updateSuccess',
      }
    } else {
      const errorData = await res.json();
      if (errorData.error.includes('A book with this ISBN already exists')) {
        return {
          success: false,
          messageKey: 'actions.book.isbnExists',
        }
      }
      if (res.status === 400) {
        console.error(errorData.error);
        return {
          success: false,
          messageKey: 'actions.book.invalidData',
        }
      } else if (res.status === 500) {
        console.error(errorData.error);
        return {
          success: false,
          messageKey: 'actions.book.serverError',
        }
      } else if (res.status === 409) {
        console.error(errorData.error);
        return {
          success: false,
          messageKey: 'actions.book.conflictError',
        }
      } else if (res.status === 404) {
        console.error(errorData.error);
        return {
          success: false,
          messageKey: 'actions.book.notFound',
        }
      } else {
        console.error('Unexpected error:', errorData);
        return {
          success: false,
          messageKey: 'actions.book.unexpectedError',
        }
      }
    }
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
}

export async function deleteBook(id: number) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/books/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      // revalidatePath('/');
      return {
        success: true,
        messageKey: 'actions.book.deleteSuccess',
      }
    } else {
      const errorData = await res.json();
      if (res.status === 400) {
        return {
          success: false,
          messageKey: 'actions.book.invalidData',
        }
      } else if (res.status === 500) {
        return {
          success: false,
          messageKey: 'actions.book.serverError',
        }
      } else if (res.status === 409) {
        return {
          success: false,
          messageKey: 'actions.book.conflictError',
        }
      } else if (res.status === 404) {
        return {
          success: false,
          messageKey: 'actions.book.notFound',
        }
      } else {
        console.error('Unexpected error:', errorData);
        return {
          success: false,
          messageKey: 'actions.book.unexpectedError',
        }
      }
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}