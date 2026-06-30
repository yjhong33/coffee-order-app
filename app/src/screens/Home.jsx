import {
  PersonIcon,
  SearchIcon,
  ChevronRight,
  MicIcon,
  CameraIcon,
  CupIcon,
  SparkleIcon,
  StarIcon,
  ClockIcon,
} from '../icons'

// ---- helpers ----------------------------------------------------------------
function greeting() {
  const h = new Date().getHours()
  if (h < 6) return { label: '늦은 밤이에요', emoji: '🌙' }
  if (h < 11) return { label: '좋은 아침이에요', emoji: '☀️' }
  if (h < 14) return { label: '점심엔 커피 한 잔', emoji: '☕' }
  if (h < 18) return { label: '나른한 오후예요', emoji: '🍃' }
  if (h < 22) return { label: '편안한 저녁이에요', emoji: '🌆' }
  return { label: '늦은 밤이에요', emoji: '🌙' }
}

const QUICK_ACTIONS = [
  { key: 'memo', title: '빠른 메모', sub: '적으면 정리', Icon: SparkleIcon, tintBg: 'var(--cc-green-soft)', tintInk: 'var(--cc-green)' },
  { key: 'voice', title: '음성 주문', sub: '말로 한 번에', Icon: MicIcon, tintBg: 'var(--cc-ice-bg)', tintInk: 'var(--cc-ice)' },
  { key: 'capture', title: '사진 인식', sub: '캡처로 추가', Icon: CameraIcon, tintBg: 'var(--cc-gold-soft)', tintInk: 'var(--cc-gold)' },
]

// ---- presentational sub-components ------------------------------------------
function Avatar({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="내 설정"
      className="cc-press"
      style={{
        width: 44,
        height: 44,
        borderRadius: 15,
        background: 'rgba(255,255,255,.16)',
        border: '1px solid rgba(255,255,255,.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flex: 'none',
        padding: 0,
      }}
    >
      <PersonIcon size={22} />
    </button>
  )
}

function SearchPill({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cc-press"
      aria-label="카페 검색하고 주문 시작하기"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: 'rgba(255,255,255,.15)',
        border: '1px solid rgba(255,255,255,.24)',
        borderRadius: 16,
        padding: '14px 14px 14px 16px',
        cursor: 'pointer',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        textAlign: 'left',
      }}
    >
      <SearchIcon color="rgba(255,255,255,.92)" size={20} />
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.92)', letterSpacing: '-.3px' }}>
        카페 검색하고 주문 시작하기
      </span>
      <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <ChevronRight color="var(--cc-green-strong)" size={18} strokeWidth="2.4" />
      </span>
    </button>
  )
}

