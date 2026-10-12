import { PageSimple } from "@/components/PageSimple";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageSimple>{children}</PageSimple>;
}
