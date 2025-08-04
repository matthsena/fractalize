"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/loading-spinner";

export function AuthGuard({ children, fallbackUrl = "/login" }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(fallbackUrl);
    }
  }, [user, loading, router, fallbackUrl]);

  if (loading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  if (!user) {
    return null;
  }

  return children;
}

export function RedirectIfAuthenticated({ children, redirectUrl = "/" }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  if (loading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  if (user) {
    return null;
  }

  return children;
}

export function useAuthGuard() {
  const { user, loading } = useAuth();
  
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user
  };
}