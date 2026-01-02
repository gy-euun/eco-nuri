'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'

interface Inquiry {
  id: string
  name: string
  phone: string
  buildingType: string
  address: string
  area: string
  areaUnit: 'pyeong' | 'sqm'
  createdAt: string
  status: 'pending' | 'contacted' | 'completed' | 'rejected'
  notes?: string
}

interface Stats {
  totalInquiries: number
  totalCalculations: number
  inquiriesByBuildingType: Record<string, number>
  inquiriesByDate: Record<string, number>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [inquiriesRes, statsRes] = await Promise.all([
        fetch('/api/inquiries'),
        fetch('/api/stats')
      ])

      if (inquiriesRes.status === 401 || statsRes.status === 401) {
        router.push('/admin')
        return
      }

      const inquiriesData = await inquiriesRes.json()
      const statsData = await statsRes.json()

      setInquiries(inquiriesData.inquiries || [])
      setStats(statsData.stats || null)
    } catch (error) {
      console.error('데이터 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  const handleStatusChange = async (id: string, status: Inquiry['status'], notes?: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      })

      if (response.ok) {
        loadData()
        setSelectedInquiry(null)
      }
    } catch (error) {
      console.error('상태 변경 오류:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  // 면적을 평으로 변환
  const convertToPyeong = (area: string, unit: 'pyeong' | 'sqm'): number => {
    const areaNum = parseFloat(area) || 0
    if (unit === 'sqm') {
      return areaNum / 3.3058 // 1평 = 3.3058m²
    }
    return areaNum
  }

  // 발전 용량 계산 (1.5평당 1kW)
  const calculateCapacity = (pyeong: number): number => {
    if (pyeong <= 0) return 0
    return Math.floor((pyeong / 1.5) * 10) / 10
  }

  // 수익금 계산 (kW * 200,000원)
  const calculateRevenue = (capacity: number): number => {
    return Math.floor(capacity * 200000)
  }

  const filteredInquiries = statusFilter === 'all' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === statusFilter)

  const statusLabels = {
    pending: '대기',
    contacted: '연락 완료',
    completed: '완료',
    rejected: '거절'
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>관리자 대시보드</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      {/* 통계 카드 */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>총 문의 수</div>
            <div className={styles.statValue}>{stats.totalInquiries.toLocaleString()}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>총 계산 수</div>
            <div className={styles.statValue}>{stats.totalCalculations.toLocaleString()}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>건물 유형별</div>
            <div className={styles.statValue}>
              {Object.keys(stats.inquiriesByBuildingType).length}개
            </div>
          </div>
        </div>
      )}

      {/* 필터 */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${statusFilter === 'all' ? styles.filterButtonActive : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          전체
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            className={`${styles.filterButton} ${statusFilter === key ? styles.filterButtonActive : ''}`}
            onClick={() => setStatusFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 문의 목록 */}
      <div className={styles.inquiriesList}>
        {filteredInquiries.length === 0 ? (
          <div className={styles.emptyState}>문의 내역이 없습니다.</div>
        ) : (
          filteredInquiries.map((inquiry) => {
            const pyeongArea = convertToPyeong(inquiry.area || '0', inquiry.areaUnit)
            const capacity = calculateCapacity(pyeongArea)
            const revenue = calculateRevenue(capacity)

            return (
              <div key={inquiry.id} className={styles.inquiryCard}>
                <div className={styles.inquiryHeader}>
                  <div>
                    <h3 className={styles.inquiryName}>{inquiry.name}</h3>
                    <p className={styles.inquiryPhone}>{inquiry.phone}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[`status${inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}`]}`}>
                    {statusLabels[inquiry.status]}
                  </span>
                </div>

                {/* kW 및 수익금 카드 */}
                {inquiry.area && parseFloat(inquiry.area) > 0 && (
                  <div className={styles.revenueCard}>
                    <div className={styles.revenueCardHeader}>
                      <span className={styles.revenueCardIcon}>⚡</span>
                      <span className={styles.revenueCardTitle}>예상 발전소 정보</span>
                    </div>
                    <div className={styles.revenueCardContent}>
                      <div className={styles.revenueItem}>
                        <div className={styles.revenueItemLabel}>발전 용량</div>
                        <div className={styles.revenueItemValue}>{capacity.toFixed(1)} kW</div>
                        <div className={styles.revenueItemNote}>1.5평당 1kW 기준</div>
                      </div>
                      <div className={styles.revenueDivider}></div>
                      <div className={styles.revenueItem}>
                        <div className={styles.revenueItemLabel}>예상 수익금</div>
                        <div className={styles.revenueItemValue}>{revenue.toLocaleString()}원</div>
                        <div className={styles.revenueItemNote}>kW × 200,000원</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.inquiryDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>건물 유형:</span>
                  <span className={styles.detailValue}>{inquiry.buildingType}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>주소:</span>
                  <span className={styles.detailValue}>{inquiry.address}</span>
                </div>
                {inquiry.area && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>면적:</span>
                    <span className={styles.detailValue}>
                      {inquiry.area} {inquiry.areaUnit === 'pyeong' ? '평' : 'm²'}
                    </span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>문의일:</span>
                  <span className={styles.detailValue}>
                    {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                {inquiry.notes && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>메모:</span>
                    <span className={styles.detailValue}>{inquiry.notes}</span>
                  </div>
                )}
              </div>
              <div className={styles.inquiryActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  수정
                </button>
                <button
                  className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                  onClick={() => handleDelete(inquiry.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            )
          })
        )}
      </div>

      {/* 수정 모달 */}
      {selectedInquiry && (
        <div className={styles.modalOverlay} onClick={() => setSelectedInquiry(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>문의 내역 수정</h2>
            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <p><strong>이름:</strong> {selectedInquiry.name}</p>
                <p><strong>연락처:</strong> {selectedInquiry.phone}</p>
                <p><strong>건물 유형:</strong> {selectedInquiry.buildingType}</p>
                <p><strong>주소:</strong> {selectedInquiry.address}</p>
                {selectedInquiry.area && (
                  <>
                    <p><strong>면적:</strong> {selectedInquiry.area} {selectedInquiry.areaUnit === 'pyeong' ? '평' : 'm²'}</p>
                    {(() => {
                      const pyeongArea = convertToPyeong(selectedInquiry.area || '0', selectedInquiry.areaUnit)
                      const capacity = calculateCapacity(pyeongArea)
                      const revenue = calculateRevenue(capacity)
                      return (
                        <>
                          <p><strong>예상 발전 용량:</strong> {capacity.toFixed(1)} kW</p>
                          <p><strong>예상 수익금:</strong> {revenue.toLocaleString()}원</p>
                        </>
                      )
                    })()}
                  </>
                )}
              </div>
              <div className={styles.modalForm}>
                <label className={styles.modalLabel}>상태</label>
                <select
                  className={styles.modalSelect}
                  value={selectedInquiry.status}
                  onChange={(e) => setSelectedInquiry({
                    ...selectedInquiry,
                    status: e.target.value as Inquiry['status']
                  })}
                >
                  <option value="pending">대기</option>
                  <option value="contacted">연락 완료</option>
                  <option value="completed">완료</option>
                  <option value="rejected">거절</option>
                </select>
                <label className={styles.modalLabel}>메모</label>
                <textarea
                  className={styles.modalTextarea}
                  value={selectedInquiry.notes || ''}
                  onChange={(e) => setSelectedInquiry({
                    ...selectedInquiry,
                    notes: e.target.value
                  })}
                  placeholder="메모를 입력하세요..."
                  rows={4}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButton}
                onClick={() => handleStatusChange(
                  selectedInquiry.id,
                  selectedInquiry.status,
                  selectedInquiry.notes
                )}
              >
                저장
              </button>
              <button
                className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
                onClick={() => setSelectedInquiry(null)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
