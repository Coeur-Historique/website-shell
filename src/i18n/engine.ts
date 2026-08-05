// website-shell/src/i18n/engine.ts
//
// Moteur i18n generique, extrait de myselion4nonprofit/src/i18n/index.ts le 05/08/2026
// (migration multi-repos, voir docs/astro_multi_website_management/
// scoping-migration-multi-repos-2026-08-05.md dans le depot myselion4nonprofit).
//
// Difference cle avec l'ancienne version monorepo : ce module ne connait AUCUNE donnee
// propre a un site (ni translations.json, ni TRANSLATED_PATHS -- ces deux etaient
// codes en dur dans l'ancien moteur partage, ce qui le rendait en realite specifique a
// coeur-historique.be malgre son apparence generique). Chaque site fournit ses propres
// donnees en parametre :
// - createTranslator(translations) pour t()
// - getSwitcherHref(..., translatedPaths) attend explicitement la liste du site courant
//
// Toute fonction ci-dessous est pure (aucun import de donnees, aucun singleton).

export const SUPPORTED_LOCALES = ['fr', 'en', 'nl', 'de', 'es'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export type TranslationEntry = Partial<Record<Locale, string>>;
export type TranslationDictionary = Record<string, TranslationEntry>;

/**
 * Fabrique une fonction t() liee a un dictionnaire de traductions precis (celui du
 * site courant). Repli sur le francais si la traduction manque, puis sur la cle
 * elle-meme si meme le francais manque (pour reperer facilement une cle oubliee).
 */
export function createTranslator<T extends TranslationDictionary>(translations: T) {
  return function t(key: keyof T & string, locale: Locale = DEFAULT_LOCALE): string {
    const entry = translations[key];
    if (!entry) return String(key);
    return entry[locale] || entry[DEFAULT_LOCALE] || String(key);
  };
}

/**
 * Deduit la locale active a partir du chemin d'URL Astro (Astro.url.pathname).
 * Structure symetrique (prefixDefaultLocale: true) : "/fr/..." -> fr, "/en/..." -> en, etc.
 * Retombe sur le francais si le premier segment n'est pas une locale connue (securite).
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(segment)
    ? (segment as Locale)
    : DEFAULT_LOCALE;
}

/**
 * Prefixe un chemin racine (ex. "/cible/asbl") avec la locale active.
 * "/cible/asbl" + "en" -> "/en/cible/asbl". Ne pas utiliser sur une URL externe
 * (http/https) ni un lien mailto:/tel:/#ancre -- retourne le chemin inchange dans ce cas.
 */
export function localizePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  if (/^([a-z]+:|#)/i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/**
 * Retire le segment de locale d'un pathname pour obtenir le chemin "nu" comparable
 * entre langues. "/en/contact" -> "/contact", "/fr/" -> "/".
 */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && (SUPPORTED_LOCALES as readonly string[]).includes(segments[0])) {
    segments.shift();
  }
  const rest = segments.join('/');
  return rest === '' ? '/' : `/${rest}`;
}

/**
 * Calcule l'URL equivalente dans une autre langue pour le path courant (sans prefixe).
 * Retombe sur l'accueil de la langue cible si le path courant n'est pas dans
 * translatedPaths (liste FOURNIE PAR LE SITE APPELANT -- ex-TRANSLATED_PATHS, qui
 * contenait en realite des slugs propres a coeur-historique.be codes en dur dans
 * l'ancien moteur partage, corrige ici en la faisant remonter au site).
 */
export function getSwitcherHref(
  currentPathWithoutLocale: string,
  targetLocale: Locale,
  translatedPaths: readonly string[],
): string {
  const normalized = currentPathWithoutLocale === '' ? '/' : currentPathWithoutLocale;
  const isTranslated = translatedPaths.includes(normalized);
  return isTranslated ? localizePath(normalized, targetLocale) : localizePath('/', targetLocale);
}

/**
 * Helpers GENERIQUES de correspondance id <-> langue <-> slug reel pour toute Content
 * Collection organisee en "un fichier par langue" (`slug.<locale>.mdx`), quel que soit
 * le nombre ou le jeu de langues du site courant. A reutiliser par toute collection
 * (blog, cible, service...) du site consommateur.
 */
export function getEntryLocale(entryId: string, defaultLocale: string = 'fr'): string {
  const match = entryId.match(/\.([a-z]{2})$/);
  return match ? match[1] : defaultLocale;
}

export function getEntrySlug(entry: { id: string; data: { customSlug?: string } }): string {
  if (entry.data.customSlug) return entry.data.customSlug;
  return entry.id.replace(/\.([a-z]{2})$/, '');
}
