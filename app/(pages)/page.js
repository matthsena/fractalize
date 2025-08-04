"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/app/hooks/useAuth";

function HomePageContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push("/login");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bem-vindo ao Fractalize</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Informações da Conta</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Conta criada em:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
              <p><strong>Último login:</strong> {new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Ações Rápidas</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => router.push("/setup")}
              >
                Configurar Empresa
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => alert("Funcionalidade em desenvolvimento")}
              >
                Ver Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => alert("Funcionalidade em desenvolvimento")}
              >
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">SEO para a era das LLMs</h2>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            O Fractalize ajuda você a otimizar seu site para ser melhor compreendido 
            por Large Language Models (LLMs) como ChatGPT, Claude e outros, garantindo 
            que seu conteúdo seja encontrado e recomendado corretamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Página principal protegida com AuthGuard
export default function HomePage() {
  return (
    <AuthGuard>
      <HomePageContent />
    </AuthGuard>
  );
}
