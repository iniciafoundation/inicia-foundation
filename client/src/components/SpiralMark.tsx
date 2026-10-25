/** Golden-ratio spiral used as a decorative brand mark. */
export function SpiralMark({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 233 144" className={className} aria-hidden fill="none" stroke="#D6B25E" strokeWidth="1.2">
    <rect x="0.5" y="0.5" width="232" height="143" strokeOpacity=".35" />
    <path d="M144 0V144M144 89H233M178 89V144M144 110H178M165 89V110M165 102H178" strokeOpacity=".35" />
    <path d="M0 144A144 144 0 0 1 144 0A89 89 0 0 1 233 89A55 55 0 0 1 178 144A34 34 0 0 1 144 110A21 21 0 0 1 165 89A13 13 0 0 1 178 102" />
  </svg>;
}
