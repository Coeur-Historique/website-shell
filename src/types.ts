// website-shell/src/types.ts
//
// Contrat de config que chaque site doit fournir aux composants du contenant
// (Header/Footer/FatFooter/BaseLayout/ContactForm/CTASection). Correspond au fichier
// "variables" unique par site decide par Laurent le 05/08/2026 (voir
// docs/astro_multi_website_management/scoping-migration-multi-repos-2026-08-05.md,
// depot myselion4nonprofit) -- ce fichier definit la FORME attendue, chaque site
// remplit sa propre instance (src/site.variables.ts dans le depot de contenu).

export interface ContactData {
  phone: string;
  phoneUrl: string;
  email: string;
  emailUrl: string;
  address: string;
  tvaNumber: string;
  kboUrl: string;
  ringMeUrl: string;
  donationUrl?: string;
  googleReviewUrl?: string;
}

export interface SocialLink {
  url: string;
  label: string;
  icon: string;
  hoverClass: string;
}

export interface NavEntry {
  name: string;
  slug: string;
  desc?: string;
}

export interface AnalyticsConfig {
  gaMeasurementId?: string;
  searchConsoleVerification?: string;
  googleAdsId?: string;
  adsensePublisherId?: string;
  metaPixelId?: string;
  pinterestTagId?: string;
}

export interface SiteConfig {
  title: string;
  slogan?: string;
  description: string;
  legalForm: string;
  themeClass: string;
  favicon: string;
  logoUrl?: string;
  domain?: string;
  locales: readonly string[];
  ogImageUrl?: string;

  // Cles TranslationKey (du dictionnaire DU SITE) pour les libelles de nav -- rendues
  // via t() par Header.astro/FatFooter.astro plutot que du texte en dur, pour que la
  // traduction fonctionne (ex: "Volontariat" chez l'ASBL devient "Recrutement" chez
  // une societe commerciale, meme mecanisme qu'avant la migration).
  labels: {
    cible: string;
    service: string;
    objectif: string;
    blog: string;
    volontariat: string;
  };

  features: {
    showBlog: boolean;
    showAffiliation: boolean;
    showBenchmark: boolean;
    showDonation: boolean;
  };

  contactData: ContactData;
  socialLinks: Record<string, SocialLink>;
  analytics?: AnalyticsConfig;

  cible: NavEntry[];
  service: NavEntry[];
  objectif: NavEntry[];
}
