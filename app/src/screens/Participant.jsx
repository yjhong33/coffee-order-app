import { ChevronLeft } from '../icons'

export default function Participant({ pName, onNameChange, pMenu, onMenuChange, pTemp, onSetTemp, onRegister, onBack }) {
  const hot = pTemp === 'HOT'
  const ice = pTemp === 'ICE'

  return (
    <div style={{ padding: '0 0 40px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
            <ChevronLeft />
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>참여자 등록</div>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontSize: 13, color: 'var(--cc-ink2)', lineHeight: 1.5, marginBottom: 14 }}>이름과 메뉴를 입력하면 그룹 주문에 바로 등록돼요.</div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 7 }}>이름</div>
          <input
            value={pName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="이름을 입력하세요"
            style={{ width: '100%', height: 46, borderRadius: 13, border: '1px solid var(--cc-line)', background: '#fff', padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 7 }}>메뉴</div>
          <input
            value={pMenu}
            onChange={(e) => onMenuChange(e.target.value)}
            placeholder="메뉴를 입력하세요"
            style={{ width: '100%', height: 46, borderRadius: 13, border: '1px solid var(--cc-line)', background: '#fff', padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 7 }}>온도</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              onClick={() => onSetTemp('HOT')}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 700,
                padding: 12,
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
                padding: 12,
                borderRadius: 11,
                cursor: 'pointer',
                background: ice ? 'var(--cc-ice-bg)' : '#fff',
                color: ice ? 'var(--cc-ice)' : '#A89E90',
                border: `1px solid ${ice ? 'var(--cc-ice)' : 'var(--cc-line)'}`,
              }}
            >
              ICE
            </div>
          </div>
        </div>

        <div onClick={onRegister} style={{ background: 'var(--cc-green)', borderRadius: 15, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 24px rgba(31,110,80,.30)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>등록하기</span>
        </div>
      </div>
    </div>
  )
}
