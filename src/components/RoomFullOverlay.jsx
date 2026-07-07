export function RoomFullOverlay({ visible, onDismiss }) {
  if (!visible) return null

  return (
    <div className="overlay">
      <div className="result-card">
        <h1 className="result-title" style={{ color: '#ff2d55' }}>ACCESS DENIED</h1>
        <p className="result-sub">ROOM IS FULL</p>
        <p className="secret-reveal" style={{ fontSize: '14px' }}>TRY A DIFFERENT CODE</p>
        <button
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #ff2d55, #ff6b35)', marginTop: '20px' }}
          onClick={onDismiss}
        >
          EXIT
        </button>
      </div>
    </div>
  )
}
