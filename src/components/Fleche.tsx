// Flèches dessinées en SVG : centrées au pixel près, quelle que soit la police (les glyphes
// ← et → de Hanken Grotesk ne sont pas centrés sur leur ligne).
const TRACES = {
  gauche: "M13 8H3m4-4L3 8l4 4",
  droite: "M3 8h10M9 4l4 4-4 4",
  sortie: "M5 11l6-6M6 5h5v5",
} as const;

export function Fleche({
  sens,
  className,
}: {
  sens: keyof typeof TRACES;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={TRACES[sens]} />
    </svg>
  );
}
