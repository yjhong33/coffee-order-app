import { SpinnerIcon } from '../icons'

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
        gap: 16,
        background: 'var(--cc-cream)',
      }}
    >
      <SpinnerIcon />
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-ink2)', letterSpacing: '-.3px' }}>CALLCOFFEE</div>
    </div>
  )
}
