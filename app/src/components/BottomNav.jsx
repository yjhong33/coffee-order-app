import { HomeTabIcon, MapTabIcon, HistoryTabIcon, PersonIcon } from '../icons'

const TABS = [
  { id: 'home', label: '홈', Icon: HomeTabIcon },
  { id: 'map', label: '지도', Icon: MapTabIcon },
  { id: 'history', label: '내역', Icon: HistoryTabIcon },
  { id: 'my', label: 'MY', Icon: PersonIcon },
]

export default function BottomNav({ screen, onGo }) {
  return (
    <div
      style={{
        flex: 'none',
        display: 'flex',
        background: '#fff',
        borderTop: '1px solid var(--cc-line)',
        padding: '8px 8px calc(8px + env(safe-area-inset-bottom))',
        boxShadow: '0 -4px 16px rgba(40,30,15,.04)',
      }}
    >
      {TABS.map((t) => {
        const active = screen === t.id
        const color = active ? 'var(--cc-green)' : '#B6AB9B'
        return (
          <div
            key={t.id}
            onClick={() => onGo(t.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '5px 0', cursor: 'pointer' }}
          >
            <t.Icon color={color} size={24} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color }}>{t.label}</span>
          </div>
        )
      })}
    </div>
  )
}
