export function LobbyScreen({
  roomInput,
  nameInput,
  onRoomChange,
  onNameChange,
  onJoin,
  onGenerateRoom,
  canJoin,
  status,
}) {
  return (
    <div className="screen">
      <div className="logo">
        <h1 className="logo-title">CODE<br />BREAK</h1>
        <p className="logo-sub">Can you crack their code?</p>
      </div>
      <div className="card">
        <div className="field">
          <label className="label-pixel">{'// ROOM CODE'}</label>
          <div className="room-row">
            <input
              type="text"
              maxLength={4}
              placeholder="0000"
              className="input-pixel"
              value={roomInput}
              onChange={e => onRoomChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
            <button className="btn btn-small" title="Generate random room" onClick={onGenerateRoom}>
              {'\u2386'}
            </button>
          </div>
        </div>
        <div className="field">
          <label className="label-pixel">{'// YOUR CALLSIGN'}</label>
          <input
            type="text"
            placeholder="Enter name..."
            className="input-pixel"
            value={nameInput}
            onChange={e => onNameChange(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" disabled={!canJoin} onClick={onJoin}>
          START GAME
        </button>
        {status && <p className="status-msg">{status}</p>}
      </div>
    </div>
  )
}
