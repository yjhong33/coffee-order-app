import { useEffect, useRef, useState } from 'react'
import {
  CAFES,
  MAP_POS,
  CATS,
  MENUS,
  PREFS,
  INITIAL_PEOPLE,
  RECENT_ORDERS,
  HISTORY_SEED,
  CAFE_SIZE_OPTIONS,
} from './data'
import { computeTotals, buildNamedFor, buildPlainFor } from './selectors'
import { parseVoiceOrders } from './voiceParser'
import { parseMemoLines } from './memoParser'
import Home from './screens/Home'
import CafeSelect from './screens/CafeSelect'
import Menu from './screens/Menu'
import Collect from './screens/Collect'
import Complete from './screens/Complete'
import Share from './screens/Share'
import Participant from './screens/Participant'
import History from './screens/History'
import Loading from './screens/Loading'
import Map from './screens/Map'
import My from './screens/My'
import VoiceOverlay from './overlays/VoiceOverlay'
import CaptureOverlay from './overlays/CaptureOverlay'
import ManualAddOverlay from './overlays/ManualAddOverlay'
import SmartMemoOverlay from './overlays/SmartMemoOverlay'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'

const TABBED_SCREENS = ['home', 'map', 'history', 'my']
const CAP_PEOPLE_COLORS = ['#E8A13C', '#6A8CC7', '#1F6E50', '#C77B9E']
const DEEP_SCREENS = ['cafe', 'menu', 'memo', 'collect', 'complete', 'share', 'participant']
const SESSION_KEY = 'callcoffee_session'
const SpeechRecognitionAPI = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

let idSeq = 0
function makeId(prefix) {
  idSeq += 1
  return `${prefix}-${Date.now()}-${idSeq}`
}

// Speech recognition (esp. on mobile) often re-emits the same phrase, producing
// transcripts like "아이스 아이스 아메리카노 아이스 아메리카노". Collapse any
// immediately-repeated run of words (longest run first) back down to one copy.
function dedupeTranscript(text) {
  let words = (text || '').split(/\s+/).filter(Boolean)
  let changed = true
  while (changed) {
    changed = false
    for (let n = Math.floor(words.length / 2); n >= 1 && !changed; n--) {
      for (let i = 0; i + 2 * n <= words.length; i++) {
        const a = words.slice(i, i + n).join(' ')
        const b = words.slice(i + n, i + 2 * n).join(' ')
        if (a === b) {
          words = [...words.slice(0, i + n), ...words.slice(i + 2 * n)]
          changed = true
          break
        }
      }
    }
  }
  return words.join(' ')
}

function mergeItemIntoPeople(people, personInfo, item) {
  const idx = people.findIndex((p) => (personInfo.isMe ? p.isMe : p.name === personInfo.name))
  if (idx === -1) {
    return [...people, { ...personInfo, items: [{ ...item, id: makeId('it') }] }]
  }
  const target = people[idx]
  const itemIdx = target.items.findIndex((it) => it.name === item.name && it.temp === item.temp && (it.note || '') === (item.note || '') && (it.size || '') === (item.size || ''))
  let items
  if (itemIdx === -1) {
    items = [...target.items, { ...item, id: makeId('it') }]
  } else {
    items = target.items.map((it, i) => (i === itemIdx ? { ...it, qty: it.qty + item.qty } : it))
  }
  const updated = { ...target, items }
  return [...people.slice(0, idx), updated, ...people.slice(idx + 1)]
}

