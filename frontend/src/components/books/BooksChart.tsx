'use client';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Locale } from '@/i18n.config';
import DropdownFilter from '../my_books/DropdownFilter';
import { BOOKS_DATA_FILTER_OPTIONS } from '@/constants/analytics';
import { BOOK_CATEGORIES } from '@/constants/books';
import { LocaleDict } from '@/lib/locales';
import { BookOpenText } from 'lucide-react';

const COLORS = [
  '#4F6D7A',
  '#FF6F61',
  '#6B8E23',
  '#FF6347',
  '#98C8E8',
  '#4C9F70',
  '#FFD700',
  '#FF4500',
  '#32CD32',
  '#FF1493',
  '#8A2BE2',
  '#D2691E',
  '#FF7F50',
  '#1E90FF',
  '#FF8C00',
];

interface BooksDonutChartProps {
  locale: Locale;
  booksData?: { name: string; count: number }[] | Record<string, number>;
  filterBy: string;
  translations: LocaleDict;
}

interface ChartTooltipContentProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  locale: Locale;
}

const ChartTooltipContent = ({
  active,
  payload,
  locale,
}: ChartTooltipContentProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const categoryLabel = getCategoryLabel(data.name, locale);

    return (
      <div className='bg-background border border-secondary ring-2 ring-primary/50 rounded-md p-2 shadow-lg'>
        <p className='font-medium text-foreground'>{categoryLabel}</p>{' '}
        {/* Display category */}
        <p className='text-sm text-muted-foreground'>
          Count: <span className='font-medium text-primary'>{data.count}</span>
        </p>
      </div>
    );
  }
  return null;
};

const getCategoryLabel = (categoryValue: string, locale: Locale) => {
  const category = BOOK_CATEGORIES.find((cat) => cat.value === categoryValue);
  return category
    ? locale === 'ja'
      ? category.label_ja
      : category.label_en
    : categoryValue;
};

export default function BooksDonutChart({
  locale,
  booksData,
  filterBy,
  translations,
}: BooksDonutChartProps) {
  // if no books data, show descriptive message
  if (!booksData) {
    return (
      <div className='flex flex-col items-center justify-center h-full w-full space-y-3'>
        <BookOpenText className='animate-bounce h-8 w-8 text-primary/60' />
        <p className='text-primary/60 text-lg font-bold'>
          {translations.page.books.noBooks}
        </p>
      </div>
    );
  }

  const processData = () => {
    let rawData: Record<string, number>;

    if (Array.isArray(booksData)) {
      rawData = booksData.reduce((acc, item) => {
        acc[item.name] = item.count;
        return acc;
      }, {} as Record<string, number>);
    } else {
      rawData = booksData;
    }

    if (filterBy === 'rating') {
      const ratingGroups: Record<string, number> = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
      };

      Object.entries(rawData).forEach(([rating, count]) => {
        const numRating = parseFloat(rating);
        const roundedRating = Math.floor(numRating).toString();
        if (ratingGroups[roundedRating] !== undefined) {
          ratingGroups[roundedRating] += count;
        }
      });

      const filteredRatingGroups = Object.entries(ratingGroups)
        .filter(([_, count]) => count > 0)
        .reduce((acc, [rating, count]) => {
          acc[rating] = count;
          return acc;
        }, {} as Record<string, number>);

      rawData = filteredRatingGroups;
    }

    return Object.entries(rawData)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name: name,
        count: count,
      }));
  };

  const chartData = processData();

  return (
    <div className='flex flex-col items-center justify-center gap-y-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='font-bold text-primary text-lg text-center'>
          {filterBy === 'category'
            ? translations.page.books.booksByCategory
            : filterBy === 'rating'
            ? translations.page.books.booksByRating
            : filterBy === 'author'
            ? translations.page.books.booksByAuthor
            : 'Books'}
        </p>
        <DropdownFilter
          locale={locale}
          label={'Filter'}
          searchParamKey='filter_by'
          defaultValue='category'
          list={BOOKS_DATA_FILTER_OPTIONS}
        />
      </div>
      <ChartContainer config={{}} className='w-full'>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            dataKey='count'
            stroke='none'
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className='hover:opacity-80 transition-opacity cursor-pointer'
              />
            ))}
          </Pie>

          <ChartTooltip content={<ChartTooltipContent locale={locale} />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
