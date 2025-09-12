'use client';
import { useState } from 'react';
import BookForm from './BookForm';
import { LocaleDict } from '@/lib/locales';
import { Locale } from '@/i18n.config';

interface AddNewBookProps {
  translations: LocaleDict;
  locale: Locale;
}

export default function AddNewBook({ translations, locale }: AddNewBookProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookForm
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      isEdit={false}
      translations={translations}
      locale={locale}
    />
  );
}
