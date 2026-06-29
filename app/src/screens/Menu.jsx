import { ChevronLeft, PastryIcon, PlusIcon, CupIcon, SearchIcon, MicIcon } from '../icons'
import { won } from '../data'

export default function Menu({ cafe, categories, menuCat, onSelectCat, menus, menuQuery, onMenuQueryChange, menuTemp, onSetTemp, menuNote, onMenuNoteChange, menuSize, onSetSize, sizeOptions, cartCount, cartTotal, onAddCart, onBack, onGoCollect, onOpenVoice }) {
  return (
    <div style={{ padding: '0 0 150px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
            <ChevronLeft />
          </div>
          <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, overflow: 'hidden', background: cafe.logo ? '#fff' : cafe.color, color: cafe.fg, border: cafe.logo ? '1px solid var(--cc-line)' : 'none' }}>
            {cafe.logo ? <img src={cafe.logo} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : cafe.initial}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>{cafe.name}</div>
        </div>
        <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 13, height: 44, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
          <SearchIcon size={18} />
          <input
            value={menuQuery}
            onChange={(e) => onMenuQueryChange(e.target.value)}
            placeholder="메뉴 검색"
            style={{ flex: 1, fontSize: 15, color: 'var(--cc-ink)', border: 'none', outline: 'none', background: 'transparent' }}
          />
        </div>
        <div onClick={onOpenVoice} style={{ marginTop: 12, background: 'var(--cc-green-soft)', borderRadius: 13, height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 0 14px', cursor: 'pointer' }}>
          <MicIcon color="var(--cc-green)" size={18} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cc-green)' }}>말로도 주문할 수 있어요 — “아이스 아메리카노요”</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', background: 'var(--cc-green)', padding: '8px 12px', borderRadius: 9, flex: 'none' }}>음성</span>
        </div>
        <div className="cc-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 0 12px' }}>
          {categories.map((label, i) => (
            <div
              key={label}
              onClick={() => onSelectCat(i)}
              style={{
                flex: 'none',
                fontSize: 14,
                fontWeight: 700,
                padding: '8px 15px',
                borderRadius: 20,
                cursor: 'pointer',
                background: menuCat === i ? 'var(--cc-green)' : 'var(--cc-band)',
                color: menuCat === i ? '#fff' : 'var(--cc-ink2)',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '4px 20px 0' }}>
        {menus.map((m) => {
          const temp = menuTemp[m.id] || 'ICE'
          const hot = temp === 'HOT'
          const ice = temp === 'ICE'
          const sizeNamed = sizeOptions?.type === 'named'
          const sizeTempBased = sizeOptions?.type === 'temperature_based'
          const currentSize = sizeNamed ? menuSize?.[m.id] || sizeOptions.default : null
          return (
            <div key={m.id} style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 18, padding: 14, display: 'flex', gap: 13, marginBottom: 12 }}>
              <div style={{ width: 74, height: 74, borderRadius: 14, flex: 'none', background: 'linear-gradient(150deg,#F3ECDD,#E7DCC4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PastryIcon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.3px' }}>{m.name}</span>
                  {m.popular && <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--cc-hot)', background: 'var(--cc-hot-bg)', padding: '2px 6px', borderRadius: 6 }}>인기</span>}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, letterSpacing: '-.3px' }}>{won(m.price)}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div
                      onClick={() => onSetTemp(m.id, 'HOT')}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        padding: '6px 12px',
                        borderRadius: 9,
                        cursor: 'pointer',
                        background: hot ? 'var(--cc-hot-bg)' : '#fff',
                        color: hot ? 'var(--cc-hot)' : '#A89E90',
                        border: `1px solid ${hot ? 'var(--cc-hot)' : 'var(--cc-line)'}`,
                      }}
                    >
                      HOT
                    </div>
                    <div
                      onClick={() => onSetTemp(m.id, 'ICE')}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        padding: '6px 12px',
                        borderRadius: 9,
                        cursor: 'pointer',
                        background: ice ? 'var(--cc-ice-bg)' : '#fff',
                        color: ice ? 'var(--cc-ice)' : '#A89E90',
                        border: `1px solid ${ice ? 'var(--cc-ice)' : 'var(--cc-line)'}`,
                      }}
                    >
                      ICE
                    </div>
                  </div>
                  <div onClick={() => onAddCart(m, temp)} style={{ width: 34, height: 34, borderRadius: 11, background: 'var(--cc-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(31,110,80,.28)' }}>
                    <PlusIcon />
                  </div>
                </div>
                {sizeNamed && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {sizeOptions.options.map((s) => (
                      <div
                        key={s}
                        onClick={() => onSetSize(m.id, s)}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '5px 10px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: currentSize === s ? 'var(--cc-green-soft)' : '#fff',
                          color: currentSize === s ? 'var(--cc-green)' : '#A89E90',
                          border: `1px solid ${currentSize === s ? 'var(--cc-green)' : 'var(--cc-line)'}`,
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
                {sizeTempBased && (
                  <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: 'var(--cc-ink3)' }}>{hot ? sizeOptions.options.HOT : sizeOptions.options.ICE}</div>
                )}
                <input
                  value={menuNote?.[m.id] || ''}
                  onChange={(e) => onMenuNoteChange(m.id, e.target.value)}
                  placeholder="+ 메모 추가 (예: 샷 추가, 휘핑 없이)"
                  style={{
                    marginTop: 8,
                    width: '100%',
                    fontSize: 13,
                    color: menuNote?.[m.id] ? 'var(--cc-gold)' : 'var(--cc-ink3)',
                    background: 'transparent',
                    border: 'none',
                    borderTop: '1px solid var(--cc-line)',
                    outline: 'none',
                    padding: '7px 0 0',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px calc(14px + env(safe-area-inset-bottom))', background: 'linear-gradient(transparent,var(--cc-cream) 22%)' }}>
        <div onClick={onGoCollect} style={{ background: 'var(--cc-green)', borderRadius: 15, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', cursor: 'pointer', boxShadow: '0 10px 24px rgba(31,110,80,.30)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ position: 'relative', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CupIcon size={24} />
              <span style={{ position: 'absolute', top: -6, right: -7, minWidth: 18, height: 18, borderRadius: 9, background: 'var(--cc-gold)', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{cartCount}</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>메뉴 확인하기</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{won(cartTotal)}</span>
        </div>
      </div>
    </div>
  )
}
