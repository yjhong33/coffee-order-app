import { CloseIcon, CheckIcon, MinusIcon, MicIcon, CaptureIcon } from '../icons'

export default function SmartMemoOverlay({
  text,
  onTextChange,
  parsed,
  orders,
  onParse,
  onUpdateOrder,
  onRemoveOrder,
  onApprove,
  onReset,
  onClose,
  onOpenVoice,
  onOpenCapture,
}) {
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
              생각나는 대로 편하게 적어보세요. 이름·메뉴·온도·잔 수를 알아서 정리해 드려요.
            </div>
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={'예) 나 아아 톨, 민준이 따뜻한 바닐라라떼\n서연이는 자몽에이드 두 잔, 지후 돌체라떼'}
              rows={5}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map((o) => (
                <div key={o.id} style={{ background: 'var(--cc-green-soft)', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'flex-start', gap: 11, textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: 12,
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
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {o.menu} {o.qty > 1 ? `${o.qty}잔` : ''}
                    </div>
                    <input
                      value={o.name}
                      onChange={(e) => onUpdateOrder(o.id, 'name', e.target.value)}
                      placeholder="이름을 입력하세요"
                      style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 4, border: 'none', borderBottom: '1px solid var(--cc-line)', background: 'transparent', width: '100%', outline: 'none', padding: '2px 0' }}
                    />
                  </div>
                  <div onClick={() => onRemoveOrder(o.id)} style={{ width: 26, height: 26, flex: 'none', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 2 }}>
                    <MinusIcon />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <div onClick={onReset} style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-band)', color: 'var(--cc-ink2)', cursor: 'pointer' }}>다시 적기</div>
              <div onClick={onApprove} style={{ flex: 2, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.3)' }}>
                취합에 추가하기{orders.length > 1 ? ` (${orders.length}건)` : ''}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
