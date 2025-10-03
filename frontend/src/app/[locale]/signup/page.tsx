import { getLocale } from '@/i18n.config';
import { getDictionary } from '@/lib/locales';
import AuthForm from '@/components/auth/AuthForm';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignupPage({ params }: LoginPageProps) {
    const { locale } = await params; 
    const lang = getLocale(locale);
    const translations = await getDictionary(lang);

  return (
    <AuthForm 
        type="signup" 
        translations={translations} 
        locale={lang} 
    />
  );
}