"use client";

// Journal des sessions. Rendu au build avec l'état calculé à ce moment-là, puis relu dans le
// navigateur : une session passée depuis le dernier déploiement s'affiche comme telle.
import { useSyncExternalStore } from "react";
import { INTERFACE } from "@content/interface";
import { JOURNAL } from "@content/sessions";
import { sessionsPassees } from "@/lib/sessions";
import { Markup } from "../Markup";

const rien = () => () => {};
const maintenant = () => sessionsPassees(Date.now()).join(",");

export function Journal({ auBuild }: { auBuild: string }) {
  const etat = useSyncExternalStore(rien, maintenant, () => auBuild).split(",");
  return (
    <ol className="journal">
      {JOURNAL.map((e, i) => {
        const passee = etat[i] === "true";
        return (
          <li
            key={e.titre}
            className={
              "election" in e && e.election
                ? "loin"
                : passee
                  ? "passee"
                  : undefined
            }
          >
            <span className="when">
              {passee && (
                <span className="sr-only">{INTERFACE.sessionPassee} </span>
              )}
              {e.quand}
            </span>
            <b>{e.titre}</b>
            {"resume" in e && e.resume && (
              <p>
                <Markup texte={e.resume.texte} />
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
