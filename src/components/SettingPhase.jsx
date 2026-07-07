import { useRef, useEffect, useState } from 'react'

export function SettingPhase({
  mySecretSet,
  onSetSecret,
  opponentReady,
  opponentExists,
  status,
}) {
  const inputRef = useRef(null)
  const [code, setCode] = useState('')

  useEffect(() => {
    if (!mySecretSet && inputRef.current) {
      inputRef.current.focus()
    }
  }, [mySecretSet])

  const handleLock = () => {
    if (mySecretSet || code.length !== 4) return
    onSetSecret(code)
    setCode('')
  }

  return (
    <div className="phase-content">
      <div className="card">
        <h2 className="section-title">{'>> SET YOUR CODE'}</h2>
        <p className="section-hint">4 digits (0-9)</p>
        <div className="secret-input-group">
          <input
            ref={inputRef}
            id="secret-input"
            type="text"
            maxLength={4}
            placeholder="----"
            className="input-pixel input-lg"
            disabled={mySecretSet}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={e => { if (e.key === 'Enter') handleLock() }}
          />
          <button
            className="btn btn-secret"
            disabled={mySecretSet || code.length !== 4}
            onClick={handleLock}
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
