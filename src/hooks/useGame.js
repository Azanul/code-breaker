import { useState, useEffect, useRef, useCallback } from 'react'
import * as Y from 'yjs'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as sync from 'y-protocols/sync'
import P2PCF from 'p2pcf'

const P2PCF_WORKER_URL = 'https://p2pcf.azanulhaque.workers.dev'
const CODE_LENGTH = 4

function computeFeedback(guess, secret) {
  const result = Array(CODE_LENGTH).fill('absent')
  const secretArr = secret.split('')
  const guessArr = guess.split('')

  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = 'correct'
      secretArr[i] = null
      guessArr[i] = null
    }
  }

  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessArr[i] === null) continue
    const idx = secretArr.indexOf(guessArr[i])
    if (idx !== -1) {
      result[i] = 'present'
      secretArr[idx] = null
    }
  }

  return result
}

function computeLedger(guesses, myId) {
  const ledger = {}
  for (let d = 0; d <= 9; d++) ledger[d] = 'unknown'

  const myGuesses = guesses.filter(g => g.guesserId === myId)
  for (const g of myGuesses) {
    if (!g.feedback) continue
    const guessDigits = g.guess.split('')
    for (let i = 0; i < guessDigits.length; i++) {
      const digit = parseInt(guessDigits[i])
      const state = g.feedback[i]
      if (state === 'correct') {
        ledger[digit] = 'confirmed'
      } else if (state === 'present') {
        if (ledger[digit] !== 'confirmed') ledger[digit] = 'present'
      } else if (state === 'absent') {
        if (ledger[digit] === 'unknown') ledger[digit] = 'absent'
      }
    }
  }

  return ledger
}

function isValidCode(val) {
  return /^\d{4}$/.test(val)
}

