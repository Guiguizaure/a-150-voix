// Étape 6 : le journal des sessions et les liens utiles.
import { LIENS_SUIVRE } from "@content/etapes";
import { sessionsPassees } from "@/lib/sessions";
import { Lien } from "../Markup";
import { Journal } from "./Journal";

/** État du journal au moment du build (la page est statique). */
const AU_BUILD = sessionsPassees(Date.now()).join(",");

export function BlocSuivre() {
  return (
    <>
      <Journal auBuild={AU_BUILD} />
      <ul className="links">
        {LIENS_SUIVRE.map((l) => (
          <li key={l.href}>
            <Lien href={l.href}>{l.texte}</Lien>
          </li>
        ))}
      </ul>
    </>
  );
}
