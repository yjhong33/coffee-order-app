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

function distMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
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
  const userPosRef = useRef(null)
  const [locationDenied, setLocationDenied] = useState(false)
  const [nearbyCafes, setNearbyCafes] = useState([])
  const [searchCenter, setSearchCenter] = useState(null)
  const [mapMoved, setMapMoved] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)  // unregistered cafe sheet
  const [selectedCafeInfo, setSelectedCafeInfo] = useState(null)  // registered cafe sheet

  // draggable list sheet: map height in px (null → default 72vh)
  const rootRef = useRef(null)
  const [mapH, setMapH] = useState(null)
  const dragRef = useRef(null)

  function onHandleDown(e) {
    const total = rootRef.current?.clientHeight || 0
    if (!total) return
    const current = mapH != null ? mapH : total * 0.72
    dragRef.current = { startY: e.clientY, startH: current, total }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function onHandleMove(e) {
    const d = dragRef.current
    if (!d) return
    const next = d.startH + (e.clientY - d.startY)
    const min = d.total * 0.2
    const max = d.total * 0.78
    setMapH(Math.max(min, Math.min(max, next)))
  }
  function onHandleUp(e) {
    if (!dragRef.current) return
    dragRef.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  // keep the Kakao map correctly sized when the sheet is dragged
  useEffect(() => {
    if (mapH != null && mapRef.current?.relayout) mapRef.current.relayout()
  }, [mapH])

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
          const lat = parseFloat(place.y)
          const lng = parseFloat(place.x)
          const pos = userPosRef.current
          const realDist = pos ? Math.round(distMeters(pos.lat, pos.lng, lat, lng)) : place.distance
          return {
            id: matched ? matched.id : `kakao-${place.id}`,
            name: place.place_name,
            lat,
            lng,
            dist: `${realDist}m`,
            wait: matched?.wait ?? '',
            logo: matched?.logo,
            color: matched?.color ?? '#8B7355',
            fg: matched?.fg ?? '#fff',
            initial: matched?.initial ?? place.place_name[0],
            registered: !!matched,
            category: place.category_name?.split('>').pop()?.trim() || '카페',
            phone: place.phone || '',
            address: place.road_address_name || place.address_name || '',
            placeUrl: place.place_url || '',
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
    if (!mapFailed && searchCenter && nearbyCafes.length > 0) return nearbyCafes
    return cafes
  }, [mapFailed, searchCenter, nearbyCafes, cafes])

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
      (pos) => { const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }; userPosRef.current = p; setUserPos(p) },
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
      el.onclick = () => (isUnregistered ? setSelectedPlace(cafe) : setSelectedCafeInfo(cafe))
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
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        userPosRef.current = p
        setUserPos(p)
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
    <div ref={rootRef} style={{ animation: 'cc-fade .2s ease', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: mapH != null ? mapH : '72vh', flex: 'none', background: 'linear-gradient(160deg,#E5EAE0,#D8E0D2)', overflow: 'hidden' }}>
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

        {/* location-loading overlay — hides until real position is known */}
        {!showFallback && !userPos && !locationDenied && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid var(--cc-green)', borderTopColor: 'transparent', animation: 'cc-spin 0.8s linear infinite' }}></div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-ink2)' }}>내 위치 확인 중...</div>
            <div style={{ fontSize: 13, color: 'var(--cc-ink3)' }}>위치 권한을 허용해 주세요</div>
          </div>
        )}

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
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--cc-cream)', borderRadius: '18px 18px 0 0', position: 'relative', zIndex: 2, boxShadow: '0 -6px 18px var(--cc-shadow)' }}>
        <div
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          style={{ flex: 'none', padding: '10px 20px 8px', cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
        >
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--cc-line)', margin: '0 auto 10px' }}></div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>내 주변 카페 {displayCafes.length}곳</div>
        </div>
        <div className="cc-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 20px 16px' }}>
          {displayCafes.length === 0 && (
            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--cc-ink3)', padding: '24px 0' }}>검색 결과가 없어요</div>
          )}
          {displayCafes.map((cafe) => {
            const isUnregistered = cafe.id.startsWith('kakao-') && !cafe.registered
            return (
              <div
                key={cafe.id}
                onClick={() => (isUnregistered ? setSelectedPlace(cafe) : setSelectedCafeInfo(cafe))}
                style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 15, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flex: 'none', overflow: 'hidden', background: isUnregistered ? 'transparent' : cafe.logo ? '#fff' : cafe.color, color: cafe.fg, border: cafe.logo ? '1px solid var(--cc-line)' : 'none' }}>
                  {isUnregistered ? <DefaultCafeMarker size={44} /> : cafe.logo ? <img src={cafe.logo} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : cafe.initial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{cafe.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 2 }}>현 위치에서 {cafe.dist}</div>
                </div>
                <ChevronRight color="#C9BFB0" strokeWidth="2.2" />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── registered cafe info sheet ── */}
      {selectedCafeInfo && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(20,16,10,.35)', display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setSelectedCafeInfo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 20px 28px', boxShadow: '0 -8px 24px rgba(0,0,0,.18)', animation: 'cc-fade .18s ease' }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 3, background: 'var(--cc-line)', margin: '0 auto 18px' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, flex: 'none', overflow: 'hidden', background: selectedCafeInfo.logo ? '#fff' : selectedCafeInfo.color, border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: selectedCafeInfo.fg }}>
                {selectedCafeInfo.logo
                  ? <img src={selectedCafeInfo.logo} alt={selectedCafeInfo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : selectedCafeInfo.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.3px', marginBottom: 4 }}>{selectedCafeInfo.name}</div>
                <div style={{ fontSize: 13, color: 'var(--cc-ink3)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedCafeInfo.dist && <span>📍 {selectedCafeInfo.dist}</span>}
                  {selectedCafeInfo.wait && <span>⏱ 대기 {selectedCafeInfo.wait}</span>}
                </div>
              </div>
              <div onClick={() => setSelectedCafeInfo(null)} style={{ fontSize: 22, color: 'var(--cc-ink3)', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</div>
            </div>
            <div
              onClick={() => { setSelectedCafeInfo(null); onOpenCafe(selectedCafeInfo.id) }}
              style={{ width: '100%', height: 52, borderRadius: 14, background: 'var(--cc-green)', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 20px rgba(31,110,80,.28)' }}
            >
              메뉴 보기
            </div>
          </div>
        </div>
      )}

      {selectedPlace && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            background: 'rgba(20,16,10,.35)',
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setSelectedPlace(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              margin: '0 auto',
              background: '#fff',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 24px',
              boxShadow: '0 -8px 24px rgba(0,0,0,.18)',
              animation: 'cc-fade .18s ease',
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 3, background: 'var(--cc-line)', margin: '0 auto 16px' }}></div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, flex: 'none', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: DEFAULT_MARKER_SVG }}></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 3 }}>{selectedPlace.name}</div>
                <div style={{ fontSize: 13, color: 'var(--cc-ink3)' }}>
                  {selectedPlace.category} {selectedPlace.dist ? `· ${selectedPlace.dist}` : ''}
                </div>
              </div>
              <div onClick={() => setSelectedPlace(null)} style={{ fontSize: 20, color: 'var(--cc-ink3)', cursor: 'pointer', padding: 4 }}>×</div>
            </div>
            {selectedPlace.address && (
              <div style={{ fontSize: 13.5, color: 'var(--cc-ink2)', marginBottom: 8, lineHeight: 1.5 }}>{selectedPlace.address}</div>
            )}
            {selectedPlace.phone && (
              <div style={{ fontSize: 13.5, color: 'var(--cc-ink2)', marginBottom: 16 }}>{selectedPlace.phone}</div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {selectedPlace.placeUrl && (
                <a
                  href={selectedPlace.placeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    height: 48,
                    borderRadius: 13,
                    border: '1px solid var(--cc-line)',
                    color: 'var(--cc-ink)',
                    fontSize: 14.5,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  카카오맵에서 보기
                </a>
              )}
              <div
                onClick={() => {
                  setSelectedPlace(null)
                  onEnterMemo()
                }}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  height: 48,
                  borderRadius: 13,
                  background: 'var(--cc-green-strong)',
                  color: '#fff',
                  fontSize: 14.5,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                간단하게 주문하기
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
