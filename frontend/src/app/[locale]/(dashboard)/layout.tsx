import MobileSidebar from '@/components/global/MobileSidebar';
import Sidebar from '@/components/global/Sidebar';
import { getSidebarLinks } from '@/constants/sidebar';
import { getLocale } from '@/i18n.config';
import { getDictionary } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = getLocale(locale);
  const translations = await getDictionary(lang);
  const sidebarLinks = getSidebarLinks(translations);

  return (
    <div className='w-full flex bg-accent'>
      {/* Sidebar */}
      <div className='min-h-[calc(100vh)]'>
        <Sidebar locale={lang} sidebarLinks={sidebarLinks} />
      </div>

      <div className='w-full bg-white rounded-sm md:m-3 md:mr-0 md:mb-0 overflow-auto invisible-scrollbar'>
        {/* Appbar */}
        <MobileSidebar locale={lang} sidebarLinks={sidebarLinks} />

        {/* Content */}
        <main className='max-w-7xl mx-auto w-full px-2 md:px-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