export default function App() {
  const [joinId] = useState(() => {
    const m = typeof window !== 'undefined' ? window.location.pathname.match(/^\/join\/([A-Za-z0-9]{4,})/) : null
    return m ? m[1] : null
  })
  const isGuest = !!joinId

  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState('home')
  const [overlay, setOverlay] = useState(null)
  const [voicePhase, setVoicePhase] = useState('listening')
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [voiceOrders, setVoiceOrders] = useState([])
  const [voiceError, setVoiceError] = useState('')
  const [menuCat, setMenuCat] = useState(0)
  const [menuTemp, setMenuTemp] = useState({})
  const [menuNote, setMenuNote] = useState({})
  const [menuSize, setMenuSize] = useState({})
  const [cart, setCart] = useState({})
  const [favs, setFavs] = useState({ starbucks: true, mega: true, twosome: false, ediya: true, compose: false, paik: false })
  const [selectedCafeId, setSelectedCafeId] = useState('starbucks')
  const [people, setPeople] = useState(INITIAL_PEOPLE)
  const [prefSel, setPrefSel] = useState([1, 1, 1])
  const [toast, setToast] = useState('')

  // ---- new state (additive) ----
  const [memoMode, setMemoMode] = useState(false)
  const [history, setHistory] = useState(HISTORY_SEED)
  const [resumeScreen, setResumeScreen] = useState(null)
  const [completeView, setCompleteView] = useState('named')
  const [expandedHistory, setExpandedHistory] = useState(null)
  const [historyView, setHistoryViewMap] = useState({})
  const [manualName, setManualName] = useState('')
  const [manualMenu, setManualMenu] = useState('')
  const [manualNote, setManualNote] = useState('')
  const [manualTemp, setManualTemp] = useState('ICE')
  const [manualQty, setManualQty] = useState(1)
  const [pName, setPName] = useState(() => (joinId ? '' : '박지후'))
  const [pMenu, setPMenu] = useState(() => (joinId ? '' : '바닐라 라떼'))
  const [pTemp, setPTemp] = useState('ICE')
  const [partDone, setPartDone] = useState({ 나: true, 김민준: true, 이서연: false, 박지후: false })
  const [myName, setMyName] = useState('취합 담당자')
  const [cafeQuery, setCafeQuery] = useState('')
  const [menuQuery, setMenuQuery] = useState('')
  const [memoQuery, setMemoQuery] = useState('')
  const [memoText, setMemoText] = useState('')
  const [memoParsed, setMemoParsed] = useState(false)
  const [memoOrders, setMemoOrders] = useState([])
  const [frameScale, setFrameScale] = useState(1)
  const [frameOffsetX, setFrameOffsetX] = useState(0)

  // ---- real cross-device sharing (Upstash-backed) ----
  const [sessionId, setSessionId] = useState(null)
  const [remoteCafeName, setRemoteCafeName] = useState('')
  const [guestRegistered, setGuestRegistered] = useState(false)
  const [guestError, setGuestError] = useState(false)

  const scrollRef = useRef(null)
  const recognitionRef = useRef(null)
  const voiceListeningRef = useRef(false)
  const voiceFinalsRef = useRef([])
  const toastTimerRef = useRef(null)
  const loadTimerRef = useRef(null)
  const lastDeepRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [screen])

  // ---- scale the 480px design frame to fit narrower mobile viewports ----
  useEffect(() => {
    function updateScale() {
      const s = Math.min(1, window.innerWidth / 480)
      setFrameScale(s)
      setFrameOffsetX((window.innerWidth - 480 * s) / 2)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // ---- initial load / resume restore ----
  useEffect(() => {
    let saved = null
    if (!joinId) {
      try {
        const raw = localStorage.getItem(SESSION_KEY)
        if (raw) saved = JSON.parse(raw)
      } catch {
        // ignore malformed session
      }
      lastDeepRef.current = saved && saved.lastDeep ? saved.lastDeep : null
    }

    loadTimerRef.current = setTimeout(() => {
      if (joinId) {
        setScreen('participant')
        setLoading(false)
        return
      }
      if (saved) {
        if (Array.isArray(saved.people) && saved.people.length) setPeople(saved.people)
        if (Array.isArray(saved.history)) setHistory(saved.history)
        if (saved.selectedCafeId) setSelectedCafeId(saved.selectedCafeId)
        if (saved.myName) setMyName(saved.myName)
        setMemoMode(!!saved.memoMode)
      }
      const rs = lastDeepRef.current && DEEP_SCREENS.includes(lastDeepRef.current) ? lastDeepRef.current : null
      setResumeScreen(rs)
      setLoading(false)
    }, 1200)

    return () => clearTimeout(loadTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- guest: fetch the shared session's cafe name on join ----
  useEffect(() => {
    if (!joinId) return
    fetch(`/api/session/${joinId}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((data) => setRemoteCafeName(data.cafeName || '주문'))
      .catch(() => setGuestError(true))
  }, [joinId])

  // ---- persist session to localStorage ----
  useEffect(() => {
    if (loading || joinId) return
    if (DEEP_SCREENS.includes(screen)) lastDeepRef.current = screen
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          lastDeep: lastDeepRef.current,
          people,
          memoMode,
          selectedCafeId,
          history,
          myName,
        }),
      )
    } catch {
      // storage unavailable — skip persistence silently
    }
  }, [loading, screen, people, memoMode, selectedCafeId, history, myName, joinId])

  // ---- host: push local order state to the shared session whenever it changes ----
  useEffect(() => {
    if (!sessionId || isGuest) return
    fetch(`/api/session/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ people }),
    }).catch(() => {
      // network hiccup — next change will retry the push
    })
  }, [people, sessionId, isGuest])

  // ---- host: poll the shared session for participants who joined via QR/link ----
  async function pullSession(id) {
    try {
      const res = await fetch(`/api/session/${id}`)
      if (!res.ok) return
      const data = await res.json()
      setPeople((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const newOnes = (data.people || []).filter((p) => !existingIds.has(p.id))
        if (!newOnes.length) return prev
        showToast(`${newOnes.map((p) => p.name).join(', ')} 님이 참여했어요 🎉`)
        return [...prev, ...newOnes]
      })
    } catch {
      // network hiccup — next poll will retry
    }
  }
  useEffect(() => {
    if (!sessionId || isGuest || !['share', 'collect', 'complete'].includes(screen)) return
    const t = setInterval(() => pullSession(sessionId), 4000)
    return () => clearInterval(t)
  }, [sessionId, screen, isGuest])

  useEffect(() => {
    return () => {
      clearTimeout(toastTimerRef.current)
      clearTimeout(loadTimerRef.current)
      recognitionRef.current?.stop()
    }
  }, [])

  function showToast(msg) {
    clearTimeout(toastTimerRef.current)
    setToast(msg)
    toastTimerRef.current = setTimeout(() => setToast(''), 2100)
  }

  function go(nextScreen) {
    setScreen(nextScreen)
    setOverlay(null)
  }

  function openCafe(cafeId) {
    if (!CAFES.find((c) => c.id === cafeId)) {
      showToast('아직 등록되지 않은 카페예요')
      return
    }
    setSelectedCafeId(cafeId)
    setMemoMode(false)
    go('menu')
  }

  // ---- memo mode / resume ----
  function enterMemo() {
    setMemoMode(true)
    go('memo')
  }
  function resume() {
    if (resumeScreen) go(resumeScreen)
  }

  // ---- smart memo (free-text → auto-organize) ----
  function openSmartMemo() {
    setMemoText('')
    setMemoParsed(false)
    setMemoOrders([])
    setOverlay('smartmemo')
  }
  function parseSmartMemo() {
    const text = memoText.trim()
    if (!text) {
      showToast('주문을 적어주세요')
      return
    }
    const parsedList = parseMemoLines(text, MENUS)
    if (parsedList.length === 0) {
      showToast('메뉴를 인식하지 못했어요')
      return
    }
    setMemoOrders(
      parsedList.map((p) => ({
        id: makeId('sm'),
        menu: p.name,
        temp: p.temp,
        qty: p.qty,
        price: p.price,
        needsOption: p.needsOption,
        fixedTemp: p.fixedTemp,
      })),
    )
    setMemoParsed(true)
  }
  function updateMemoOrder(id, field, value) {
    setMemoOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const next = { ...o, [field]: value }
        if (field === 'temp' && value) next.needsOption = false
        return next
      }),
    )
  }
  function changeMemoQty(id, delta) {
    setMemoOrders((prev) => prev.map((o) => (o.id === id ? { ...o, qty: Math.max(1, o.qty + delta) } : o)))
  }
  function removeMemoOrder(id) {
    setMemoOrders((prev) => prev.filter((o) => o.id !== id))
  }
  function resetSmartMemo() {
    setMemoParsed(false)
    setMemoOrders([])
  }
  function approveSmartMemo() {
    if (memoOrders.length === 0) return
    if (memoOrders.some((o) => o.needsOption || !o.temp)) {
      showToast('온도(아이스/핫)를 선택해 주세요')
      return
    }
    const count = memoOrders.length
    setPeople((prev) => {
      let next = prev
      memoOrders.forEach((o) => {
        next = mergeItemIntoPeople(
          next,
          { id: 'me', name: '나', isMe: true, color: '#1F6E50', fg: '#fff' },
          { name: o.menu, temp: o.temp, qty: o.qty, price: o.price },
        )
      })
      return next
    })
    setMemoMode(true)
    setOverlay(null)
    showToast(`${count}건 정리했어요 🎉`)
    go('memo')
  }
  function quickAdd(menu, temp = 'ICE', qty = 1, size = '') {
    const label = size ? `${menu.name} (${size})` : menu.name
    setPeople((prev) =>
      mergeItemIntoPeople(prev, { id: 'me', name: '나', isMe: true, color: '#1F6E50', fg: '#fff' }, { name: label, temp, qty, price: menu.price }),
    )
    showToast(`${label} 기록했어요`)
  }
  function collectBack() {
    go(memoMode ? 'home' : 'menu')
  }
  function finish() {
    const cafe = CAFES.find((c) => c.id === selectedCafeId) || CAFES[0]
    const snap = JSON.parse(JSON.stringify(people))
    const entry = {
      id: makeId('h'),
      label: memoMode ? '메뉴 메모' : cafe.name,
      initial: memoMode ? '메' : cafe.initial,
      color: memoMode ? '#1F6E50' : cafe.color,
      fg: memoMode ? '#fff' : cafe.fg,
      logo: memoMode ? null : cafe.logo,
      ts: Date.now(),
      justNow: true,
      people: snap,
    }
    setHistory((prev) => [entry, ...prev.map((h) => ({ ...h, justNow: false }))])
    setExpandedHistory(entry.id)
    setResumeScreen(null)
    lastDeepRef.current = null
    go('complete')
  }
  function completeOrder() {
    setPeople([])
    setResumeScreen(null)
    lastDeepRef.current = null
    showToast('주문이 완료됐어요 🎉')
    go('home')
  }
  // ---- real-time share session ----
  async function ensureSession() {
    if (sessionId) return sessionId
    try {
      const cafeName = memoMode ? '메뉴 메모' : selectedCafe.name
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cafeName, people }),
      })
      const data = await res.json()
      if (data.id) {
        setSessionId(data.id)
        return data.id
      }
    } catch {
      showToast('공유 링크 생성에 실패했어요. 다시 시도해주세요')
    }
    return null
  }
  async function goShare() {
    await ensureSession()
    go('share')
  }
  function manualRefresh() {
    if (!sessionId) {
      showToast('공유 후 새로고침할 수 있어요')
      return
    }
    pullSession(sessionId)
  }

  // ---- voice overlay ----
  function openVoice() {
    setOverlay('voice')
    setVoiceTranscript('')
    setVoiceOrders([])
    setVoiceError('')
    voiceFinalsRef.current = []

    if (!SpeechRecognitionAPI) {
      setVoicePhase('listening')
      return
    }

    recognitionRef.current?.stop()
    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'ko-KR'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      // Only final results become order data; interim text is shown for reference
      // but never stored. Skip a final segment if it duplicates the previous one
      // (some engines re-deliver the same phrase across restarts).
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript.trim()
        if (event.results[i].isFinal) {
          if (t && voiceFinalsRef.current[voiceFinalsRef.current.length - 1] !== t) {
            voiceFinalsRef.current.push(t)
          }
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setVoiceTranscript(`${voiceFinalsRef.current.join(' ')} ${interim}`.trim())
    }
    recognition.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setVoiceError('마이크 권한을 허용해주세요')
      } else {
        setVoiceError('음성을 인식하지 못했어요')
      }
      setVoicePhase('failed')
      voiceListeningRef.current = false
    }
    recognition.onend = () => {
      // mobile browsers can end the session after a pause even with continuous:true.
      // If the user hasn't explicitly stopped (voiceListeningRef still true) and no
      // permission error occurred, restart it so capture keeps going seamlessly.
      if (recognitionRef.current !== recognition) return
      if (voiceListeningRef.current) {
        try {
          recognition.start()
        } catch {
          voiceListeningRef.current = false
        }
      }
    }

    voiceListeningRef.current = true
    setVoicePhase('listening')
    recognition.start()
  }
  function finishVoiceListening() {
    // Fully stop recognition, then analyze the accumulated final transcript
    // exactly once (never inside onresult).
    voiceListeningRef.current = false
    recognitionRef.current?.stop()
    const text = dedupeTranscript(voiceFinalsRef.current.join(' ').trim())
    if (!text) {
      setVoiceError('음성을 인식하지 못했어요')
      setVoicePhase('failed')
      return
    }
    const parsedList = parseVoiceOrders(text, MENUS).filter((p) => p.matched)
    if (parsedList.length === 0) {
      setVoiceError('메뉴를 인식하지 못했어요')
      setVoicePhase('failed')
      return
    }
    setVoiceOrders(
      parsedList.map((p, i) => ({
        id: makeId('vo'),
        name: p.personName || (i === 0 ? '나' : ''),
        menu: p.name,
        temp: p.temp,
        qty: p.qty,
        price: p.price,
      })),
    )
    setVoicePhase('done')
  }
  function retryVoice() {
    voiceListeningRef.current = false
    recognitionRef.current?.stop()
    openVoice()
  }
  function updateVoiceOrder(id, field, value) {
    setVoiceOrders((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)))
  }
  function removeVoiceOrder(id) {
    setVoiceOrders((prev) => prev.filter((o) => o.id !== id))
  }
  function approveVoice() {
    if (voiceOrders.length === 0) return
    setPeople((prev) => {
      let next = prev
      voiceOrders.forEach((o) => {
        const name = o.name.trim() || '나'
        next = mergeItemIntoPeople(
          next,
          { id: makeId('p'), name, isMe: name === '나', color: '#5B8C7A', fg: '#fff' },
          { name: o.menu, temp: o.temp, qty: o.qty, price: o.price },
        )
      })
      return next
    })
    setOverlay(null)
    showToast(`${voiceOrders.length}건의 주문이 취합에 추가됐어요 🎉`)
  }

  // ---- capture overlay (real OCR) ----
  function openCapture() {
    setOverlay('capture')
  }
  function addCaptureOrders(orders) {
    if (!orders || !orders.length) {
      setOverlay(null)
      return
    }
    setPeople((prev) => {
      let next = prev
      orders.forEach((o, i) => {
        const isMe = o.name === '나'
        next = mergeItemIntoPeople(
          next,
          { id: makeId('p'), name: o.name, isMe, color: isMe ? '#1F6E50' : CAP_PEOPLE_COLORS[i % CAP_PEOPLE_COLORS.length], fg: '#fff' },
          { name: o.menu, temp: o.temp, qty: o.qty, price: o.price || 4500, note: (o.options || []).join(', ') },
        )
      })
      return next
    })
    if (screen !== 'collect' && screen !== 'memo') go('collect')
    else setOverlay(null)
    showToast(`${orders.length}건의 주문을 취합에 추가했어요 🎉`)
  }
  function closeOverlay() {
    voiceListeningRef.current = false
    recognitionRef.current?.stop()
    setOverlay(null)
  }

  // ---- manual add overlay ----
  function openManual() {
    setManualName('')
    setManualMenu('')
    setManualTemp('ICE')
    setManualQty(1)
    setOverlay('manual')
  }
  function addManual() {
    const name = manualName.trim() || '손님'
    const menuName = manualMenu.trim()
    if (!menuName) {
      showToast('메뉴를 입력해 주세요')
      return
    }
    const colors = ['#5B8C7A', '#C98A33', '#7B6FB0', '#6A8CC7', '#C77B9E', '#E8A13C']
    const color = colors[people.length % colors.length]
    const note = manualNote.trim()
    setPeople((prev) => [
      ...prev,
      { id: makeId('mn'), name, color, fg: '#fff', items: [{ id: makeId('mi'), name: menuName, temp: manualTemp, qty: manualQty, price: 4500, note }] },
    ])
    setOverlay(null)
    setManualNote('')
    showToast(`${name} 님 주문을 추가했어요`)
  }
  function changeNote(personId, itemId, note) {
    setPeople((prev) => prev.map((p) => (p.id !== personId ? p : { ...p, items: p.items.map((it) => (it.id === itemId ? { ...it, note } : it)) })))
  }
  function changeTemp(personId, itemId, temp) {
    setPeople((prev) => prev.map((p) => (p.id !== personId ? p : { ...p, items: p.items.map((it) => (it.id === itemId ? { ...it, temp } : it)) })))
  }

  // ---- participant ----
  function registerParticipant() {
    const name = pName.trim() || '손님'
    const menuName = pMenu.trim()
    if (!menuName) {
      showToast('메뉴를 입력해 주세요')
      return
    }
    const item = { name: menuName, temp: pTemp, qty: 1, price: 4500 }

    if (isGuest && joinId) {
      const color = CAP_PEOPLE_COLORS[Math.floor(Math.random() * CAP_PEOPLE_COLORS.length)]
      const person = { id: makeId('gp'), name, color, fg: '#fff', items: [{ ...item, id: makeId('gi') }] }
      fetch(`/api/session/${joinId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ people: [person] }),
      })
        .then(() => {
          setGuestRegistered(true)
          showToast(`${name} 님 주문이 등록됐어요 🎉`)
        })
        .catch(() => showToast('등록에 실패했어요. 다시 시도해주세요'))
      return
    }

    setPeople((prev) => mergeItemIntoPeople(prev, { id: makeId('p'), name, isMe: name === '나', color: '#5B8C7A', fg: '#fff' }, item))
    setPartDone((prev) => ({ ...prev, [name]: true }))
    go('share')
    showToast(`${name} 님 주문이 등록됐어요 🎉`)
  }

  // ---- history ----
  function toggleHistory(id) {
    setExpandedHistory((prev) => (prev === id ? null : id))
  }
  function setHistoryView(id, view) {
    setHistoryViewMap((prev) => ({ ...prev, [id]: view }))
  }
  function deleteHistory(id) {
    setHistory((prev) => prev.filter((h) => h.id !== id))
    setExpandedHistory((prev) => (prev === id ? null : prev))
    showToast('주문 내역을 삭제했어요')
  }
  async function copyHistory(h) {
    const view = historyView[h.id] || 'named'
    const text = view === 'named' ? buildNamedFor(h.people) : buildPlainFor(h.people)
    await copyText(text, '주문 양식을 복사했어요')
  }
  async function copyComplete() {
    const text = completeView === 'named' ? buildNamedFor(people) : buildPlainFor(people)
    await copyText(text, '주문 양식을 복사했어요')
  }

  // ---- menu ----
  function setTemp(menuId, temp) {
    setMenuTemp((prev) => ({ ...prev, [menuId]: temp }))
  }
  function setMenuNoteFor(menuId, note) {
    setMenuNote((prev) => ({ ...prev, [menuId]: note }))
  }
  function setSize(menuId, size) {
    setMenuSize((prev) => ({ ...prev, [menuId]: size }))
  }
  function addCart(menu, temp) {
    const note = (menuNote[menu.id] || '').trim()
    const cafeSizeOpts = CAFE_SIZE_OPTIONS[selectedCafeId]
    const size =
      cafeSizeOpts?.type === 'named'
        ? menuSize[menu.id] || cafeSizeOpts.default
        : cafeSizeOpts?.type === 'temperature_based'
        ? cafeSizeOpts.options[temp]
        : ''
    setCart((prev) => ({ ...prev, [menu.id]: (prev[menu.id] || 0) + 1 }))
    setPeople((prev) =>
      mergeItemIntoPeople(prev, { id: 'me', name: '나', isMe: true, color: '#1F6E50', fg: '#fff' }, { name: menu.name, temp, qty: 1, price: menu.price, note, size }),
    )
    setMenuNote((prev) => ({ ...prev, [menu.id]: '' }))
    showToast(`${menu.name} 담았어요 🎉`)
  }

  // ---- collect edit ----
  function changeQty(personId, itemId, delta) {
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== personId) return p
        const items = p.items.map((it) => (it.id === itemId ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        return { ...p, items }
      }),
    )
  }
  function removeItem(personId, itemId) {
    setPeople((prev) => prev.map((p) => (p.id !== personId ? p : { ...p, items: p.items.filter((it) => it.id !== itemId) })).filter((p) => p.items.length > 0))
    showToast('항목을 삭제했어요')
  }

  function toggleFav(cafeId) {
    setFavs((prev) => ({ ...prev, [cafeId]: !prev[cafeId] }))
  }

  function selectPref(prefIndex, optIndex) {
    setPrefSel((prev) => prev.map((v, i) => (i === prefIndex ? optIndex : v)))
  }

  async function copyText(text, msg) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // clipboard unavailable — still show feedback
    }
    showToast(msg)
  }

  const selectedCafe = CAFES.find((c) => c.id === selectedCafeId) || CAFES[0]
  const favCafes = CAFES.filter((c) => favs[c.id])
  const mapPins = CAFES.map((c, i) => ({ ...c, x: MAP_POS[i][0], y: MAP_POS[i][1] }))
  const filteredCafes = cafeQuery.trim() ? CAFES.filter((c) => c.name.includes(cafeQuery.trim())) : CAFES
  const filteredMapPins = cafeQuery.trim() ? mapPins.filter((c) => c.name.includes(cafeQuery.trim())) : mapPins
  const memoQueryTrimmed = memoQuery.trim()
  const memoMenus = memoQueryTrimmed ? MENUS.filter((m) => m.name.includes(memoQueryTrimmed)) : MENUS
  const menuQueryTrimmed = menuQuery.trim()
  const menus = menuQueryTrimmed
    ? MENUS.filter((m) => m.name.includes(menuQueryTrimmed))
    : MENUS.filter((m) => (menuCat === 0 ? m.popular || m.cat.includes(0) : m.cat.includes(menuCat)))
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((a, [id, n]) => a + (MENUS.find((m) => m.id === id)?.price || 0) * n, 0)
  const { totalQty, totalPrice } = computeTotals(people)
  const hasOrders = people.length > 0
  const confirmedCount = people.length
  const joinUrl = sessionId && typeof window !== 'undefined' ? `${window.location.origin}/join/${sessionId}` : ''

  const showTabs = TABBED_SCREENS.includes(screen) && !overlay && !loading

  return (
    <div
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        background: '#E7E1D6',
      }}
    >
      <div
        style={{
          width: 480,
          height: frameScale < 1 ? `calc(100dvh / ${frameScale})` : '100dvh',
          background: 'var(--cc-cream)',
          position: 'absolute',
          top: 0,
          left: frameOffsetX,
          transform: `scale(${frameScale})`,
          transformOrigin: 'top left',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 0 1px rgba(0,0,0,.04),0 24px 60px rgba(40,30,15,.18)',
        }}
      >
        <div ref={scrollRef} className="cc-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          {screen === 'home' && (
            <Home
              favCafes={favCafes}
              recentOrders={RECENT_ORDERS}
              hasOrders={hasOrders}
              totalQty={totalQty}
              onGoMy={() => go('my')}
              onGoCafe={() => go('map')}
              onOpenVoice={openVoice}
              onOpenCapture={openCapture}
              onGoCollect={() => go('collect')}
              onOpenCafe={openCafe}
              onReorder={openCafe}
              onEnterMemo={enterMemo}
              onOpenSmartMemo={openSmartMemo}
            />
          )}
          {screen === 'cafe' && (
            <CafeSelect
              cafes={filteredCafes}
              favs={favs}
              cafeQuery={cafeQuery}
              onCafeQueryChange={setCafeQuery}
              onBack={() => go('home')}
              onGoMap={() => go('map')}
              onOpenCafe={openCafe}
              onToggleFav={toggleFav}
            />
          )}
          {screen === 'menu' && (
            <Menu
              cafe={selectedCafe}
              categories={CATS}
              menuCat={menuCat}
              onSelectCat={setMenuCat}
              menus={menus}
              menuQuery={menuQuery}
              onMenuQueryChange={setMenuQuery}
              menuTemp={menuTemp}
              onSetTemp={setTemp}
              menuNote={menuNote}
              onMenuNoteChange={setMenuNoteFor}
              menuSize={menuSize}
              onSetSize={setSize}
              sizeOptions={CAFE_SIZE_OPTIONS[selectedCafeId]}
              cartCount={cartCount}
              cartTotal={cartTotal}
              onAddCart={addCart}
              onBack={() => go('map')}
              onGoCollect={() => go('collect')}
              onOpenVoice={openVoice}
            />
          )}
          {(screen === 'collect' || screen === 'memo') && (
            <Collect
              people={people}
              totalQty={totalQty}
              totalPrice={totalPrice}
              memoMode={memoMode}
              onBack={collectBack}
              onOpenVoice={openVoice}
              onOpenCapture={openCapture}
              onOpenManual={openManual}
              onOpenSmartMemo={openSmartMemo}
              onChangeQty={changeQty}
              onRemoveItem={removeItem}
              onChangeNote={changeNote}
              onChangeTemp={changeTemp}
              onFinish={finish}
              onGoShare={goShare}
              memoMenus={memoMenus}
              memoQuery={memoQuery}
              onMemoQueryChange={setMemoQuery}
              onQuickAdd={quickAdd}
            />
          )}
          {screen === 'complete' && (
            <Complete
              completeView={completeView}
              onSetView={setCompleteView}
              completeText={completeView === 'named' ? buildNamedFor(people) : buildPlainFor(people)}
              totalQty={totalQty}
              onCopy={copyComplete}
              onBack={() => go('collect')}
              onComplete={completeOrder}
            />
          )}
          {screen === 'share' && (
            <Share
              participants={people.map((p) => ({
                name: p.name,
                order: p.items.map((it) => `${it.temp === 'HOT' ? '핫' : '아이스'} ${it.name} ${it.qty}잔`).join(', '),
                ok: true,
                bg: p.color,
              }))}
              confirmedCount={confirmedCount}
              joinUrl={joinUrl}
              onBack={() => go('collect')}
              onCopyLink={() => copyText(joinUrl, '참여 링크를 복사했어요')}
              onShareKakao={() => showToast('카카오톡으로 공유했어요 🎉')}
              onFinish={() => {
                setSessionId(null)
                finish()
              }}
              onGoParticipant={() => go('participant')}
              onRefresh={manualRefresh}
            />
          )}
          {screen === 'participant' && (
            <Participant
              pName={pName}
              onNameChange={setPName}
              pMenu={pMenu}
              onMenuChange={setPMenu}
              pTemp={pTemp}
              onSetTemp={setPTemp}
              onRegister={registerParticipant}
              onBack={() => go('share')}
              cafeName={isGuest ? remoteCafeName || '불러오는 중...' : memoMode ? '메뉴 메모' : selectedCafe.name}
              isHost={!isGuest}
              registered={isGuest && guestRegistered}
              error={isGuest && guestError ? '주문을 찾을 수 없어요. 링크를 다시 확인해주세요.' : ''}
            />
          )}
          {screen === 'history' && (
            <History
              history={history}
              expandedHistory={expandedHistory}
              onToggle={toggleHistory}
              historyView={historyView}
              onSetView={setHistoryView}
              onCopy={copyHistory}
              onDelete={deleteHistory}
            />
          )}
          {screen === 'map' && (
            <Map
              cafes={filteredCafes}
              mapPins={filteredMapPins}
              cafeQuery={cafeQuery}
              onQueryChange={setCafeQuery}
              onBack={() => go('home')}
              onOpenCafe={openCafe}
              onEnterMemo={enterMemo}
            />
          )}
          {screen === 'my' && (
            <My recentOrders={RECENT_ORDERS} prefs={PREFS} prefSel={prefSel} onSelectPref={selectPref} onReorder={openCafe} myName={myName} onChangeMyName={setMyName} />
          )}
        </div>

        {showTabs && <BottomNav screen={screen} onGo={go} />}

        {overlay === 'voice' && (
          <VoiceOverlay
            phase={voicePhase}
            transcript={voiceTranscript}
            orders={voiceOrders}
            onUpdateOrder={updateVoiceOrder}
            onRemoveOrder={removeVoiceOrder}
            onClose={closeOverlay}
            onFinishListening={finishVoiceListening}
            onApprove={approveVoice}
            onRetry={retryVoice}
            supported={!!SpeechRecognitionAPI}
            error={voiceError}
          />
        )}
        {overlay === 'capture' && <CaptureOverlay onClose={closeOverlay} onApprove={addCaptureOrders} />}
        {overlay === 'manual' && (
          <ManualAddOverlay
            name={manualName}
            onNameChange={setManualName}
            menu={manualMenu}
            onMenuChange={setManualMenu}
            note={manualNote}
            onNoteChange={setManualNote}
            temp={manualTemp}
            onSetTemp={setManualTemp}
            qty={manualQty}
            onInc={() => setManualQty((q) => q + 1)}
            onDec={() => setManualQty((q) => Math.max(1, q - 1))}
            onClose={closeOverlay}
            onAdd={addManual}
          />
        )}
        {overlay === 'smartmemo' && (
          <SmartMemoOverlay
            text={memoText}
            onTextChange={setMemoText}
            parsed={memoParsed}
            orders={memoOrders}
            onParse={parseSmartMemo}
            onUpdateOrder={updateMemoOrder}
            onChangeQty={changeMemoQty}
            onRemoveOrder={removeMemoOrder}
            onApprove={approveSmartMemo}
            onReset={resetSmartMemo}
            onClose={closeOverlay}
            onOpenVoice={openVoice}
            onOpenCapture={openCapture}
          />
        )}

        {loading && <Loading />}

        {toast && <Toast message={toast} />}
      </div>
    </div>
  )
}
