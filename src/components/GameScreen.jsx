import { StatusBar } from './StatusBar.jsx'
import { AnnouncementBanner } from './AnnouncementBanner.jsx'
import { PlayerPanel } from './PlayerPanel.jsx'
import { SettingPhase } from './SettingPhase.jsx'
import { PlayingPhase } from './PlayingPhase.jsx'
import { ResultOverlay } from './ResultOverlay.jsx'
import { RoomFullOverlay } from './RoomFullOverlay.jsx'

export function GameScreen({
  myName,
  roomCode,
  phase,
  players,
  myId,
  opponentName,
  opponentReady,
  isMyTurn,
  winner,
  guesses,
  mySecretDisplay,
  mySecretSetDisplay,
  announcementVisible,
  announcementText,
  roomFull,
  secretStatus,
  guessStatus,
  setSecret,
  submitGuess,
  resetGame,
  dismissRoomFull,
  myGuesses,
  opponentGuesses,
  myLedger,
  opponentLedger,
}) {
  const opponentExists = players.length >= 2
  const isWinner = winner === myId

  return (
    <div className="screen">
      <StatusBar roomCode={roomCode} />
      <AnnouncementBanner visible={announcementVisible} text={announcementText} />

      {(!phase || phase === 'lobby') && (
        <div className="game-header">
          <div className="player-panel">
            <span className="panel-label">YOU</span>
            <span className="panel-name">{myName}</span>
          </div>
          <div className="vs-display">VS</div>
          <div className="player-panel">
            <span className="panel-label">OPPONENT</span>
            <span className="panel-name">{opponentName || 'WAITING...'}</span>
          </div>
        </div>
      )}

      {phase === 'setting' && (
        <SettingPhase
          mySecretSet={mySecretSetDisplay}
          onSetSecret={setSecret}
          opponentReady={opponentReady}
          opponentExists={opponentExists}
          status={secretStatus}
        />
      )}

      {(phase === 'playing' || phase === 'finished') && (
        <PlayingPhase
          isMyTurn={isMyTurn}
          opponentName={opponentName}
          myId={myId}
          myName={myName}
          onSubmitGuess={submitGuess}
          guessStatus={guessStatus}
          myGuesses={myGuesses}
          opponentGuesses={opponentGuesses}
          myLedger={myLedger}
          opponentLedger={opponentLedger}
          mySecretSetDisplay={mySecretSetDisplay}
        />
      )}

      <ResultOverlay
        visible={phase === 'finished'}
        isWinner={isWinner}
        mySecretDisplay={mySecretDisplay}
        onPlayAgain={resetGame}
      />

      <RoomFullOverlay visible={roomFull} onDismiss={dismissRoomFull} />
    </div>
  )
}
