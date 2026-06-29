import { SearchIcon, PersonIcon, PinIcon, ChevronRight, MicIcon, CaptureIcon, CupIcon, GridIcon } from '../icons'

export default function Home({
  favCafes,
  recentOrders,
  hasOrders,
  totalQty,
  onGoMy,
  onGoCafe,
  onGoCafeSearch,
  onOpenVoice,
  onOpenCapture,
  onGoCollect,
  onOpenCafe,
  onReorder,
  onEnterMemo,
}) {
  return (
    <div style={{ padding: '0 0 96px', animation: 'cc-fade .25s ease' }}>
      <div
        style={{
          padding: '60px 20px 16px',
          background: 'linear-gradient(160deg,#21795A 0%,#1B6249 60%,#185940 100%)',
          borderRadius: '0 0 26px 26px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }}></div>
        <div style={{ position: 'absolute', right: 40, top: 70, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.7)', letterSpacing: '-.2px' }}>반가워요, 오늘도 커피 한 잔 ☕</div>
            <div style={{ fontSize: 25, fontWeight: 700, color: '#fff', letterSpacing: '-.6px', marginTop: 6, lineHeight: 1.28 }}>
              오늘 커피,
              <br />
              한 번에 주문해 볼까요?
            </div>
          </div>
          <div onClick={onGoMy} style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}>
            <PersonIcon />
          </div>
        </div>
        <div onClick={onGoCafeSearch} style={{ marginTop: 18, background: '#fff', borderRadius: 14, height: 48, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', cursor: 'pointer', boxShadow: '0 6px 16px rgba(10,40,28,.18)' }}>
          <SearchIcon />
          <span style={{ fontSize: 16, color: 'var(--cc-ink3)', fontWeight: 500 }}>카페 이름이나 메뉴를 검색해 보세요</span>
        </div>
      </div>

      {hasOrders && (
        <div style={{ padding: '14px 20px 0' }}>
          <div onClick={onGoCollect} style={{ background: 'var(--cc-green-deep)', borderRadius: 18, padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#37C77C', animation: 'cc-ping 1.8s ease-out infinite', opacity: 0.5 }}></span>
              <span style={{ position: 'relative' }}>
                <CupIcon />
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8FE3B6', letterSpacing: '.2px' }}>진행 중인 그룹 주문</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2, letterSpacing: '-.3px' }}>스타벅스 강남R점 · 총 {totalQty}잔</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,.16)', padding: '7px 11px', borderRadius: 9 }}>이어서 정리</div>
          </div>
        </div>
      )}

      <div style={{ padding: '18px 20px 0' }}>
        <div
          onClick={onGoCafe}
          style={{
            background: 'linear-gradient(135deg,#B98B3E,#A9762C)',
            borderRadius: 20,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(150,110,40,.22)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -20, bottom: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.10)' }}></div>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <PinIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-.4px' }}>주변 카페 찾기</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', marginTop: 3, lineHeight: 1.4 }}>카페를 정하고 메뉴까지 골라 주문해요</div>
          </div>
          <ChevronRight />
        </div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ background: '#fff', border: '1.5px solid var(--cc-green)', borderRadius: 18, padding: 16 }}>
          <div onClick={onEnterMemo} style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: 'var(--cc-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <GridIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.3px', color: 'var(--cc-green-strong)' }}>간단하게 주문 메모하기</div>
              <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 4, lineHeight: 1.45 }}>카페 선택 없이 메뉴만 빠르게 기록해요</div>
            </div>
            <ChevronRight color="#1F6E50" size={20} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
            <div
              onClick={onOpenVoice}
              style={{ background: 'var(--cc-green-soft)', borderRadius: 14, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              <MicIcon color="var(--cc-green)" />
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-green)' }}>음성으로</span>
            </div>
            <div
              onClick={onOpenCapture}
              style={{ background: 'var(--cc-gold-soft)', borderRadius: 14, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              <CaptureIcon />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#9A6F26' }}>캡처로</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 20px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.4px' }}>즐겨찾는 카페</div>
          <div onClick={onGoCafe} style={{ fontSize: 14, color: 'var(--cc-ink3)', fontWeight: 600, cursor: 'pointer' }}>
            전체보기
          </div>
        </div>
        <div className="cc-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '14px 20px 4px' }}>
          {favCafes.map((cafe) => {
            const nameParts = cafe.name.split(' ')
            const brand = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : cafe.name
            const branch = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
            return (
              <div key={cafe.id} onClick={() => onOpenCafe(cafe.id)} style={{ flex: 'none', width: 86, textAlign: 'center', cursor: 'pointer' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(40,30,15,.10)',
                    background: cafe.color,
                    color: cafe.fg,
                  }}
                >
                  {cafe.initial}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, letterSpacing: '-.3px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' }}>{brand}</div>
                {branch && <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cc-ink2)', letterSpacing: '-.2px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' }}>{branch}</div>}
                <div style={{ fontSize: 12, color: 'var(--cc-ink3)', marginTop: 2 }}>{cafe.dist}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.4px', marginBottom: 12 }}>최근 주문</div>
        {recentOrders.map((ro) => (
          <div key={ro.cafeId} onClick={() => onReorder(ro.cafeId)} style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', marginBottom: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flex: 'none', background: ro.color, color: ro.fg }}>{ro.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px' }}>{ro.name}</div>
              <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ro.summary}</div>
            </div>
            <div style={{ textAlign: 'right', flex: 'none' }}>
              <div style={{ fontSize: 12, color: 'var(--cc-ink3)' }}>{ro.date}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-green)', marginTop: 6, border: '1px solid var(--cc-green-soft)', background: 'var(--cc-green-soft)', padding: '5px 10px', borderRadius: 9 }}>재주문</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
