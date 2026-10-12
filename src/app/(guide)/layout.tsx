// Mise en page commune à l'accueil et aux huit étapes : elle reste montée quand on passe
// d'une étape à l'autre (la scène ne sera jamais rechargée).
import { Shell } from "@/components/Shell";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell>{children}</Shell>;
}
