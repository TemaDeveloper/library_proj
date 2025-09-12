import { Locale } from '@/i18n.config';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CustomLink from '../global/CustomLink';
import { LocaleDict } from '@/lib/locales';

interface BooksPaginationProps {
  totalCount: number;
  locale: Locale;
  pagination: {
    currentPage: number;
    limit: number;
  };
  translations: LocaleDict;
}

export default function BooksPagination({
  totalCount,
  locale: lang,
  pagination,
  translations,
}: BooksPaginationProps) {
  return (
    <div className='flex items-center justify-center space-x-5 -ml-28'>
      {pagination.currentPage > 1 ? (
        <CustomLink
          locale={lang}
          href={`?page=${pagination.currentPage - 1}`}
          className='flex items-center justify-center space-x-1 min-w-24'
        >
          <ChevronLeft className='h-5 w-5 text-primary' />
          <span className='font-medium'>
            {translations.page.home.pagination.previous}
          </span>
        </CustomLink>
      ) : (
        <div className='min-w-24'></div>
      )}

      <p className='text-primary font-normal text-sm'>
        ({totalCount}&nbsp;
        {translations.page.home.pagination.results}
        )&nbsp;
        {translations.page.home.pagination.page}&nbsp;
        {pagination.currentPage}&nbsp;
        {translations.page.home.pagination.of}&nbsp;
        {Math.ceil((totalCount || 0) / pagination.limit)}
      </p>

      {pagination.currentPage * pagination.limit < totalCount ? (
        <CustomLink
          locale={lang}
          href={`?page=${pagination.currentPage + 1}`}
          className='flex items-center justify-center space-x-1 min-w-24'
        >
          <span className='font-medium'>
            {translations.page.home.pagination.next}
          </span>
          <ChevronRight className='h-5 w-5 text-primary' />
        </CustomLink>
      ) : (
        <div className='min-w-24'></div>
      )}
    </div>
  );
}
