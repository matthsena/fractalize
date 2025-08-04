
import { useState, useCallback } from 'react';

const useValidateSite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState(null);

  const validateSite = useCallback(async (url) => {
    if (!url) return "Site é obrigatório";
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      return "Formato de URL inválido";
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/validate-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        if (result.faviconUrl) {
          setFaviconUrl(result.faviconUrl);
        }
        return true;
      } else if (result.error) {
        setFaviconUrl(null);
        return result.error;
      } else {
        setFaviconUrl(null);
        return "Erro desconhecido ao validar site";
      }
    } catch (error) {
      console.error('Erro ao validar site:', error);
      setFaviconUrl(null);
      return "Erro ao conectar com o serviço de validação";
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    faviconUrl,
    validateSite,
  };
};

export default useValidateSite;
  