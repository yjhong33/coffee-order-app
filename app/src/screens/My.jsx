import { useState } from 'react'
import { PersonIcon } from '../icons'

export default function My({ recentOrders, prefs, prefSel, onSelectPref, onReorder, myName, onChangeMyName }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(myName)

  function startEdit() {
    setDraft(myName)
    setEditing(true)
  }
  function commitEdit() {
    const next = draft.trim()
    if (next) onChangeMyName(next)
    setEditing(false)
  }

  return (
    <div style={{ padding: '54px 0 96px', animation: 'cc-fade .2s ease' }}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-.5px' }}>MY</div>
        <div style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--cc-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <PersonIcon color="#1F6E50" size={28} />
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
                style={{ fontSize: 17, fontWeight: 700, border: 'none', borderBottom: '1.5px solid var(--cc-green)', background: 'transparent', outline: 'none', padding: '0 0 2px', width: '100%' }}
              />
            ) : (
              <div onClick={startEdit} style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                {myName}님
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cc-ink3)' }}>수정</span>
              </div>
            )}
            <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 3 }}>익명 세션 · 지금까지 12번 취합했어요</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>내 취향 설정</div>
        <div style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 18, padding: '6px 16px' }}>
          {prefs.map((pf, pi) => (
            <div key={pf.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: pi === prefs.length - 1 ? 'none' : '1px solid var(--cc-line)' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{pf.label}</span>
              <div style={{ display: 'flex', background: 'var(--cc-band)', borderRadius: 10, padding: 3 }}>
                {pf.opts.map((label, oi) => {
                  const selected = prefSel[pi] === oi
                  return (
                    <div
                      key={label}
                      onClick={() => onSelectPref(pi, oi)}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        padding: '6px 13px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: selected ? '#fff' : 'transparent',
                        color: selected ? 'var(--cc-green)' : 'var(--cc-ink3)',
                        boxShadow: selected ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
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
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>최근 그룹 주문</div>
        {recentOrders.map((ro) => (
          <div key={ro.cafeId} onClick={() => onReorder(ro.cafeId)} style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 15, padding: 13, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, flex: 'none', background: ro.color, color: ro.fg }}>{ro.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{ro.name}</div>
              <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 2 }}>{ro.summary} · {ro.date}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-green)', background: 'var(--cc-green-soft)', padding: '6px 11px', borderRadius: 9 }}>재주문</div>
          </div>
        ))}
      </div>
    </div>
  )
}
