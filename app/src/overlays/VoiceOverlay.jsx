import { CloseIcon, MicIcon, CheckIcon } from '../icons'

export default function VoiceOverlay({ phase, transcript, order, name, onNameChange, onClose, onApprove, onRetry, supported, error }) {
  const listening = phase === 'listening'
  const done = phase === 'done'
  const failed = phase === 'failed'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(18,14,8,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', animation: 'cc-fade .2s ease' }}>
      <div style={{ width: '100%', background: 'var(--cc-cream)', borderRadius: '24px 24px 0 0', padding: '22px 20px calc(24px + env(safe-area-inset-bottom))', animation: 'cc-sheet .28s cubic-bezier(.2,.8,.2,1)' }}>
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

        {supported && (
          <div style={{ background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 18, padding: '22px 18px', marginTop: 16, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            {listening && (
              <>
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
              </>
            )}
            {failed && (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-ink2)' }}>{error || '메뉴를 인식하지 못했어요'}</div>
                <div style={{ fontSize: 13, color: 'var(--cc-ink3)', marginTop: 8 }}>“메뉴 · 온도 · 잔 수”를 또렷하게 말씀해 주세요</div>
              </>
            )}
            {done && order && (
              <>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--cc-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckIcon />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 14, color: 'var(--cc-ink2)' }}>이렇게 인식했어요, 확인해 주세요</div>
                <div style={{ marginTop: 14, width: '100%', background: 'var(--cc-green-soft)', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 7,
                      flex: 'none',
                      background: order.temp === 'ICE' ? 'var(--cc-ice-bg)' : 'var(--cc-hot-bg)',
                      color: order.temp === 'ICE' ? 'var(--cc-ice)' : 'var(--cc-hot)',
                    }}
                  >
                    {order.temp}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {order.name} {order.qty > 1 ? `${order.qty}잔` : ''}
                    </div>
                    <input
                      value={name}
                      onChange={(e) => onNameChange(e.target.value)}
                      placeholder="이름을 입력하세요"
                      style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 4, border: 'none', borderBottom: '1px solid var(--cc-line)', background: 'transparent', width: '100%', outline: 'none', padding: '2px 0' }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {done && order && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <div onClick={onRetry} style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-band)', color: 'var(--cc-ink2)', cursor: 'pointer' }}>다시 말하기</div>
            <div onClick={onApprove} style={{ flex: 2, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.3)' }}>취합에 추가하기</div>
          </div>
        )}
        {failed && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <div onClick={onRetry} style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', cursor: 'pointer' }}>다시 말하기</div>
          </div>
        )}
        {listening && <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--cc-ink3)', marginTop: 16 }}>또렷하게 “메뉴 · 온도 · 잔 수”를 말해 주세요</div>}
      </div>
    </div>
  )
}
