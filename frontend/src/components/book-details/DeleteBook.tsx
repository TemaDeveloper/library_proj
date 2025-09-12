'use client';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { useState, useTransition } from 'react';
import { deleteBook } from '@/actions/my_book.actions';
import { toast } from 'sonner';
import { Locale } from '@/i18n.config';
import { LocaleDict } from '@/lib/locales';
import { resolveActionMessage } from '@/lib/utils';

interface DeleteBookProps {
  bookId: number;
  translations: LocaleDict;
  locale: Locale;
}

export default function DeleteBook({ bookId, translations }: DeleteBookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteBook = () => {
    try {
      startTransition(async () => {
        const response = await deleteBook(bookId);
        if (response.success) {
          toast.success(
            resolveActionMessage(
              response.messageKey,
              translations || ({} as LocaleDict)
            )
          );
          setIsOpen(false);
          window.location.href = '/';
        } else {
          console.error('Error deleting book:', response?.messageKey);
          toast.error(
            resolveActionMessage(
              response?.messageKey || 'actions.book.unexpectedError',
              translations || ({} as LocaleDict)
            )
          );
        }
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error(
        resolveActionMessage(
          'actions.book.unexpectedError',
          translations || ({} as LocaleDict)
        )
      );
    }
  };

  return (
    <div>
      {/* Delete Book Dialog */}
      <div className='flex flex-col space-y-3'>
        <div className='flex items-center justify-between'>
          <p className='text-2xl font-bold text-destructive'>
            {translations.page.bookDetails.dangerZone}
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant='destructive' className='flex items-center'>
                <Trash2 className='h-4 w-4' />
                <span>{translations.page.bookDetails.deleteBook}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='w-full md:min-w-[350px]'>
              <DialogHeader>
                <DialogTitle>
                  {translations.page.bookDetails.confirmDeletion}
                </DialogTitle>
                <DialogDescription>
                  {translations.page.bookDetails.confirmDeletionText}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className='sm:justify-end'>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    {translations.page.bookDetails.cancel}
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleDeleteBook}
                  disabled={isPending}
                  type='button'
                  variant='destructive'
                >
                  {isPending
                    ? translations.page.bookDetails.deleting
                    : translations.page.bookDetails.deleteBook}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
