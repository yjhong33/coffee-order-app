import { ChevronLeft, CheckIcon, GridIcon } from '../icons'

export default function Complete({ completeView, onSetView, completeText, totalQty, onCopy, onBack, onComplete }) {
  const named = completeView === 'named'
  const hint = named ? '누가 무엇을 시켰는지 한눈에 보여요' : '이름을 빼고 메뉴·수량만 — 매장 직원에게 그대로 전달하세요'

  return (
    <div style={{ padding: '0 0 40px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
            <ChevronLeft />
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>주문 완료</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginTop: 7 }}>
          <span style={{ color: 'var(--cc-green)' }}>① 메뉴 선택</span>
          <span style={{ color: 'var(--cc-green)' }}>② 메뉴 확인</span>
          <span style={{ color: 'var(--cc-green)' }}>③ 공유·주문</span>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ background: 'var(--cc-green-soft)', borderRadius: 14, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cc-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <CheckIcon color="#fff" size={18} strokeWidth="2.4" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-green-strong)' }}>총 {totalQty}잔, 정리 끝!</div>
            <div style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 2 }}>아래 양식을 복사해 공유하세요</div>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'var(--cc-band)', borderRadius: 11, padding: 4, marginTop: 16 }}>
          <div
            onClick={() => onSetView('named')}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 700,
              padding: 9,
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
            onClick={() => onSetView('plain')}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 700,
              padding: 9,
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
        <div style={{ fontSize: 12, color: 'var(--cc-ink3)', marginTop: 8, lineHeight: 1.4 }}>{hint}</div>

        <div style={{ marginTop: 14, background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 16, padding: 16, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6, letterSpacing: '-.2px' }}>{completeText}</div>

        <div onClick={onCopy} style={{ marginTop: 14, background: '#fff', border: '1.5px solid var(--cc-green)', borderRadius: 14, padding: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          <GridIcon size={18} color="#1F6E50" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-green)' }}>이 양식 복사하기</span>
        </div>

        <div onClick={onComplete} style={{ marginTop: 18, background: 'var(--cc-green-deep)', borderRadius: 15, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 24px rgba(31,110,80,.30)' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>주문을 완료할게요~</span>
        </div>
      </div>
    </div>
  )
}
