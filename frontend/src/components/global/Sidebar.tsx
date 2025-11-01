'use client';

import { useSidebarStore } from '@/stores/sidebar.store';
import { PanelLeftOpen, PanelRightOpen, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Locale } from '@/i18n.config';
import SidebarLink from './SidebarLink';
import BrandLogo from './BrandLogo';
import LanguageSelector from './LanguageSelector';
import { logout, getCurrentUser } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LocaleDict } from '@/lib/locales';

interface SidebarProps {
  locale: Locale;
  sidebarLinks: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
  translations: LocaleDict;
}

export default function Sidebar({ locale, sidebarLinks, translations }: SidebarProps) {
  const { collapse, toggleCollapse } = useSidebarStore();
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
    <div
      className={`h-full hidden md:flex flex-col items-start justify-between p-3 md:py-6 transition-all duration-200 ease-in-out
       ${collapse ? 'w-16' : 'w-[270px]'}
   `}
    >
      <div className='space-y-8 w-full'>
        {/* logo  */}
        <div className='flex items-center justify-between'>
          <BrandLogo collapse={collapse} />
          <Button
            className='hidden md:block'
            onClick={toggleCollapse}
            variant={'ghost'}
            size={'sm'}
          >
            {collapse ? (
              <PanelLeftOpen className='h-5 w-5' />
            ) : (
              <PanelRightOpen className='h-5 w-5' />
            )}
          </Button>
        </div>

        {/* links */}
        <div className='space-y-2'>
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.name}
              link={link}
              collapse={collapse}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* footer */}
      <div className='space-y-2 w-full'>
        <LanguageSelector collapse={collapse} locale={locale} />
        {isLoggedIn && (
          <Button
            variant={'destructive'}
            className='flex items-center justify-between w-full hover:cursor-pointer p-5'
            onClick={handleLogout}
          >
            <p
              className={`text-white transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden ${
                collapse ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}
            >
              {translations.auth.logout.button}
            </p>
            <LogOut className='-ml-2 h-5 w-5' />
          </Button>
        )}
      </div>
    </div>
  );
}