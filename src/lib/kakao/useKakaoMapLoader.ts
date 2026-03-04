import { useEffect, useState } from 'react'

export function useKakaoMapLoader(appKey?: string) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!appKey) return

    const loadMap = () => {
      const kakao = (window as any).kakao
      if (!kakao?.maps) return

      kakao.maps.load(() => {
        setReady(true)
      })
    }

    // 이미 로드된 경우
    if ((window as any).kakao?.maps) {
      queueMicrotask(loadMap)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-map="true"]')

    if (existing) {
      existing.addEventListener('load', loadMap)
      return
    }

    const script = document.createElement('script')
    script.dataset.kakaoMap = 'true'
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`

    script.onload = loadMap

    document.head.appendChild(script)
  }, [appKey])

  return ready
}
