'use server'
import { PubBookDetailsResponse, PubBooksResponse } from "@/types/pub_book";

const PUB_API = process.env.PUB_API

export async function getPubBooks(limit: number = 32, offset: number = 0): Promise<PubBooksResponse | null> {
  try {
    //const offset = (pagination.currentPage - 1) * pagination.limit;

    const URL = `${PUB_API}`;
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

       return {
        data: data.results,
        meta: {
          total_count: data.count,
          limit: limit,
          offset: offset,
        },
      };
    } else {
      console.error('Error fetching books', res.statusText);
      return null
    }

  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
  
}

export async function getPubBookDetails(id: number): Promise<PubBookDetailsResponse | null> {
  try {
    const res = await fetch(`${PUB_API}/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });


    if (res.ok) {
      const bookDetails = await res.json();
      return { ...bookDetails };
    } else {
      console.error('Error fetching book:', res.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
}