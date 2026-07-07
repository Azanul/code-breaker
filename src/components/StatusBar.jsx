export function StatusBar({ roomCode }) {
  return (
    <div className="status-bar">
      <span className="room-tag">ROOM: <span>{roomCode}</span></span>
      <span className="status-led">{'\u25CF'} CONNECTED</span>
    </div>
  )
}
