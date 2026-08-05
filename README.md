# website-shell — contenant partagé (Groupe Selion)

Package Astro partagé par les sites du Groupe Selion : Header, Footer, FatFooter, BaseLayout, ContactForm, CTASection + moteur i18n. Chaque site consomme ce package et lui fournit sa propre config (voir `src/types.ts`, interface `SiteConfig`) — le contenant ne connaît aucune donnée propre à un site (pas de `SITE_CONFIG` global, tout arrive en props).

Contexte complet de la migration : `docs/astro_multi_website_management/scoping-migration-multi-repos-2026-08-05.md` dans le dépôt `coeur-historique/myselion4nonprofit`.

## Contenu

- `src/i18n/engine.ts` — moteur i18n générique (aucune donnée de traduction embarquée).
- `src/types.ts` — contrat `SiteConfig` que chaque site doit fournir.
- `src/web3forms.ts` — clé d'accès Web3Forms partagée par tous les sites (destination technique unique, décision de Laurent le 05/08/2026).
- `src/components/layout/{Header,Footer,FatFooter}.astro`
- `src/layouts/BaseLayout.astro`
- `src/components/contact/ContactForm.astro`
- `src/components/CTASection.astro`

## État (05/08/2026)

Première extraction — couvre le shell de page (Header/Footer/FatFooter/BaseLayout) + les composants de contact/CTA. Pas encore migré : les 2 scripts de vérification (`check-hardcoded-domains.mjs`/`check-cross-site-leakage.mjs`, dont la logique doit être adaptée à un contexte mono-site avant migration), les templates de rendu de collections (`cible-shared/`, `blog/`).

## Utiliser ce package depuis un site de contenu

Tant qu'il n'est pas publié sur un registre (GitHub Packages), dépendance directe sur le dépôt :

```json
"dependencies": {
  "@coeur-historique/website-shell": "github:coeur-historique/website-shell"
}
```
