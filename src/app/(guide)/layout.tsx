// Mise en page commune à l'accueil et aux huit étapes : elle reste montée quand on passe
// d'une étape à l'autre, et la scène avec elle (jamais rechargée).
import { Shell } from "@/components/Shell";
import { Stage } from "@/components/Stage";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell scene={<Stage />}>{children}</Shell>;
}
