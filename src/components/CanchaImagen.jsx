// Ilustración de cancha en SVG (sin imágenes externas)
export default function CanchaImagen({ tipo }) {
  const padel = tipo === 'Pádel'
  const a = padel ? '#2f6fb5' : '#2e9e5f'
  const b = padel ? '#2a64a3' : '#278a52'
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="120" fill={a} />
      {[0, 2, 4, 6].map(i => <rect key={i} x={i * 25} y="0" width="25" height="120" fill={b} />)}
      <g fill="none" stroke="#fff" strokeWidth="1.5" opacity=".9">
        <rect x="10" y="10" width="180" height="100" rx="2" />
        <line x1="100" y1="10" x2="100" y2="110" />
        {padel ? (
          <>
            <line x1="55" y1="10" x2="55" y2="110" />
            <line x1="145" y1="10" x2="145" y2="110" />
            <line x1="55" y1="60" x2="145" y2="60" />
          </>
        ) : (
          <>
            <circle cx="100" cy="60" r="16" />
            <rect x="10" y="35" width="28" height="50" />
            <rect x="162" y="35" width="28" height="50" />
          </>
        )}
      </g>
    </svg>
  )
}
