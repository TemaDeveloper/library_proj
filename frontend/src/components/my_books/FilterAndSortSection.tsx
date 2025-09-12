'use client';
import { BOOK_CATEGORIES, BOOK_SORT_OPTIONS } from '@/constants/books';
import DropdownFilter from './DropdownFilter';
import Filters from './Filters';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import HintLabel from '../global/HintLabel';
import { Filters as TFilters } from '@/types/book';
import { LocaleDict } from '@/lib/locales';
import { Locale } from '@/i18n.config';

interface FiltersAndSortSectionProps {
  filters: TFilters;
  translations: LocaleDict;
  locale: Locale;
}

export default function FilterAndSortSection({
  filters,
  translations,
  locale,
}: FiltersAndSortSectionProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear all filters
    params.delete('category');
    params.delete('publication_year');
    params.delete('query');
    params.delete('rating');
    params.delete('pages');
    params.delete('page');
    params.delete('filter_by');
    params.delete('sort');

    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newPath);
  };

  return (
    <div className='flex flex-wrap items-center justify-between gap-2'>
      <div className='flex flex-wrap items-center justify-start gap-2'>
        <Filters translations={translations} />
      </div>

      <div className='flex items-center justify-start flex-wrap gap-2'>
        {filters && Object.keys(filters).length > 0 && (
          <HintLabel
            label={translations.page.home.filters.clearAllFilters}
            side='bottom'
          >
            <Button
              type='button'
              className='border border-destructive hover:bg-destructive/10'
              variant={'outline'}
              onClick={handleClearAllFilters}
            >
              <Trash2 className='h-4 w-4 text-destructive' />
            </Button>
          </HintLabel>
        )}

        <DropdownFilter
          label={translations.page.home.filters.category}
          searchParamKey='category'
          defaultValue='all'
          list={BOOK_CATEGORIES}
          locale={locale}
        />
        <DropdownFilter
          label='Sort'
          searchParamKey='sort'
          defaultValue='recently_added'
          list={BOOK_SORT_OPTIONS}
          locale={locale}
        />
      </div>
    </div>
  );
}
