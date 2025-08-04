"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryDropdown } from "@/components/ui/country-dropdown"
import { Button } from "@/components/ui/button"
import useValidateSite from "@/app/hooks/useValidateSite";

export default function Home() {

  const {
    isLoading: isSubmitting,
    faviconUrl,
    validateSite,
  } = useValidateSite();


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
    try {
      const siteValidation = await validateSite(data.site);
      if (siteValidation !== true) {
        setError("site", {
          type: "manual",
          message: siteValidation
        });
        return;
      }

      alert("Formulário enviado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  const handleSiteValidation = async (value) => {
    if (!value) {
      return true;
    }

    clearErrors("site");

    setTimeout(() => {
      const result = validateSite(value);
      return result;
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      {faviconUrl && (
        <div className="mb-2">
          <img 
            src={faviconUrl} 
            alt="Favicon da empresa" 
            className="w-16 h-16 rounded-lg shadow-md"
          />
        </div>
      )}
      
      <h1 className="text-3xl font-bold">Configure sua empresa</h1>
      <p className="text-neutral-600">Insira os detalhes da sua empresa para iniciar</p>
      
      <Card className="w-lg mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-6">
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
