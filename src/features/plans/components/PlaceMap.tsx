import { useEffect, useMemo, useRef } from 'react'

type LatLng = { lat: number; lng: number }

export type MapPlaceMarker = {
  id: number | string
  name: string
  lat: number
  lng: number
}

interface PlaceMapProps {
  center?: LatLng | null
  myLocation?: LatLng | null
  places: MapPlaceMarker[]
  focusPlaceId?: number | string | null
  onMarkerClick?: (id: number | string) => void
}

export default function PlaceMap({
  center,
  myLocation,
  places,
  focusPlaceId,
  onMarkerClick,
}: PlaceMapProps) {
  const mapElRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)

  const myMarkerRef = useRef<any>(null)
  const placeMarkersRef = useRef<Map<string, any>>(new Map())

  const fallbackCenter = useMemo(() => ({ lat: 37.5665, lng: 126.978 }), [])
  const initialCenter = center ?? myLocation ?? fallbackCenter

  // 맵 생성
  useEffect(() => {
    if (!mapElRef.current) return

    const kakao = (window as any).kakao
    if (!kakao?.maps) return
    if (mapRef.current) return

    const map = new kakao.maps.Map(mapElRef.current, {
      center: new kakao.maps.LatLng(initialCenter.lat, initialCenter.lng),
      level: 4,
    })

    mapRef.current = map
  }, [initialCenter.lat, initialCenter.lng])

  // 내 위치 마커
  useEffect(() => {
    const kakao = window.kakao
    const map = mapRef.current
    if (!kakao?.maps || !map) return

    // 내 위치가 없으면 마커 제거
    if (!myLocation) {
      if (myMarkerRef.current) {
        myMarkerRef.current.setMap(null)
        myMarkerRef.current = null
      }
      return
    }

    const pos = new kakao.maps.LatLng(myLocation.lat, myLocation.lng)

    if (!myMarkerRef.current) {
      const marker = new kakao.maps.Marker({
        position: pos,
      })
      marker.setMap(map)
      myMarkerRef.current = marker
    } else {
      myMarkerRef.current.setPosition(pos)
    }
  }, [myLocation?.lat, myLocation?.lng])

  // 검색 결과 마커 동기화 (추가/삭제/갱신)
  useEffect(() => {
    const kakao = window.kakao
    const map = mapRef.current
    if (!kakao?.maps || !map) return

    const markerMap = placeMarkersRef.current

    const nextIds = new Set(places.map(p => String(p.id)))

    // 없는 마커 제거
    for (const [id, marker] of markerMap.entries()) {
      if (!nextIds.has(id)) {
        marker.setMap(null)
        markerMap.delete(id)
      }
    }

    // 신규/갱신
    places.forEach(p => {
      const id = String(p.id)
      const pos = new kakao.maps.LatLng(p.lat, p.lng)

      const existing = markerMap.get(id)
      if (!existing) {
        const marker = new kakao.maps.Marker({ position: pos })
        marker.setMap(map)

        if (onMarkerClick) {
          kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(p.id))
        }

        markerMap.set(id, marker)
      } else {
        existing.setPosition(pos)
      }
    })
  }, [places, onMarkerClick])

  // focusPlaceId가 바뀌면 해당 마커로 중심 이동
  useEffect(() => {
    const kakao = window.kakao
    const map = mapRef.current
    if (!kakao?.maps || !map) return
    if (!focusPlaceId) return

    const marker = placeMarkersRef.current.get(String(focusPlaceId))
    if (!marker) return

    const pos = marker.getPosition()
    map.panTo(pos)
  }, [focusPlaceId])

  // 초기 center 변경 시 지도 중심 이동 (검색 시작 지점 반영)
  useEffect(() => {
    const kakao = window.kakao
    const map = mapRef.current
    if (!kakao?.maps || !map) return
    if (!center && !myLocation) return

    const c = center ?? myLocation!
    map.setCenter(new kakao.maps.LatLng(c.lat, c.lng))
  }, [center?.lat, center?.lng, myLocation?.lat, myLocation?.lng])

  return <div ref={mapElRef} className="w-full h-[220px] rounded-lg border border-border/50" />
}
