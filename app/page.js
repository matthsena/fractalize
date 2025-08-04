"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryDropdown } from "@/components/ui/country-dropdown"
import { Button } from "@/components/ui/button"

// Função para validar se o site é acessível
const validateWebsite = async (url, setFaviconUrl) => {
  if (!url) return "Site é obrigatório";
  
  // Validação básica de formato URL
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlPattern.test(url)) {
    return "Formato de URL inválido";
  }

  try {
    // Usar a API route para validar o site
    const response = await fetch('/api/validate-site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const result = await response.json();

    if (result.success) {
      // Se o site for válido e tiver favicon URL, definir no estado
      if (result.faviconUrl && setFaviconUrl) {
        setFaviconUrl(result.faviconUrl);
      }
      return true;
    } else if (result.error) {
      // Limpar favicon se houver erro
      if (setFaviconUrl) {
        setFaviconUrl(null);
      }
      return result.error;
    } else {
      // Limpar favicon se houver erro
      if (setFaviconUrl) {
        setFaviconUrl(null);
      }
      return "Erro desconhecido ao validar site";
    }
  } catch (error) {
    console.error('Erro ao validar site:', error);
    // Limpar favicon se houver erro
    if (setFaviconUrl) {
      setFaviconUrl(null);
    }
    return "Erro ao conectar com o serviço de validação";
  }
};

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValidating },
    watch,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      name: "",
      site: "",
      country: null
    },
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Validação final do site antes de submeter
      const siteValidation = await validateWebsite(data.site, setFaviconUrl);
      if (siteValidation !== true) {
        setError("site", {
          type: "manual",
          message: siteValidation
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Dados válidos:", data);
      // Aqui você processaria os dados do formulário
      alert("Formulário enviado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para validação em tempo real do site
  const handleSiteValidation = async (value) => {
    if (!value) {
      setFaviconUrl(null);
      return true; // Deixa a validação obrigatória para o register
    }
    
    clearErrors("site");
    const result = await validateWebsite(value, setFaviconUrl);
    return result;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      {/* Exibir favicon se disponível */}
      {faviconUrl && (
        <div className="mb-2">
          <img 
            src={faviconUrl} 
            alt="Favicon da empresa" 
            className="w-16 h-16 rounded-lg shadow-md"
            onError={(e) => {
              e.target.style.display = 'none';
              setFaviconUrl(null);
            }}
          />
        </div>
      )}
      
      <h1 className="text-3xl font-bold">Configure sua empresa</h1>
      <p className="text-neutral-600">Insira os detalhes da sua empresa para iniciar</p>
      
      <Card className="w-lg mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-6">
            {/* Nome da empresa */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome da empresa</Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Nome da empresa é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres"
                  }
                })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Site da empresa */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="site">Site da empresa</Label>
              <Input
                id="site"
                placeholder="exemplo.com ou https://exemplo.com"
                {...register("site", {
                  required: "Site é obrigatório",
                  validate: handleSiteValidation
                })}
                className={errors.site ? "border-red-500" : ""}
              />
              {errors.site && (
                <p className="text-sm text-red-500">{errors.site.message}</p>
              )}
              {isValidating && watch("site") && (
                <p className="text-sm text-blue-500">Validando site...</p>
              )}
            </div>

            {/* Localização padrão */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Localização padrão</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CountryDropdown
                    {...field}
                    onChange={(country) => {
                      field.onChange(country);
                    }}
                  />
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="mt-6">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || isValidating}
            >
              {isSubmitting ? "Processando..." : "Próximo passo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
