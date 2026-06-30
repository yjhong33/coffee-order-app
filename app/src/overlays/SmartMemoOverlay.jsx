import { CloseIcon, CheckIcon, MinusIcon, PlusIcon, MicIcon, CaptureIcon } from '../icons'

function TempToggle({ order, onUpdateOrder }) {
  if (order.fixedTemp) {
    return (
      <span style={{ fontSize: 12, fontWeight: 800, padding: '5px 9px', borderRadius: 8, flex: 'none', background: 'var(--cc-ice-bg)', color: 'var(--cc-ice)' }}>ICE</span>
    )
  }
  return (
    <div style={{ display: 'flex', gap: 4, flex: 'none', background: '#fff', borderRadius: 9, padding: 3, border: order.needsOption ? '1.5px solid #E0A53C' : '1px solid var(--cc-line)' }}>
      {['ICE', 'HOT'].map((t) => {
        const on = order.temp === t
        return (
          <span
            key={t}
            onClick={() => onUpdateOrder(order.id, 'temp', t)}
            style={{
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 9px',
              borderRadius: 7,
              cursor: 'pointer',
              background: on ? (t === 'ICE' ? 'var(--cc-ice-bg)' : 'var(--cc-hot-bg)') : 'transparent',
              color: on ? (t === 'ICE' ? 'var(--cc-ice)' : 'var(--cc-hot)') : 'var(--cc-ink3)',
            }}
          >
            {t}
          </span>
        )
      })}
    </div>
  )
}

export default function SmartMemoOverlay({
  text,
  onTextChange,
  parsed,
  orders,
  onParse,
  onUpdateOrder,
  onChangeQty,
  onRemoveOrder,
  onApprove,
  onReset,
  onClose,
  onOpenVoice,
  onOpenCapture,
}) {
  const needCount = orders.filter((o) => o.needsOption || !o.temp).length
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(18,14,8,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', animation: 'cc-fade .2s ease' }}>
      <div style={{ width: '100%', maxHeight: '88vh', overflowY: 'auto', background: 'var(--cc-cream)', borderRadius: '24px 24px 0 0', padding: '22px 20px calc(24px + env(safe-area-inset-bottom))', animation: 'cc-sheet .28s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--cc-line)', margin: '0 auto 18px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>✨ 메모하면 정리해드려요</div>
          <div onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon />
          </div>
        </div>

        {!parsed && (
          <>
            <div style={{ fontSize: 13.5, color: 'var(--cc-ink3)', marginTop: 8, lineHeight: 1.5 }}>
              한 줄에 하나씩 편하게 적어보세요. 메뉴·온도·잔 수를 알아서 정리해 드려요. (아아·따아·아샷추 같은 줄임말도 OK)
            </div>
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={'예)\n아아 1\n따아 1\n아샷추 2\n카라멜 마끼아또 2 (아이스)\n아메리카노 1'}
              rows={6}
              style={{
                width: '100%',
                marginTop: 14,
                background: '#fff',
                border: '1px solid var(--cc-line)',
                borderRadius: 16,
                padding: '14px 15px',
                fontSize: 16,
                lineHeight: 1.55,
                color: 'var(--cc-ink)',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <div
              onClick={onParse}
              style={{ marginTop: 14, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <CheckIcon color="#fff" size={18} />
              정리하기
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 4px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--cc-line)' }}></div>
              <div style={{ fontSize: 12.5, color: 'var(--cc-ink3)', fontWeight: 600 }}>또는</div>
              <div style={{ flex: 1, height: 1, background: 'var(--cc-line)' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div onClick={onOpenVoice} style={{ background: 'var(--cc-green-soft)', borderRadius: 14, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <MicIcon color="var(--cc-green)" />
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-green)' }}>음성으로</span>
              </div>
              <div onClick={onOpenCapture} style={{ background: 'var(--cc-gold-soft)', borderRadius: 14, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <CaptureIcon />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#9A6F26' }}>캡처로</span>
              </div>
            </div>
          </>
        )}

        {parsed && (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-ink2)', margin: '16px 0 10px' }}>이렇게 정리했어요, 한번에 확인해 주세요</div>
            {needCount > 0 && (
              <div style={{ fontSize: 13, fontWeight: 700, color: '#9A6F26', background: 'var(--cc-gold-soft)', borderRadius: 11, padding: '10px 12px', marginBottom: 10, lineHeight: 1.45 }}>
                ⚠️ 온도가 정해지지 않은 메뉴 {needCount}개가 있어요. 아이스/핫을 골라주세요.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map((o) => {
                const need = o.needsOption || !o.temp
                return (
                  <div
                    key={o.id}
                    style={{
                      background: need ? '#FFF8EC' : 'var(--cc-green-soft)',
                      border: need ? '1px solid #EAD3A0' : '1px solid transparent',
                      borderRadius: 14,
                      padding: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <TempToggle order={o} onUpdateOrder={onUpdateOrder} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.menu}</div>
                      {need && <div style={{ fontSize: 12, color: '#9A6F26', fontWeight: 600, marginTop: 2 }}>온도 선택 필요</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                      <div onClick={() => onChangeQty(o.id, -1)} style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <MinusIcon />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 800, minWidth: 16, textAlign: 'center' }}>{o.qty}</span>
                      <div onClick={() => onChangeQty(o.id, 1)} style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <PlusIcon color="#1F6E50" size={16} strokeWidth="2.6" />
                      </div>
                    </div>
                    <div onClick={() => onRemoveOrder(o.id)} style={{ width: 24, height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--cc-ink3)', fontSize: 18 }}>×</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <div onClick={onReset} style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-band)', color: 'var(--cc-ink2)', cursor: 'pointer' }}>다시 적기</div>
              <div
                onClick={onApprove}
                style={{ flex: 2, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: needCount > 0 ? 'var(--cc-line)' : 'var(--cc-green)', color: needCount > 0 ? 'var(--cc-ink3)' : '#fff', cursor: 'pointer', boxShadow: needCount > 0 ? 'none' : '0 8px 18px rgba(31,110,80,.3)' }}
              >
                취합에 추가하기{orders.length > 1 ? ` (${orders.length}건)` : ''}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
