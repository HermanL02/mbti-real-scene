'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();

  const switchLocale = async (newLocale: Locale) => {
    // Set cookie
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    // Refresh to apply new locale
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            currentLocale === locale
              ? 'bg-white/20 text-white font-medium'
              : 'text-white/50 hover:text-white hover:bg-white/10'
          }`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  );
}
