import type { Metadata } from "next";
import { SOURCES_PAGE as T } from "@content/legal";
import { FAITS, SOURCES, type Fait, type Source } from "@content/sources";
import { Lien, Markup } from "@/components/Markup";

export const metadata: Metadata = {
  title: T.titre,
  description: T.description,
  alternates: { canonical: "/sources" },
};

const date = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "UTC",
});
const jour = (iso: string) => date.format(new Date(`${iso}T12:00:00Z`));

const faits = Object.values(FAITS) as Fait[];

function Meta({ s }: { s: Source }) {
  const parties = [
    s.editeur,
    s.auteur,
    s.publie && `${T.publie} ${jour(s.publie)}`,
    `${T.consulte} ${jour(s.consulte)}`,
    s.langue === "en" && T.enAnglais,
  ].filter(Boolean);
  return <p className="source-meta">{parties.join(" · ")}</p>;
}

export default function Sources() {
  return (
    <article aria-labelledby="titre-page">
      <h1 className="title" id="titre-page">
        {T.titre}
      </h1>
      <p className="lead">{T.intro}</p>
      <ol className="sources">
        {(Object.entries(SOURCES) as [string, Source][]).map(([id, s]) => {
          const lies = faits.filter((f) =>
            (f.sources as readonly string[]).includes(id),
          );
          return (
            <li key={id} id={id}>
              <h2 lang={s.langue}>
                <Lien href={s.url}>{s.titre}</Lien>
              </h2>
              <Meta s={s} />
              <p className="k-label">{T.faits}</p>
              <ul>
                {lies.map((f) => (
                  <li key={f.enonce}>
                    <Markup texte={f.enonce} />
                    {f.statut === "a-reverifier" && (
                      <span className="statut"> ({T.aReverifier})</span>
                    )}
                    {f.calcul && (
                      <span className="calcul">
                        {" "}
                        {T.calcul}&nbsp;: {f.calcul.formule}.
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
