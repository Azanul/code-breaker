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
  lobbyStatus,
  secretStatus,
  guessStatus,
  setSecret,
  submitGuess,
  resetGame,
  dismissRoomFull,
}) {
  const opponentExists = players.length >= 2
  const isWinner = winner === myId

  return (
    <div className="screen">
      <StatusBar roomCode={roomCode} />
      <AnnouncementBanner visible={announcementVisible} text={announcementText} />

      <div className="game-header">
        <PlayerPanel label="P1" name={myName} />
        <div className="vs-display">VS</div>
        <PlayerPanel label="P2" name={opponentName || 'WAITING...'} isOpponent />
      </div>

      {(!phase || phase === 'lobby') && lobbyStatus && (
        <p className="status-msg">{lobbyStatus}</p>
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
          mySecretDisplay={mySecretDisplay}
          guesses={guesses}
          myId={myId}
          myName={myName}
          onSubmitGuess={submitGuess}
          guessStatus={guessStatus}
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
