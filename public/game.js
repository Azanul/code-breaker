import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const $ = id => document.getElementById(id)

const myId = crypto.randomUUID()
let myName = ''
let mySecret = null
let mySecretSet = false
let doc = null
let provider = null
let joined = false
let prevPlayerCount = 0
let announcementTimer = null

// const SELF_SIGNALING = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/signaling`
const SELF_SIGNALING = 'wss://code-breaker.aliah.university/signaling'
const SIGNALING_SERVERS = [
  SELF_SIGNALING,
  'wss://signaling.yjs.dev',
  'wss://y-webrtc-signaling-eu.fly.dev',
  'wss://y-webrtc-signaling-eu.herokuapp.com',
  'wss://y-webrtc-signaling-us.herokuapp.com'
]

function init() {
  $('name-input').addEventListener('input', validateLobby)
  $('room-input').addEventListener('input', onRoomInput)
  $('join-btn').addEventListener('click', joinGame)
  $('set-secret-btn').addEventListener('click', setSecret)
  $('guess-btn').addEventListener('click', submitGuess)
  $('guess-input').addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess() })
  $('secret-input').addEventListener('keydown', e => { if (e.key === 'Enter') setSecret() })
  $('play-again-btn').addEventListener('click', resetGame)
  $('generate-room-btn').addEventListener('click', generateRoomCode)
  validateLobby()
}

function generateRoomCode() {
  const code = Math.floor(1000 + Math.random() * 9000).toString()
  $('room-input').value = code
  validateLobby()
}

function onRoomInput() {
  this.value = this.value.replace(/\D/g, '').slice(0, 4)
  validateLobby()
}

function validateLobby() {
  const name = $('name-input').value.trim()
  const room = $('room-input').value.trim()
  $('join-btn').disabled = !name || room.length !== 4
}

function joinGame() {
  if (joined) return
  myName = $('name-input').value.trim()
  const roomCode = $('room-input').value.trim()
  if (!myName || roomCode.length !== 4) return
  joined = true

  doc = new Y.Doc()
  provider = new WebrtcProvider(roomCode, doc, { signaling: SIGNALING_SERVERS })

  const state = doc.getMap('state')

  doc.transact(() => {
    if (!state.get('phase')) state.set('phase', 'lobby')
    if (!state.get('winner')) state.set('winner', null)
    if (!state.get('currentTurn')) state.set('currentTurn', null)
    if (!state.get('players')) state.set('players', new Y.Map())
    if (!state.get('guesses')) state.set('guesses', new Y.Array())
  })

  const players = state.get('players')

  const existingCount = players.size
  const iAmInside = players.has(myId)

  if (existingCount >= 2 && !iAmInside) {
    joined = false
    showRoomFullError()
    return
  }

  doc.transact(() => {
    const p = new Y.Map()
    p.set('name', myName)
    p.set('ready', false)
    players.set(myId, p)
  })

  prevPlayerCount = players.size

  state.observeDeep(() => {
    updateUI()
    processGuesses()
    checkGameStart()
    checkPlayerCount()
  })

  $('my-name-display').textContent = myName
  $('room-code-display').textContent = roomCode
  showScreen('game-screen')

  updateUI()
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'))
  $(id).classList.remove('hidden')
}

function updateUI() {
  const state = doc?.getMap('state')
  if (!state) return

  const players = state.get('players')
  const opponentId = getOpponentId()
  const phase = state.get('phase')
  const currentTurn = state.get('currentTurn')
  const winner = state.get('winner')

  if (opponentId && players?.get(opponentId)) {
    $('opponent-name-display').textContent = players.get(opponentId).get('name')
    $('opponent-name-guess').textContent = players.get(opponentId).get('name')
  }

  if ($('room-full-overlay') && !$('room-full-overlay').classList.contains('hidden')) {
    return
  }

  if (phase === 'lobby' || !phase) {
    $('setting-phase')?.classList.add('hidden')
    $('playing-phase')?.classList.add('hidden')

    const pCount = players ? players.size : 0
    const announcementVisible = $('join-announcement') && !$('join-announcement').classList.contains('hidden')

    if (!announcementVisible && pCount >= 2) {
      showAnnouncement()
      doc.transact(() => state.set('phase', 'setting'))
    } else if (pCount < 2 && joined) {
      const status = $('lobby-status')
      if (status) status.textContent = '> WAITING FOR OPPONENT...'
    }
    return
  }

  if (phase === 'setting') {
    $('setting-phase').classList.remove('hidden')
    $('playing-phase').classList.add('hidden')

    if (mySecretSet) {
      $('secret-status').textContent = '> CODE LOCKED'
      $('set-secret-btn').disabled = true
      $('secret-input').disabled = true
    }

    if (opponentId && players?.get(opponentId)?.get('ready')) {
      $('opponent-not-ready').classList.add('hidden')
    } else if (players && players.size >= 2) {
      $('opponent-not-ready').classList.remove('hidden')
    }
    return
  }

  if (phase === 'playing' || phase === 'finished') {
    $('setting-phase').classList.add('hidden')
    $('playing-phase').classList.remove('hidden')

    if (mySecret !== null) {
      $('my-secret-value').textContent = mySecret
    }

    if (phase === 'finished') {
      showResult(winner)
      return
    }
  }

  if (phase === 'playing') {
    const myTurn = currentTurn === myId
    const guessSection = $('guess-section')
    if (myTurn) {
      guessSection.classList.remove('hidden')
      guessSection.querySelector('.card').classList.add('my-turn')
      $('turn-indicator').textContent = '>> YOUR TURN'
      $('guess-input').disabled = false
      $('guess-btn').disabled = false
      $('guess-input').focus()
    } else {
      guessSection.querySelector('.card').classList.remove('my-turn')
      $('turn-indicator').textContent = `> ${(getOpponentName() || 'OPPONENT').toUpperCase()}'S MOVE`
      $('guess-input').disabled = true
      $('guess-btn').disabled = true
    }
  }

  renderHistory()
}

