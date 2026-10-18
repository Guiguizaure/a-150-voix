# À 150 voix

Guide interactif et indépendant qui explique l'assemblée citoyenne
[Un commun accord](https://www.uncommunaccord.fr) : 150 Français tirés au sort, 6 week-ends de
septembre 2026 à février 2027, des conclusions rendues avant l'élection présidentielle de 2027.

Projet indépendant, sans lien avec les organisateurs d'Un commun accord.

Conçu par Guillaume Salle ([webjuno.com](https://webjuno.com)), avec Claude.

## Le guide

Un accueil et huit étapes, chacune à sa propre adresse : `/hasard`, `/ecouter`, `/dilemme`,
`/deliberer`, `/accord`, `/suivre`, `/democratie`, `/soutenir`, plus `/mentions-legales` et
`/sources`. Une scène animée accompagne le texte : 150 points, un par citoyen, qui glissent
d'une formation à l'autre sans que le canvas soit jamais rechargé.

- Palettes Nuit (par défaut) et Papier (au choix, gardée dans le navigateur), accent Lampe.
- Accessibilité (RGAA AA visé) : flèches du clavier, balayage du texte sur mobile, focus sur
  le titre à chaque étape, scènes décrites pour les lecteurs d'écran, cibles de 44 px,
  mouvement réduit respecté, son coupé par défaut.
- Aucun cookie, aucune donnée personnelle collectée.

## Commandes

```bash
pnpm install
pnpm build           # garde-fou du registre, images de partage, export statique dans out/
pnpm check           # lint, types, tests unitaires
pnpm e2e             # tests de bout en bout et accessibilité (après pnpm build)
pnpm serve:out       # sert out/ sur le port 4330, avec les en-têtes de public/_headers
pnpm typo            # corrige la typographie française des textes de content/
pnpm sources         # régénère docs/sources.md depuis le registre
pnpm og              # régénère seulement les images de partage (public/og/)
STRICT=1 pnpm build  # échoue s'il reste un fait à sourcer ou à revérifier
```

Node 24 (`.nvmrc`) et pnpm 11.

## Organisation

```
content/              textes du guide et registre des sources (content/sources.ts fait foi)
docs/sources.md       registre lisible, généré par pnpm sources (ne pas modifier à la main)
docs/lancement.md     mise en ligne publique : étapes et réglages Cloudflare
src/app/              pages (export statique Next.js), styles, en-têtes de page
src/components/       coquille du guide, navigation, calques de la scène, blocs d'étapes
src/scene/            moteur des 150 points (indépendant du DOM), formations, scènes, son
src/lib/              palette, typographie, mini-balisage, registre, adresse du site
scripts/              garde-fous, typographie, images de partage, en-têtes, polices
e2e/                  tests Playwright (Chromium, WebKit ; mobile et bureau) et serveur de test
public/_headers       en-têtes Cloudflare Pages : noindex de préversion, sécurité, cache
```

## Contenu et sources

Chaque affirmation du guide renvoie à un fait du registre `content/sources.ts`, et chaque fait
à ses sources, avec sa date de vérification. Les tests vérifient la typographie française de
tout le texte affiché, que chaque chiffre cite un fait, que le registre est cohérent et que
`docs/sources.md` est à jour, et que les deux options d'un dilemme ont des longueurs proches.
`STRICT=1` (et `SITE_LAUNCHED=1`) font échouer le build tant qu'il reste un fait à sourcer ou
à revérifier, ou un emplacement à compléter.

Le texte utilise un mini-balisage : `**gras**`, `*accent*` (italique Newsreader),
`[lien](https://…)` et `^exposant^`.

## Déploiement

Cloudflare Pages, intégration Git : `main` en production, chaque autre branche en preview.
Commande de build `pnpm build`, dossier `out`, variable `PNPM_VERSION=11.3.0`. Tant que
`SITE_LAUNCHED=1` n'est pas posée, tout est en noindex (en-tête, balise meta, robots.txt) et le
sitemap est vide. La mise en ligne publique est décrite dans [docs/lancement.md](docs/lancement.md).

## Polices

Polices locales, sous licence SIL Open Font License 1.1 (fichiers `OFL-*.txt` dans
`assets/fonts/`) :

- **Hanken Grotesk** (texte), fichiers de Google Fonts, latin et latin étendu ;
- **Newsreader italique** (accents), allégée avec [fonttools](https://github.com/fonttools/fonttools) :
  graisse 500 seule, axe de taille optique conservé, sous-ensemble latin et caractères français
  (`scripts/subset-newsreader.sh`, depuis le fichier variable du dépôt google/fonts).

Aucune des deux n'avait d'espace fine insécable (U+202F) : `scripts/add-narrow-nbsp.py`
l'ajoute (glyphe vide de 1/8 de cadratin), pour que la typographie française ne dépende pas
des polices du système. Ces licences ne réservent aucun nom de police : les versions modifiées
gardent leur nom.
