'use client';
import { Menu, LogOut } from 'lucide-react';
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
import { logout, getCurrentUser } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { LocaleDict } from '@/lib/locales';


interface MobileSidebarProps {
  locale: Locale;
  sidebarLinks: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
  translations: LocaleDict;
}

export default function MobileSidebar({
  locale,
  sidebarLinks,
  translations,
}: MobileSidebarProps) {
  const { collapse } = useSidebarStore();

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount and when component updates
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    toast.success(translations.auth.logout.success);
    // Redirect to login page
    router.push(`/${locale}/login`);
    router.refresh();
  };
  return (
    <div className='md:hidden flex items-center justify-between w-full p-2 py-4'>
      {/* Logo  */}
      <BrandLogo collapse={false} />

      {/* Mobile Sidebar Trigger and Content */}
      <Sheet>
        <SheetTrigger>
          <Menu className='text-primary h-5 w-5' />
        </SheetTrigger>
        <SheetContent side='left' className='w-11/12 h-full p-3  flex flex-col'>
          <SheetHeader className='hidden'>
            <SheetTitle className='sr-only'>Sidebar</SheetTitle>
            <SheetDescription className='sr-only'>
              Donutly, your personal library.
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 flex flex-col justify-between'>

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
                  {/* footer */}
                  <div className='space-y-2 w-full'>
              <LanguageSelector locale={locale} collapse={collapse} />
              {isLoggedIn && (
                <Button
                  variant={'destructive'}
                  className='flex items-center justify-start w-full hover:cursor-pointer p-5 gap-3'
                  onClick={handleLogout}
                >
                  <LogOut className='h-5 w-5' />
                  <span>{translations.auth.logout.button}</span>
                </Button>
              )}
            </div>
    </div>
  );
}
