let loadPromise = null

export function loadKakaoMaps() {
  const appkey = import.meta.env.VITE_KAKAO_MAP_KEY
  if (!appkey) return Promise.reject(new Error('no-key'))
  if (window.kakao?.maps) return Promise.resolve(window.kakao)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false`
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    script.onerror = () => reject(new Error('script-load-failed'))
    document.head.appendChild(script)
  })
  return loadPromise
}
