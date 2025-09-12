import Link from 'next/link';
import { i18n, Locale } from '@/i18n.config';

interface CustomLinkProps {
    href: string
    locale: Locale
    children?: React.ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any

}

export default function CustomLink({
    href, locale, ...props
}: CustomLinkProps) {
    const isDefaultLocale = locale === i18n.defaultLocale;
    const path = isDefaultLocale ? href : `/${locale}${href}`;
    return (
        <Link
            href={path}
            {...props}
        />
    )

}