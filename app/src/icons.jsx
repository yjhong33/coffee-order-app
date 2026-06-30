export function SearchIcon({ color = '#9A9082', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="m20 20-3.5-3.5"></path>
    </svg>
  )
}

export function PersonIcon({ color = '#fff', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round">
      <circle cx="12" cy="8.5" r="3.6"></circle>
      <path d="M5 19c.7-3.4 3.4-5 7-5s6.3 1.6 7 5"></path>
    </svg>
  )
}

export function PinIcon({ color = '#fff', size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.2-7-10.5A7 7 0 0 1 12 3a7 7 0 0 1 7 7.5C19 15.8 12 21 12 21Z"></path>
      <circle cx="12" cy="10.5" r="2.4"></circle>
    </svg>
  )
}

export function LocateIcon({ color = '#2A2520', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <line x1="12" y1="2" x2="12" y2="5"></line>
      <line x1="12" y1="19" x2="12" y2="22"></line>
      <line x1="2" y1="12" x2="5" y2="12"></line>
      <line x1="19" y1="12" x2="22" y2="12"></line>
    </svg>
  )
}

export function TrashIcon({ color = '#C75450', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
    </svg>
  )
}

export function ChevronRight({ color = '#fff', size = 22, strokeWidth = '2.2' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6"></path>
    </svg>
  )
}

export function ChevronLeft({ color = '#2A2520', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 6-6 6 6 6"></path>
    </svg>
  )
}

export function MicIcon({ color = '#1F6E50', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3"></rect>
      <path d="M6 11a6 6 0 0 0 12 0M12 17v3"></path>
    </svg>
  )
}

export function CaptureIcon({ color = '#B98B3E', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8a2 2 0 0 1 2-2h1.2l1-1.6A1 1 0 0 1 9 4h6a1 1 0 0 1 .8.4L16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path>
      <circle cx="12" cy="12.5" r="3.2"></circle>
    </svg>
  )
}

export function CupIcon({ color = '#fff', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h11l-1 9a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 17ZM9 8V6a3 3 0 0 1 6 0v2"></path>
    </svg>
  )
}

export function DefaultCafeMarker({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#B98B3E"></circle>
      <path d="M19 9c0 1.2-1.4 1.2-1.4 2.5S19 13 19 13" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"></path>
      <path d="M23 9c0 1.2-1.4 1.2-1.4 2.5S23 13 23 13" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"></path>
      <path d="M11 17h17l-1.3 9.3A3 3 0 0 1 23.7 29H16.3a3 3 0 0 1-3-2.7L12 17Z" fill="#fff"></path>
      <path d="M28 18.5h1.6a2.6 2.6 0 0 1 0 5.2H27.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"></path>
    </svg>
  )
}

export function MugIcon({ color = '#fff', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z"></path>
      <path d="M16 10h2.2a2 2 0 0 1 0 4H16"></path>
      <path d="M8 3v2M11 3v2"></path>
    </svg>
  )
}

export function PastryIcon({ color = '#B98B3E', size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z"></path>
      <path d="M16 10h2.2a2 2 0 0 1 0 4H16"></path>
      <path d="M8 3v2M11 3v2"></path>
    </svg>
  )
}

export function PlusIcon({ color = '#fff', size = 20, strokeWidth = '2.4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M12 6v12M6 12h12"></path>
    </svg>
  )
}

export function MinusIcon({ color = '#6E665C', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <path d="M6 12h12"></path>
    </svg>
  )
}

export function CloseIcon({ color = '#9A9082', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18"></path>
    </svg>
  )
}

export function StarIcon({ color = '#B98B3E', size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.9 5.9 19.4 7.4 12.9l-5-4.3 6.6-.6z"></path>
    </svg>
  )
}

export function HeartIcon({ filled, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#B98B3E' : 'none'} stroke={filled ? '#B98B3E' : '#C9BFB0'} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 4.5 14.3 9l4.9.7-3.6 3.5.9 4.9L12 16.8 7.5 18.6l.9-4.9L4.8 9.7 9.7 9z"></path>
    </svg>
  )
}

export function RefreshIcon({ color = '#1F6E50', size = 16, strokeWidth = '2.2' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.6M4 13a8 8 0 0 0 13.7 4.7L20 15.4"></path>
      <path d="M4 4v4.6h4.6M20 20v-4.6h-4.6"></path>
    </svg>
  )
}

export function CheckIcon({ color = '#1F6E50', size = 30, strokeWidth = '2.4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7"></path>
    </svg>
  )
}

