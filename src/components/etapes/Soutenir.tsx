// Étape 8 : une seule action en bouton plein (Ulule), les autres en liens, ce que paie le
// budget en quelques lignes concrètes, puis l'invitation finale.
import { SOUTENIR } from "@content/etapes";
import { Fleche } from "../Fleche";
import { Lien, Markup } from "../Markup";

export function BlocSoutenir() {
  const S = SOUTENIR;
  return (
    <>
      <Lien href={S.principal.href} className="cta-soutien">
        {S.principal.texte}
        <Fleche sens="sortie" />
      </Lien>
      <ul className="actions">
        {S.liens.map((l) => (
          <li key={l.texte}>
            <Lien href={l.href}>
              {l.texte}
              <Fleche sens="droite" className="actions-fleche" />
            </Lien>
          </li>
        ))}
      </ul>
      <h2 className="k-label">{S.budget.titre}</h2>
      <ul className="budget">
        {S.budget.lignes.map((l) => (
          <li key={l.cle}>
            <em>{l.cle}</em> <Markup texte={l.texte} />
          </li>
        ))}
      </ul>
      <p className="cloture">
        <Markup texte={S.cloture.texte} />
      </p>
    </>
  );
}
