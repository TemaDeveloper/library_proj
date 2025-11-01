'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signupFormSchema } from '@/lib/validation'
import { signup } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { LocaleDict } from '@/lib/locales'
import BrandLogo from '@/components/global/BrandLogo'
import Link from 'next/link'

type SignupFormData = z.infer<typeof signupFormSchema>

interface SignupFormProps {
  translations: LocaleDict
  locale: string
}

export default function SignupForm({ translations, locale }: SignupFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const authTranslations = translations.auth.signup

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  })

  const onSubmit = (data: SignupFormData) => {
    startTransition(() => {
      const result = signup(data)
      
      if (result.success) {
        toast.success(translations.auth.signup.success)
        // Redirect to dashboard after successful signup
        router.push(`/${locale}`)
        router.refresh()
      } else {
        toast.error(
          translations.auth.signup[result.messageKey as keyof typeof translations.auth.signup] as string || 
          result.error || 
          translations.auth.signup.serverError
        )
      }
    })
  }

  const getErrorMessage = (key: string | undefined) => {
    if (!key) return undefined
    const translationKey = key.replace('auth.form.error.', '')
    return translations.auth.form.error[translationKey as keyof typeof translations.auth.form.error] as string | undefined
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">{authTranslations.title}</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              {authTranslations.fullName}
            </label>
            <Input
              id="username"
              type="text"
              placeholder={authTranslations.fullNamePlaceholder}
              {...register('username')}
              aria-invalid={errors.username ? 'true' : 'false'}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {getErrorMessage(errors.username.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {authTranslations.email}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={authTranslations.emailPlaceholder}
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {getErrorMessage(errors.email.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {authTranslations.password}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={authTranslations.passwordPlaceholder}
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {getErrorMessage(errors.password.message)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? authTranslations.submitting : authTranslations.submit}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">{authTranslations.hasAccount} </span>
          <Link href={`/${locale}/login`} className="text-primary hover:underline">
            {authTranslations.loginLink}
          </Link>
        </div>
      </Card>
    </div>
  )
}

