// Texte d'une étape : fil, titre (un mot par span pour l'entrée animée), paragraphes, bloc
// propre à l'étape, note et ligne de fin.
import type { Etape as EtapeT } from "@content/etapes";
import { fil } from "@/lib/guide";
import { Markup } from "./Markup";
import { BlocDemocratie } from "./etapes/Democratie";
import { BlocDilemme } from "./etapes/Dilemme";
import { BlocSoutenir } from "./etapes/Soutenir";
import { BlocSuivre } from "./etapes/Suivre";

const BLOCS: Partial<Record<EtapeT["slug"], () => React.ReactNode>> = {
  dilemme: BlocDilemme,
  suivre: BlocSuivre,
  democratie: BlocDemocratie,
  soutenir: BlocSoutenir,
};

/** Titre découpé en mots (espaces ordinaires seulement : « sort ? » reste uni). */
export function TitreMots({ titre }: { titre: string }) {
  const mots = titre.split(" ");
  return (
    <>
      {mots.map((m, i) => (
        <span key={i}>
          <span className="w" style={{ "--i": i } as React.CSSProperties}>
            <Markup texte={m} />
          </span>
          {i < mots.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export function Etape({ etape }: { etape: EtapeT }) {
  const f = fil(etape);
  const Bloc = BLOCS[etape.slug];
  const k = etape.paragraphes.length;
  return (
    <article className="step enter" aria-labelledby="titre-etape">
      <p className="num">
        <em>{f.numero}</em> {f.texte}
      </p>
      <h1 className="title" id="titre-etape" tabIndex={-1}>
        <TitreMots titre={etape.titre} />
      </h1>
      {k > 0 && (
        <div className="body">
          {etape.paragraphes.map((p, i) => (
            <p key={i} style={{ "--k": i } as React.CSSProperties}>
              <Markup texte={p.texte} />
            </p>
          ))}
        </div>
      )}
      {Bloc && (
        <div className="reveal" style={{ "--k": k } as React.CSSProperties}>
          <Bloc />
        </div>
      )}
      {"note" in etape && etape.note && (
        <aside
          className="note reveal"
          style={{ "--k": k + 1 } as React.CSSProperties}
        >
          <span className="note-k accent">{etape.note.etiquette}</span>
          <span>
            <Markup texte={etape.note.texte} />
          </span>
        </aside>
      )}
      {"fin" in etape && etape.fin && (
        <p
          className="fine reveal"
          style={{ "--k": k + 2 } as React.CSSProperties}
        >
          <Markup texte={etape.fin.texte} />
        </p>
      )}
    </article>
  );
}
