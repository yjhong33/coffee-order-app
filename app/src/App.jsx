import { useEffect, useRef, useState } from 'react'
import {
  CAFES,
  MAP_POS,
  CATS,
  MENUS,
  ANALYZE_STEPS,
  PREFS,
  INITIAL_PEOPLE,
  PARTICIPANT_STATUS,
  RECENT_ORDERS,
  CAP_PEOPLE,
} from './data'
import { computeTotals } from './selectors'
import Home from './screens/Home'
import CafeSelect from './screens/CafeSelect'
import Menu from './screens/Menu'
import Collect from './screens/Collect'
import Share from './screens/Share'
import Map from './screens/Map'
import My from './screens/My'
import VoiceOverlay from './overlays/VoiceOverlay'
import CaptureOverlay from './overlays/CaptureOverlay'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'

const TABBED_SCREENS = ['home', 'map', 'collect', 'my']
const VOICE_FULL_TEXT = '아이스 아메리카노 한 잔이요'
const CAP_PEOPLE_COLORS = ['#E8A13C', '#6A8CC7', '#1F6E50', '#C77B9E']

let idSeq = 0
function makeId(prefix) {
  idSeq += 1
  return `${prefix}-${Date.now()}-${idSeq}`
}

function mergeItemIntoPeople(people, personInfo, item) {
  const idx = people.findIndex((p) => (personInfo.isMe ? p.isMe : p.name === personInfo.name))
  if (idx === -1) {
    return [...people, { ...personInfo, items: [{ ...item, id: makeId('it') }] }]
  }
  const target = people[idx]
  const itemIdx = target.items.findIndex((it) => it.name === item.name && it.temp === item.temp)
  let items
  if (itemIdx === -1) {
    items = [...target.items, { ...item, id: makeId('it') }]
  } else {
    items = target.items.map((it, i) => (i === itemIdx ? { ...it, qty: it.qty + item.qty } : it))
  }
  const updated = { ...target, items }
  return [...people.slice(0, idx), updated, ...people.slice(idx + 1)]
}

