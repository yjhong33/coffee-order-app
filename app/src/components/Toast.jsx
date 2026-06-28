export default function Toast({ message }) {
  if (!message) return null
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 96,
        zIndex: 50,
        background: 'var(--cc-green-deep)',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        padding: '13px 20px',
        borderRadius: 13,
        boxShadow: '0 10px 28px rgba(0,0,0,.25)',
        whiteSpace: 'nowrap',
        animation: 'cc-toast 2.2s ease forwards',
      }}
    >
      {message}
    </div>
  )
}
