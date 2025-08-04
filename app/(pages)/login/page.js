"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RedirectIfAuthenticated } from "@/components/auth/AuthGuard";
import { useAuth } from "@/app/hooks/useAuth";

function LoginPageContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      if (showResetPassword) {
        const { error } = await resetPassword(data.email);
        
        if (error) {
          setError("email", {
            type: "manual",
            message: error.message
          });
        } else {
          alert("Email de reset de senha enviado! Verifique sua caixa de entrada.");
          setShowResetPassword(false);
          reset();
        }
      } else if (isLogin) {
        const { error } = await signIn(data.email, data.password);
        
        if (error) {
          setError("password", {
            type: "manual",
            message: "Email ou senha incorretos"
          });
        } else {
          router.push("/");
        }
      } else {
        if (data.password !== data.confirmPassword) {
          setError("confirmPassword", {
            type: "manual",
            message: "As senhas não coincidem"
          });
          return;
        }

        const { error } = await signUp(data.email, data.password);
        
        if (error) {
          setError("email", {
            type: "manual",
            message: error.message
          });
        } else {
          alert("Conta criada com sucesso! Verifique seu email para confirmar a conta.");
          setIsLogin(true);
          reset();
        }
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      setError("email", {
        type: "manual",
        message: "Erro interno. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFormTitle = () => {
    if (showResetPassword) return "Resetar Senha";
    return isLogin ? "Entrar" : "Criar Conta";
  };

  const getSubmitButtonText = () => {
    if (isLoading) return "Processando...";
    if (showResetPassword) return "Enviar Email";
    return isLogin ? "Entrar" : "Criar Conta";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold">{getFormTitle()}</h1>
            <p className="text-sm text-neutral-600">
              {showResetPassword 
                ? "Digite seu email para receber o link de reset"
                : isLogin 
                  ? "Entre com suas credenciais" 
                  : "Crie sua conta para continuar"
              }
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {!showResetPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    {...register("password", {
                      required: "Senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Senha deve ter pelo menos 6 caracteres"
                      }
                    })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
              )}

              {!isLogin && !showResetPassword && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    {...register("confirmPassword", {
                      required: "Confirmação de senha é obrigatória"
                    })}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {getSubmitButtonText()}
              </Button>

              <div className="flex flex-col space-y-2 text-center text-sm">
                {!showResetPassword && (
                  <>
                    {isLogin ? (
                      <>
                        <button
                          type="button"
                          className="text-blue-600 hover:underline hover:cursor-pointer"
                          onClick={() => setShowResetPassword(true)}
                        >
                          Esqueceu sua senha?
                        </button>
                        <p className="text-neutral-600">
                          Não tem uma conta?{" "}
                          <button
                            type="button"
                            className="text-blue-600 hover:underline hover:cursor-pointer"
                            onClick={() => {
                              setIsLogin(false);
                              reset();
                            }}
                          >
                            Criar conta
                          </button>
                        </p>
                      </>
                    ) : (
                      <p className="text-neutral-600">
                        Já tem uma conta?{" "}
                        <button
                          type="button"
                          className="text-blue-600 hover:underline hover:cursor-pointer"
                          onClick={() => {
                            setIsLogin(true);
                            reset();
                          }}
                        >
                          Entrar
                        </button>
                      </p>
                    )}
                  </>
                )}

                {showResetPassword && (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={() => {
                      setShowResetPassword(false);
                      reset();
                    }}
                  >
                    Voltar para login
                  </button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

// Página de login que redireciona se usuário já estiver logado
export default function LoginPage() {
  return (
    <RedirectIfAuthenticated>
      <LoginPageContent />
    </RedirectIfAuthenticated>
  );
}