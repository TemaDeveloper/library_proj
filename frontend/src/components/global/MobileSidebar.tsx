'use client';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Locale } from '@/i18n.config';
import BrandLogo from './BrandLogo';
import SidebarLink from './SidebarLink';
import { useSidebarStore } from '@/stores/sidebar.store';
import LanguageSelector from './LanguageSelector';

interface MobileSidebarProps {
  locale: Locale;
  sidebarLinks: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export default function MobileSidebar({
  locale,
  sidebarLinks,
}: MobileSidebarProps) {
  const { collapse } = useSidebarStore();
  return (
    <div className='md:hidden flex items-center justify-between w-full p-2 py-4'>
      {/* Logo  */}
      <BrandLogo collapse={false} />

      {/* Mobile Sidebar Trigger and Content */}
      <Sheet>
        <SheetTrigger>
          <Menu className='text-primary h-5 w-5' />
        </SheetTrigger>
        <SheetContent side='left' className='w-11/12 h-full p-3'>
          <SheetHeader className='hidden'>
            <SheetTitle className='sr-only'>Sidebar</SheetTitle>
            <SheetDescription className='sr-only'>
              Donutly, your personal library.
            </SheetDescription>
          </SheetHeader>

          <div
            className={`h-full block md:hidden flex-col items-start justify-between
   `}
          >
            <div className='space-y-5 w-full'>
              {/* logo  */}
              <BrandLogo />
              {/* links */}
              <div className='space-y-2'>
                {sidebarLinks.map((link) => (
                  <SidebarLink key={link.name} link={link} locale={locale} />
                ))}
              </div>
            </div>
          </div>

          {/* footer */}
          <LanguageSelector locale={locale} collapse={collapse} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
