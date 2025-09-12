import { Book } from '@/types/book';
import { Locale } from '@/i18n.config';
import CustomLink from '../global/CustomLink';
import { ExternalLink } from 'lucide-react';

interface BookTableItemProps {
  book: Book;
  locale: Locale;
}

export default function BookTableItem({ book, locale }: BookTableItemProps) {
  if (!book) return null;
  return (
    <tr className='bg-white border-b hover:bg-gray-50'>
      <th
        scope='row'
        className='table-data font-medium text-gray-900 whitespace-nowrap'
      >
        {book.title}
      </th>
      <td className='table-data'>{book.authorName}</td>
      <td className='table-data'>{book.category}</td>
      <td className='table-data'>{book.rating}</td>
      <td className='table-data'>{book.publicationYear}</td>
      <td className='table-data pl-7'>
        <CustomLink
          target='_blank'
          locale={locale}
          href={`/books/${book.id}`}
          className='text-primary font-bold'
        >
          <ExternalLink className='h-4 w-4' />
        </CustomLink>
      </td>
    </tr>
  );
}
