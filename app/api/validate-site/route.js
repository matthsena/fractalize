import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const getFaviconUrl = (siteUrl) => {
      return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(siteUrl)}&size=64`;
    };

    try {
      const response = await fetch(normalizedUrl, {
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SiteValidator/1.0)'
        }
      });

      if (response.status >= 400 && response.status < 500) {
        return NextResponse.json({ 
          error: `Erro do cliente (${response.status}): Site não encontrado ou inacessível`,
          status: response.status
        }, { status: 200 });
      }

      if (response.status >= 500) {
        return NextResponse.json({ 
          error: `Erro do servidor (${response.status}): Site com problemas técnicos`,
          status: response.status
        }, { status: 200 });
      }

      if (response.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Site válido e acessível',
          status: response.status,
          faviconUrl: getFaviconUrl(normalizedUrl)
        });
      }

    } catch (fetchError) {
      try {
        const getResponse = await fetch(normalizedUrl, {
          method: 'GET',
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SiteValidator/1.0)'
          }
        });

        if (getResponse.status >= 400 && getResponse.status < 500) {
          return NextResponse.json({ 
            error: `Erro do cliente (${getResponse.status}): Site não encontrado ou inacessível`,
            status: getResponse.status
          }, { status: 200 });
        }

        if (getResponse.status >= 500) {
          return NextResponse.json({ 
            error: `Erro do servidor (${getResponse.status}): Site com problemas técnicos`,
            status: getResponse.status
          }, { status: 200 });
        }

        if (getResponse.ok) {
          return NextResponse.json({ 
            success: true, 
            message: 'Site válido e acessível',
            status: getResponse.status,
            faviconUrl: getFaviconUrl(normalizedUrl)
          });
        }

      } catch (secondError) {
        return NextResponse.json({ 
          error: 'Site não acessível ou não existe',
          details: secondError.message
        }, { status: 200 });
      }
    }

  } catch (error) {
    console.error('Erro na validação do site:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor ao validar site' 
    }, { status: 500 });
  }
} 