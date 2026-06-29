import { ChevronLeft } from '../icons'

export default function Participant({ pName, onNameChange, pMenu, onMenuChange, pTemp, onSetTemp, onRegister, onBack, cafeName, isHost = true, registered = false, error = '' }) {
  const hot = pTemp === 'HOT'
  const ice = pTemp === 'ICE'

  if (error) {
    return (
      <div style={{ padding: '90px 24px', textAlign: 'center', animation: 'cc-fade .2s ease' }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{error}</div>
      </div>
    )
  }

  if (registered) {
    return (
      <div style={{ padding: '90px 24px', textAlign: 'center', animation: 'cc-fade .2s ease' }}>
        <div style={{ fontSize: 40 }}>🎉</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginTop: 14 }}>주문이 등록됐어요</div>
        <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 8, lineHeight: 1.5 }}>
          담당자가 모아서 카페에 전달할 거예요.
          <br />
          이 화면은 그대로 닫아도 괜찮아요.
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 0 40px', animation: 'cc-fade .2s ease' }}>
      <div
        style={{
          padding: '54px 20px 22px',
          background: 'linear-gradient(160deg,#2C6BB0,#1A4FA0)',
          borderRadius: '0 0 22px 22px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isHost && (
            <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
              <ChevronLeft color="#fff" />
            </div>
          )}
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: 'rgba(255,255,255,.18)', padding: '3px 9px', borderRadius: 7, letterSpacing: '.2px' }}>참여자</span>
          <div style={{ flex: 1 }}></div>
          {isHost && <div onClick={onBack} style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.85)', cursor: 'pointer' }}>담당자 시점 →</div>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.75)', marginTop: 14 }}>함께 커피 주문해요 ☕</div>
        <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', marginTop: 4, letterSpacing: '-.4px' }}>{cafeName}</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.8)', marginTop: 6 }}>내 주문만 등록하면 끝이에요</div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
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

        <div onClick={onRegister} style={{ background: '#1A4FA0', borderRadius: 15, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 24px rgba(26,79,160,.30)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>내 주문 등록하기</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--cc-ink3)', textAlign: 'center', marginTop: 10, lineHeight: 1.45 }}>
          등록하면 담당자 화면에 바로 '확인 완료'로 떠요
        </div>
      </div>
    </div>
  )
}
