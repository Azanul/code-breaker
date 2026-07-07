export function BattleLog({ guesses, myId, myName, opponentName }) {
  if (!guesses || guesses.length === 0) {
    return (
      <div className="history-panel">
        <h3 className="history-title">{'>> BATTLE LOG'}</h3>
        <p className="empty-msg">NO GUESSES YET</p>
      </div>
    )
  }

  return (
    <div className="history-panel">
      <h3 className="history-title">{'>> BATTLE LOG'}</h3>
      <div id="history-list">
        {guesses.map((g, i) => {
          const isMe = g.guesserId === myId
          const name = isMe ? myName : opponentName || 'Opponent'
          const targetName = g.targetId === myId ? myName : opponentName || 'Opponent'

          let resultClass = 'result-pending'
          let resultText = '??'
          if (g.result === 'higher') { resultClass = 'result-higher'; resultText = 'HIGHER' }
          else if (g.result === 'lower') { resultClass = 'result-lower'; resultText = 'LOWER' }
          else if (g.result === 'correct') { resultClass = 'result-correct'; resultText = 'HIT' }

          return (
            <div className="history-item" key={i}>
              <span className="guesser">{name} → {targetName}</span>
              <span className="guess-num">{g.guess}</span>
              <span className={`result-badge ${resultClass}`}>{resultText}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
