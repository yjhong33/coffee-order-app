import { useState } from 'react'
import { PersonIcon, ChevronRight } from '../icons'
import { useTheme } from '../theme'

const APP_VERSION = '1.0.0'

function Section({ title, children }) {
  return (
    <div style={{ padding: '0 20px', marginTop: 26 }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.4px', color: 'var(--cc-ink3)', marginBottom: 9, paddingLeft: 4, textTransform: 'uppercase' }}>{title}</div>
      <div style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px var(--cc-shadow)' }}>{children}</div>
    </div>
  )
}

function Row({ icon, title, subtitle, trailing, onClick, last, disabled }) {
  const interactive = !!onClick && !disabled
  return (
    <div
      className={interactive ? 'cc-press' : undefined}
      onClick={interactive ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={title}
      aria-disabled={disabled || undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '13px 16px',
        minHeight: 44,
        cursor: interactive ? 'pointer' : 'default',
        borderBottom: last ? 'none' : '1px solid var(--cc-line)',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span aria-hidden style={{ fontSize: 18, width: 24, textAlign: 'center', flex: 'none' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--cc-ink)', letterSpacing: '-.2px' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--cc-ink3)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {trailing}
    </div>
  )
}

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      style={{
        width: 51,
        height: 31,
        borderRadius: 31,
        border: 'none',
        padding: 0,
        flex: 'none',
        position: 'relative',
        cursor: 'pointer',
        background: on ? 'var(--cc-green)' : 'var(--cc-band)',
        boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--cc-line)',
        transition: 'background-color .3s ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 22 : 2,
          width: 27,
          height: 27,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,.3)',
          transition: 'left .28s cubic-bezier(.4,0,.2,1)',
        }}
      />
    </button>
  )
}

function Chevron() {
  return <ChevronRight color="var(--cc-ink3)" size={18} />
}

function Value({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 'none' }}>
      <span style={{ fontSize: 14, color: 'var(--cc-ink3)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
      <Chevron />
    </div>
  )
}

function Pill({ children }) {
  return <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-gold)', background: 'var(--cc-gold-soft)', padding: '2px 7px', borderRadius: 6, flex: 'none' }}>{children}</span>
}

