"use client";

// Calques HTML posés sur la scène, selon l'étape.
import type { SceneId } from "@content/etapes";
import { CalqueAccord } from "./Accord";
import { CalqueDilemme } from "./Dilemme";
import { CalqueHasard } from "./Hasard";
import { CalqueDeliberer, CalqueDemocratie, CalqueEcouter } from "./Legende";
import { CalqueSoutenir } from "./Soutenir";

export function Calques({ scene }: { scene: SceneId }) {
  switch (scene) {
    case "hasard":
      return <CalqueHasard />;
    case "ecouter":
      return <CalqueEcouter />;
    case "dilemme":
      return <CalqueDilemme />;
    case "deliberer":
      return <CalqueDeliberer />;
    case "accord":
      return <CalqueAccord />;
    case "democratie":
      return <CalqueDemocratie />;
    case "soutenir":
      return <CalqueSoutenir />;
    default:
      return null;
  }
}
