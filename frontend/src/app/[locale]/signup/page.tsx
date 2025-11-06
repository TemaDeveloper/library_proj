import { getLocale } from '@/i18n.config'
import { getDictionary } from '@/lib/locales'
import SignupForm from '@/components/auth/SignupForm'

export const dynamic = 'force-dynamic'

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const lang = getLocale(locale)
  const translations = await getDictionary(lang)

  return <SignupForm translations={translations} locale={locale} />
}
