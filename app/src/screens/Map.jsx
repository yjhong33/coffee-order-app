import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, MapLines, LocateIcon } from '../icons'
import { loadKakaoMaps } from '../kakaoMap'

export default function Map({ cafes, mapPins, cafeQuery, onQueryChange, onBack, onOpenCafe }) {
  const mapDivRef = useRef(null)
  const mapRef = useRef(null)
  const overlaysRef = useRef([])
  const meOverlayRef = useRef(null)
  const recenteredRef = useRef(false)
  const [mapReady, setMapReady] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState('')
  const [userPos, setUserPos] = useState(null)

  const baseLat = cafes[0]?.lat
  const baseLng = cafes[0]?.lng
  const displayCafes = useMemo(() => {
    if (!userPos || baseLat == null || baseLng == null) return cafes
    return cafes.map((cafe) =>
      cafe.lat == null || cafe.lng == null
        ? cafe
        : { ...cafe, lat: userPos.lat + (cafe.lat - baseLat), lng: userPos.lng + (cafe.lng - baseLng) },
    )
  }, [cafes, userPos, baseLat, baseLng])

  useEffect(() => {
    let cancelled = false
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !mapDivRef.current) return
        const center = new kakao.maps.LatLng(cafes[0]?.lat || 37.4979, cafes[0]?.lng || 127.0276)
        mapRef.current = new kakao.maps.Map(mapDivRef.current, { center, level: 4 })
        setMapReady(true)
      })
      .catch(() => {
        if (!cancelled) setMapFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // auto-detect the user's real position so the demo cafe cluster relocates near them
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [])

  useEffect(() => {
    if (!mapReady || !userPos || !mapRef.current || recenteredRef.current) return
    const kakao = window.kakao
    mapRef.current.setCenter(new kakao.maps.LatLng(userPos.lat, userPos.lng))
    recenteredRef.current = true
  }, [mapReady, userPos])

  useEffect(() => {
    if (!mapReady || !window.kakao || !mapRef.current) return
    const kakao = window.kakao
    overlaysRef.current.forEach((ov) => ov.setMap(null))
    overlaysRef.current = []
    displayCafes.forEach((cafe) => {
      if (cafe.lat == null || cafe.lng == null) return
      const position = new kakao.maps.LatLng(cafe.lat, cafe.lng)
      const el = document.createElement('div')
      el.style.cssText =
        'width:40px;height:40px;border-radius:14px 14px 14px 4px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.22);cursor:pointer;'
      el.style.background = cafe.logo ? '#fff' : cafe.color
      el.style.color = cafe.fg
      if (cafe.logo) {
        const img = document.createElement('img')
        img.src = cafe.logo
        img.alt = cafe.name
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;'
        el.appendChild(img)
      } else {
        el.textContent = cafe.initial
      }
      el.onclick = () => onOpenCafe(cafe.id)
      const overlay = new kakao.maps.CustomOverlay({ position, content: el, yAnchor: 1 })
      overlay.setMap(mapRef.current)
      overlaysRef.current.push(overlay)
    })
  }, [mapReady, displayCafes, onOpenCafe])

  function locateMe() {
    if (mapFailed) {
      setLocateError('데모 지도에서는 현재 위치를 표시할 수 없어요')
      setTimeout(() => setLocateError(''), 2000)
      return
    }
    if (!navigator.geolocation) {
      setLocateError('이 브라우저는 위치 정보를 지원하지 않아요')
      setTimeout(() => setLocateError(''), 2000)
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const kakao = window.kakao
        if (!kakao || !mapRef.current) return
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        const position = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
        mapRef.current.panTo(position)
        if (meOverlayRef.current) meOverlayRef.current.setMap(null)
        const el = document.createElement('div')
        el.style.cssText =
          'width:20px;height:20px;border-radius:50%;background:#3B82C4;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);'
        const overlay = new kakao.maps.CustomOverlay({ position, content: el, yAnchor: 0.5, zIndex: 10 })
        overlay.setMap(mapRef.current)
        meOverlayRef.current = overlay
      },
      () => {
        setLocating(false)
        setLocateError('위치 권한을 확인해주세요')
        setTimeout(() => setLocateError(''), 2000)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const showFallback = mapFailed

  return (
    <div style={{ animation: 'cc-fade .2s ease', height: '100%' }}>
      <div style={{ position: 'relative', height: '62vh', background: 'linear-gradient(160deg,#E5EAE0,#D8E0D2)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 54, left: 20, right: 20, zIndex: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(40,30,15,.12)' }}>
            <ChevronLeft />
          </div>
          <input
            value={cafeQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="주변 카페 검색"
            style={{ flex: 1, background: '#fff', border: 'none', outline: 'none', borderRadius: 13, height: 44, padding: '0 14px', fontSize: 15, color: 'var(--cc-ink)', boxShadow: '0 4px 12px rgba(40,30,15,.10)' }}
          />
        </div>

        {!showFallback && <div ref={mapDivRef} style={{ position: 'absolute', inset: 0 }}></div>}

        <div
          onClick={locateMe}
          style={{
            position: 'absolute',
            right: 16,
            bottom: showFallback ? 50 : 16,
            zIndex: 3,
            width: 44,
            height: 44,
            borderRadius: 13,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(40,30,15,.18)',
            opacity: locating ? 0.6 : 1,
          }}
        >
          <LocateIcon />
        </div>

        {locateError && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: showFallback ? 100 : 70,
              transform: 'translateX(-50%)',
              zIndex: 4,
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              background: 'rgba(40,30,15,.85)',
              padding: '8px 14px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {locateError}
          </div>
        )}

        {showFallback && (
          <>
            <MapLines />
            <div style={{ position: 'absolute', left: '52%', top: '46%', transform: 'translate(-50%,-50%)', width: 20, height: 20, borderRadius: '50%', background: '#3B82C4', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,.2)' }}></div>
            <div style={{ position: 'absolute', left: '52%', top: '46%', transform: 'translate(-50%,-50%)', width: 60, height: 60, borderRadius: '50%', background: 'rgba(59,130,196,.18)' }}></div>
            {mapPins.map((pin) => (
              <div key={pin.id} onClick={() => onOpenCafe(pin.id)} style={{ position: 'absolute', left: pin.x, top: pin.y, transform: 'translate(-50%,-100%)', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '14px 14px 14px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,.22)', background: pin.logo ? '#fff' : pin.color, color: pin.fg }}>
                  {pin.logo ? <img src={pin.logo} alt={pin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : pin.initial}
                </div>
              </div>
            ))}
            <div style={{ position: 'absolute', left: 12, bottom: 12, fontSize: 11, fontWeight: 600, color: 'var(--cc-ink3)', background: 'rgba(255,255,255,.85)', padding: '4px 8px', borderRadius: 8 }}>
              데모 지도 (카카오맵 키 미설정)
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>내 주변 카페 {cafes.length}곳</div>
        {cafes.length === 0 && (
          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--cc-ink3)', padding: '24px 0' }}>검색 결과가 없어요</div>
        )}
        {cafes.map((cafe) => (
          <div key={cafe.id} onClick={() => onOpenCafe(cafe.id)} style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 15, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flex: 'none', overflow: 'hidden', background: cafe.logo ? '#fff' : cafe.color, color: cafe.fg, border: cafe.logo ? '1px solid var(--cc-line)' : 'none' }}>
              {cafe.logo ? <img src={cafe.logo} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : cafe.initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{cafe.name}</div>
              <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 2 }}>{cafe.dist} · 대기 {cafe.wait}</div>
            </div>
            <ChevronRight color="#C9BFB0" strokeWidth="2.2" />
          </div>
        ))}
      </div>
    </div>
  )
}
