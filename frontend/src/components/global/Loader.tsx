import { BookOpenText } from 'lucide-react';

export default function Loader() {
  return (
    <div className='flex items-center justify-center h-40'>
      <BookOpenText className='animate-bounce h-8 w-8 text-primary/40' />
    </div>
  );
}
