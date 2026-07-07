import { useRef, useEffect } from 'react'

export function SettingPhase({
  mySecretSet,
  onSetSecret,
  opponentReady,
  opponentExists,
  status,
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!mySecretSet && inputRef.current) {
      inputRef.current.focus()
    }
  }, [mySecretSet])

  return (
    <div className="phase-content">
      <div className="card">
        <h2 className="section-title">{'>> SET SECRET NUMBER'}</h2>
        <p className="section-hint">Choose 1 — 100</p>
        <div className="secret-input-group">
          <input
            ref={inputRef}
            id="secret-input"
            type="number"
            min={1}
            max={100}
            placeholder="??"
            className="input-pixel input-lg"
            disabled={mySecretSet}
            onKeyDown={e => { if (e.key === 'Enter' && !mySecretSet) onSetSecret() }}
          />
          <button
            className="btn btn-secret"
            disabled={mySecretSet}
            onClick={onSetSecret}
          >
            LOCK IN
          </button>
        </div>
        {status && <p className="status-msg">{status}</p>}
      </div>
      {opponentExists && !opponentReady && (
        <div className="waiting-box">
          <span className="blink-dot">_</span> WAITING FOR OPPONENT...
        </div>
      )}
    </div>
  )
}