function capturePersonToItem(p) {
  const ice = p.temp === 'ICE'
  const qty = p.menu.includes('2잔') ? 2 : 1
  const name = p.menu.replace(' 2잔', '')
  const price = name.includes('돌체') ? 6300 : name.includes('바닐라') ? 5500 : 4500
  return { name, temp: ice ? 'ICE' : 'HOT', qty, price }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [overlay, setOverlay] = useState(null)
  const [voicePhase, setVoicePhase] = useState('listening')
  const [voiceTyped, setVoiceTyped] = useState('')
  const [capStep, setCapStep] = useState('upload')
  const [analyzeIdx, setAnalyzeIdx] = useState(0)
  const [menuCat, setMenuCat] = useState(0)
  const [menuTemp, setMenuTemp] = useState({})
  const [cart, setCart] = useState({})
  const [favs, setFavs] = useState({ starbucks: true, mega: true, twosome: false, ediya: true, compose: false, paik: false })
  const [selectedCafeId, setSelectedCafeId] = useState('starbucks')
  const [people, setPeople] = useState(INITIAL_PEOPLE)
  const [prefSel, setPrefSel] = useState([1, 1, 1])
  const [toast, setToast] = useState('')

  const scrollRef = useRef(null)
  const voiceTimerRef = useRef(null)
  const capTimerRef = useRef(null)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [screen])

  useEffect(() => {
    return () => {
      clearTimeout(toastTimerRef.current)
      clearInterval(voiceTimerRef.current)
      clearInterval(capTimerRef.current)
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
    setSelectedCafeId(cafeId)
    go('menu')
  }

  // ---- voice overlay ----
  function openVoice() {
    clearInterval(voiceTimerRef.current)
    setOverlay('voice')
    setVoicePhase('listening')
    setVoiceTyped('')
    let i = 0
    voiceTimerRef.current = setInterval(() => {
      i++
      setVoiceTyped(VOICE_FULL_TEXT.slice(0, i))
      if (i >= VOICE_FULL_TEXT.length) {
        clearInterval(voiceTimerRef.current)
        setTimeout(() => setVoicePhase('done'), 500)
      }
    }, 90)
  }
  function approveVoice() {
    setPeople((prev) =>
      mergeItemIntoPeople(
        prev,
        { id: makeId('p'), name: '정우성', isMe: false, color: '#5B8C7A', fg: '#fff' },
        { name: '아메리카노', temp: 'ICE', qty: 1, price: 4500 },
      ),
    )
    setOverlay(null)
    showToast('정우성 님 주문이 추가됐어요 🎉')
  }

  // ---- capture overlay ----
  function openCapture() {
    clearInterval(capTimerRef.current)
    setOverlay('capture')
    setCapStep('upload')
    setAnalyzeIdx(0)
  }
  function startCapture() {
    setCapStep('analyzing')
    setAnalyzeIdx(0)
    clearInterval(capTimerRef.current)
    capTimerRef.current = setInterval(() => {
      setAnalyzeIdx((prev) => {
        const next = prev + 1
        if (next > ANALYZE_STEPS.length) {
          clearInterval(capTimerRef.current)
          setCapStep('result')
          return prev
        }
        return next
      })
    }, 750)
  }
  function approveCapture() {
    setPeople((prev) => {
      let next = prev
      CAP_PEOPLE.forEach((p, i) => {
        const isMe = p.name === '나'
        const item = capturePersonToItem(p)
        next = mergeItemIntoPeople(
          next,
          { id: makeId('p'), name: p.name, isMe, color: isMe ? '#1F6E50' : CAP_PEOPLE_COLORS[i % CAP_PEOPLE_COLORS.length], fg: '#fff' },
          item,
        )
      })
      return next
    })
    setOverlay(null)
    showToast('4명의 주문을 취합에 추가했어요 🎉')
  }
  function closeOverlay() {
    clearInterval(voiceTimerRef.current)
    clearInterval(capTimerRef.current)
    setOverlay(null)
  }

  // ---- menu ----
  function setTemp(menuId, temp) {
    setMenuTemp((prev) => ({ ...prev, [menuId]: temp }))
  }
  function addCart(menu, temp) {
    setCart((prev) => ({ ...prev, [menu.id]: (prev[menu.id] || 0) + 1 }))
    setPeople((prev) =>
      mergeItemIntoPeople(prev, { id: 'me', name: '나', isMe: true, color: '#1F6E50', fg: '#fff' }, { name: menu.name, temp, qty: 1, price: menu.price }),
    )
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
  const menus = MENUS.filter((m) => (menuCat === 0 ? m.popular || m.cat.includes(0) : m.cat.includes(menuCat)))
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((a, [id, n]) => a + (MENUS.find((m) => m.id === id)?.price || 0) * n, 0)
  const { totalQty, totalPrice } = computeTotals(people)
  const hasOrders = people.length > 0
  const confirmedCount = PARTICIPANT_STATUS.filter((p) => p.ok).length

  const showTabs = TABBED_SCREENS.includes(screen) && !overlay

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'stretch', background: '#E7E1D6' }}>
      <div
        style={{
          width: 480,
          maxWidth: '100%',
          minHeight: '100dvh',
          height: '100dvh',
          background: 'var(--cc-cream)',
          position: 'relative',
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
              onGoCafe={() => go('cafe')}
              onOpenVoice={openVoice}
              onOpenCapture={openCapture}
              onGoCollect={() => go('collect')}
              onOpenCafe={openCafe}
              onReorder={openCafe}
            />
          )}
          {screen === 'cafe' && <CafeSelect cafes={CAFES} favs={favs} onBack={() => go('home')} onGoMap={() => go('map')} onOpenCafe={openCafe} onToggleFav={toggleFav} />}
          {screen === 'menu' && (
            <Menu
              cafe={selectedCafe}
              categories={CATS}
              menuCat={menuCat}
              onSelectCat={setMenuCat}
              menus={menus}
              menuTemp={menuTemp}
              onSetTemp={setTemp}
              cartCount={cartCount}
              cartTotal={cartTotal}
              onAddCart={addCart}
              onBack={() => go('cafe')}
              onGoCollect={() => go('collect')}
            />
          )}
          {screen === 'collect' && (
            <Collect
              people={people}
              totalQty={totalQty}
              totalPrice={totalPrice}
              onBack={() => go('menu')}
              onOpenVoice={openVoice}
              onOpenCapture={openCapture}
              onChangeQty={changeQty}
              onRemoveItem={removeItem}
              onGoShare={() => go('share')}
            />
          )}
          {screen === 'share' && (
            <Share
              participants={PARTICIPANT_STATUS}
              confirmedCount={confirmedCount}
              onBack={() => go('collect')}
              onCopyLink={() => copyText('https://callcoffee.app/join/C4F9', '참여 링크를 복사했어요')}
              onCopyCode={() => copyText('C4F9', '참여 코드 C4F9를 복사했어요')}
              onShareKakao={() => showToast('카카오톡으로 공유했어요 🎉')}
              onFinish={() => go('home')}
            />
          )}
          {screen === 'map' && <Map cafes={CAFES} mapPins={mapPins} onBack={() => go('cafe')} onOpenCafe={openCafe} />}
          {screen === 'my' && <My recentOrders={RECENT_ORDERS} prefs={PREFS} prefSel={prefSel} onSelectPref={selectPref} onReorder={openCafe} />}
        </div>

        {showTabs && <BottomNav screen={screen} onGo={go} />}

        {overlay === 'voice' && <VoiceOverlay phase={voicePhase} typed={voiceTyped} onClose={closeOverlay} onApprove={approveVoice} />}
        {overlay === 'capture' && <CaptureOverlay step={capStep} analyzeIdx={analyzeIdx} onClose={closeOverlay} onStart={startCapture} onApprove={approveCapture} />}

        {toast && <Toast message={toast} />}
      </div>
    </div>
  )
}