function renderHistory() {
  const state = doc?.getMap('state')
  if (!state) return
  const guesses = state.get('guesses')
  const list = $('history-list')
  const empty = $('history-empty')
  if (!guesses || guesses.length === 0) {
    list.innerHTML = ''
    empty?.classList.remove('hidden')
    return
  }
  empty?.classList.add('hidden')

  list.innerHTML = ''
  for (let i = 0; i < guesses.length; i++) {
    const g = guesses.get(i)
    if (!g || !g.get) continue
    const guesser = g.get('guesserId')
    const target = g.get('targetId')
    const num = g.get('guess')
    const result = g.get('result')
    const isMe = guesser === myId
    const name = isMe ? myName : getOpponentName() || 'Opponent'
    const targetName = target === myId ? myName : getOpponentName() || 'Opponent'

    let resultClass = 'result-pending'
    let resultText = '??'
    if (result === 'higher') { resultClass = 'result-higher'; resultText = 'HIGHER' }
    else if (result === 'lower') { resultClass = 'result-lower'; resultText = 'LOWER' }
    else if (result === 'correct') { resultClass = 'result-correct'; resultText = 'HIT' }

    const div = document.createElement('div')
    div.className = 'history-item'
    div.innerHTML = `
      <span class="guesser">${name} → ${targetName}</span>
      <span class="guess-num">${num}</span>
      <span class="result-badge ${resultClass}">${resultText}</span>
    `
    list.appendChild(div)
  }
}

function processGuesses() {
  const state = doc?.getMap('state')
  if (!state) return
  const guesses = state.get('guesses')
  if (!guesses || mySecret === null) return

  for (let i = 0; i < guesses.length; i++) {
    const g = guesses.get(i)
    if (!g || !(g instanceof Y.Map)) continue
    if (g.get('result') !== null) continue
    if (g.get('targetId') !== myId) continue

    const guessVal = g.get('guess')
    let result
    if (guessVal === mySecret) result = 'correct'
    else if (guessVal < mySecret) result = 'higher'
    else result = 'lower'

    g.set('result', result)

    if (result === 'correct') {
      const winnerId = g.get('guesserId')
      state.set('winner', winnerId)
      state.set('phase', 'finished')
      break
    }
  }
}

function checkGameStart() {
  const state = doc?.getMap('state')
  if (!state) return
  if (state.get('phase') !== 'setting') return
  const players = state.get('players')
  if (!players || players.size < 2) return
  const allReady = Array.from(players.values()).every(p => p.get('ready') === true)
  if (!allReady) return

  const pIds = Array.from(players.keys())
  doc.transact(() => {
    state.set('phase', 'playing')
    state.set('currentTurn', pIds[0])
  })
}

function setSecret() {
  const val = parseInt($('secret-input').value)
  if (isNaN(val) || val < 1 || val > 100) {
    $('secret-status').textContent = '> INVALID CODE (1-100)'
    return
  }
  mySecret = val
  mySecretSet = true
  $('secret-status').textContent = '> CODE LOCKED'
  $('set-secret-btn').disabled = true
  $('secret-input').disabled = true

  const state = doc.getMap('state')
  const players = state.get('players')
  const me = players.get(myId)
  if (me) {
    doc.transact(() => me.set('ready', true))
  }
}

