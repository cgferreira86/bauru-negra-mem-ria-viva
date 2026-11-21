/** Adinkra Sankofa — pássaro de pé, com o pescoço voltado para trás, buscando o ovo sobre as costas. Decorativo. */
export function SankofaWatermark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 200" className={`pointer-events-none select-none ${className}`} style={{ color: "#985B43", opacity: 0.18 }} fill="currentColor" fillRule="evenodd">
      <path d="M34 112c0-18 14-30 32-30 18 0 32 8 50 8 22 0 42-12 60-30 4-4 10 0 8 6-8 34-30 68-74 76-44 8-76-6-76-30z" />
      <path d="M52 92C40 64 46 36 70 26c22-9 44 2 50 22l-14 4c-4-12-16-18-30-12-16 7-18 28-10 46z" />
      <path d="M104 40c10-4 22 2 24 12 1 5 0 9-2 12l12 16-18-8c-8 4-18 2-22-6-4-10-2-22 6-26zM114 47a3 3 0 1 0 0 6a3 3 0 1 0 0-6z" />
      <ellipse cx="136" cy="80" rx="9" ry="11" transform="rotate(-20 136 80)" />
      <path d="M78 140h7v34l12 8-3 5-12-7-12 7-3-5 11-8zM112 138h7v36l12 8-3 5-12-7-12 7-3-5 11-8z" />
    </svg>
  );
}
