// Calque de Soutenir : le budget, sa répartition et la valeur d'un point.
import { SCENES } from "@content/etapes";

const T = SCENES.soutenir;

export function CalqueSoutenir() {
  return (
    <div className="ov">
      <div className="counter">
        <span className="counter-n">{T.montant}</span>
        <span className="counter-l">{T.legende}</span>
        <ul className="legend">
          <li>
            <i className="full" aria-hidden="true" />
            {T.dons}
          </li>
          <li>
            <i className="hollow" aria-hidden="true" />
            {T.cagnotte}
          </li>
        </ul>
        <span className="counter-u">{T.unite}</span>
      </div>
    </div>
  );
}
