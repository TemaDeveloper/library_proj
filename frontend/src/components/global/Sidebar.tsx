'use client';

import { useSidebarStore } from '@/stores/sidebar.store';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Locale } from '@/i18n.config';
import SidebarLink from './SidebarLink';
import BrandLogo from './BrandLogo';
import LanguageSelector from './LanguageSelector';

interface SidebarProps {
  locale: Locale;
  sidebarLinks: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export default function Sidebar({ locale, sidebarLinks }: SidebarProps) {
  const { collapse, toggleCollapse } = useSidebarStore();

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
      <LanguageSelector collapse={collapse} locale={locale} />
    </div>
  );
}
