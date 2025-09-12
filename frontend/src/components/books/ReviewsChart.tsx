'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '@/components/ui/chart';
import { Locale } from '@/i18n.config';
import { LocaleDict } from '@/lib/locales';
import { UserStar } from 'lucide-react';

interface ReviewsChartProps {
  locale: Locale;
  reviewsData: { name: string; count: number }[];
  translations: LocaleDict;
}

const chartConfig = {
  count: {
    label: 'Reviews',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const ChartTooltipContent = ({
  active,
  payload,
  translations,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  translations: LocaleDict;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='bg-background border border-secondary ring-2 ring-primary/50 rounded-md p-2 shadow-lg'>
        <p className='font-medium text-foreground'>{data.name}</p>
        <p className='text-sm text-muted-foreground'>
          {translations.page.books.Reviews}:
          <span className='font-medium text-primary'>{data.count}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ReviewsChart({
  reviewsData,
  translations,
}: ReviewsChartProps) {
  const chartData = reviewsData.map((item) => ({
    name: item.name,
    count: item.count,
  }));

  // if no reviews data, show descriptive message
  if (!reviewsData || reviewsData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full w-full space-y-3'>
        <UserStar className='animate-bounce h-8 w-8 text-primary/60' />
        <p className='text-primary/60 text-lg font-bold'>
          {translations.page.books.noReviews}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start justify-center gap-4 w-full'>
      <p className='font-bold text-primary text-xl'>
        {translations.page.books.Reviews}
      </p>
      <ChartContainer config={chartConfig} className='p-0 w-full'>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#ddd' />

          {/* X Axis */}
          <XAxis
            dataKey='name'
            tickLine={false}
            tickMargin={15}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            style={{ fontSize: '12px', fill: '#6b7280' }}
          />

          {/* Y Axis */}
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value}
            style={{ fontSize: '12px', fill: '#6b7280' }}
          />

          <ChartTooltip
            content={(props) => (
              <ChartTooltipContent {...props} translations={translations} />
            )}
          />

          <ChartLegend content={<ChartLegendContent />} />

          {/* Bar */}
          <Bar
            dataKey='count'
            fill='var(--color-desktop)'
            radius={3}
            barSize={20}
            opacity={0.8}
            isAnimationActive={true}
            animationDuration={1300}
            animationEasing='ease-out'
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
