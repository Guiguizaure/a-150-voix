// Les scènes du guide, une par étape et une pour l'accueil.
import type { SceneId } from "@content/etapes";
import type { Engine, Scene } from "../core/engine";
import { intro } from "./intro";

export function creerScenes(e: Engine): Partial<Record<SceneId, Scene>> {
  return {
    intro: intro(e),
  };
}
