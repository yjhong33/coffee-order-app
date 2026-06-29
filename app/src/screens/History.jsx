import { useState } from 'react'
import { ChevronLeft, CupIcon, GridIcon, TrashIcon, CloseIcon } from '../icons'
import { buildNamedFor, buildPlainFor, computeTotals } from '../selectors'

function relTime(ts) {
  const now = Date.now()
  const d = now - ts
  const day = 86400000
  const dt = new Date(ts)
  const time = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
  if (d < 60000) return `방금 전 · ${time}`
  const sameDay = dt.toDateString() === new Date().toDateString()
  if (sameDay) return `오늘 ${time}`
  if (d < 2 * day) return `어제 ${time}`
  return `${Math.floor(d / day)}일 전 · ${time}`
}

export default function History({ history, expandedHistory, onToggle, historyView, onSetView, onCopy, onDelete, onBack }) {
  const hasHistory = history.length > 0
  const [confirmId, setConfirmId] = useState(null)

  return (
    <div style={{ padding: '0 0 96px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
              <ChevronLeft />
            </div>
          )}
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.4px' }}>주문 내역</div>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--cc-ink2)', marginTop: 8, lineHeight: 1.5 }}>
          언제 무엇을 주문했는지 모아봤어요. 카드를 누르면 매장에 전달할 양식을 다시 볼 수 있어요.
        </div>
      </div>

      <div style={{ padding: '6px 20px 0' }}>
        {hasHistory ? (
          history.map((h) => {
            const { totalQty } = computeTotals(h.people)
            const expanded = expandedHistory === h.id
            const view = historyView[h.id] || 'named'
            const named = view === 'named'
            const first = h.people[0]?.items[0]?.name || '주문'
            const summary = first + (totalQty > 1 ? ` 외 ${totalQty - 1}잔` : '')
            return (
              <div
                key={h.id}
                style={{
                  background: h.justNow ? 'var(--cc-green-soft)' : 'var(--cc-card)',
                  border: `1px solid ${h.justNow ? 'var(--cc-green)' : 'var(--cc-line)'}`,
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <div onClick={() => onToggle(h.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flex: 'none', overflow: 'hidden', background: h.logo ? '#fff' : h.color, color: h.fg, border: h.logo ? '1px solid var(--cc-line)' : 'none' }}>
                    {h.logo ? <img src={h.logo} alt={h.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : h.initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px' }}>{h.label}</span>
                      {h.justNow && <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--cc-green)', background: 'var(--cc-green-soft)', padding: '2px 6px', borderRadius: 6, flex: 'none' }}>방금 주문</span>}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{summary}</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    <div style={{ fontSize: 12, color: 'var(--cc-ink3)' }}>{relTime(h.ts)}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-ink3)', marginTop: 4 }}>{totalQty}잔</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmId(h.id)
                    }}
                    style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
                  >
                    <TrashIcon size={16} />
                  </div>
                </div>

                {confirmId === h.id && (
                  <div
                    style={{
                      marginTop: 12,
                      background: 'var(--cc-hot-bg)',
                      borderRadius: 12,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--cc-hot)' }}>이 주문 내역을 삭제할까요?</span>
                    <div
                      onClick={() => setConfirmId(null)}
                      style={{ width: 30, height: 30, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
                    >
                      <CloseIcon size={15} color="var(--cc-ink3)" />
                    </div>
                    <div
                      onClick={() => {
                        setConfirmId(null)
                        onDelete(h.id)
                      }}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#fff',
                        background: 'var(--cc-hot)',
                        padding: '8px 14px',
                        borderRadius: 9,
                        cursor: 'pointer',
                        flex: 'none',
                      }}
                    >
                      삭제
                    </div>
                  </div>
                )}

                {expanded && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', background: 'var(--cc-band)', borderRadius: 11, padding: 4 }}>
                      <div
                        onClick={() => onSetView(h.id, 'named')}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                          padding: 8,
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: named ? '#fff' : 'transparent',
                          color: named ? 'var(--cc-green)' : 'var(--cc-ink3)',
                          boxShadow: named ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                        }}
                      >
                        이름 포함
                      </div>
                      <div
                        onClick={() => onSetView(h.id, 'plain')}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                          padding: 8,
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: !named ? '#fff' : 'transparent',
                          color: !named ? 'var(--cc-green)' : 'var(--cc-ink3)',
                          boxShadow: !named ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                        }}
                      >
                        직원 전달용
                      </div>
                    </div>
                    <div style={{ marginTop: 10, background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 14, padding: 14, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6 }}>
                      {named ? buildNamedFor(h.people) : buildPlainFor(h.people)}
                    </div>
                    <div onClick={() => onCopy(h)} style={{ marginTop: 10, background: 'var(--cc-band)', borderRadius: 12, padding: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer' }}>
                      <GridIcon size={16} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-ink2)' }}>양식 복사하기</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--cc-band)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CupIcon color="#C9BFB0" size={36} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 16 }}>아직 주문 내역이 없어요</div>
            <div style={{ fontSize: 14, color: 'var(--cc-ink2)', marginTop: 6, lineHeight: 1.5 }}>
              주문을 완료하면 여기에 기록돼요.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