export function LinkIcon({ color = '#1F6E50', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6M10 8.5 8 8.5a3.5 3.5 0 0 0 0 7h2M14 8.5h2a3.5 3.5 0 0 1 0 7h-2"></path>
    </svg>
  )
}

export function KakaoIcon({ color = '#3C1E1E', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 4C7 4 3 7.1 3 10.9c0 2.4 1.7 4.6 4.2 5.8-.2.6-.7 2.4-.8 2.8 0 0 0 .2.1.3h.3c.4-.1 2.7-1.8 3.4-2.3.5.1 1.1.1 1.8.1 5 0 9-3.1 9-6.9S17 4 12 4Z"></path>
    </svg>
  )
}

export function GridIcon({ color = '#1F6E50', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1"></rect>
      <rect x="13" y="4" width="7" height="7" rx="1"></rect>
      <rect x="4" y="13" width="7" height="7" rx="1"></rect>
      <rect x="13" y="13" width="7" height="7" rx="1"></rect>
    </svg>
  )
}

export function CameraIcon({ color = '#6E665C', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8a2 2 0 0 1 2-2h1.2l1-1.6A1 1 0 0 1 9 4h6a1 1 0 0 1 .8.4L16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path>
      <circle cx="12" cy="12.5" r="3.2"></circle>
    </svg>
  )
}

export function GalleryIcon({ color = '#fff', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="2.4"></rect>
      <path d="m4 15 4-4 3.5 3.5L16 9l4 4"></path>
      <circle cx="9" cy="9.5" r="1.4"></circle>
    </svg>
  )
}

export function SpinnerIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ animation: 'cc-spin 1s linear infinite' }}>
      <circle cx="32" cy="32" r="27" fill="none" stroke="#E9F1EC" strokeWidth="6"></circle>
      <path d="M32 5a27 27 0 0 1 27 27" fill="none" stroke="#1F6E50" strokeWidth="6" strokeLinecap="round"></path>
    </svg>
  )
}

export function HomeTabIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11.5 12 4l8 7.5"></path>
      <path d="M6 10v9h12v-9"></path>
    </svg>
  )
}

export function MapTabIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2Z"></path>
      <path d="M9 4v14M15 6v14"></path>
    </svg>
  )
}

export function HistoryTabIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8"></circle>
      <path d="M12 9v4l3 2"></path>
      <path d="M9 2h6"></path>
    </svg>
  )
}

export function QrSample() {
  return (
    <svg width="118" height="118" viewBox="0 0 118 118" shapeRendering="crispEdges">
      <rect width="118" height="118" fill="#fff"></rect>
      <g fill="#1F1A14">
        <rect x="6" y="6" width="34" height="34"></rect>
        <rect x="78" y="6" width="34" height="34"></rect>
        <rect x="6" y="78" width="34" height="34"></rect>
      </g>
      <g fill="#fff">
        <rect x="12" y="12" width="22" height="22"></rect>
        <rect x="84" y="12" width="22" height="22"></rect>
        <rect x="12" y="84" width="22" height="22"></rect>
      </g>
      <g fill="#1F1A14">
        <rect x="18" y="18" width="10" height="10"></rect>
        <rect x="90" y="18" width="10" height="10"></rect>
        <rect x="18" y="90" width="10" height="10"></rect>
      </g>
      <g fill="#1F6E50">
        <rect x="50" y="6" width="8" height="8"></rect>
        <rect x="62" y="14" width="8" height="8"></rect>
        <rect x="50" y="26" width="8" height="8"></rect>
        <rect x="74" y="50" width="8" height="8"></rect>
        <rect x="50" y="50" width="8" height="8"></rect>
        <rect x="62" y="62" width="8" height="8"></rect>
        <rect x="86" y="62" width="8" height="8"></rect>
        <rect x="50" y="74" width="8" height="8"></rect>
        <rect x="98" y="74" width="8" height="8"></rect>
        <rect x="62" y="86" width="8" height="8"></rect>
        <rect x="86" y="86" width="8" height="8"></rect>
        <rect x="50" y="98" width="8" height="8"></rect>
        <rect x="74" y="98" width="8" height="8"></rect>
        <rect x="98" y="98" width="8" height="8"></rect>
      </g>
    </svg>
  )
}

export function MapLines() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
      <g stroke="#C7CFBE" strokeWidth="2" fill="none">
        <path d="M-20 120 L260 60 L520 180"></path>
        <path d="M60 -20 L120 300 L80 540"></path>
        <path d="M-20 360 L300 320 L520 400"></path>
        <path d="M300 -20 L360 280 L320 540"></path>
      </g>
    </svg>
  )
}
