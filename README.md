# À 150 voix

Guide interactif et indépendant qui explique l'assemblée citoyenne
[Un commun accord](https://www.uncommunaccord.fr) : 150 Français tirés au sort, 6 week-ends de
septembre 2026 à février 2027, des conclusions rendues avant l'élection présidentielle de 2027.

Projet indépendant, sans lien avec les organisateurs d'Un commun accord.

Conçu par Guillaume Salle ([webjuno.com](https://webjuno.com)), avec Claude.

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
