'use client';

import { useForm, FieldErrors, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Github, Globe } from 'lucide-react';
import { LocaleDict } from '@/lib/locales';
import { Locale } from '@/i18n.config';
import { LoginFormData, SignupFormData, loginSchema, signupSchema } from '@/lib/auth.validation';
import { useAuthOIDC } from '@/hooks/use-auth-oidc';

interface AuthFormProps {
  type: 'login' | 'signup';
  translations: LocaleDict;
  locale: Locale;
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center min-h-screen bg-accent p-4">
    {children}
  </div>
);

// Define a unified form data type for clarity in the register function union
type UnifiedFormData = LoginFormData | SignupFormData;

export default function AuthForm({ type, locale }: AuthFormProps) { 
  const isLogin = type === 'login';
  const { handleOidcLogin, handleLocalLogin, handleLocalSignup } = useAuthOIDC(); 

  // --- 1. LOGIN FORM SETUP (Typed for LoginFormData) ---
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const onLoginSubmit = (data: LoginFormData) => {
    handleLocalLogin(data);
  };
  const { 
      register: loginRegister, 
      formState: { errors: loginErrors, isSubmitting: loginIsSubmitting }, 
      handleSubmit: loginHandleSubmit 
  } = loginForm;

  // --- 2. SIGNUP FORM SETUP (Typed for SignupFormData) ---
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
  });
  const onSignupSubmit = (data: SignupFormData) => {
    handleLocalSignup(data);
  };
  const { 
      register: signupRegister, 
      formState: { errors: signupErrors, isSubmitting: signupIsSubmitting }, 
      handleSubmit: signupHandleSubmit 
  } = signupForm;
  
  // --- 3. CONDITIONAL HANDLERS & STATE ---
  const isSubmitting = isLogin ? loginIsSubmitting : signupIsSubmitting;
  
  const onSubmitHandler = isLogin 
    ? loginHandleSubmit(onLoginSubmit) 
    : signupHandleSubmit(onSignupSubmit); 
    
  // Errors variable resolves safely because email/password exist on both base types
  const currentErrors = isLogin ? loginErrors : signupErrors;
  
  // Explicitly typed error variable for fields unique to signup (username)
  const usernameErrors = (isLogin ? null : signupErrors) as FieldErrors<SignupFormData> | null;
  
  // FIX: This helper is now robust by using explicit function calls inside
  const registerField = <T extends 'email' | 'password'>(field: T) => {
    if (isLogin) {
      return loginRegister(field);
    }
    return signupRegister(field);
  };


  const title = isLogin ? 'Login to Donutly' : 'Create an Account';
  const description = isLogin ? 'Sign in with your email or use OIDC.' : 'Sign up with your email or use OIDC.';
  
  const inputClass = 'form-input w-full';

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">{title}</CardTitle>
          <CardDescription className="text-center text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">

          {/* OIDC Buttons (Logic Handled by Hook) */}
          <div className="flex flex-col gap-2">
            <Button 
                onClick={() => handleOidcLogin('google')}
                variant="outline" 
                className="w-full"
                type="button"
            >
              <Globe />
              {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
            </Button>
            <Button 
                onClick={() => handleOidcLogin('github')}
                variant="outline" 
                className="w-full"
                type="button"
            >
            <Github />
              {isLogin ? 'Sign in with GitHub' : 'Sign up with GitHub'}
            </Button>
          </div>
          
          <div className="flex items-center">
            <div className="flex-grow border-t border-secondary"></div>
            <span className="flex-shrink mx-4 text-sm text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-secondary"></div>
          </div>
          
          {/* Traditional Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4"> 
            
            {/* Username for Signup - Only renders if not login */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  type="text"
                  // Use explicitly typed signupRegister
                  {...signupRegister('username')} 
                  className={inputClass}
                />
                {/* Use the explicitly typed usernameErrors variable */}
                {usernameErrors?.username && <p className='text-destructive text-xs'>{usernameErrors.username.message}</p>} 
              </div>
            )}

            {/* Email for Both (Uses dedicated registerField helper) */}
            <div className="space-y-1">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                {...registerField('email')}
                className={inputClass}
              />
              {currentErrors.email && <p className='text-destructive text-xs'>{currentErrors.email.message}</p>}
            </div>

            {/* Password for Both (Uses dedicated registerField helper) */}
            <div className="space-y-1">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                {...registerField('password')}
                className={inputClass}
              />
              {currentErrors.password && <p className='text-destructive text-xs'>{currentErrors.password.message}</p>}
            </div>
            
            <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : (isLogin ? 'Login' : 'Signup')}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
            <a href={isLogin ? `/${locale}/signup` : `/${locale}/login`} className="text-primary font-medium ml-1 hover:underline">
              {isLogin ? 'Sign up' : 'Login'}
            </a>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
