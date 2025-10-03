// frontend/src/hooks/use-auth-oidc.ts
'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { LoginFormData, SignupFormData } from '@/lib/auth.validation';

const BACKEND_BASE_URL = 'http://localhost:8080';

export const useAuthOIDC = () => { // Parameter removed

  const handleOidcLogin = useCallback((provider: 'google' | 'github') => {
    const oidcUrl = `${BACKEND_BASE_URL}/oauth2/authorization/${provider}`;
    window.location.href = oidcUrl;
  }, []);


  const handleLocalLogin = useCallback((data: LoginFormData) => {
    console.log('Attempting local login:', data);
    toast.info(`Local Login for ${data.email} initiated.`);
  }, []);

  const handleLocalSignup = useCallback((data: SignupFormData) => {
    console.log('Attempting local signup:', data);
    toast.info(`Local Signup for ${data.email} initiated.`);
  }, []);


  const handleLogout = useCallback(() => {
    window.location.href = `${BACKEND_BASE_URL}/logout`;
  }, []);

  return {
    handleOidcLogin,
    handleLocalLogin,
    handleLocalSignup,
    handleLogout,
  };
};