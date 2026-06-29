import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, MapLines, LocateIcon, RefreshIcon, DefaultCafeMarker } from '../icons'
import { loadKakaoMaps } from '../kakaoMap'

const DEFAULT_MARKER_SVG =
  '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="20" cy="20" r="20" fill="#B98B3E"></circle>' +
  '<path d="M19 9c0 1.2-1.4 1.2-1.4 2.5S19 13 19 13" stroke="#fff" stroke-width="1.4" stroke-linecap="round"></path>' +
  '<path d="M23 9c0 1.2-1.4 1.2-1.4 2.5S23 13 23 13" stroke="#fff" stroke-width="1.4" stroke-linecap="round"></path>' +
  '<path d="M11 17h17l-1.3 9.3A3 3 0 0 1 23.7 29H16.3a3 3 0 0 1-3-2.7L12 17Z" fill="#fff"></path>' +
  '<path d="M28 18.5h1.6a2.6 2.6 0 0 1 0 5.2H27.6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"></path>' +
  '</svg>'

const BRAND_KEYWORDS = {
  starbucks: ['스타벅스'],
  mega: ['메가커피', '메가MGC', '메가엠지씨'],
  twosome: ['투썸플레이스', '투썸'],
  ediya: ['이디야'],
  compose: ['컴포즈커피', '컴포즈'],
  paik: ['빽다방'],
}

function matchBrand(placeName, cafes) {
  for (const [id, keywords] of Object.entries(BRAND_KEYWORDS)) {
    if (keywords.some((kw) => placeName.includes(kw))) {
      return cafes.find((c) => c.id === id)
    }
  }
  return null
}

export default function Map({ cafes, mapPins, cafeQuery, onQueryChange, onBack, onOpenCafe, onEnterMemo }) {
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
  const [locationDenied, setLocationDenied] = useState(false)
  const [nearbyCafes, setNearbyCafes] = useState([])
  const [searchCenter, setSearchCenter] = useState(null)
  const [mapMoved, setMapMoved] = useState(false)

  function searchNearby(center) {
    if (!window.kakao?.maps?.services) return
    const kakao = window.kakao
    const places = new kakao.maps.services.Places()
    places.categorySearch(
      'CE7',
      (results, status) => {
        if (status !== kakao.maps.services.Status.OK) {
          setNearbyCafes([])
          return
        }
        const mapped = results.map((place) => {
          const matched = matchBrand(place.place_name, cafes)
          return {
            id: matched ? matched.id : `kakao-${place.id}`,
            name: place.place_name,
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
            dist: `${place.distance}m`,
            wait: matched?.wait ?? '',
            logo: matched?.logo,
            color: matched?.color ?? '#8B7355',
            fg: matched?.fg ?? '#fff',
            initial: matched?.initial ?? place.place_name[0],
            registered: !!matched,
          }
        })
        setNearbyCafes(mapped)
        setMapMoved(false)
      },
      { location: center, radius: 1000, sort: kakao.maps.services.SortBy.DISTANCE },
    )
  }

  useEffect(() => {
    if (!mapReady || !userPos || !window.kakao?.maps?.services) return
    const center = new window.kakao.maps.LatLng(userPos.lat, userPos.lng)
    setSearchCenter(center)
    searchNearby(center)
  }, [mapReady, userPos])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const handler = () => setMapMoved(true)
    window.kakao.maps.event.addListener(mapRef.current, 'dragend', handler)
    window.kakao.maps.event.addListener(mapRef.current, 'zoom_changed', handler)
    return () => {
      window.kakao.maps.event.removeListener(mapRef.current, 'dragend', handler)
      window.kakao.maps.event.removeListener(mapRef.current, 'zoom_changed', handler)
    }
  }, [mapReady])

  function researchHere() {
    if (!mapRef.current) return
    const center = mapRef.current.getCenter()
    setSearchCenter(center)
    searchNearby(center)
  }

  const displayCafes = useMemo(() => {
    if (!mapFailed && !locationDenied && searchCenter && nearbyCafes.length > 0) return nearbyCafes
    return cafes
  }, [mapFailed, locationDenied, searchCenter, nearbyCafes, cafes])

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

  // auto-request location on entering the map so nearby real cafes can be searched
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationDenied(true),
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
      const isUnregistered = cafe.id.startsWith('kakao-') && !cafe.registered
      const position = new kakao.maps.LatLng(cafe.lat, cafe.lng)
      const el = document.createElement('div')
      if (isUnregistered) {
        el.style.cssText = 'width:40px;height:40px;cursor:pointer;filter:drop-shadow(0 4px 8px rgba(0,0,0,.25));'
        el.innerHTML = DEFAULT_MARKER_SVG
      } else {
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
      }
      el.onclick = () => (isUnregistered ? onEnterMemo() : onOpenCafe(cafe.id))
      const overlay = new kakao.maps.CustomOverlay({ position, content: el, yAnchor: 1 })
      overlay.setMap(mapRef.current)
      overlaysRef.current.push(overlay)
    })
  }, [mapReady, displayCafes, onOpenCafe, onEnterMemo])

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

        {!showFallback && mapMoved && (
          <div
            onClick={researchHere}
            style={{
              position: 'absolute',
              top: 108,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#fff',
              borderRadius: 20,
              padding: '9px 16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(40,30,15,.18)',
            }}
          >
            <RefreshIcon size={15} />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--cc-ink)' }}>이 지역 재검색</span>
          </div>
        )}

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
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>내 주변 카페 {displayCafes.length}곳</div>
        {displayCafes.length === 0 && (
          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--cc-ink3)', padding: '24px 0' }}>검색 결과가 없어요</div>
        )}
        {displayCafes.map((cafe) => {
          const isUnregistered = cafe.id.startsWith('kakao-') && !cafe.registered
          return (
            <div
              key={cafe.id}
              onClick={() => (isUnregistered ? onEnterMemo() : onOpenCafe(cafe.id))}
              style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 15, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flex: 'none', overflow: 'hidden', background: isUnregistered ? 'transparent' : cafe.logo ? '#fff' : cafe.color, color: cafe.fg, border: cafe.logo ? '1px solid var(--cc-line)' : 'none' }}>
                {isUnregistered ? <DefaultCafeMarker size={44} /> : cafe.logo ? <img src={cafe.logo} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : cafe.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{cafe.name}</div>
                <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 2 }}>{cafe.dist} · 대기 {cafe.wait}</div>
              </div>
              <ChevronRight color="#C9BFB0" strokeWidth="2.2" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
