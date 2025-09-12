'use client'
import { useState } from 'react';
import BookForm from './BookForm';
import { Book } from '@/types/book';
import { LocaleDict } from '@/lib/locales';
import { Locale } from '@/i18n.config';

interface UpdateBookProps {
  bookDetails: Book;
  translations: LocaleDict;
  locale: Locale;
}

export default function UpdateBook({ bookDetails, translations, locale }: UpdateBookProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookForm
      bookDetails={bookDetails}
      setIsOpen={setIsOpen} isOpen={isOpen} isEdit={true}
      translations={translations}
      locale={locale}
    />
  )
}