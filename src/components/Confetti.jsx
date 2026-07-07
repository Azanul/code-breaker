import { useMemo } from 'react'

const COLORS = ['#818cf8', '#ff2d55', '#34d399', '#fbbf24', '#22d3ee', '#a78bfa', '#fb7185']

export function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      background: COLORS[Math.floor(Math.random() * COLORS.length)],
      width: (Math.random() * 8 + 4) + 'px',
      height: (Math.random() * 8 + 4) + 'px',
      duration: (Math.random() * 2 + 2) + 's',
      delay: (Math.random() * 1.5) + 's',
    }))
  }, [])

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-10px',
            background: p.background,
            width: p.width,
            height: p.height,
            borderRadius: '1px',
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
