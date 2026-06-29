import { ChevronLeft, CupIcon, GridIcon } from '../icons'
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

export default function History({ history, expandedHistory, onToggle, historyView, onSetView, onCopy, onBack }) {
  const hasHistory = history.length > 0

  return (
    <div style={{ padding: '0 0 96px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
              <ChevronLeft />
            </div>
          )}
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>주문 내역</div>
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
                  <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, flex: 'none', background: h.color, color: h.fg }}>{h.initial}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.3px' }}>{h.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{summary}</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    <div style={{ fontSize: 11, color: 'var(--cc-ink3)' }}>{relTime(h.ts)}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-ink3)', marginTop: 4 }}>{totalQty}잔</div>
                  </div>
                </div>

                {expanded && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', background: 'var(--cc-band)', borderRadius: 11, padding: 4 }}>
                      <div
                        onClick={() => onSetView(h.id, 'named')}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          padding: 8,
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: named ? '#fff' : 'transparent',
                          color: named ? 'var(--cc-green)' : 'var(--cc-ink3)',
                          boxShadow: named ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                        }}
                      >
                        이름별로
                      </div>
                      <div
                        onClick={() => onSetView(h.id, 'plain')}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          padding: 8,
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: !named ? '#fff' : 'transparent',
                          color: !named ? 'var(--cc-green)' : 'var(--cc-ink3)',
                          boxShadow: !named ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                        }}
                      >
                        메뉴만
                      </div>
                    </div>
                    <div style={{ marginTop: 10, background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 14, padding: 14, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6 }}>
                      {named ? buildNamedFor(h.people) : buildPlainFor(h.people)}
                    </div>
                    <div onClick={() => onCopy(h)} style={{ marginTop: 10, background: 'var(--cc-band)', borderRadius: 12, padding: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer' }}>
                      <GridIcon size={16} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-ink2)' }}>양식 복사하기</span>
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
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 16 }}>아직 주문 내역이 없어요</div>
            <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 6, lineHeight: 1.5 }}>
              주문을 완료하면 여기에 기록돼요.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
