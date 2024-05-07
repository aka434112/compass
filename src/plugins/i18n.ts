import { nextTick } from 'vue'
import { WritableComputedRef } from '@vue/reactivity'
import { Composer, createI18n, I18n, I18nOptions } from 'vue-i18n'
import axios from 'axios'

export const VUE_I18N_DEFAULT_LOCALE = 'en'
export const VUE_I18N_DEFAULT_FALLBACK_LOCALE = 'en'
export const LOCALES_DIRECTORY_NAME = 'locales'
const LOCALES_FILE_PATH_PREFIX = `../${LOCALES_DIRECTORY_NAME}/`

export function setupI18n(
  options: I18nOptions = {
    locale: VUE_I18N_DEFAULT_LOCALE,
    fallbackLocale: VUE_I18N_DEFAULT_FALLBACK_LOCALE,
    legacy: false,
  }
): I18n {
  const i18n = createI18n(options)
  const lang = options.locale || VUE_I18N_DEFAULT_FALLBACK_LOCALE
  setI18nLanguage(i18n, lang)
  return i18n
}

export function setI18nLanguage(
  i18n: I18n,
  locale: string = VUE_I18N_DEFAULT_FALLBACK_LOCALE
): string {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    ;(i18n.global as unknown as Composer).locale.value = locale
  }

  axios.defaults.headers.common['Accept-Language'] = locale
  document.querySelector('html')?.setAttribute('lang', locale)

  return locale
}

export const loadLocale = async (
  file: string,
  locale: string = VUE_I18N_DEFAULT_FALLBACK_LOCALE
) => {
  return fetch(`${LOCALES_FILE_PATH_PREFIX}${file}.${locale}.json`)
    .then(async (response) => {
      if (response.ok) {
        const messages = await response.json()
        i18n.global.mergeLocaleMessage(locale, messages)
      } else {
        throw new Error('Something went wrong!')
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

export async function loadVueI18nLocaleMessages(
  locale: string = VUE_I18N_DEFAULT_FALLBACK_LOCALE
): Promise<string> {
  await loadLocale('common')
  await nextTick()
  return setI18nLanguage(i18n, locale)
}

export async function addVueI18nLocaleMessages(file: string) {
  let currentLocale = VUE_I18N_DEFAULT_FALLBACK_LOCALE
  if (i18n.mode === 'legacy') {
    currentLocale = i18n.global.locale as string
  } else {
    currentLocale = (i18n.global.locale as WritableComputedRef<string>)
      .value as string
  }
  loadLocale(file)
}

export const i18n = setupI18n()
export default [i18n, {}]
