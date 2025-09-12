import { Book } from '@/types/book';
import Link from 'next/link';
import HintLabel from '../global/HintLabel';
import Image from 'next/image';

interface BookListItemProps {
  book: Book | null;
}

export default function BookListItem({ book }: BookListItemProps) {
  if (!book) return null;

  return (
    <Link
      href={`/books/${book.id}`}
      className='flex flex-col items-center justify-center space-y-3'
    >
      <div className='mx-auto'>
        <div className='relative w-[200px] h-[250px] object-fill  md:w-[165px] md:h-[250px] rounded-md overflow-hidden drop-shadow-md shadow-lg'>
          <Image
            fill
            src={book.bookCoverUrl || '/assets/books/book-placeholder.png'}
            alt={book.title}
            className='object-fill w-full h-full'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
      <div>
        {book.title.length > 16 ? (
          <HintLabel label={book.title} side='bottom'>
            <p className='font-semibold text-primary'>
              {book.title.slice(0, 16)}...
            </p>
          </HintLabel>
        ) : (
          <p className='font-semibold text-primary'>{book.title}</p>
        )}
        <p className='font-medium text-sm text-primary/50'>
          {book.authorName}
        </p>
      </div>
    </Link>
  );
}