function QuickAction({ action, onClick }) {
  const { Icon, title, sub, tintBg, tintInk } = action
  return (
    <button
      type="button"
      onClick={onClick}
      className="cc-press"
      aria-label={title}
      style={{
        flex: 1,
        background: 'transparent',
        border: 'none',
        borderRadius: 14,
        padding: '8px 4px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 9,
        cursor: 'pointer',
      }}
    >
      <span style={{ width: 50, height: 50, borderRadius: 16, background: tintBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon color={tintInk} size={24} />
      </span>
      <span style={{ display: 'block', textAlign: 'center' }}>
        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--cc-ink)', letterSpacing: '-.3px' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 11.5, color: 'var(--cc-ink3)', marginTop: 2, letterSpacing: '-.2px' }}>{sub}</span>
      </span>
    </button>
  )
}

function SectionTitle({ title, actionLabel, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--cc-ink)' }}>{title}</div>
      {actionLabel && (
        <button type="button" onClick={onAction} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, color: 'var(--cc-ink3)', fontWeight: 600, cursor: 'pointer', letterSpacing: '-.2px' }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function FavoriteCard({ cafe, onClick }) {
  const parts = cafe.name.split(' ')
  const brand = parts.length > 1 ? parts.slice(0, -1).join(' ') : cafe.name
  const branch = parts.length > 1 ? parts[parts.length - 1] : ''
  return (
    <button
      type="button"
      onClick={onClick}
      className="cc-press"
      style={{ flex: 'none', width: 96, background: 'none', border: 'none', padding: 0, textAlign: 'center', cursor: 'pointer' }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 22,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 800,
          overflow: 'hidden',
          boxShadow: '0 6px 16px var(--cc-shadow)',
          background: cafe.logo ? '#fff' : cafe.color,
          color: cafe.fg,
          border: cafe.logo ? '1px solid var(--cc-line)' : 'none',
        }}
      >
        {cafe.logo ? <img src={cafe.logo} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : cafe.initial}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 9, letterSpacing: '-.3px', lineHeight: 1.25, color: 'var(--cc-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{brand}</div>
      {branch && <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--cc-ink2)', letterSpacing: '-.2px', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{branch}</div>}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
        <StarIcon size={11} />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--cc-ink2)' }}>{cafe.rating}</span>
        <span style={{ fontSize: 11.5, color: 'var(--cc-ink3)' }}>· {cafe.dist}</span>
      </div>
    </button>
  )
}

function RecentRow({ order, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cc-press"
      style={{ width: '100%', background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 16, padding: 13, display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', marginBottom: 10, boxShadow: '0 1px 3px var(--cc-shadow)', textAlign: 'left' }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flex: 'none', overflow: 'hidden', background: order.logo ? '#fff' : order.color, color: order.fg, border: order.logo ? '1px solid var(--cc-line)' : 'none' }}>
        {order.logo ? <img src={order.logo} alt={order.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : order.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px', color: 'var(--cc-ink)' }}>{order.name}</div>
        <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.summary}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flex: 'none' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--cc-ink3)' }}>
          <ClockIcon size={12} color="var(--cc-ink3)" /> {order.date}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-green)', background: 'var(--cc-green-soft)', padding: '5px 11px', borderRadius: 9 }}>재주문</span>
      </div>
    </button>
  )
}

// ---- screen -----------------------------------------------------------------
export default function Home({
  favCafes,
  recentOrders,
  hasOrders,
  totalQty,
  onGoMy,
  onGoCafe,
  onOpenVoice,
  onOpenCapture,
  onGoCollect,
  onOpenCafe,
  onReorder,
  onOpenSmartMemo,
}) {
  const g = greeting()
  const quickHandlers = { memo: onOpenSmartMemo, voice: onOpenVoice, capture: onOpenCapture }

  return (
    <div style={{ padding: '0 0 96px', animation: 'cc-fade .25s ease' }}>
      {/* hero */}
      <div
        style={{
          padding: '58px 20px 48px',
          background: 'var(--cc-hero-grad)',
          borderRadius: '0 0 28px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', right: -34, top: -34, width: 170, height: 170, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }}></div>
        <div style={{ position: 'absolute', right: 54, top: 84, width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }}></div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.72)', letterSpacing: '-.2px' }}>
                {g.label} {g.emoji}
              </div>
              <div style={{ fontSize: 25, fontWeight: 700, color: '#fff', letterSpacing: '-.6px', marginTop: 7, lineHeight: 1.28 }}>
                오늘 커피,
                <br />한 번에 주문해 볼까요?
              </div>
            </div>
            <Avatar onClick={onGoMy} />
          </div>

          <div style={{ marginTop: 22 }}>
            <SearchPill onClick={onGoCafe} />
          </div>
        </div>
      </div>

      {/* floating quick-capture card (overlaps hero) */}
      <div style={{ padding: '0 20px', marginTop: -30, position: 'relative', zIndex: 2 }}>
        <div
          style={{
            background: 'var(--cc-surface)',
            border: '1px solid var(--cc-line)',
            borderRadius: 22,
            padding: '14px 10px 12px',
            boxShadow: '0 14px 34px var(--cc-shadow)',
            animation: 'cc-rise .45s ease both',
            animationDelay: '.05s',
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cc-ink3)', letterSpacing: '-.2px', padding: '0 8px 10px' }}>
            카페 없이 바로 기록해요
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            {QUICK_ACTIONS.map((a, i) => (
              <div key={a.key} style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
                {i > 0 && <div style={{ width: 1, background: 'var(--cc-line)', margin: '6px 0', flex: 'none' }}></div>}
                <QuickAction action={a} onClick={quickHandlers[a.key]} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* resume in-progress group order */}
      {hasOrders && (
        <div style={{ padding: '16px 20px 0', animation: 'cc-rise .45s ease both', animationDelay: '.1s' }}>
          <button
            type="button"
            onClick={onGoCollect}
            className="cc-press"
            style={{ width: '100%', background: 'var(--cc-green-deep)', borderRadius: 18, padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', border: 'none', textAlign: 'left', boxShadow: '0 10px 24px var(--cc-shadow)' }}
          >
            <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#37C77C', animation: 'cc-ping 1.8s ease-out infinite', opacity: 0.5 }}></span>
              <span style={{ position: 'relative', display: 'flex' }}>
                <CupIcon />
              </span>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8FE3B6', letterSpacing: '.2px' }}>진행 중인 그룹 주문</span>
              <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2, letterSpacing: '-.3px' }}>지금까지 총 {totalQty}잔 모았어요</span>
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,.16)', padding: '8px 12px', borderRadius: 10, flex: 'none' }}>이어서 →</span>
          </button>
        </div>
      )}

      {/* favorites */}
      {favCafes.length > 0 && (
        <div style={{ padding: '26px 0 0', animation: 'cc-rise .45s ease both', animationDelay: '.16s' }}>
          <div style={{ padding: '0 20px' }}>
            <SectionTitle title="즐겨찾는 카페" actionLabel="전체보기" onAction={onGoCafe} />
          </div>
          <div className="cc-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '14px 20px 4px' }}>
            {favCafes.map((cafe) => (
              <FavoriteCard key={cafe.id} cafe={cafe} onClick={() => onOpenCafe(cafe.id)} />
            ))}
          </div>
        </div>
      )}

      {/* recent orders */}
      {recentOrders.length > 0 && (
        <div style={{ padding: '20px 20px 0', animation: 'cc-rise .45s ease both', animationDelay: '.22s' }}>
          <div style={{ marginBottom: 12 }}>
            <SectionTitle title="최근 주문" />
          </div>
          {recentOrders.map((ro) => (
            <RecentRow key={ro.cafeId} order={ro} onClick={() => onReorder(ro.cafeId)} />
          ))}
        </div>
      )}
    </div>
  )
}
