'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { UserStar } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { z } from 'zod';
import { reviewFormSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addReview } from '@/actions/reviews.action';
import { useReviewStore } from '@/stores/review.store';
import { getNestedTranslation, resolveActionMessage } from '@/lib/utils';
import { LocaleDict } from '@/lib/locales';
import { Locale } from '@/i18n.config';

interface AddReviewProps {
  bookId: number;
  translations: LocaleDict;
  locale: Locale;
}

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function AddReview({ bookId, translations }: AddReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    mode: 'onChange',
  });

  const { hasSubmittedReview, markReviewSubmitted } = useReviewStore();

  const onSubmit = async (data: ReviewFormData) => {
    try {
      startTransition(async () => {
        const response = await addReview(data, bookId);

        if (response?.success) {
          toast.success(
            resolveActionMessage(response.messageKey, translations)
          );
          markReviewSubmitted(bookId);
          reset();
          setIsOpen(false);
        } else {
          toast.error(
            resolveActionMessage(
              response?.messageKey || 'actions.review.unexpectedError',
              translations
            )
          );
        }
      });
    } catch (error) {
      toast.error(
        resolveActionMessage('actions.review.submissionError', translations)
      );
    }
  };

  const alreadySubmitted = hasSubmittedReview(bookId);
  console.log(bookId);

  return (
    <div>
      {/* Add Review Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant='secondary'
            className='flex items-center'
            onClick={() => setIsOpen(true)}
            disabled={alreadySubmitted}
          >
            <UserStar className='h-4 w-4' />
            <span>
              {alreadySubmitted
                ? translations.page.bookDetails.reviewSubmitted
                : translations.page.bookDetails.addReview}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className='w-full md:min-w-[350px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center space-x-2 justify-start'>
              <UserStar className='h-5 w-5' />
              <p>{translations.page.bookDetails.addReview}</p>
            </DialogTitle>
          </DialogHeader>

          <hr />
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col space-y-1 col-span-2 md:col-span-1'>
                <label htmlFor='name' className='form-label'>
                  Name
                </label>
                <input
                  type='text'
                  required
                  {...register('name')}
                  className='form-input'
                  placeholder={
                    translations.page.bookDetails.reviewForm.namePlaceholder
                  }
                />
                {errors.name && (
                  <p className='text-destructive text-xs'>
                    {translations
                      ? getNestedTranslation(
                          errors.name.message,
                          translations,
                          'review'
                        )
                      : errors.name.message}
                  </p>
                )}
              </div>
              <div className='flex flex-col space-y-1 col-span-2 md:col-span-1'>
                <label htmlFor='email' className='form-label'>
                  {translations.page.bookDetails.reviewForm.email}
                </label>
                <input
                  type='email'
                  required
                  {...register('email')}
                  className='form-input'
                  placeholder={
                    translations.page.bookDetails.reviewForm.emailPlaceholder
                  }
                />
                {errors.email && (
                  <p className='text-destructive text-xs'>
                    {translations
                      ? getNestedTranslation(
                          errors.email.message,
                          translations,
                          'review'
                        )
                      : errors.email.message}
                  </p>
                )}
              </div>
              <div className='flex flex-col space-y-1 col-span-2'>
                <label htmlFor='content' className='form-label'>
                  {translations.page.bookDetails.reviewForm.content}
                </label>
                <textarea
                  {...register('content')}
                  className='form-input'
                  placeholder={
                    translations.page.bookDetails.reviewForm.contentPlaceholder
                  }
                  rows={4}
                  style={{ resize: 'none' }}
                ></textarea>
                {errors.content && (
                  <p className='text-destructive text-xs'>
                    {translations
                      ? getNestedTranslation(
                          errors.content.message,
                          translations,
                          'review'
                        )
                      : errors.content.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className='flex items-center justify-end'>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    reset();
                    setIsOpen(false);
                  }}
                >
                  {translations.page.bookDetails.reviewForm.cancel}
                </Button>
              </DialogClose>
              <Button type='submit' disabled={isSubmitting || isPending}>
                {isSubmitting || isPending
                  ? `${translations.page.bookDetails.reviewForm.submitting}...`
                  : translations.page.bookDetails.reviewForm.submit}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
