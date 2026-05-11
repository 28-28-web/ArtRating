"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');
  
  const [currentLocale, setCurrentLocale] = useState(locale);

  // Sync with locale changes
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'bn' ? 'en' : 'bn';
    
    // Store preference in localStorage and cookie
    localStorage.setItem('preferred-language', newLocale);
    document.cookie = `preferred-language=${newLocale}; max-age=31536000; path=/`;
    
    // Navigate to the same page with new locale
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
    
    setCurrentLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2 text-sm font-extrabold text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
      title={t('toggle')}
    >
      <span className="text-xs">
        {currentLocale === 'bn' ? 'বাং' : 'EN'}
      </span>
      <div className="w-4 h-4 flex items-center justify-center">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      </div>
    </button>
  );
}
