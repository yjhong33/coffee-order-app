import { CupIcon } from '../icons'

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
        gap: 18,
        background: 'var(--cc-green-deep)',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CupIcon size={40} color="#fff" />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-.5px' }}>CallCoffee</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>커피 주문, 한 번에 모아서</div>
    </div>
  )
}
