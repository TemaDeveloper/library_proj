'use server'

import { ReviewFormData } from "@/components/book-details/AddReview";
import { ReviewsResponse } from "@/types/book";
import { revalidatePath } from "next/cache";

const BACKEND_API_URL = process.env.BACKEND_API_URL


export async function getBookReviews(bookId: number): Promise<ReviewsResponse | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/reviews/book/${bookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error('Error fetching reviews:', res.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

export async function addReview(data: ReviewFormData, bookId: number) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/reviews/addReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, bookId: bookId }),
      cache: 'no-store',
    });

    if (res.ok) {
      revalidatePath(`/api/books/${bookId}`);
      return { success: true, messageKey: 'actions.review.addSuccess' };

    } else {
      if (res.status === 400) {
        return {
          success: false,
          messageKey: 'actions.review.invalidData',
        }
      } else if (res.status === 500) {
        return {
          success: false,
          messageKey: 'actions.review.serverError',
        }
      } else if (res.status === 409) {
        return {
          success: false,
          messageKey: 'actions.review.conflictError',
        }
      } else if (res.status === 404) {
        return {
          success: false,
          messageKey: 'actions.review.notFound',
        }
      } else {
        console.error('Unexpected error:', res.statusText);
        return {
          success: false,
          messageKey: 'actions.review.unexpectedError',
        }
      }
    }
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}