export default function My({ recentOrders, prefs, prefSel, onSelectPref, onReorder, myName, onChangeMyName }) {
  const { resolved, toggle } = useTheme()
  const dark = resolved === 'dark'

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(myName)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [notifyOrder, setNotifyOrder] = useState(true)
  const [notifyUpdate, setNotifyUpdate] = useState(false)
  const [note, setNote] = useState('')

  function startEdit() {
    setDraft(myName)
    setEditing(true)
  }
  function commitEdit() {
    const next = draft.trim()
    if (next) onChangeMyName(next)
    setEditing(false)
  }
  function flash(msg) {
    setNote('')
    requestAnimationFrame(() => setNote(msg))
  }

  const defaultCafe = recentOrders[0]?.name || '미설정'

  return (
    <div style={{ padding: '54px 0 110px', animation: 'cc-fade .2s ease' }}>
      {/* title + profile */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.6px', color: 'var(--cc-ink)' }}>설정</div>
        <div style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, boxShadow: '0 1px 3px var(--cc-shadow)' }}>
          <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--cc-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <PersonIcon color="var(--cc-green)" size={28} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editing ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit()
                  if (e.key === 'Escape') setEditing(false)
                }}
                placeholder="이름을 입력하세요"
                aria-label="이름 수정"
                style={{ fontSize: 17, fontWeight: 700, border: 'none', borderBottom: '1.5px solid var(--cc-green)', background: 'transparent', outline: 'none', padding: '0 0 2px', width: '100%', color: 'var(--cc-ink)' }}
              />
            ) : (
              <div onClick={startEdit} style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--cc-ink)' }}>
                {myName}님
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cc-ink3)' }}>수정</span>
              </div>
            )}
            <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 3 }}>익명 세션 · 지금까지 12번 취합했어요</div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <Section title="Appearance">
        <Row
          icon="🌙"
          title="다크 모드"
          subtitle={dark ? '어두운 화면으로 보고 있어요' : '밝은 화면으로 보고 있어요'}
          trailing={<Toggle on={dark} onChange={toggle} label="다크 모드" />}
        />
        <Row icon="🎨" title="앱 테마" subtitle="향후 제공 예정" disabled trailing={<Pill>준비 중</Pill>} />
        <Row icon="🌐" title="언어" subtitle="한국어" disabled last trailing={<Pill>준비 중</Pill>} />
      </Section>

      {/* Order */}
      <Section title="Order">
        <Row icon="☕" title="기본 매장" onClick={() => flash('매장 설정은 준비 중이에요')} trailing={<Value>{defaultCafe}</Value>} />
        <Row
          icon="🥤"
          title="기본 음료 옵션"
          subtitle={prefsOpen ? '아래에서 선택해 주세요' : '온도·사이즈·샷 기본값'}
          onClick={() => setPrefsOpen((v) => !v)}
          trailing={
            <span style={{ display: 'inline-flex', transform: prefsOpen ? 'rotate(90deg)' : 'none', transition: 'transform .25s ease' }}>
              <Chevron />
            </span>
          }
          last={!prefsOpen && false}
        />
        {prefsOpen && (
          <div style={{ padding: '4px 16px 6px', animation: 'cc-rise .2s ease', borderBottom: '1px solid var(--cc-line)' }}>
            {prefs.map((pf, pi) => (
              <div key={pf.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: pi === prefs.length - 1 ? 'none' : '1px solid var(--cc-line)' }}>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cc-ink)' }}>{pf.label}</span>
                <div style={{ display: 'flex', background: 'var(--cc-band)', borderRadius: 10, padding: 3 }}>
                  {pf.opts.map((label, oi) => {
                    const selected = prefSel[pi] === oi
                    return (
                      <div
                        key={label}
                        onClick={() => onSelectPref(pi, oi)}
                        role="radio"
                        aria-checked={selected}
                        aria-label={`${pf.label} ${label}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          padding: '6px 13px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: selected ? 'var(--cc-surface)' : 'transparent',
                          color: selected ? 'var(--cc-green)' : 'var(--cc-ink3)',
                          boxShadow: selected ? '0 1px 3px var(--cc-shadow)' : 'none',
                          transition: 'background-color .2s ease, color .2s ease',
                        }}
                      >
                        {label}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <Row icon="📍" title="최근 주문" subtitle={`${recentOrders.length}건의 기록`} onClick={() => flash('아래 목록에서 다시 주문할 수 있어요')} last trailing={<Chevron />} />
      </Section>

      {/* recent orders list */}
      <div style={{ padding: '0 20px', marginTop: 14 }}>
        {recentOrders.map((ro) => (
          <div
            key={ro.cafeId}
            onClick={() => onReorder(ro.cafeId)}
            className="cc-press"
            style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 15, padding: 13, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10, boxShadow: '0 1px 3px var(--cc-shadow)' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, flex: 'none', overflow: 'hidden', background: ro.logo ? '#fff' : ro.color, color: ro.fg, border: ro.logo ? '1px solid var(--cc-line)' : 'none' }}>
              {ro.logo ? <img src={ro.logo} alt={ro.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ro.initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-ink)' }}>{ro.name}</div>
              <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 2 }}>{ro.summary} · {ro.date}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-green)', background: 'var(--cc-green-soft)', padding: '6px 11px', borderRadius: 9 }}>재주문</div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <Section title="Notifications">
        <Row icon="🔔" title="주문 완료 알림" subtitle="주문이 완료되면 알려드려요" trailing={<Toggle on={notifyOrder} onChange={() => setNotifyOrder((v) => !v)} label="주문 완료 알림" />} />
        <Row icon="📢" title="업데이트 알림" subtitle="새 기능 소식을 받아요" last trailing={<Toggle on={notifyUpdate} onChange={() => setNotifyUpdate((v) => !v)} label="업데이트 알림" />} />
      </Section>

      {/* Support */}
      <Section title="Support">
        <Row icon="⭐" title="앱 평가하기" onClick={() => flash('스토어 연결은 준비 중이에요')} trailing={<Chevron />} />
        <Row icon="✉️" title="문의하기" onClick={() => flash('문의 기능은 준비 중이에요')} trailing={<Chevron />} />
        <Row icon="📄" title="개인정보 처리방침" onClick={() => flash('곧 제공할 예정이에요')} trailing={<Chevron />} />
        <Row icon="📃" title="이용약관" onClick={() => flash('곧 제공할 예정이에요')} last trailing={<Chevron />} />
      </Section>

      {/* About */}
      <Section title="About">
        <Row icon="📦" title="현재 버전" trailing={<span style={{ fontSize: 14, color: 'var(--cc-ink3)' }}>{APP_VERSION}</span>} />
        <Row icon="ℹ️" title="앱 정보" subtitle="콜커피 · 함께 주문 취합" onClick={() => flash('콜커피 v' + APP_VERSION)} trailing={<Chevron />} />
        <Row icon="👤" title="개발자 정보" subtitle="CallCoffee Team" last onClick={() => flash('CallCoffee Team')} trailing={<Chevron />} />
      </Section>

      {note && (
        <div
          key={note}
          style={{ position: 'fixed', left: '50%', bottom: 100, zIndex: 60, background: 'var(--cc-green-deep)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 18px', borderRadius: 12, boxShadow: '0 10px 28px var(--cc-shadow-strong)', whiteSpace: 'nowrap', animation: 'cc-toast 2.2s ease forwards' }}
        >
          {note}
        </div>
      )}
    </div>
  )
}
