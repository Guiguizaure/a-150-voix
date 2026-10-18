// Les scènes du guide, une par étape et une pour l'accueil.
import type { SceneId } from "@content/etapes";
import type { Engine, Scene } from "../core/engine";
import type { Son } from "../sound/accord";
import { accord } from "./accord";
import { deliberer } from "./deliberer";
import { democratie } from "./democratie";
import { dilemme } from "./dilemme";
import { ecouter } from "./ecouter";
import { hasard } from "./hasard";
import { intro } from "./intro";
import { soutenir } from "./soutenir";
import { suivre } from "./suivre";

export function creerScenes(
  e: Engine,
  { son }: { son?: Son } = {},
): Partial<Record<SceneId, Scene>> {
  return {
    intro: intro(e),
    hasard: hasard(e),
    ecouter: ecouter(e),
    dilemme: dilemme(e),
    deliberer: deliberer(e),
    accord: accord(e, son),
    suivre: suivre(e),
    democratie: democratie(e),
    soutenir: soutenir(e),
  };
}
