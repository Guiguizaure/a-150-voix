import { describe, expect, it } from "vitest";
import { parseMarkup, plainText, strayMarks } from "./markup";

describe("mini-balisage", () => {
  it("découpe gras, accent, exposant et liens", () => {
    expect(
      parseMarkup(
        "À 150 *voix* : **200 000** au V^e^ siècle, [site](https://a.fr/).",
      ),
    ).toEqual([
      { type: "texte", texte: "À 150 " },
      { type: "accent", texte: "voix" },
      { type: "texte", texte: " : " },
      { type: "gras", texte: "200 000" },
      { type: "texte", texte: " au V" },
      { type: "exposant", texte: "e" },
      { type: "texte", texte: " siècle, " },
      { type: "lien", texte: "site", href: "https://a.fr/" },
      { type: "texte", texte: "." },
    ]);
  });

  it("rend le texte lu, sans marques ni adresses", () => {
    expect(plainText("**Les deux** [comptent](https://a.fr/).")).toBe(
      "Les deux comptent.",
    );
  });

  it("repère les marques orphelines", () => {
    expect(strayMarks("**gras* et [lien](a b)")).not.toEqual([]);
    expect(strayMarks("**gras** et [lien](https://a.fr/)")).toEqual([]);
  });
});
