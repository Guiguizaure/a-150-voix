# À 150 voix : consignes pour Claude

Guide interactif indépendant (en français) sur l'assemblée citoyenne Un commun accord. Projet
de Guillaume Salle (Webjuno). Lire le README pour l'organisation et les commandes.

## Travail

- Une branche, un commit par sujet. Avant chaque push : `pnpm check` (lint, types, tests
  unitaires), `pnpm build`, puis `pnpm e2e` (Chromium et WebKit, mobile et bureau), la suite
  complète et pas seulement les tests touchés.
- Pousser, ouvrir ou mettre à jour la PR, **ne jamais fusionner** : Guillaume fusionne. Jamais
  de push sur `main` sans son accord.
- Pas de `pnpm dev`. Pour regarder une page : `pnpm build` puis le serveur de test
  (`PORT=4332 node e2e/static-server.mjs`), arrêté ensuite par son port
  (`lsof -ti tcp:4332 | xargs kill`), jamais `pkill` par motif.
- Fichiers temporaires dans `.tmp/` (ignoré). `_references/` (le prototype) n'est pas du code du
  site : ne pas le modifier ni le déployer.
- Aucun secret dans le dépôt ni dans la conversation. Pour Cloudflare et le DNS : préparer les
  étapes et les commandes, Guillaume les fait (voir `docs/lancement.md`).
- Choix visuel (police, palette, animation, navigation) : page de test temporaire en noindex,
  variantes côte à côte, à relire en local avant de trancher. Montrer des captures avant de
  commiter une retouche visuelle demandée.
- Next.js 16 : lire la documentation de `node_modules/next/dist/docs/` avant d'utiliser une API
  (elle diffère des versions connues).

## Contenu : règles intangibles

- **Faits** : aucun chiffre, aucune citation, aucun témoignage inventé. Tout fait entre dans
  `content/sources.ts` avec sa source et sa date de vérification ; le texte qui l'affirme le
  cite (`faits: [...]`). Une source qu'on n'a pas pu lire reste « à revérifier ». Si une source
  dit autre chose que le texte, corriger le texte et le noter dans le registre.
- **Neutralité** : les deux options d'un dilemme ont la même structure et le même poids visuel
  (testé) ; les critiques sont montrées ; les décomptes qui divergent sont présentés côte à
  côte, sans trancher.
- **Indépendance** : « Projet indépendant, sans lien avec les organisateurs d'Un commun
  accord » dans l'en-tête et le pied de page. Ni logo, ni photo, ni vidéo d'Un commun accord :
  des liens.
- **Pied de page** : « Conçu par Guillaume Salle · webjuno.com, avec Claude ». Ne jamais écrire
  « développé entièrement à la main ».
- **Couleurs** : pas de couleur de parti (bleu marine, rouge, rose, vert, orange vif). Palettes
  dans `src/lib/palette.ts` (Nuit par défaut, Papier au choix), reprises dans `globals.css`
  (testé) ; l'accent ne sert jamais de couleur de texte (`--hi` pour le texte d'accent).
- **Typographie française** : espaces insécables (fine avant ; ! ?, normale avant : et dans
  les « »), apostrophe ’, milliers séparés par une fine. `pnpm typo` corrige `content/`.
- Après une modification du registre : `pnpm sources` (un test vérifie que `docs/sources.md`
  est à jour).

## Repères techniques

- La scène vit dans la mise en page `(guide)` et n'est jamais rechargée ; le moteur
  (`src/scene/core/engine.ts`) ne dépend pas du DOM : il sert aussi aux images de partage
  (`scripts/og.ts`, @napi-rs/canvas).
- Les formations (`src/scene/formations`) sont des fonctions pures testées sur une grille de
  tailles ; toute nouvelle formation doit rester dans le cadre de 320 × 260 à 1920 × 1080.
- Liens internes du guide en `scroll={false}` : `Gestes.tsx` remonte la page lui-même (sinon le
  titre passe sous la scène collée en haut de l'écran mobile).
- `public/_headers` : bloc de préversion (noindex) retiré au lancement par
  `scripts/finalize-headers.ts` ; la CSP est vérifiée par les e2e (erreur console = échec).
