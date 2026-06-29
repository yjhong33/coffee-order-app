import { CloseIcon, MicIcon, CheckIcon, MinusIcon } from '../icons'

export default function VoiceOverlay({ phase, transcript, orders, onUpdateOrder, onRemoveOrder, onClose, onFinishListening, onApprove, onRetry, supported, error }) {
  const listening = phase === 'listening'
  const done = phase === 'done'
  const failed = phase === 'failed'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(18,14,8,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', animation: 'cc-fade .2s ease' }}>
      <div style={{ width: '100%', maxHeight: '88vh', overflowY: 'auto', background: 'var(--cc-cream)', borderRadius: '24px 24px 0 0', padding: '22px 20px calc(24px + env(safe-area-inset-bottom))', animation: 'cc-sheet .28s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--cc-line)', margin: '0 auto 18px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.4px' }}>음성으로 주문 받기</div>
          <div onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon />
          </div>
        </div>

        {!supported && (
          <div style={{ marginTop: 16, textAlign: 'center', padding: '24px 10px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-ink2)' }}>이 브라우저는 음성 인식을 지원하지 않아요</div>
            <div style={{ fontSize: 13, color: 'var(--cc-ink3)', marginTop: 8 }}>Chrome 브라우저에서 다시 시도해 주세요</div>
          </div>
        )}

        {supported && listening && (
          <div style={{ background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 18, padding: '22px 18px', marginTop: 16, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--cc-green)', opacity: 0.25, animation: 'cc-ping 1.6s ease-out infinite' }}></span>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--cc-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(31,110,80,.35)' }}>
                <MicIcon color="#fff" size={30} />
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 16, color: 'var(--cc-green)' }}>듣고 있어요…</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 10, lineHeight: 1.5, minHeight: 24 }}>
              {transcript}
              <span style={{ color: 'var(--cc-green)', animation: 'cc-blink 1s step-end infinite' }}>|</span>
            </div>
          </div>
        )}

        {supported && failed && (
          <div style={{ background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 18, padding: '22px 18px', marginTop: 16, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-ink2)' }}>{error || '메뉴를 인식하지 못했어요'}</div>
            <div style={{ fontSize: 13, color: 'var(--cc-ink3)', marginTop: 8 }}>"이름 메뉴 · 온도 · 잔 수"를 또렷하게 말씀해 주세요</div>
            <div style={{ fontSize: 12, color: 'var(--cc-ink3)', marginTop: 6 }}>예: "민준 아아 한잔, 서연 돌체라떼 핫"</div>
          </div>
        )}

        {supported && done && orders.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-ink2)', marginBottom: 10 }}>이렇게 인식했어요, 한번에 확인해 주세요</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map((o) => (
                <div key={o.id} style={{ background: 'var(--cc-green-soft)', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'flex-start', gap: 11, textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 7,
                      flex: 'none',
                      marginTop: 2,
                      background: o.temp === 'ICE' ? 'var(--cc-ice-bg)' : 'var(--cc-hot-bg)',
                      color: o.temp === 'ICE' ? 'var(--cc-ice)' : 'var(--cc-hot)',
                    }}
                  >
                    {o.temp}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {o.menu} {o.qty > 1 ? `${o.qty}잔` : ''}
                    </div>
                    <input
                      value={o.name}
                      onChange={(e) => onUpdateOrder(o.id, 'name', e.target.value)}
                      placeholder="이름을 입력하세요"
                      style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 4, border: 'none', borderBottom: '1px solid var(--cc-line)', background: 'transparent', width: '100%', outline: 'none', padding: '2px 0' }}
                    />
                  </div>
                  <div onClick={() => onRemoveOrder(o.id)} style={{ width: 26, height: 26, flex: 'none', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 2 }}>
                    <MinusIcon />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {listening && (
          <>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--cc-ink3)', marginTop: 16 }}>여러 명의 주문을 이어서 말해도 괜찮아요</div>
            <div onClick={onFinishListening} style={{ marginTop: 14, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CheckIcon color="#fff" size={18} />
              다 말했어요, 정리하기
            </div>
          </>
        )}
        {done && orders.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <div onClick={onRetry} style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-band)', color: 'var(--cc-ink2)', cursor: 'pointer' }}>다시 말하기</div>
            <div onClick={onApprove} style={{ flex: 2, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.3)' }}>
              취합에 추가하기{orders.length > 1 ? ` (${orders.length}건)` : ''}
            </div>
          </div>
        )}
        {failed && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <div onClick={onRetry} style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', cursor: 'pointer' }}>다시 말하기</div>
          </div>
        )}
      </div>
    </div>
  )
}
