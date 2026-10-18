# Mise en ligne publique

À faire par Guillaume, dans cet ordre, une fois la preview validée (y compris par l'équipe
d'Un commun accord). Aucun identifiant ne passe par le dépôt.

## 1. Vérifier le registre

```bash
STRICT=1 pnpm build
```

Le build doit passer : aucun fait à sourcer ou à revérifier, aucun emplacement à compléter.
Relire aussi les notes de `docs/sources.md`, en particulier :

- dates de la présidentielle (`afpPresidentielle`) : vérifiées à l'annonce du Conseil des
  ministres du 1er juillet 2026 ; revérifier au décret de convocation des électeurs, attendu
  fin janvier 2027 (au plus tard le 7 février) ;
- état de l'assemblée (`content/sessions.ts`) : dates des sessions 3 à 5 dès leur publication,
  et résumé de chaque session passée.

## 2. Fusionner

Fusionner la PR de `v1` dans `main` sur GitHub. Cloudflare Pages déploie `main` en production
(`https://a-150-voix.pages.dev`), encore en noindex à ce stade.

## 3. Relier le domaine 150voix.com

Tableau de bord Cloudflare → **Workers & Pages** → projet `a-150-voix` → **Custom domains** →
**Set up a custom domain** :

1. `150voix.com` (le domaine est déjà chez Cloudflare : l'enregistrement DNS est créé
   automatiquement) ;
2. `www.150voix.com`, puis une règle de redirection (**Rules** → **Redirect Rules** du domaine)
   de `www.150voix.com/*` vers `https://150voix.com/${1}`, code 301.

Attendre que les deux domaines soient **Active** (certificat émis).

## 4. Variables de production

Projet `a-150-voix` → **Settings** → **Variables and Secrets**, environnement **Production**
seulement :

| Variable        | Valeur                | Effet                                                              |
| --------------- | --------------------- | ------------------------------------------------------------------ |
| `SITE_URL`      | `https://150voix.com` | adresses canoniques, images de partage, sitemap                    |
| `SITE_LAUNCHED` | `1`                   | lève le noindex, ouvre robots.txt, remplit le sitemap, mode strict |

`PNPM_VERSION=11.3.0` reste en place (Production et Preview). Ne rien changer en Preview : les
previews restent en noindex.

## 5. Mesure d'audience

Projet `a-150-voix` → **Metrics** → **Web Analytics** → **Enable**. Cloudflare ajoute son script
au déploiement suivant ; la Content-Security-Policy de `public/_headers` l'autorise déjà. Les
mentions légales l'annoncent (outil sans cookie ni stockage dans le navigateur).

## 6. Redéployer et vérifier

**Deployments** → dernier déploiement de `main` → **Retry deployment** (pour prendre en compte
les variables et Web Analytics). Puis :

```bash
curl -sI https://150voix.com/ | grep -iE "^HTTP|x-robots|content-security"
curl -s https://150voix.com/robots.txt
curl -s https://150voix.com/sitemap.xml | head
curl -s https://150voix.com/hasard | grep -o '<meta property="og:image" content="[^"]*"'
```

Attendus : `HTTP/2 200`, **aucun** `x-robots-tag`, une Content-Security-Policy, un robots.txt
`Allow: /` avec le sitemap, 11 adresses dans le sitemap, et une image de partage en
`https://150voix.com/og/hasard.png`.

Enfin, tester le partage d'un lien (aperçu avec image) et déclarer le site dans Google Search
Console si souhaité (propriété de domaine `150voix.com`, vérification DNS chez Cloudflare).
