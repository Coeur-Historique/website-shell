// website-shell/src/web3forms.ts
// Cle d'acces Web3Forms UNIQUE, partagee par tous les sites du groupe (decision de
// Laurent le 05/08/2026 : "un seul formulaire pour tout" -- destination technique
// unique noreply-contactform@grpsln.com). Contrairement a CONTACT_DATA.email (adresse
// publique affichee, propre a chaque site), cette valeur est identique partout : elle
// vit donc dans le contenant, pas dans le fichier "variables" de chaque site. Pas un
// secret -- Web3Forms la documente elle-meme comme "safe to use in client-side code"
// (alias public de l'email de destination).
export const WEB3FORMS_ACCESS_KEY = "38d1eb99-f340-40b3-9937-f9c93f0e6ca4";
