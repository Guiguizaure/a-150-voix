// Les scènes du guide, une par étape et une pour l'accueil.
import type { SceneId } from "@content/etapes";
import type { Engine, Scene } from "../core/engine";
import { deliberer } from "./deliberer";
import { ecouter } from "./ecouter";
import { hasard } from "./hasard";
import { intro } from "./intro";

export function creerScenes(e: Engine): Partial<Record<SceneId, Scene>> {
  return {
    intro: intro(e),
    hasard: hasard(e),
    ecouter: ecouter(e),
    deliberer: deliberer(e),
  };
}
