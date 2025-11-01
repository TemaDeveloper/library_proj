import { getLocale } from '@/i18n.config'
import { getDictionary } from '@/lib/locales'
import LoginForm from '@/components/auth/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const lang = getLocale(locale)
  const translations = await getDictionary(lang)

  return <LoginForm translations={translations} locale={locale} />
}