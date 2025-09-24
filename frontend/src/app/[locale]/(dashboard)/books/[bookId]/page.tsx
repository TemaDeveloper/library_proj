import { getPubBookDetails } from '@/actions/books.actions';
import { buttonVariants } from '@/components/ui/button';
import { getLocale } from '@/i18n.config';
import { cn, formatTitleCase, formatToAgo } from '@/lib/utils';
import { ArrowLeft, BookAlert } from 'lucide-react';
import Image from 'next/image';
import AddReview from '@/components/book-details/AddReview';
import DeleteBook from '@/components/book-details/DeleteBook';
import StarRating from '@/components/book-details/StarRating';
import UpdateBook from '@/components/my_books/UpdateBook';
import CustomLink from '@/components/global/CustomLink';
import { getDictionary } from '@/lib/locales';
import { BOOK_CATEGORIES } from '@/constants/books';

export const dynamic = 'force-dynamic';

interface BookDetailPageProps {
  params: Promise<{ locale: string; bookId: number }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { locale, bookId } = await params;
  const lang = getLocale(locale);
  const translations = await getDictionary(lang);
  const bookDetailsTranslations = translations?.page?.bookDetails;

  const bookDetails = await getPubBookDetails(bookId);

  // if book not found, show descriptive message
  if (!bookDetails) {
    return (
      <div className='flex flex-col items-center justify-center gap-y-5 h-[calc(100vh-30px)]'>
        <div className='flex flex-col items-center justify-center gap-2'>
          <BookAlert className='h-16 w-16 text-primary mx-auto mb-4' />
          <p className='text-2xl font-bold text-primary'>
            {bookDetailsTranslations.bookNotFound}
          </p>
        </div>
        <CustomLink
          href={`/books`}
          locale={lang}
          className={cn(buttonVariants({ variant: 'default' }), '')}
        >
          {bookDetailsTranslations.goBackToLibrary}
        </CustomLink>
      </div>
    );
  }

  return (
    <div className='flex flex-col space-y-10 h-[calc(100vh-30px)] overflow-auto invisible-scrollbar px-2 pb-10'>
      {/* Back button + Update book button */}
      <div className='flex items-center justify-between w-full'>
        <CustomLink
          href={`/books`}
          locale={lang}
          className='flex items-center space-x-2'
        >
          <ArrowLeft className='h-4 w-4' />
          <span className='font-medium text-primary hover:underline underline-offset-4'>
            {bookDetailsTranslations.viewAllBooks}
          </span>
        </CustomLink>
        {/* <UpdateBook
          bookDetails={bookDetails}
          translations={translations}
          locale={lang}
        /> */}
      </div>

      <div className='flex flex-col md:flex-row items-start justify-center space-x-0 md:space-x-10 space-y-5 md:space-y-0'>
        {/* Left section - Book image */}
        <div className='relative flex items-center justify-center w-full md:w-1/2'>
          <div className='hidden md:block md:absolute md:h-[520px] md:w-[520px] md:rounded-full md:bg-secondary/35 md:z-0 shadow-lg' />
          <Image
            src={bookDetails.formats["image/jpeg"] || '/assets/books/book-placeholder.png'}
            alt={bookDetails.title || 'Book Image'}
            width={350}
            height={520}
            className='rounded-md object-cover z-10 shadow-xl'
          />
        </div>

        {/* Right section - Book details */}
        <div className='flex flex-col items-start justify-center space-y-4 w-full md:w-1/2'>
          <p className='bg-secondary border border-primary rounded-xl font-bold px-3 text-primary'>
            {/* {BOOK_CATEGORIES.find(
              (cat) => cat.value === bookDetails.subjects.forEach((sub) => )
            )?.[`label_${locale}` as keyof (typeof BOOK_CATEGORIES)[0]] ||
              formatTitleCase(bookDetails.category)} */}
          </p>
          <p className='text-5xl font-extrabold text-primary'>
            {bookDetails.title}
          </p>
          <p className='text-lg font-medium text-primary/50 mt-2'>
            - {bookDetailsTranslations.by} {bookDetails.authors.map((author) => author.name).join(', ')}
          </p>
          <p className='text-justify text-lg font-normal text-primary mt-2'>
            {bookDetails.summaries}
          </p>
        </div>
      </div>

     {/* Tags Section */}
      <div className='flex flex-col items-start gap-6 pt-4'>
        <div className='flex flex-wrap items-center gap-3'>
          {bookDetails.subjects && bookDetails.subjects.map((tag) => (
            <div
              key={tag}
              className='px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium'
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button className='flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white bg-[#FF6B6B] rounded-lg hover:bg-[#ff4f4f] transition-colors duration-200'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-heart'
          >
            <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
          </svg>
          <span>Read me</span>
        </button>
      </div>
    </div>
  );
}