function submitGuess() {
  const state = doc?.getMap('state')
  if (!state) return
  if (state.get('phase') !== 'playing') return
  if (state.get('currentTurn') !== myId) return

  const val = parseInt($('guess-input').value)
  if (isNaN(val) || val < 1 || val > 100) {
    $('guess-status').textContent = '> INVALID TARGET (1-100)'
    return
  }

  const opponent = getOpponentId()
  if (!opponent) return

  $('guess-status').textContent = ''
  $('guess-input').value = ''

  const guesses = state.get('guesses')
  doc.transact(() => {
    const entry = new Y.Map()
    entry.set('guesserId', myId)
    entry.set('targetId', opponent)
    entry.set('guess', val)
    entry.set('result', null)
    guesses.push([entry])
    state.set('currentTurn', opponent)
  })
}

function showResult(winnerId) {
  const overlay = $('result-overlay')
  overlay.classList.remove('hidden')
  const card = overlay.querySelector('.result-card')
  card.id = winnerId === myId ? 'win-card' : 'lose-card'

  if (winnerId === myId) {
    overlay.querySelector('h1').textContent = 'YOU WIN'
    overlay.querySelector('p').textContent = 'CODE CRACKED'
    overlay.querySelector('#secret-reveal').textContent = 'THEIR CODE: REVEALED'
    spawnConfetti()
  } else {
    overlay.querySelector('h1').textContent = 'YOU LOSE'
    overlay.querySelector('p').textContent = 'THEY CRACKED YOUR CODE'
    overlay.querySelector('#secret-reveal').textContent = mySecret !== null
      ? `YOUR CODE: ${mySecret}`
      : 'YOUR CODE: ??'
  }
}

function spawnConfetti() {
  const container = $('confetti-container')
  container.innerHTML = ''
  const colors = ['#818cf8', '#ff2d55', '#34d399', '#fbbf24', '#22d3ee', '#a78bfa', '#fb7185']
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    piece.style.left = Math.random() * 100 + '%'
    piece.style.top = '-10px'
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]
    piece.style.width = (Math.random() * 8 + 4) + 'px'
    piece.style.height = (Math.random() * 8 + 4) + 'px'
    piece.style.borderRadius = '1px'
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's'
    piece.style.animationDelay = (Math.random() * 1.5) + 's'
    container.appendChild(piece)
  }
}

function resetGame() {
  const state = doc?.getMap('state')
  if (!state) return

  doc.transact(() => {
    state.set('phase', 'lobby')
    state.set('winner', null)
    state.set('currentTurn', null)
    const guesses = state.get('guesses')
    if (guesses) {
      const len = guesses.length
      for (let i = len - 1; i >= 0; i--) {
        guesses.delete(i)
      }
    }
    const players = state.get('players')
    if (players) {
      const me = players.get(myId)
      if (me) {
        me.set('ready', false)
      }
    }
  })
  mySecret = null
  mySecretSet = false
  prevPlayerCount = 0
  hideAnnouncement()
  $('result-overlay').classList.add('hidden')
  $('secret-input').value = ''
  $('secret-input').disabled = false
  $('set-secret-btn').disabled = false
  $('secret-status').textContent = ''
  $('guess-input').value = ''
  $('guess-status').textContent = ''
  $('confetti-container').innerHTML = ''
}

function checkPlayerCount() {
  const state = doc?.getMap('state')
  if (!state || !joined) return
  const players = state.get('players')
  if (!players) return

  const pCount = players.size
  const iAmInside = players.has(myId)

  if (pCount > 2 && iAmInside) {
    showRoomFullError()
    return
  }

  if (pCount === 2 && prevPlayerCount === 1) {
    showAnnouncement()
  }

  prevPlayerCount = pCount
}

function showAnnouncement() {
  if (announcementTimer) return
  const banner = $('join-announcement')
  if (!banner) return
  const opponentName = getOpponentName()
  $('announcement-text').textContent = opponentName
    ? `> ${opponentName.toUpperCase()} HAS JOINED THE GAME`
    : '> BOTH PLAYERS CONNECTED'
  banner.classList.remove('hidden')
  announcementTimer = setTimeout(() => {
    hideAnnouncement()
  }, 3000)
}

function hideAnnouncement() {
  $('join-announcement')?.classList.add('hidden')
  if (announcementTimer) {
    clearTimeout(announcementTimer)
    announcementTimer = null
  }
}

function showRoomFullError() {
  const overlay = $('room-full-overlay')
  if (overlay) {
    overlay.classList.remove('hidden')
  }
  $('room-full-leave-btn')?.addEventListener('click', () => {
    location.reload()
  })
}

function getOpponentId() {
  const state = doc?.getMap('state')
  if (!state) return null
  const players = state.get('players')
  if (!players) return null
  return Array.from(players.keys()).find(id => id !== myId) || null
}

function getOpponentName() {
  const state = doc?.getMap('state')
  if (!state) return null
  const players = state.get('players')
  if (!players) return null
  const opp = getOpponentId()
  return opp && players.get(opp) ? players.get(opp).get('name') : null
}

init()
