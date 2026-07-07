import { useRef, useEffect, useState } from 'react'
import { AttemptGrid } from './AttemptGrid.jsx'
import { DigitLedger } from './DigitLedger.jsx'

function PlayerBoard({
  label,
  name,
  guesses,
  ledger,
  isActive,
  isMe,
  isReady,
}) {
  return (
    <div className={`player-board${isActive ? ' active-board' : ''}`}>
      <div className="board-header">
        <span className="board-label">{label}</span>
        <span className="board-name">{name || 'WAITING...'}</span>
        {isActive && <span className="turn-pulse">{'\u25C9'}</span>}
        {isMe && isReady && <span className="ready-indicator">{'\u25CF'} READY</span>}
      </div>
      <AttemptGrid guesses={guesses} playerName={name} />
      <DigitLedger ledger={ledger} />
    </div>
  )
}

export function PlayingPhase({
  isMyTurn,
  opponentName,
  guesses,
  myId,
  myName,
  onSubmitGuess,
  guessStatus,
  myGuesses,
  opponentGuesses,
  myLedger,
  opponentLedger,
  mySecretSetDisplay,
}) {
  const inputRef = useRef(null)
  const [guessInput, setGuessInput] = useState('')

  useEffect(() => {
    if (isMyTurn && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMyTurn])

  const handleSubmit = () => {
    if (!isMyTurn || guessInput.length !== 4) return
    onSubmitGuess(guessInput)
    setGuessInput('')
  }

  return (
    <div className="playing-layout">
      <div className="boards-container">
        <PlayerBoard
          label="P1"
          name={myName}
          guesses={myGuesses}
          ledger={myLedger}
          isActive={isMyTurn}
          isMe
          isReady={mySecretSetDisplay}
        />

        <div className="center-rail">
          <div className="turn-indicator">
            <span className={`turn-badge${isMyTurn ? ' my-turn-badge' : ' opp-turn-badge'}`}>
              {isMyTurn ? 'YOUR TURN' : `${(opponentName || 'OPPONENT').toUpperCase()}'S TURN`}
            </span>
          </div>
          <div className="center-controls">
            <div className="card guess-card">
              <h2 className="section-title">{'>> GUESS'}</h2>
              <p className="section-hint">CRACK THE CODE</p>
              <div className="guess-input-group">
                <input
                  ref={inputRef}
                  id="guess-input"
                  type="text"
                  maxLength={4}
                  placeholder="----"
                  className="input-pixel input-lg"
                  disabled={!isMyTurn}
                  value={guessInput}
                  onChange={e => setGuessInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                />
                <button
                  className="btn btn-guess"
                  disabled={!isMyTurn || guessInput.length !== 4}
                  onClick={handleSubmit}
                >
                  FIRE
                </button>
              </div>
              {guessStatus && <p className="status-msg">{guessStatus}</p>}
            </div>
          </div>
        </div>

        <PlayerBoard
          label="P2"
          name={opponentName}
          guesses={opponentGuesses}
          ledger={opponentLedger}
          isActive={!isMyTurn}
        />
      </div>
    </div>
  )
}
