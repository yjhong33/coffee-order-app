import { MugIcon } from '../icons'

export default function Loading() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        background: 'linear-gradient(170deg,#21795A 0%,#1B6249 55%,#123F2D 100%)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, animation: 'cc-fade .5s ease' }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MugIcon size={46} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>CallCoffee</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.72)', letterSpacing: '-.2px' }}>커피 주문, 한 번에 모아서</div>
      </div>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '4px solid rgba(255,255,255,.22)', borderTopColor: '#fff', animation: 'cc-spin .9s linear infinite' }}></div>
    </div>
  )
}
