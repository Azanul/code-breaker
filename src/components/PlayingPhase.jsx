import { useRef, useEffect } from 'react'
import { BattleLog } from './BattleLog.jsx'

export function PlayingPhase({
  isMyTurn,
  opponentName,
  mySecretDisplay,
  guesses,
  myId,
  myName,
  onSubmitGuess,
  guessStatus,
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isMyTurn && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMyTurn])

  return (
    <div className="phase-content">
      <div id="guess-section">
        <div className={`card${isMyTurn ? ' my-turn' : ''}`}>
          <h2 className="section-title">
            {isMyTurn ? '>> YOUR TURN' : `> ${(opponentName || 'OPPONENT').toUpperCase()}'S MOVE`}
          </h2>
          <p className="section-hint">
            GUESS <span>{opponentName || 'OPPONENT'}</span>'S CODE
          </p>
          <div className="guess-input-group">
            <input
              ref={inputRef}
              id="guess-input"
              type="number"
              min={1}
              max={100}
              placeholder="??"
              className="input-pixel input-lg"
              disabled={!isMyTurn}
              onKeyDown={e => { if (e.key === 'Enter' && isMyTurn) onSubmitGuess() }}
            />
            <button
              className="btn btn-guess"
              disabled={!isMyTurn}
              onClick={onSubmitGuess}
            >
              FIRE
            </button>
          </div>
          {guessStatus && <p className="status-msg">{guessStatus}</p>}
        </div>
      </div>

      <div className="secret-display">
        {'> MY CODE: '}{mySecretDisplay !== null ? mySecretDisplay : '??'}
      </div>

      <BattleLog
        guesses={guesses}
        myId={myId}
        myName={myName}
        opponentName={opponentName}
      />
    </div>
  )
}
