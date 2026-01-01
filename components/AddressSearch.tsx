'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './DetailPage.module.css'

interface AddressSearchProps {
  value: string
  onChange: (address: string, lat?: number, lng?: number) => void
  onMapReady?: (map: any) => void
}

declare global {
  interface Window {
    kakao: any
  }
}

export default function AddressSearch({ value, onChange, onMapReady }: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // 카카오맵 API 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true)
      })
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return

    const container = mapContainerRef.current
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
      level: 3,
      mapTypeId: window.kakao.maps.MapTypeId.HYBRID // 항공뷰 + 지도
    }

    const map = new window.kakao.maps.Map(container, options)
    mapRef.current = map

    // 지도 타입 컨트롤 추가
    const mapTypeControl = new window.kakao.maps.MapTypeControl()
    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

    // 줌 컨트롤 추가
    const zoomControl = new window.kakao.maps.ZoomControl()
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

    if (onMapReady) {
      onMapReady(map)
    }
  }, [mapLoaded, onMapReady])

  // 주소 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert('지도 API가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(searchQuery, (result: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(result)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
        alert('주소를 찾을 수 없습니다.')
      }
    })
  }

  // 주소 선택
  const handleSelectAddress = (address: any) => {
    const fullAddress = address.address_name
    const lat = parseFloat(address.y)
    const lng = parseFloat(address.x)

    onChange(fullAddress, lat, lng)
    setSearchQuery('')
    setShowResults(false)

    // 지도 이동 및 마커 표시
    if (mapRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(lat, lng)
      mapRef.current.setCenter(moveLatLon)
      mapRef.current.setLevel(3)

      // 기존 마커 제거
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }

      // 새 마커 추가
      const marker = new window.kakao.maps.Marker({
        position: moveLatLon
      })
      marker.setMap(mapRef.current)
      markerRef.current = marker

      // 인포윈도우 표시
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:12px;">${fullAddress}</div>`
      })
      infowindow.open(mapRef.current, marker)
    }
  }

  return (
    <div className={styles.addressSearchContainer}>
      <div className={styles.addressSearchInputWrapper}>
        <input
          type="text"
          className={styles.addressSearchInput}
          placeholder="주소를 검색해주세요 (예: 서울시 강남구 테헤란로)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
          }}
        />
        <button
          type="button"
          className={styles.addressSearchButton}
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className={styles.addressSearchResults}>
          {searchResults.map((result, index) => (
            <div
              key={index}
              className={styles.addressSearchResultItem}
              onClick={() => handleSelectAddress(result)}
            >
              <div className={styles.addressSearchResultMain}>
                {result.address_name}
              </div>
              {result.road_address && (
                <div className={styles.addressSearchResultSub}>
                  도로명: {result.road_address.address_name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value && (
        <div className={styles.selectedAddress}>
          <strong>선택된 주소:</strong> {value}
        </div>
      )}

      <div 
        ref={mapContainerRef} 
        className={styles.addressMapContainer}
        style={{ width: '100%', height: '300px', marginTop: '16px', borderRadius: '12px', overflow: 'hidden' }}
      />
    </div>
  )
}
