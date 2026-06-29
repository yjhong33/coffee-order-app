import { ChevronLeft, ChevronRight, MicIcon, CaptureIcon, MinusIcon, PlusIcon, CloseIcon, CupIcon, GridIcon } from '../icons'
import { won } from '../data'

export default function Collect({ people, totalQty, totalPrice, memoMode, onBack, onOpenVoice, onOpenCapture, onOpenManual, onChangeQty, onRemoveItem, onFinish }) {
  const hasOrders = people.length > 0

  return (
    <div style={{ padding: '0 0 150px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
            <ChevronLeft />
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>{memoMode ? '메뉴 메모' : '추가 주문'}</div>
        </div>
        {!memoMode && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
              <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
              <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
              <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-band)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginTop: 7 }}>
              <span style={{ color: 'var(--cc-green)' }}>① 메뉴 선택</span>
              <span style={{ color: 'var(--cc-green)' }}>② 메뉴 확인</span>
              <span style={{ color: 'var(--cc-ink3)' }}>③ 공유·주문</span>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '6px 20px 0' }}>
        {memoMode && (
          <div style={{ background: 'var(--cc-green-soft)', borderRadius: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <GridIcon size={20} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cc-green-strong)', lineHeight: 1.45 }}>간단하게 메뉴만 기록해요 — 카페는 나중에 정해도 돼요</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div onClick={onOpenManual} style={{ flex: 1, background: 'var(--cc-green)', borderRadius: 13, padding: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer', boxShadow: '0 6px 14px rgba(31,110,80,.24)' }}>
            <PlusIcon size={18} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>직접 입력</span>
          </div>
          <div onClick={onOpenVoice} style={{ flex: 1, background: 'var(--cc-green-soft)', borderRadius: 13, padding: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer' }}>
            <MicIcon size={18} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cc-green-strong)' }}>음성</span>
          </div>
          <div onClick={onOpenCapture} style={{ flex: 1, background: 'var(--cc-gold-soft)', borderRadius: 13, padding: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer' }}>
            <CaptureIcon size={18} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#9A6F26' }}>캡처</span>
          </div>
        </div>

        {hasOrders ? (
          <div>
            {people.map((p) => {
              const qty = p.items.reduce((a, it) => a + it.qty, 0)
              const avatarText = p.isMe ? '나' : p.name.slice(-2)
              return (
                <div key={p.id} style={{ background: 'var(--cc-card)', border: `1px solid ${p.isMe ? 'var(--cc-green)' : 'var(--cc-line)'}`, borderRadius: 18, padding: 14, marginBottom: 12, animation: 'cc-rise .25s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flex: 'none', background: p.color, color: p.fg }}>{avatarText}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px' }}>{p.name}</div>
                    {p.isMe && <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--cc-green)', background: 'var(--cc-green-soft)', padding: '2px 7px', borderRadius: 6 }}>나</span>}
                    <div style={{ flex: 1 }}></div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-ink3)' }}>{qty}잔</span>
                  </div>
                  {p.items.map((it) => (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid var(--cc-line)' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 7px',
                          borderRadius: 6,
                          flex: 'none',
                          background: it.temp === 'HOT' ? 'var(--cc-hot-bg)' : 'var(--cc-ice-bg)',
                          color: it.temp === 'HOT' ? 'var(--cc-hot)' : 'var(--cc-ice)',
                        }}
                      >
                        {it.temp}
                      </span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, letterSpacing: '-.3px' }}>{it.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cc-band)', borderRadius: 10, padding: 4 }}>
                        <div onClick={() => onChangeQty(p.id, it.id, -1)} style={{ width: 26, height: 26, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <MinusIcon />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, minWidth: 14, textAlign: 'center' }}>{it.qty}</span>
                        <div onClick={() => onChangeQty(p.id, it.id, 1)} style={{ width: 26, height: 26, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <PlusIcon color="#1F6E50" size={16} strokeWidth="2.6" />
                        </div>
                      </div>
                      <div onClick={() => onRemoveItem(p.id, it.id)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}>
                        <CloseIcon color="#C9BFB0" size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--cc-band)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CupIcon color="#C9BFB0" size={36} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 16 }}>아직 기록된 주문이 없어요</div>
            <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 6, lineHeight: 1.5 }}>
              직접 입력·음성·캡처로 메뉴를 기록해 보세요.
            </div>
          </div>
        )}
      </div>

      {hasOrders && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px calc(14px + env(safe-area-inset-bottom))', background: 'linear-gradient(transparent,var(--cc-cream) 24%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 11px' }}>
            <span style={{ fontSize: 13, color: 'var(--cc-ink2)', fontWeight: 600 }}>총 {totalQty}잔</span>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.4px' }}>{won(totalPrice)}</span>
          </div>
          <div onClick={onFinish} style={{ background: 'var(--cc-green)', borderRadius: 15, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 10px 24px rgba(31,110,80,.30)' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>주문하러 가기</span>
            <ChevronRight />
          </div>
        </div>
      )}
    </div>
  )
}
