import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { RECAPTCHA_CONFIG } from '../config/recaptcha';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface UseRecaptchaV2Return {
  recaptchaRef: RefObject<HTMLDivElement>;
  getToken: () => string | null;
  resetRecaptcha: () => void;
  renderRecaptcha: () => void;
  isReady: boolean;
}

let uniqueIdCounter = 0;

export const useRecaptcha = (): UseRecaptchaV2Return => {
  const [isReady, setIsReady] = useState(false);
  const [widgetId, setWidgetId] = useState<number | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const renderAttempted = useRef(false);
  const widgetIdRef = useRef<number | null>(null);
  const instanceId = useRef(++uniqueIdCounter);
  const siteKey = RECAPTCHA_CONFIG.siteKey;

  useEffect(() => {
    if (!siteKey) {
      console.warn('reCAPTCHA: Configure a chave publica');
      return;
    }

    renderAttempted.current = false;

    const loadRecaptchaScript = () => {
      if (document.querySelector('script[src*="google.com/recaptcha/api.js"]')) {
        checkRecaptchaLoaded();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = checkRecaptchaLoaded;
      document.head.appendChild(script);
    };

    const checkRecaptchaLoaded = () => {
      if (renderAttempted.current) {
        return;
      }

      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current) {
        const wasUsed = recaptchaRef.current.getAttribute('data-recaptcha-used') === 'true';
        const hasWidget = recaptchaRef.current.children.length > 0;

        if (!hasWidget && !wasUsed) {
          try {
            renderAttempted.current = true;

            recaptchaRef.current.setAttribute('data-recaptcha-used', 'true');
            recaptchaRef.current.setAttribute('data-instance-id', String(instanceId.current));

            const id = window.grecaptcha.render(recaptchaRef.current, {
              sitekey: siteKey,
              theme: RECAPTCHA_CONFIG.theme,
              size: RECAPTCHA_CONFIG.size,
            });
            setWidgetId(id);
            widgetIdRef.current = id;
            setIsReady(true);
            console.log(`reCAPTCHA v2 carregado (instância #${instanceId.current}, widget #${id})`);
          } catch (error) {
            console.error(`Erro ao renderizar reCAPTCHA (instância #${instanceId.current}):`, error);
            renderAttempted.current = false;
            if (recaptchaRef.current) {
              recaptchaRef.current.removeAttribute('data-recaptcha-used');
            }
          }
        } else if (wasUsed) {
          console.warn(`Elemento já foi usado por outra instância (instância atual #${instanceId.current})`);
        }
      } else if (window.grecaptcha && window.grecaptcha.render) {
        setTimeout(checkRecaptchaLoaded, 100);
      } else {
        setTimeout(checkRecaptchaLoaded, 100);
      }
    };

    loadRecaptchaScript();

    return () => {
      console.log(`Limpando reCAPTCHA (instância #${instanceId.current}, widget #${widgetIdRef.current})`);

      if (recaptchaRef.current) {
        const instanceIdAttr = recaptchaRef.current.getAttribute('data-instance-id');
        if (instanceIdAttr !== String(instanceId.current)) {
          console.log(`Elemento pertence a outra instância (#${instanceIdAttr}), pulando limpeza`);
          return;
        }

        recaptchaRef.current.removeAttribute('data-recaptcha-used');
        recaptchaRef.current.removeAttribute('data-instance-id');
        recaptchaRef.current.innerHTML = '';
      }

      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (error) {
          // Ignorar erros
        }
      }

      renderAttempted.current = false;
      widgetIdRef.current = null;
      setIsReady(false);
      setWidgetId(null);
    };
  }, [siteKey]);

  const getToken = useCallback((): string | null => {
    if (!isReady || widgetId === null) {
      console.warn('reCAPTCHA ainda não está pronto');
      return null;
    }

    try {
      const token = window.grecaptcha.getResponse(widgetId);
      return token || null;
    } catch (error) {
      console.error('Erro ao obter token reCAPTCHA:', error);
      return null;
    }
  }, [isReady, widgetId]);

  const resetRecaptcha = useCallback(() => {
    if (widgetId !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetId);
      } catch (error) {
        console.error('Erro ao resetar reCAPTCHA:', error);
      }
    }
  }, [widgetId]);

  const renderRecaptcha = useCallback(() => {
    if (!siteKey || !recaptchaRef.current || !window.grecaptcha || !window.grecaptcha.render) {
      return;
    }

    const hasWidget = recaptchaRef.current.children.length > 0;
    if (hasWidget) {
      return;
    }

    try {
      recaptchaRef.current.innerHTML = '';

      const id = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        theme: RECAPTCHA_CONFIG.theme,
        size: RECAPTCHA_CONFIG.size,
      });
      setWidgetId(id);
      widgetIdRef.current = id;
      setIsReady(true);
      console.log('reCAPTCHA v2 renderizado');
    } catch (error) {
      console.error('Erro ao renderizar reCAPTCHA:', error);
      if (recaptchaRef.current) {
        recaptchaRef.current.innerHTML = '';
      }
    }
  }, [siteKey]);

  return { recaptchaRef, getToken, resetRecaptcha, renderRecaptcha, isReady };
};
