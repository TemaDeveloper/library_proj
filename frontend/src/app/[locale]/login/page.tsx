import { getLocale } from '@/i18n.config';
import { getDictionary } from '@/lib/locales';
import AuthForm from '@/components/auth/AuthForm';

// Define the expected asynchronous props structure
interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

// Change the function to be async and await the parameters.
export default async function LoginPage({ params }: LoginPageProps) {
  // Await the destructured locale from the promise
  const { locale } = await params; 
  const lang = getLocale(locale);
  const translations = await getDictionary(lang);

  return (
    <AuthForm 
        type="login" 
        translations={translations} 
        locale={lang} 
    />
  );
}