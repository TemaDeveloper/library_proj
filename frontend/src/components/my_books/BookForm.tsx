import { Button } from '../ui/button'
import {
  DialogFooter,
  DialogClose,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../ui/dialog'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bookFormSchema } from '@/lib/validation';
import { BOOK_CATEGORIES } from '@/constants/books';
import { Slider } from '../ui/slider';
import { useState, useTransition, useEffect } from 'react';
import { BookPlus, PencilLine } from 'lucide-react';
import UploadBookImage from './UploadBookImage';
import { addBook, updateBook } from '@/actions/my_book.actions';
import { toast } from 'sonner';
import { Book } from '@/types/book';
import { LocaleDict } from '@/lib/locales';
import { Locale } from '@/i18n.config';
import { getNestedTranslation, resolveActionMessage } from '@/lib/utils';

export type BookFormData = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  bookDetails?: Book;
  isOpen?: boolean;
  setIsOpen: (open: boolean) => void;
  isEdit?: boolean;
  translations: LocaleDict
  locale: Locale
}

export default function BookForm({ bookDetails, isOpen = false, setIsOpen, isEdit = false, translations, locale }: BookFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [currentRating, setCurrentRating] = useState<number>(bookDetails?.rating || 4);
  const bookFormTranslations = translations.page.home.bookForm;

  const getDefaultValues = (book?: Book): Partial<BookFormData> => ({
    rating: book?.rating || 4,
    category: (book?.category || BOOK_CATEGORIES[1].value) as BookFormData['category'],
    publicationYear: book?.publicationYear || new Date().getFullYear(),
    pages: book?.pages || 100,
    title: book?.title || '',
    isbn: book?.isbn || '',
    description: book?.description || '',
    authorName: book?.authorName || '',
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    mode: 'onChange',
    defaultValues: getDefaultValues(bookDetails),
  });

  // Reset form when bookDetails changes (after successful update)
  useEffect(() => {
    if (bookDetails && isEdit) {
      reset(getDefaultValues(bookDetails));
      setImageFile(null);
    }
  }, [bookDetails, isEdit, reset]);

  const onSubmit = async (data: BookFormData) => {
    try {
      if (isEdit) {
        startTransition(async () => {
          const response = await updateBook({ ...data, id: Number(bookDetails?.id) || 0 }, imageFile || undefined);
          if (response?.success) {
            toast.success(resolveActionMessage(response.messageKey, translations));
            setIsOpen(false);
          } else {
            toast.error(resolveActionMessage(response?.messageKey || 'actions.book.unexpectedError', translations));
          }
        });
      } else {
        startTransition(async () => {
          const response = await addBook(data, imageFile || undefined);
          if (response?.success) {
            toast.success(resolveActionMessage(response.messageKey, translations));
            reset();
            setImageFile(null);
            setIsOpen(false);
          } else {
            toast.error(resolveActionMessage(response?.messageKey || 'actions.book.unexpectedError', translations));
          }
        });
      }
    } catch (error) {
      toast.error(resolveActionMessage('actions.book.unexpectedError', translations));
    }
  };

  const handleCancel = () => {
    if (isEdit && bookDetails) {
      reset(getDefaultValues(bookDetails));
    } else {
      reset();
    }
    setImageFile(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center md:min-w-40">
          {isEdit ? <PencilLine className="h-4 w-4" /> : <BookPlus className="h-4 w-4" />}
          <span className='hidden md:block'>
            {isEdit ? bookFormTranslations.editBook : bookFormTranslations.addBook}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-[750px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 justify-start">
            <BookPlus className="h-5 w-5" />
            <p>
              {isEdit ? bookFormTranslations.editBook : bookFormTranslations.addNewBook}
            </p>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? bookFormTranslations.editBookDescription : bookFormTranslations.addBookDescription}
          </DialogDescription>
        </DialogHeader>

        <hr />

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4 full h-[600px] md:h-auto overflow-auto invisible-scrollbar'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col space-y-4 border-r border-secondary pr-4'>
              <UploadBookImage
                imageFile={imageFile}
                setImageFile={setImageFile}
                imageURL={bookDetails?.bookCoverUrl || null}
                translations={translations}
              />

              <div className='flex flex-col space-y-1'>
                <label
                  htmlFor='title'
                  className='form-label'>
                  {bookFormTranslations.title}
                </label>
                <input
                  type="text"
                  required
                  {...register("title")}
                  className='form-input'
                  placeholder={bookFormTranslations.titlePlaceholder}
                />
                {errors.title && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.title.message, translations)}
                  </p>
                )}
              </div>

              <div className='flex flex-col space-y-1'>
                <label
                  htmlFor='isbn'
                  className='form-label'>
                  {bookFormTranslations.isbn}
                </label>
                <input
                  type="text"
                  required
                  {...register("isbn")}
                  className='form-input disabled:bg-secondary/50 disabled:cursor-not-allowed'
                  placeholder='978-3-16-148410-0'
                  disabled={isEdit}
                />
                {errors.isbn && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.isbn.message, translations)}
                  </p>
                )}
              </div>

              <div className='flex flex-col space-y-1'>
                <label
                  htmlFor='description'
                  className='form-label'>
                  {bookFormTranslations.description}
                </label>
                <textarea
                  required
                  {...register("description")}
                  className='form-input'
                  rows={3}
                  style={{ resize: 'none' }}
                  placeholder={bookFormTranslations.descriptionPlaceholder}
                ></textarea>
                {errors.description && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.description.message, translations)}
                  </p>
                )}
              </div>
            </div>

            <div className='flex flex-col space-y-4'>
              <div className='flex flex-col space-y-1'>
                <label
                  htmlFor='authorName'
                  className='form-label'>
                  {bookFormTranslations.authorName}
                </label>
                <input
                  required
                  type="text"
                  {...register("authorName")}
                  className='form-input'
                  placeholder={bookFormTranslations.authorNamePlaceholder}
                />
                {errors.authorName && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.authorName.message, translations)}
                  </p>
                )}
              </div>

              <div className='flex flex-col space-y-1'>
                <label
                  htmlFor='category'
                  className='form-label'>
                  {bookFormTranslations.category}
                </label>
                <select
                  required
                  {...register("category")}
                  className='form-input'
                >
                  {BOOK_CATEGORIES.slice(1).map((category) => (
                    <option key={category.value} value={category.value}>
                      {category[`label_${locale}`]}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.category.message, translations)}
                  </p>
                )}
              </div>

              <div className='flex flex-col space-y-1'>
                <label
                  htmlFor='publicationYear'
                  className='form-label'>
                  {bookFormTranslations.publicationYear}
                </label>
                <input
                  required
                  type="number"
                  {...register("publicationYear", {
                    setValueAs: (value) => parseInt(value, 10),
                    valueAsNumber: true,
                  })}
                  className='form-input'
                  placeholder='2020'
                  min="1950"
                  max={new Date().getFullYear()}
                />
                {errors.publicationYear && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.publicationYear.message, translations)}
                  </p>
                )}
              </div>

              <div className='flex flex-col space-y-1'>
                <label
                  htmlFor='pages'
                  className='form-label'>
                  {bookFormTranslations.numberOfPages}
                </label>
                <input
                  required
                  type="number"
                  {...register("pages", {
                    setValueAs: (value) => parseInt(value, 10),
                    valueAsNumber: true,
                  })}
                  className='form-input'
                  placeholder='300'
                  min="1"
                />
                {errors.pages && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.pages.message, translations)}
                  </p>
                )}
              </div>

              <div className='flex flex-col space-y-1'>
                <div className='flex items-center justify-between'>
                  <label htmlFor="rating" className='form-label'>
                    {bookFormTranslations.rating}
                  </label>
                  <p className='text-sm font-medium'>
                    {currentRating} / 5
                  </p>

                </div>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        setCurrentRating(value[0]);
                      }}
                      max={5}
                      min={0}
                      step={0.5}
                      defaultValue={[field.value]}
                      value={[field.value]}
                      className="w-full"
                    />
                  )}
                />
                {errors.rating && (
                  <p className='text-destructive text-xs'>
                    {getNestedTranslation(errors.rating.message, translations)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                {bookFormTranslations.cancel}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || isPending}
            >
              {isSubmitting || isPending ? (isEdit ?
                `${bookFormTranslations.updating}...`
                : `${bookFormTranslations.adding}...`)
                :
                (isEdit ?
                  `${bookFormTranslations.update}`
                  : `${bookFormTranslations.addBook}`)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}