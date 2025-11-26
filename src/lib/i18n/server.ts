/**
 * Server-side translation utility for i18n
 * This allows accessing translations in API routes and server components
 * without relying on React hooks or client-side context
 */

import en from '@/i18n/messages/en.json';
import zh from '@/i18n/messages/zh.json';

// Type for the translation messages structure
type Messages = typeof en;

// All available locales and their messages
const messages: Record<string, Messages> = {
  en,
  zh,
};

/**
 * Get the full translations object for a locale
 */
export function getTranslations(locale: string): Messages {
  return messages[locale] || messages['en'];
}

/**
 * Get a nested translation value by dot-notation path
 *
 * @param locale - The locale code (e.g., 'en', 'zh')
 * @param path - Dot-notation path to the translation (e.g., 'scenarios.ageDescriptions.teen')
 * @param params - Optional parameters to interpolate (e.g., { base: 'Student', detail: 'CS' })
 * @returns The translated string or the path if not found
 *
 * @example
 * t('en', 'scenarios.ageDescriptions.teen') // "Teen (13-17, high school)"
 * t('zh', 'scenarios.occupationDetailFormat', { base: '学生', detail: '计算机' }) // "学生，计算机方向"
 */
export function t(
  locale: string,
  path: string,
  params?: Record<string, string>
): any {
  const translations = getTranslations(locale);

  // Navigate to the nested value using the path
  let value: any = path.split('.').reduce(
    (obj: any, key: string) => obj?.[key],
    translations
  );

  // If not found, return the path as fallback
  if (value === undefined) {
    console.warn(`Translation missing: ${path} for locale: ${locale}`);
    return path;
  }

  // Interpolate parameters if value is a string and params provided
  if (params && typeof value === 'string') {
    Object.entries(params).forEach(([key, val]) => {
      value = value.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
    });
  }

  return value;
}

/**
 * Check if a locale is supported
 */
export function isLocaleSupported(locale: string): boolean {
  return locale in messages;
}

/**
 * Get all supported locale codes
 */
export function getSupportedLocales(): string[] {
  return Object.keys(messages);
}
