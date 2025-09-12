import AddNewBook from './AddNewBook';
import Link from 'next/link';
import SearchInput from './SearchInput';
import { LocaleDict } from '@/lib/locales';
import { Locale } from '@/i18n.config';
import Image from 'next/image';

interface HeaderProps {
  translations: LocaleDict;
  locale: Locale;
}

export default function Header({ translations, locale }: HeaderProps) {
  return (
    <div className='flex items-center justify-between space-x-3 md:space-x-3 w-2/3'>
      <SearchInput translations={translations} />
      <AddNewBook translations={translations} locale={locale} />
      <Link
        className='rounded-full p-[1px] border border-primary'
        href='https://github.com/TemaDeveloper'
        target='_blank'
      >
        <Image
          src='/assets/github-logo.png'
          alt='GitHub'
          width={24}
          height={24}
          className='h-9 w-9 object-contain'
        />
      </Link>
    </div>
  );
}
