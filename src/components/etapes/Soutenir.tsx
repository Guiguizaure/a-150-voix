// Étape 8 : liens pour soutenir et ce que paie le budget.
import { BOUTONS_SOUTENIR, POSTES_BUDGET } from "@content/etapes";
import { Lien } from "../Markup";

export function BlocSoutenir() {
  return (
    <>
      <div className="btn-row">
        {BOUTONS_SOUTENIR.map((b) => (
          <Lien
            key={b.href}
            href={b.href}
            className={b.principal ? "btn primary" : "btn"}
          >
            {b.texte}
            {b.principal && <span aria-hidden="true"> ↗</span>}
          </Lien>
        ))}
      </div>
      <h2 className="k-label">{POSTES_BUDGET.titre}</h2>
      <ul className="tags">
        {POSTES_BUDGET.postes.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </>
  );
}
