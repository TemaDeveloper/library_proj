'use client';
import { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

import { LocaleDict } from '@/lib/locales';

interface SearchInputProps {
  translations: LocaleDict;
}

export default function SearchInput({ translations }: SearchInputProps) {
  const [query, setQuery] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const performSearch = useCallback(
    (searchQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete('page');

      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim());
      } else {
        params.delete('query');
      }

      router.push(`/?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearch = useCallback(
    debounce((newQuery: string) => {
      performSearch(newQuery);
    }, 500),
    [performSearch]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch.cancel();
      performSearch(query);
    }
  };

  return (
    <div className='flex flex-1 items-center md:w-1/2 relative'>
      <input
        type='text'
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={
          translations.page.home.filters?.searchBooksPlaceholder ||
          'Search books...'
        }
        className='w-full form-input pr-10'
      />
      <Search className='absolute right-2  text-muted-foreground h-4 w-4' />
    </div>
  );
}