export function useGame() {
  const myIdRef = useRef(crypto.randomUUID())
  const myId = myIdRef.current

  const docRef = useRef(null)
  const signalingRef = useRef(null)
  const mySecretRef = useRef(null)
  const prevPlayerCountRef = useRef(0)
  const announcementTimerRef = useRef(null)
  const joinedRef = useRef(false)
  const syncInitiatedRef = useRef(new Set())

  const [phase, setPhase] = useState(null)
  const [players, setPlayers] = useState([])
  const [currentTurn, setCurrentTurn] = useState(null)
  const [winner, setWinner] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [joined, setJoined] = useState(false)
  const [roomFull, setRoomFull] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(false)
  const [announcementText, setAnnouncementText] = useState('')
  const [myName, setMyName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [secretStatus, setSecretStatus] = useState('')
  const [guessStatus, setGuessStatus] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [mySecretDisplay, setMySecretDisplay] = useState(null)
  const [mySecretSetDisplay, setMySecretSetDisplay] = useState(false)

  const opponentId = players.find(p => p.id !== myId)?.id || null
  const opponentName = players.find(p => p.id !== myId)?.name || null
  const opponentReady = players.find(p => p.id !== myId)?.ready || false
  const isMyTurn = currentTurn === myId
  const canJoin = nameInput.trim().length > 0 && roomInput.trim().length === 4

  const processGuesses = useCallback((doc) => {
    const state = doc.getMap('state')
    const guesses = doc.getArray('guesses')
    if (mySecretRef.current === null) return

    for (let i = 0; i < guesses.length; i++) {
      const g = guesses.get(i)
      if (!g || !(g instanceof Y.Map)) continue
      const existingFeedback = g.get('feedback')
      if (existingFeedback !== null && existingFeedback !== undefined) continue
      if (g.get('targetId') !== myId) continue

      const guessVal = g.get('guess')
      const feedbackArr = computeFeedback(guessVal, mySecretRef.current)
      const yFeedback = new Y.Array()
      yFeedback.insert(0, feedbackArr)
      g.set('feedback', yFeedback)

      if (feedbackArr.every(f => f === 'correct')) {
        const winnerId = g.get('guesserId')
        state.set('winner', winnerId)
        state.set('phase', 'finished')
        break
      }
    }
  }, [myId])

  const checkGameStart = useCallback((doc) => {
    const state = doc.getMap('state')
    if (state.get('phase') !== 'setting') return
    const players = doc.getMap('players')
    if (!players || players.size < 2) return
    const allReady = Array.from(players.values()).every(p => p.get('ready') === true)
    if (!allReady) return

    const pIds = Array.from(players.keys())
    doc.transact(() => {
      state.set('phase', 'playing')
      state.set('currentTurn', pIds[0])
    })
  }, [])

  const checkPlayerCount = useCallback((doc) => {
    if (!joinedRef.current) return
    const players = doc.getMap('players')
    if (!players) return

    const pCount = players.size
    const iAmInside = players.has(myId)

    if (pCount > 2 && iAmInside) {
      setRoomFull(true)
      return
    }

    if (pCount === 2 && prevPlayerCountRef.current === 1) {
      showAnnouncement(doc)
      const state = doc.getMap('state')
      if (state.get('phase') === 'lobby') {
        queueMicrotask(() => {
          doc.transact(() => {
            state.set('phase', 'setting')
          })
        })
      }
    }

    prevPlayerCountRef.current = pCount
  }, [myId])

  const showAnnouncement = useCallback((doc) => {
    if (announcementTimerRef.current) return
    const players = doc.getMap('players')
    const oppId = Array.from(players.keys()).find(id => id !== myId)
    const oppName = oppId ? players.get(oppId)?.get('name') : null
    setAnnouncementText(
      oppName
        ? `> ${oppName.toUpperCase()} HAS JOINED THE GAME`
        : '> BOTH PLAYERS CONNECTED'
    )
    setAnnouncementVisible(true)
    announcementTimerRef.current = setTimeout(() => {
      setAnnouncementVisible(false)
      announcementTimerRef.current = null
    }, 3000)
  }, [myId])

  const hideAnnouncement = useCallback(() => {
    setAnnouncementVisible(false)
    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current)
      announcementTimerRef.current = null
    }
  }, [])

  const syncState = useCallback((doc) => {
    const state = doc.getMap('state')
    const yPlayers = doc.getMap('players')
    const yGuesses = doc.getArray('guesses')

    setPhase(state.get('phase') || null)
    setCurrentTurn(state.get('currentTurn') || null)
    setWinner(state.get('winner') || null)

    const pList = []
    yPlayers.forEach((p, id) => {
      pList.push({ id, name: p.get('name'), ready: p.get('ready') })
    })
    setPlayers(pList)

    const gList = []
    for (let i = 0; i < yGuesses.length; i++) {
      const g = yGuesses.get(i)
      if (g && g.get) {
        const rawFeedback = g.get('feedback')
        let feedback = null
        if (rawFeedback && rawFeedback.toArray) {
          feedback = rawFeedback.toArray()
        }
        gList.push({
          guesserId: g.get('guesserId'),
          targetId: g.get('targetId'),
          guess: g.get('guess'),
          feedback,
        })
      }
    }
    setGuesses(gList)
  }, [])

  const generateRoomCode = useCallback(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setRoomInput(code)
  }, [])

  const joinGame = useCallback(() => {
    if (joinedRef.current) return
    const name = nameInput.trim()
    const code = roomInput.trim()
    if (!name || code.length !== 4) return
    joinedRef.current = true
    setJoined(true)
    setMyName(name)
    setRoomCode(code)

    const doc = new Y.Doc()
    docRef.current = doc

    const state = doc.getMap('state')

    doc.transact(() => {
      if (!state.get('phase')) state.set('phase', 'lobby')
      if (!state.get('winner')) state.set('winner', null)
      if (!state.get('currentTurn')) state.set('currentTurn', null)
    })

    const players = doc.getMap('players')
    const guesses = doc.getArray('guesses')

    const existingCount = players.size
    const iAmInside = players.has(myId)

    if (existingCount >= 2 && !iAmInside) {
      joinedRef.current = false
      setJoined(false)
      setRoomFull(true)
      return
    }

    doc.transact(() => {
      const p = new Y.Map()
      p.set('name', name)
      p.set('ready', false)
      players.set(myId, p)
    })

    prevPlayerCountRef.current = players.size

    const observer = () => {
      processGuesses(doc)
      syncState(doc)
      checkGameStart(doc)
      checkPlayerCount(doc)
    }

    state.observeDeep(observer)
    players.observe(observer)
    guesses.observe(observer)

    doc.on('update', (update, origin) => {
      if (!signalingRef.current) return
      if (origin === 'p2pcf-sync') return
      const encoder = encoding.createEncoder()
      sync.writeUpdate(encoder, update)
      signalingRef.current.broadcast(encoding.toUint8Array(encoder))
    })

    const signaling = new P2PCF(myId, code, {
      workerUrl: P2PCF_WORKER_URL,
    })
    signalingRef.current = signaling

    const initiateSync = (peer) => {
      const clientId = peer.client_id || peer.id
      if (syncInitiatedRef.current.has(clientId)) return
      syncInitiatedRef.current.add(clientId)
      const encoder = encoding.createEncoder()
      sync.writeSyncStep1(encoder, doc)
      signaling.send(peer, encoding.toUint8Array(encoder))
    }

    signaling.on('peerconnect', (peer) => {
      initiateSync(peer)
    })

    signaling.on('msg', (peer, data) => {
      const clientId = peer.client_id || peer.id
      if (!syncInitiatedRef.current.has(clientId)) {
        initiateSync(peer)
      }

      const uint8Array = new Uint8Array(data)
      const decoder = decoding.createDecoder(uint8Array)
      const messageType = decoding.readVarUint(decoder)

      switch (messageType) {
        case sync.messageYjsSyncStep1: {
          const encoder = encoding.createEncoder()
          sync.readSyncStep1(decoder, encoder, doc)
          signaling.send(peer, encoding.toUint8Array(encoder))
          break
        }
        case sync.messageYjsSyncStep2:
          doc.transact(() => {
            sync.readSyncStep2(decoder, doc)
          }, 'p2pcf-sync')
          break
        case sync.messageYjsUpdate:
          doc.transact(() => {
            sync.readUpdate(decoder, doc)
          }, 'p2pcf-sync')
          break
      }
    })

    signaling.on('peerclose', (peer) => {
      const state = doc?.getMap('state')
      if (!state) return
      const players = doc.getMap('players')
      if (!players || !peer.client_id) return
      if (players.has(peer.client_id)) {
        doc.transact(() => {
          players.delete(peer.client_id)
        })
      }
    })

    signaling.start()

    observer()
  }, [myId, nameInput, roomInput, processGuesses, syncState, checkGameStart, checkPlayerCount])

  const setSecret = useCallback((val) => {
    const doc = docRef.current
    if (!doc) return
    if (!val || !isValidCode(val)) {
      setSecretStatus('> INVALID CODE (4 DIGITS, 0-9)')
      return
    }
    mySecretRef.current = val
    setMySecretDisplay(val)
    setMySecretSetDisplay(true)
    setSecretStatus('> CODE LOCKED')

    const players = doc.getMap('players')
    const me = players.get(myId)
    if (me) {
      doc.transact(() => me.set('ready', true))
    }
  }, [myId])

  const submitGuess = useCallback((val) => {
    const doc = docRef.current
    if (!doc) return
    const state = doc.getMap('state')
    if (state.get('phase') !== 'playing') return
    if (state.get('currentTurn') !== myId) return

    if (!val || !isValidCode(val)) {
      setGuessStatus('> INVALID TARGET (4 DIGITS, 0-9)')
      return
    }

    const yPlayers = doc.getMap('players')
    const oppId = Array.from(yPlayers.keys()).find(id => id !== myId)
    if (!oppId) return

    setGuessStatus('')

    const guesses = doc.getArray('guesses')
    doc.transact(() => {
      const entry = new Y.Map()
      entry.set('guesserId', myId)
      entry.set('targetId', oppId)
      entry.set('guess', val)
      entry.set('feedback', null)
      guesses.push([entry])
      state.set('currentTurn', oppId)
    })
  }, [myId])

  const resetGame = useCallback(() => {
    const doc = docRef.current
    if (!doc) return

    const state = doc.getMap('state')
    doc.transact(() => {
      state.set('phase', 'lobby')
      state.set('winner', null)
      state.set('currentTurn', null)
      const guesses = doc.getArray('guesses')
      if (guesses) {
        const len = guesses.length
        for (let i = len - 1; i >= 0; i--) {
          guesses.delete(i)
        }
      }
      const players = doc.getMap('players')
      if (players) {
        const me = players.get(myId)
        if (me) {
          me.set('ready', false)
        }
      }
    })
    mySecretRef.current = null
    setMySecretDisplay(null)
    setMySecretSetDisplay(false)
    prevPlayerCountRef.current = 0
    hideAnnouncement()
    setSecretStatus('')
    setGuessStatus('')
  }, [myId, hideAnnouncement])

  const dismissRoomFull = useCallback(() => {
    window.location.reload()
  }, [])

  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) {
        clearTimeout(announcementTimerRef.current)
      }
    }
  }, [])

  const myGuesses = guesses.filter(g => g.guesserId === myId)
  const opponentGuesses = guesses.filter(g => g.guesserId === opponentId)
  const myLedger = computeLedger(guesses, myId)
  const opponentLedger = computeLedger(guesses, opponentId)

  return {
    myId,
    myName,
    roomCode,
    phase,
    players,
    currentTurn,
    winner,
    guesses,
    joined,
    roomFull,
    announcementVisible,
    announcementText,
    opponentId,
    opponentName,
    opponentReady,
    isMyTurn,
    canJoin,
    secretStatus,
    mySecretDisplay,
    mySecretSetDisplay,
    guessStatus,
    roomInput,
    nameInput,
    setRoomInput,
    setNameInput,
    generateRoomCode,
    joinGame,
    setSecret,
    submitGuess,
    resetGame,
    dismissRoomFull,
    setGuessStatus,
    setSecretStatus,
    myGuesses,
    opponentGuesses,
    myLedger,
    opponentLedger,
  }
}
