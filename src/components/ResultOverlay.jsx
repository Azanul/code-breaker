import { Confetti } from './Confetti.jsx'

export function ResultOverlay({ visible, isWinner, mySecretDisplay, onPlayAgain }) {
  if (!visible) return null

  return (
    <div className="overlay">
      <div className="result-card" id={isWinner ? 'win-card' : 'lose-card'}>
        {isWinner && <Confetti />}
        <h1 className="result-title">{isWinner ? 'YOU WIN' : 'YOU LOSE'}</h1>
        <p className="result-sub">
          {isWinner ? 'CODE CRACKED' : 'THEY CRACKED YOUR CODE'}
        </p>
        <p className="secret-reveal">
          {isWinner
            ? 'THEIR CODE: REVEALED'
            : `YOUR CODE: ${mySecretDisplay !== null ? mySecretDisplay : '??'}`}
        </p>
        <button className="btn btn-primary" onClick={onPlayAgain}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  )
}
