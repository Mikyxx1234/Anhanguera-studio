// Global type declarations for Google Analytics functions
declare global {
  interface Window {
    gtag_report_conversion_graduacao: (url?: string) => boolean;
    gtag_report_conversion_pos: (url?: string) => boolean;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export {};