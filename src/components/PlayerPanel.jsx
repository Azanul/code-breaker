export function PlayerPanel({ label, name, isOpponent }) {
  return (
    <div className={`player-panel${isOpponent ? ' opponent' : ''}`}>
      <span className="panel-label">{label}</span>
      <span className="panel-name">{name}</span>
    </div>
  )
}
