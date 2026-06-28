import { ChevronLeft, ChevronRight, MapLines } from '../icons'

export default function Map({ cafes, mapPins, onBack, onOpenCafe }) {
  return (
    <div style={{ animation: 'cc-fade .2s ease', height: '100%' }}>
      <div style={{ position: 'relative', height: '62vh', background: 'linear-gradient(160deg,#E5EAE0,#D8E0D2)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 54, left: 20, right: 20, zIndex: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(40,30,15,.12)' }}>
            <ChevronLeft />
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 13, height: 44, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 14, color: 'var(--cc-ink3)', boxShadow: '0 4px 12px rgba(40,30,15,.10)' }}>주변 카페 검색</div>
        </div>
        <MapLines />
        <div style={{ position: 'absolute', left: '52%', top: '46%', transform: 'translate(-50%,-50%)', width: 20, height: 20, borderRadius: '50%', background: '#3B82C4', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,.2)' }}></div>
        <div style={{ position: 'absolute', left: '52%', top: '46%', transform: 'translate(-50%,-50%)', width: 60, height: 60, borderRadius: '50%', background: 'rgba(59,130,196,.18)' }}></div>
        {mapPins.map((pin) => (
          <div key={pin.id} onClick={() => onOpenCafe(pin.id)} style={{ position: 'absolute', left: pin.x, top: pin.y, transform: 'translate(-50%,-100%)', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '14px 14px 14px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,.22)', background: pin.color, color: pin.fg }}>{pin.initial}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>내 주변 카페 {cafes.length}곳</div>
        {cafes.map((cafe) => (
          <div key={cafe.id} onClick={() => onOpenCafe(cafe.id)} style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 15, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, flex: 'none', background: cafe.color, color: cafe.fg }}>{cafe.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{cafe.name}</div>
              <div style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 2 }}>{cafe.dist} · 대기 {cafe.wait}</div>
            </div>
            <ChevronRight color="#C9BFB0" strokeWidth="2.2" />
          </div>
        ))}
      </div>
    </div>
  )
}
