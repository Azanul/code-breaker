import { useGame } from './hooks/useGame.js'
import { Scanlines } from './components/Scanlines.jsx'
import { Vignette } from './components/Vignette.jsx'
import { Particles } from './components/Particles.jsx'
import { LobbyScreen } from './components/LobbyScreen.jsx'
import { GameScreen } from './components/GameScreen.jsx'

export function App() {
  const game = useGame()

  return (
    <>
      <Scanlines />
      <Vignette />
      <Particles />

      {!game.joined ? (
        <LobbyScreen
          roomInput={game.roomInput}
          nameInput={game.nameInput}
          onRoomChange={game.setRoomInput}
          onNameChange={game.setNameInput}
          onJoin={game.joinGame}
          onGenerateRoom={game.generateRoomCode}
          canJoin={game.canJoin}
          status={''}
        />
      ) : (
        <GameScreen
          myName={game.myName}
          roomCode={game.roomCode}
          phase={game.phase}
          players={game.players}
          myId={game.myId}
          opponentName={game.opponentName}
          opponentReady={game.opponentReady}
          isMyTurn={game.isMyTurn}
          winner={game.winner}
          guesses={game.guesses}
          mySecretDisplay={game.mySecretDisplay}
          mySecretSetDisplay={game.mySecretSetDisplay}
          announcementVisible={game.announcementVisible}
          announcementText={game.announcementText}
          roomFull={game.roomFull}
          secretStatus={game.secretStatus}
          guessStatus={game.guessStatus}
          setSecret={game.setSecret}
          submitGuess={game.submitGuess}
          resetGame={game.resetGame}
          dismissRoomFull={game.dismissRoomFull}
          myGuesses={game.myGuesses}
          opponentGuesses={game.opponentGuesses}
          myLedger={game.myLedger}
          opponentLedger={game.opponentLedger}
        />
      )}
    </>
  )
}
