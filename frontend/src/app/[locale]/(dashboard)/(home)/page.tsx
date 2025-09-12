// src/app/[locale]/(dashboard)/(home)/page.tsx
import { getLocale } from '@/i18n.config';
import { getBooks } from '@/actions/my_book.actions';
import Header from '@/components/my_books/Header';
import BookList from '@/components/my_books/BookList';
import FilterAndSortSection from '@/components/my_books/FilterAndSortSection';
import { getFilters, getPagination } from '@/lib/utils';
import { Book, Filters, BooksResponse } from '@/types/book';
import { getDictionary } from '@/lib/locales';
import BooksPagination from '@/components/my_books/BooksPagination';
import { BookOpenText } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ params, searchParams }: HomePageProps) {
  const locale = await params;
  const lang = getLocale(locale.locale);
  const translations = await getDictionary(lang);

  const filters = await searchParams;
  const formattedFilters: Filters = getFilters(filters);
  const pagination = getPagination(filters.page);

  const response = await getBooks(formattedFilters, pagination);

  let data: Book[] = [];
  let meta = { total_count: 0 };

  // A more robust type guard that avoids the 'any' type
  if (response && 'data' in response && 'meta' in response) {
    data = (response as BooksResponse).data;
    meta = (response as BooksResponse).meta;
  } else if (response && Array.isArray(response)) {
    data = response;
  }

  return (
    <div className='flex flex-col gap-y-8 h-[calc(100vh-30px)] overflow-auto invisible-scrollbar pb-4 py-2'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-bold text-primary'>
          {translations.page.home.titleName}
        </p>
        <Header translations={translations} locale={lang} />
      </div>

      <div className='flex flex-col items-center justify-between h-full gap-y-6'>
        {/* Search input + Add button */}
        <div className='flex flex-col gap-y-6 w-full'>
          <div className='flex flex-col gap-y-4'>
            {/* Filters + Sort */}
            <FilterAndSortSection
              filters={formattedFilters}
              translations={translations}
              locale={lang}
            />
          </div>

          <div>
            {!data || data.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full space-y-3'>
                <BookOpenText className='animate-bounce h-8 w-8 text-primary/60' />
                <p className='text-primary/60 text-lg font-bold'>
                  {translations.page.home.noBooks}
                </p>
              </div>
            ) : (
              <div className='w-full flex flex-col justify-between h-full gap-y-6'>
                <BookList books={data as Book[]} />
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {meta && meta.total_count > 0 && (
          <BooksPagination
            totalCount={meta.total_count}
            locale={lang}
            pagination={pagination}
            translations={translations}
          />
        )}
      </div>
    </div>
  );
}