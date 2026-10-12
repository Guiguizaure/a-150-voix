import type { Metadata } from "next";
import { EDITEUR, HEBERGEUR, MENTIONS } from "@content/legal";
import { Lien, Markup } from "@/components/Markup";
import { pageMetadata } from "@/lib/site";
import { INTERFACE } from "@content/interface";

export const metadata: Metadata = pageMetadata({
  title: MENTIONS.titre,
  description: MENTIONS.description,
  path: "/mentions-legales",
  image: "accueil",
  alt: INTERFACE.partage.accueil,
});

function Paragraphes({ textes }: { textes: readonly string[] }) {
  return textes.map((t) => (
    <p key={t}>
      <Markup texte={t} />
    </p>
  ));
}

export default function MentionsLegales() {
  const M = MENTIONS;
  return (
    <article aria-labelledby="titre-page">
      <h1 className="title" id="titre-page">
        {M.titre}
      </h1>
      <section aria-labelledby="editeur">
        <h2 id="editeur">{M.editeur}</h2>
        <address>
          {EDITEUR.nom}, {EDITEUR.statut}
          <br />
          SIRET {EDITEUR.siret}
          <br />
          {EDITEUR.rue}, {EDITEUR.codePostal} {EDITEUR.ville}
          <br />
          <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>
        </address>
        <p>{M.directeur}</p>
      </section>
      <section aria-labelledby="hebergeur">
        <h2 id="hebergeur">{M.hebergeur}</h2>
        <address>
          {HEBERGEUR.nom}
          <br />
          {HEBERGEUR.rue}, {HEBERGEUR.ville} {HEBERGEUR.codePostal},{" "}
          {HEBERGEUR.pays}
          <br />
          <Lien href={HEBERGEUR.url}>cloudflare.com</Lien>
        </address>
        <p>{M.hebergeurTexte}</p>
      </section>
      <section aria-labelledby="donnees">
        <h2 id="donnees">{M.donnees}</h2>
        <Paragraphes textes={M.donneesTexte} />
      </section>
      <section aria-labelledby="independance">
        <h2 id="independance">{M.independance}</h2>
        <Paragraphes textes={M.independanceTexte} />
      </section>
      <section aria-labelledby="credits">
        <h2 id="credits">{M.credits}</h2>
        <Paragraphes textes={M.creditsTexte} />
      </section>
    </article>
  );
}
