import { CloseIcon, MinusIcon, PlusIcon } from '../icons'

export default function ManualAddOverlay({ name, onNameChange, menu, onMenuChange, temp, onSetTemp, qty, onInc, onDec, onClose, onAdd }) {
  const hot = temp === 'HOT'
  const ice = temp === 'ICE'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(18,14,8,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', animation: 'cc-fade .2s ease' }}>
      <div style={{ width: '100%', background: 'var(--cc-cream)', borderRadius: '24px 24px 0 0', padding: '22px 20px calc(24px + env(safe-area-inset-bottom))', animation: 'cc-sheet .28s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--cc-line)', margin: '0 auto 18px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.4px' }}>직접 입력</div>
          <div onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="이름 (선택, 비우면 '손님')"
            style={{ width: '100%', height: 46, borderRadius: 13, border: '1px solid var(--cc-line)', background: '#fff', padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
          />
          <input
            value={menu}
            onChange={(e) => onMenuChange(e.target.value)}
            placeholder="메뉴를 입력하세요"
            style={{ width: '100%', height: 46, borderRadius: 13, border: '1px solid var(--cc-line)', background: '#fff', padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <div
              onClick={() => onSetTemp('HOT')}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 700,
                padding: 11,
                borderRadius: 11,
                cursor: 'pointer',
                background: hot ? 'var(--cc-hot-bg)' : '#fff',
                color: hot ? 'var(--cc-hot)' : '#A89E90',
                border: `1px solid ${hot ? 'var(--cc-hot)' : 'var(--cc-line)'}`,
              }}
            >
              HOT
            </div>
            <div
              onClick={() => onSetTemp('ICE')}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 700,
                padding: 11,
                borderRadius: 11,
                cursor: 'pointer',
                background: ice ? 'var(--cc-ice-bg)' : '#fff',
                color: ice ? 'var(--cc-ice)' : '#A89E90',
                border: `1px solid ${ice ? 'var(--cc-ice)' : 'var(--cc-line)'}`,
              }}
            >
              ICE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cc-band)', borderRadius: 11, padding: 5 }}>
              <div onClick={onDec} style={{ width: 28, height: 28, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <MinusIcon />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, minWidth: 16, textAlign: 'center' }}>{qty}</span>
              <div onClick={onInc} style={{ width: 28, height: 28, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <PlusIcon color="#1F6E50" size={16} strokeWidth="2.6" />
              </div>
            </div>
          </div>
        </div>

        <div onClick={onAdd} style={{ marginTop: 18, background: 'var(--cc-green)', borderRadius: 15, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.3)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>추가하기</span>
        </div>
      </div>
    </div>
  )
}
