import { ChevronLeft, SearchIcon, StarIcon, HeartIcon } from '../icons'

export default function CafeSelect({ cafes, favs, cafeQuery, onCafeQueryChange, onBack, onGoMap, onOpenCafe, onToggleFav }) {
  return (
    <div style={{ padding: '0 0 40px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
            <ChevronLeft />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.4px' }}>카페 선택</div>
        </div>
        <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 13, height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
          <SearchIcon size={19} />
          <input
            value={cafeQuery}
            onChange={(e) => onCafeQueryChange(e.target.value)}
            placeholder="카페 검색"
            style={{ flex: 1, fontSize: 15, color: 'var(--cc-ink)', border: 'none', outline: 'none', background: 'transparent' }}
          />
        </div>
      </div>
      <div style={{ padding: '6px 20px 0' }}>
        {cafes.map((cafe) => {
          const isFav = !!favs[cafe.id]
          return (
            <div key={cafe.id} onClick={() => onOpenCafe(cafe.id)} style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', marginBottom: 11 }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 800, flex: 'none', overflow: 'hidden', background: cafe.logo ? '#fff' : cafe.color, color: cafe.fg, border: cafe.logo ? '1px solid var(--cc-line)' : 'none' }}>
                {cafe.logo ? <img src={cafe.logo} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : cafe.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.3px' }}>{cafe.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, fontSize: 13, color: 'var(--cc-ink2)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--cc-gold)', fontWeight: 700 }}>
                    <StarIcon />
                    {cafe.rating}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--cc-line)' }}></span>
                  <span>{cafe.dist}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--cc-line)' }}></span>
                  <span style={{ color: 'var(--cc-green)', fontWeight: 600 }}>대기 {cafe.wait}</span>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFav(cafe.id)
                }}
                style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
              >
                <HeartIcon filled={isFav} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
