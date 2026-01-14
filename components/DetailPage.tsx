'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import styles from './DetailPage.module.css'
import AnimatedNumber from './AnimatedNumber'

export default function DetailPage() {
  const [isVisible, setIsVisible] = useState<{ [key: number]: boolean }>({})
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const [showCalculator, setShowCalculator] = useState(false)
  const [showInquiry, setShowInquiry] = useState(false)
  const [area, setArea] = useState<number>(0)
  const [areaUnit, setAreaUnit] = useState<'pyeong' | 'sqm'>('pyeong')
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    buildingType: '',
    address: '',
    area: '',
    areaUnit: 'pyeong' as 'pyeong' | 'sqm'
  })
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const reviewSliderRef = useRef<HTMLDivElement>(null)

  // 스크롤 진행도 계산
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))

      // 플로팅 CTA 표시 여부 (히어로 섹션 지나면 표시)
      setShowFloatingCTA(scrollTop > windowHeight * 0.5)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기값 설정

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-section') || '0')
            setIsVisible((prev) => ({ ...prev, [index]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // 터치 스와이프 핸들러
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentReviewIndex((prev) => (prev < 2 ? prev + 1 : 0))
    }
    if (isRightSwipe) {
      setCurrentReviewIndex((prev) => (prev > 0 ? prev - 1 : 2))
    }
  }

  const scrollToCTA = () => {
    const ctaElement = document.getElementById('final-cta')
    ctaElement?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCopyLink = async () => {
    const currentUrl = window.location.href
    try {
      await navigator.clipboard.writeText(currentUrl)
      alert('링크가 클립보드에 복사되었습니다!')
    } catch (error) {
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        alert('링크가 클립보드에 복사되었습니다!')
      } catch (err) {
        alert('링크 복사에 실패했습니다. 링크를 직접 복사해주세요:\n' + currentUrl)
      }
      document.body.removeChild(textArea)
    }
  }

  // 면적 계산 (평 → m² 변환: 1평 = 3.3058m²)
  const calculateArea = (value: number, unit: 'pyeong' | 'sqm') => {
    if (unit === 'pyeong') {
      return value
    } else {
      return value / 3.3058
    }
  }

  // 발전 용량 계산 (1.5평당 1kW)
  const calculateCapacity = (pyeong: number) => {
    return Math.floor((pyeong / 1.5) * 10) / 10
  }

  // 연간 수익 계산 (1kW당 연 4만원)
  const calculateAnnualRevenue = (capacity: number) => {
    return Math.floor(capacity * 4)
  }

  // 5년 선납 계산
  const calculateFiveYearAdvance = (annual: number) => {
    return annual * 5
  }

  // 20년 총 수익 계산
  const calculateTwentyYearTotal = (annual: number) => {
    return annual * 20
  }

  const handleAreaChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    setArea(numValue)
  }

  const handleUnitToggle = () => {
    setAreaUnit(areaUnit === 'pyeong' ? 'sqm' : 'pyeong')
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryForm),
      })

      const data = await response.json()

      if (response.ok) {
        // Facebook Pixel 이벤트 트리거 - 문의 제출
        try {
          if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
            (window as any).fbq('track', 'Lead', {
              content_name: '제안서 문의',
              content_category: inquiryForm.buildingType,
              value: inquiryForm.area ? parseFloat(inquiryForm.area) : 0,
              currency: 'KRW',
            })
            
            // CompleteRegistration 이벤트도 함께 전송
            (window as any).fbq('track', 'CompleteRegistration', {
              content_name: '문의하기',
              status: true,
            })
          }
        } catch (error) {
          // 픽셀 오류는 무시하고 계속 진행
          console.warn('Facebook Pixel 이벤트 전송 실패:', error)
        }

        alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.')
        setShowInquiry(false)
        setInquiryForm({
          name: '',
          phone: '',
          buildingType: '',
          address: '',
          area: '',
          areaUnit: 'pyeong'
        })
      } else {
        alert(data.error || '문의 접수 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('문의 제출 오류:', error)
      alert('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const pyeongArea = calculateArea(area, areaUnit)
  const capacity = calculateCapacity(pyeongArea)
  const annualRevenue = calculateAnnualRevenue(capacity)
  const fiveYearAdvance = calculateFiveYearAdvance(annualRevenue)
  const twentyYearTotal = calculateTwentyYearTotal(annualRevenue)

  return (
    <div className={styles.container}>
      {/* 스크롤 진행 표시기 */}
      <div className={styles.scrollProgressBar} role="progressbar" aria-label="페이지 읽기 진행도">
        <div 
          className={styles.scrollProgressFill} 
          style={{ width: `${scrollProgress}%` }}
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* 고정 플로팅 CTA 버튼 */}
      {showFloatingCTA && (
        <div className={styles.floatingCTA}>
          <button 
            className={styles.floatingCTAButton}
            onClick={() => setShowCalculator(true)}
            aria-label="예상 수익 계산하기"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setShowCalculator(true)
              }
            }}
          >
            <span className={styles.floatingCTAIcon} aria-hidden="true">💰</span>
            <span className={styles.floatingCTAText}>수익 계산하기</span>
          </button>
          <button 
            className={`${styles.floatingCTAButton} ${styles.floatingCTASecondary}`}
            onClick={() => setShowInquiry(true)}
            aria-label="제안서 받아보기"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setShowInquiry(true)
              }
            }}
          >
            <span className={styles.floatingCTAIcon} aria-hidden="true">📄</span>
            <span className={styles.floatingCTAText}>제안서 받아보기</span>
          </button>
        </div>
      )}

      {/* 히어로 섹션 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[0] = el }}
        data-section="0"
        className={`${styles.heroSection} ${isVisible[0] ? styles.scaleIn : ''}`}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroLogo}>
            <Image 
              src="/로고 컬러.png" 
              alt="에코누리 ECO-NURI" 
              width={120} 
              height={40}
              priority
              className={styles.logoImage}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <div className={styles.heroEmoji}>
            <div className={`${styles.clayEmoji} ${styles.heroEmojiSize} ${styles.floatAnimation}`}>🏠</div>
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine1}>지붕이 돈을 버는 공간이</span>
            <span className={styles.heroLine2}>될 수 있다는 걸 아시나요?</span>
            <span className={styles.heroLine3}>그냥 두면 <strong>0원</strong>, 임대하면 <strong>연 수억원</strong>.</span>
          </h1>
          
          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1.5평</div>
              <div className={styles.statLabel}>= 1kW</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>4만원</div>
              <div className={styles.statLabel}>kW당 연 임대료</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>5년치</div>
              <div className={styles.statLabel}>선납 가능</div>
            </div>
          </div>

          <div className={styles.heroNote}>
            <p><strong>투자도, 관리도, 책임도 없습니다.</strong></p>
            <p>단순히 지붕을 임대하고, 매년 임대료를 받는 구조입니다.</p>
          </div>

          <div className={styles.heroFeatures}>
            <div className={styles.featureTag}>초기비용 ❌</div>
            <div className={styles.featureTag}>관리·운영 ❌</div>
            <div className={styles.featureTag}>계약·책임 ❗ 문서로 명확</div>
          </div>

          <div className={styles.heroCTAs}>
            <button className={styles.heroCTA} onClick={() => setShowCalculator(true)}>
              예상 수익 계산하기
            </button>
            <button className={styles.heroCTASecondary} onClick={() => setShowInquiry(true)}>
              빠른 문의하기
            </button>
          </div>
        </div>
      </section>

      {/* 섹션 2: 왜 낯설게 느껴질까 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[1] = el }}
        data-section="1"
        className={`${styles.section} ${isVisible[1] ? styles.slideInLeft : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.floatAnimation}`}>🤔</div>
          </div>
          <h2 className={styles.sectionTitle}>
            "왜 지붕만 놀리고 있을까요?"
          </h2>
          <p className={styles.sectionIntro}>
            지붕 임대는 새로운 개념이 아닙니다. 이미 우리는 공간을 임대하고 있습니다.
          </p>
          
          <div className={styles.comparisonList}>
            <div className={`${styles.comparisonItem} ${isVisible[1] ? styles.staggerItem : ''}`}>
              <div className={styles.comparisonIcon}>🏢</div>
              <p>상가를 임대하고</p>
            </div>
            <div className={`${styles.comparisonItem} ${isVisible[1] ? styles.staggerItem : ''}`}>
              <div className={styles.comparisonIcon}>🏢</div>
              <p>사무실을 임대하고</p>
            </div>
            <div className={`${styles.comparisonItem} ${isVisible[1] ? styles.staggerItem : ''}`}>
              <div className={styles.comparisonIcon}>🏢</div>
              <p>창고 공간을 임대합니다</p>
            </div>
          </div>

          <div className={styles.highlightBox}>
            <p className={styles.highlightText}>
              그런데 유독 <strong>지붕만은 '돈이 나가는 공간'</strong>으로 남아 있습니다.
            </p>
            <p className={styles.highlightSubtext}>
              비를 맞고, 햇볕에 노출되고, 시간이 지나면 수백만 원의 보수 비용이 드는 공간.<br />
              <strong>이 공간이 매년 수익을 만들어낼 수 있다면?</strong>
            </p>
          </div>

          <div className={styles.questionBox}>
            <p className={styles.questionText}>"왜 지붕은 임대하지 않을까?"</p>
            <p className={styles.questionText}>"왜 지붕은 늘 비용으로만 남을까?"</p>
            <p className={styles.questionSource}>에코누리는 이 질문에서 시작했습니다.</p>
          </div>
        </div>
      </section>

      {/* 섹션 3: 건물주가 망설이는 이유 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[2] = el }}
        data-section="2"
        className={`${styles.section} ${styles.sectionAlt} ${isVisible[2] ? styles.slideInRight : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.pulseAnimation}`}>😰</div>
          </div>
          <h2 className={styles.sectionTitle}>
            건물주가 태양광을 거부하는 진짜 이유
          </h2>
          
          <div className={styles.quoteList}>
            <div className={styles.quoteItem}>
              <p>"누수 나면 제가 책임지는 거 아닌가요?"</p>
            </div>
            <div className={styles.quoteItem}>
              <p>"불이라도 나면 건물 보험은요?"</p>
            </div>
            <div className={styles.quoteItem}>
              <p>"계약이 길면 나중에 문제 생기지 않나요?"</p>
            </div>
            <div className={styles.quoteItem}>
              <p>"말은 다 좋은데, 계약서가 제일 불안해요."</p>
            </div>
          </div>

          <div className={styles.insightBox}>
            <p className={styles.insightText}>
              상담에서 가장 많이 듣는 말은 '수익' 이야기가 아닙니다.
            </p>
            <div className={styles.insightHighlight}>
              <p>👉 건물주는 수익보다 <strong>'책임과 리스크'</strong>를 더 두려워합니다.</p>
            </div>
            <p className={styles.insightConclusion}>
              그래서 아무리 좋은 조건의 제안도, 마지막 순간에 "나중에 생각해볼게요"로 끝납니다.<br />
              <strong>하지만 에코누리는 다릅니다.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 4: 에코누리의 접근 방식 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[3] = el }}
        data-section="3"
        className={`${styles.section} ${isVisible[3] ? styles.scaleIn : ''}`}
      >
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            에코누리는 태양광 회사가 아닙니다
          </h2>
          
          <div className={styles.differenceBox}>
            <p className={styles.differenceIntro}>
              우리는 <strong>태양광을 파는 회사가 아닙니다.</strong>
            </p>
            <p className={styles.differenceMain}>
              <strong>지붕 임대 운영사</strong>입니다.
            </p>
            <p className={styles.differenceSubtext}>
              건물주는 지붕만 빌려주고, 매년 임대료를 받습니다.<br />
              그게 전부입니다.
            </p>
          </div>

          <div className={styles.roleBox}>
            <div className={styles.roleCard}>
              <h3 className={styles.roleTitle}>건물주</h3>
              <p className={styles.roleDesc}>지붕 사용권 임대</p>
            </div>
            <div className={styles.roleArrow}>→</div>
            <div className={styles.roleCard}>
              <h3 className={styles.roleTitle}>에코누리</h3>
              <p className={styles.roleDesc}>설치·운영·관리·책임 전담</p>
            </div>
          </div>

          <div className={styles.buildingOwnerBox}>
            <h3 className={styles.buildingOwnerTitle}>건물주는</h3>
            <div className={styles.buildingOwnerList}>
              <div className={styles.buildingOwnerItem}>투자하지 않고</div>
              <div className={styles.buildingOwnerItem}>관리하지 않고</div>
              <div className={styles.buildingOwnerItem}>문제 발생 시 직접 대응하지 않습니다.</div>
            </div>
          </div>

          <div className={styles.structureBox}>
            <p>그래서 이 구조는</p>
            <p className={styles.structureHighlight}>'사업'이 아니라</p>
            <p className={styles.structureHighlight}>부동산 임대 구조에 가깝습니다.</p>
          </div>
        </div>
      </section>

      {/* 섹션 5: 얼마 받을 수 있는지 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[4] = el }}
        data-section="4"
        className={`${styles.section} ${styles.sectionAlt} ${isVisible[4] ? styles.slideUpFade : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.rotateAnimation}`}>💰</div>
          </div>
          <h2 className={styles.sectionTitle}>
            "제 건물 지붕, 정확히 얼마 받을 수 있나요?"
          </h2>
          <p className={styles.sectionSubtitle}>
            가장 많이 받는 질문입니다. <strong>숨기지 않고, 기준부터 공개합니다.</strong>
          </p>

          <div className={styles.calculationBox}>
            <h3 className={styles.calculationTitle}>임대료 계산 기준</h3>
            <div className={styles.calculationList}>
              <div className={styles.calculationItem}>
                <span className={styles.calculationLabel}>지붕 1.5평</span>
                <span className={styles.calculationEquals}>≈</span>
                <span className={styles.calculationValue}>1kW</span>
              </div>
              <div className={styles.calculationItem}>
                <span className={styles.calculationLabel}>1kW당</span>
                <span className={styles.calculationValue}>연 4만원 임대료</span>
              </div>
            </div>
            <p className={styles.calculationNote}>
              임대료는 <strong>설치 가능 용량 × 단가</strong>로 계산됩니다.
            </p>
            <p className={styles.calculationDetail}>
              실제 계약 금액은 지붕 구조·그늘·접근성·전기 인입 조건을 반영해<br />
              현장 실사 후 최종 확정됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 6: 수익표 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[5] = el }}
        data-section="5"
        className={`${styles.section} ${isVisible[5] ? styles.fadeIn : ''}`}
      >
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            📊 지붕 면적별 실제 수익표
          </h2>
          <p className={styles.sectionSubtitle}>
            <strong>"내 건물은 어느 줄에 해당할까?"</strong><br />
            아래 표에 당신의 지붕 면적을 대입해보세요.
          </p>

          <div className={styles.tableContainer}>
            <table className={styles.revenueTable}>
              <thead>
                <tr>
                  <th>지붕 면적</th>
                  <th>예상 용량</th>
                  <th>연 임대료</th>
                  <th>5년 선납</th>
                  <th>20년 총 수익</th>
                </tr>
              </thead>
              <tbody>
                <tr className={isVisible[5] ? styles.staggerItem : ''}>
                  <td>100평</td>
                  <td>약 67kW</td>
                  <td>약 <Suspense fallback="268만 원"><AnimatedNumber value={268} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="1,340만 원"><AnimatedNumber value={1340} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="5,360만 원"><AnimatedNumber value={5360} suffix="만 원" /></Suspense></td>
                </tr>
                <tr className={isVisible[5] ? styles.staggerItem : ''}>
                  <td>150평</td>
                  <td>약 100kW</td>
                  <td>약 <Suspense fallback="400만 원"><AnimatedNumber value={400} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="2,000만 원"><AnimatedNumber value={2000} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="8,000만 원"><AnimatedNumber value={8000} suffix="만 원" /></Suspense></td>
                </tr>
                <tr className={isVisible[5] ? styles.staggerItem : ''}>
                  <td>200평</td>
                  <td>약 133kW</td>
                  <td>약 <Suspense fallback="532만 원"><AnimatedNumber value={532} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="2,660만 원"><AnimatedNumber value={2660} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="1억 640만 원"><AnimatedNumber value={16400} suffix="만 원" /></Suspense></td>
                </tr>
                <tr className={isVisible[5] ? styles.staggerItem : ''}>
                  <td>300평</td>
                  <td>약 200kW</td>
                  <td>약 <Suspense fallback="800만 원"><AnimatedNumber value={800} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="4,000만 원"><AnimatedNumber value={4000} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="1억 6,000만 원"><AnimatedNumber value={16000} suffix="만 원" /></Suspense></td>
                </tr>
                <tr className={isVisible[5] ? styles.staggerItem : ''}>
                  <td>500평</td>
                  <td>약 333kW</td>
                  <td>약 <Suspense fallback="1,332만 원"><AnimatedNumber value={1332} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="6,660만 원"><AnimatedNumber value={6660} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="2억 6,640만 원"><AnimatedNumber value={26640} suffix="만 원" /></Suspense></td>
                </tr>
                <tr className={`${styles.tableHighlight} ${isVisible[5] ? styles.staggerItem : ''}`}>
                  <td>1,000평</td>
                  <td>약 667kW</td>
                  <td>약 <Suspense fallback="2,668만 원"><AnimatedNumber value={2668} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="1억 3,340만 원"><AnimatedNumber value={13340} suffix="만 원" /></Suspense></td>
                  <td>약 <Suspense fallback="5억 3,360만 원"><AnimatedNumber value={53360} suffix="만 원" /></Suspense></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.tableFeatures}>
            <div className={styles.tableFeature}>✔ 초기비용 0원</div>
            <div className={styles.tableFeature}>✔ 관리 부담 없음</div>
            <div className={styles.tableFeature}>✔ 계약으로 확정되는 임대료</div>
          </div>

          <div className={styles.tableThought}>
            <p><strong>"지붕을 그냥 두는 게 손해 아닌가요?"</strong></p>
            <p className={styles.tableThoughtCTA}>→ 20년간 5억 원을 놓치고 계신 건 아닐까요?</p>
          </div>
        </div>
      </section>

      {/* 섹션 6.5: 업계 최고 임대료 도전 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[15] = el }}
        data-section="15"
        className={`${styles.section} ${styles.challengeSection} ${isVisible[15] ? styles.scaleIn : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.challengeBadge}>
            <span className={styles.challengeBadgeText}>🏆 업계 최고 수준</span>
          </div>
          <h2 className={styles.challengeTitle}>
            업계 최고의 임대료 수익을<br />
            <strong className={styles.challengeHighlight}>도전합니다</strong>
          </h2>
          <p className={styles.challengeSubtitle}>
            에코누리는 단순히 지붕을 임대하는 것이 아닙니다.<br />
            <strong>건물주에게 최고의 수익을 보장</strong>하는 것이 우리의 목표입니다.
          </p>
          
          <div className={styles.challengeGrid}>
            <div className={styles.challengeCard}>
              <div className={styles.challengeCardIcon}>💰</div>
              <h3 className={styles.challengeCardTitle}>경쟁력 있는 단가</h3>
              <p className={styles.challengeCardDesc}>
                1kW당 연 4만원의 명확한 기준으로<br />
                업계 최고 수준의 임대료를 제공합니다
              </p>
            </div>
            
            <div className={styles.challengeCard}>
              <div className={styles.challengeCardIcon}>📊</div>
              <h3 className={styles.challengeCardTitle}>투명한 계산</h3>
              <p className={styles.challengeCardDesc}>
                숨기지 않고 기준을 공개합니다.<br />
                계산 과정을 모두 확인할 수 있습니다
              </p>
            </div>
            
            <div className={styles.challengeCard}>
              <div className={styles.challengeCardIcon}>🤝</div>
              <h3 className={styles.challengeCardTitle}>장기 파트너십</h3>
              <p className={styles.challengeCardDesc}>
                15~20년 장기 계약으로<br />
                안정적인 수익을 보장합니다
              </p>
            </div>
          </div>
          
          <div className={styles.challengePromise}>
            <div className={styles.challengePromiseIcon}>✨</div>
            <p className={styles.challengePromiseText}>
              <strong>"우리는 건물주에게 최고의 수익을 드리기 위해 노력합니다."</strong><br />
              <span className={styles.challengePromiseSubtext}>
                단순한 약속이 아닌, 계약서에 명시되는 확정된 임대료입니다.
              </span>
            </p>
          </div>
          
          <div className={styles.challengeCTA}>
            <button 
              className={styles.challengeCTAButton}
              onClick={() => setShowInquiry(true)}
            >
              내 건물의 최고 수익 확인하기 →
            </button>
          </div>
        </div>
      </section>

      {/* 섹션 7: 왜 단순한 구조가 가능한가 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[6] = el }}
        data-section="6"
        className={`${styles.section} ${styles.sectionAlt} ${isVisible[6] ? styles.rotateFade : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.floatAnimation}`}>🤷</div>
          </div>
          <h2 className={styles.sectionTitle}>
            "이렇게 단순한 구조가 정말 가능한가요?"
          </h2>
          <p className={styles.sectionSubtitle}>
            의심하셔도 됩니다. 그래서 <strong>수익 구조를 숨기지 않고 공개합니다.</strong>
          </p>

          <div className={styles.structureExplanation}>
            <p className={styles.structureText}>
              에코누리는 지붕을 활용해 장기간 운영 수익을 만듭니다.
            </p>
            <p className={styles.structureText}>
              그 수익 중 일부를 <strong>지붕 사용료(임대료)</strong>로 건물주에게 지급합니다.
            </p>
          </div>

          <div className={styles.buildingOwnerBox}>
            <h3 className={styles.buildingOwnerTitle}>건물주는</h3>
            <div className={styles.buildingOwnerList}>
              <div className={styles.buildingOwnerItem}>수익의 주체도 아니고</div>
              <div className={styles.buildingOwnerItem}>운영의 주체도 아닙니다.</div>
            </div>
          </div>

          <div className={styles.promiseBox}>
            <p>그래서 에코누리는</p>
            <p className={styles.promiseText}>'높은 수익률'을 약속하지 않습니다.</p>
            <p className={styles.promiseHighlight}><strong>대신 '확정된 임대료'를 계약서에 명시합니다.</strong></p>
            <p style={{ marginTop: '16px', fontSize: '16px', color: 'var(--gray-600)' }}>
              투자 리스크 없이, 안정적인 임대 수익만 받으시면 됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 8: 계약과 기간 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[7] = el }}
        data-section="7"
        className={`${styles.section} ${isVisible[7] ? styles.blurFade : ''}`}
      >
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            계약과 기간 – 가장 중요한 이야기
          </h2>
          <p className={styles.sectionSubtitle}>
            이건 단기 이벤트가 아닙니다. <strong>15~20년 장기 계약</strong>입니다.
          </p>
          <p className={styles.sectionSubtitle}>
            그래서 수익보다 <strong>계약 구조와 책임 범위</strong>를 먼저 설명합니다.
          </p>

          <div className={styles.contractBox}>
            <h3 className={styles.contractTitle}>기본 계약 구조 (예시)</h3>
            <div className={styles.contractList}>
              <div className={styles.contractItem}>
                <span className={styles.contractLabel}>계약 기간:</span>
                <span className={styles.contractValue}>장기 계약 (예: 15~20년 범위)</span>
              </div>
              <div className={styles.contractItem}>
                <span className={styles.contractLabel}>임대료 지급:</span>
                <span className={styles.contractValue}>연 단위 / 선납 선택 가능</span>
              </div>
              <div className={styles.contractItem}>
                <span className={styles.contractLabel}>설비 소유:</span>
                <span className={styles.contractValue}>에코누리</span>
              </div>
              <div className={styles.contractItem}>
                <span className={styles.contractLabel}>지붕 소유:</span>
                <span className={styles.contractValue}>건물주</span>
              </div>
            </div>
          </div>

          <div className={styles.contractClauseBox}>
            <h3 className={styles.contractClauseTitle}>
              반드시 계약서에 들어가는 조항
            </h3>
            <div className={styles.contractClauseList}>
              <div className={styles.contractClauseItem}>
                누수 발생 시 책임 및 처리 절차
              </div>
              <div className={styles.contractClauseItem}>
                화재·사고 시 보험 및 배상 구조
              </div>
              <div className={styles.contractClauseItem}>
                건물 매각 시 승계/조기 해지 기준
              </div>
              <div className={styles.contractClauseItem}>
                계약 종료 시 철거·원상복구 범위
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 9: 리스크 정면 대응 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[8] = el }}
        data-section="8"
        className={`${styles.section} ${styles.sectionAlt} ${isVisible[8] ? styles.slideFromBottom : ''}`}
      >
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            가장 무서운 질문부터 답합니다
          </h2>
          <p className={styles.sectionSubtitle}>
            리스크를 회피하지 않고, <strong>정면으로 다룹니다.</strong>
          </p>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <span className={styles.faqQ}>Q.</span>
                <span>누수 나면요?</span>
              </div>
              <div className={styles.faqAnswer}>
                → 원인 조사 → 즉시 조치 → 복구 기준 계약 명시
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <span className={styles.faqQ}>Q.</span>
                <span>화재 나면요?</span>
              </div>
              <div className={styles.faqAnswer}>
                → 공사·운영 보험 + 책임 주체 사전 합의
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <span className={styles.faqQ}>Q.</span>
                <span>나중에 철거는요?</span>
              </div>
              <div className={styles.faqAnswer}>
                → 철거·원상복구 기준 문서화
              </div>
            </div>
          </div>

          <div className={styles.riskPromiseBox}>
            <p>"문제 없습니다"라는 막연한 답변은 하지 않습니다.</p>
            <p className={styles.riskPromiseHighlight}>
              <strong>"문제가 생기면 이렇게 처리합니다"</strong>라고 계약서에 명시합니다.
            </p>
            <p style={{ marginTop: '16px', fontSize: '16px', color: 'var(--gray-700)' }}>
              막연한 약속이 아닌, 문서로 확정된 책임 범위입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 10: 안 되는 경우 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[9] = el }}
        data-section="9"
        className={`${styles.section} ${isVisible[9] ? styles.scaleRotate : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.bounceAnimation}`}>🙏</div>
          </div>
          <h2 className={styles.sectionTitle}>
            솔직한 고백: 모든 지붕이 가능한 건 아닙니다
          </h2>
          <p className={styles.sectionSubtitle}>
            다음 경우에는 <strong>처음부터 진행하지 않습니다.</strong><br />
            억지로 진행하는 것이 가장 큰 리스크이기 때문입니다.
          </p>

          <div className={styles.exclusionList}>
            <div className={styles.exclusionItem}>
              <div className={styles.exclusionIcon}>❌</div>
              <p>구조 안전이 불확실한 지붕</p>
            </div>
            <div className={styles.exclusionItem}>
              <div className={styles.exclusionIcon}>❌</div>
              <p>심각한 누수·노후 상태</p>
            </div>
            <div className={styles.exclusionItem}>
              <div className={styles.exclusionIcon}>❌</div>
              <p>법적 권리관계가 복잡한 경우</p>
            </div>
          </div>

          <div className={styles.exclusionReason}>
            <p>안 되는 걸 억지로 진행하는 것이</p>
            <p className={styles.exclusionReasonHighlight}>
              가장 큰 리스크이기 때문입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 11: 시공 사례 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[10] = el }}
        data-section="10"
        className={`${styles.section} ${isVisible[10] ? styles.slideInLeft : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.pulseAnimation}`}>🏗️</div>
          </div>
          <h2 className={styles.sectionTitle}>
            실제 시공 사례
          </h2>
          <p className={styles.sectionSubtitle}>
            다양한 건물 유형에 <strong>성공적으로 설치된 실제 사례</strong>입니다.<br />
            내 건물과 유사한 사례를 찾아보세요.
          </p>

          <div className={styles.caseGrid}>
            <div className={`${styles.caseCard} ${isVisible[10] ? styles.staggerItem : ''}`}>
              <div className={styles.caseImageWrapper}>
                <Image 
                  src="/공장시공사례.png" 
                  alt="공장 시공 사례" 
                  width={400} 
                  height={300}
                  className={styles.caseImage}
                />
              </div>
              <div className={styles.caseContent}>
                <h3 className={styles.caseTitle}>공장 시공 사례</h3>
                <p className={styles.caseDescription}>
                  대형 공장 지붕에 설치된 태양광 패널로<br />
                  안정적인 임대 수익을 창출하고 있습니다.
                </p>
              </div>
            </div>

            <div className={`${styles.caseCard} ${isVisible[10] ? styles.staggerItem : ''}`}>
              <div className={styles.caseImageWrapper}>
                <Image 
                  src="/축사사례.png" 
                  alt="축사 시공 사례" 
                  width={400} 
                  height={300}
                  className={styles.caseImage}
                />
              </div>
              <div className={styles.caseContent}>
                <h3 className={styles.caseTitle}>축사 시공 사례</h3>
                <p className={styles.caseDescription}>
                  농축산 시설 지붕을 활용하여<br />
                  추가 수익원을 확보한 사례입니다.
                </p>
              </div>
            </div>

            <div className={`${styles.caseCard} ${isVisible[10] ? styles.staggerItem : ''}`}>
              <div className={styles.caseImageWrapper}>
                <Image 
                  src="/주택사례.png" 
                  alt="주택 시공 사례" 
                  width={400} 
                  height={300}
                  className={styles.caseImage}
                />
              </div>
              <div className={styles.caseContent}>
                <h3 className={styles.caseTitle}>주택 시공 사례</h3>
                <p className={styles.caseDescription}>
                  주택 지붕에도 설치 가능하며,<br />
                  깔끔한 마감으로 미관을 해치지 않습니다.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.caseNote}>
            <p>모든 사례는 현장 실사 후 설치 가능 여부를 확인하고 진행되었습니다.</p>
            <p className={styles.caseNoteHighlight}>
              내 건물도 가능한지 확인해보세요.
            </p>
          </div>

          {/* 시공 개요 */}
          <div className={styles.constructionOverview}>
            <h3 className={styles.constructionOverviewTitle}>시공 개요</h3>
            <div className={styles.constructionSpecs}>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>구조물 소재</span>
                <span className={styles.specValue}>포스맥</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>하부 구조물 체결방식</span>
                <span className={styles.specValue}>T볼팅 사용</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>모듈 고정방식</span>
                <span className={styles.specValue}>볼팅 방식</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>설계 풍속</span>
                <span className={styles.specValue}>40m/sec</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>설계 적설하중</span>
                <span className={styles.specValue}>50cm</span>
              </div>
            </div>
          </div>

          {/* 구조 안전 확인서 */}
          <div className={styles.safetyCertificate}>
            <h3 className={styles.safetyCertificateTitle}>구조 안전 확인서</h3>
            <p className={styles.safetyCertificateSubtitle}>
              모든 시공은 <strong>구조기술사 검토</strong>를 거쳐 안전성을 확보합니다.
            </p>
            <div className={styles.certificateImageWrapper}>
              <Image 
                src="/구조안전확인서.png" 
                alt="구조 안전 확인서" 
                width={600} 
                height={800}
                className={styles.certificateImage}
              />
            </div>
            <div className={styles.certificateNote}>
              <p>✓ 구조기술사 검토 완료</p>
              <p>✓ 허용응력 이하 설계</p>
              <p>✓ 기존 건물 및 태양광 설비 안전성 확보</p>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 12: 고객 후기 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[11] = el }}
        data-section="11"
        className={`${styles.section} ${styles.sectionAlt} ${isVisible[11] ? styles.slideInRight : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.rotateAnimation}`}>😊</div>
          </div>
          <h2 className={styles.sectionTitle}>
            ⭐ 실제 건물주들의 후기
          </h2>
          <p className={styles.sectionSubtitle}>
            지붕 임대를 선택한 건물주들의 <strong>실제 경험담</strong>입니다.<br />
            그들이 왜 선택했는지, 지금은 어떤지 들어보세요.
          </p>

          <div 
            className={styles.reviewSliderContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={reviewSliderRef}
          >
            <div 
              className={styles.reviewSlider}
              style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
              role="region"
              aria-label="고객 후기 슬라이더"
              aria-live="polite"
            >
              <div className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewName}>김○○</div>
                  <div className={styles.reviewType}>물류센터 건물주</div>
                </div>
                <div className={styles.reviewStats}>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>지붕 면적:</span>
                    <span className={styles.reviewStatValue}>약 300평</span>
                  </div>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>연 임대료:</span>
                    <span className={styles.reviewStatValue}>약 800만 원</span>
                  </div>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>5년 선납:</span>
                    <span className={styles.reviewStatValue}>약 4,000만 원 수령</span>
                  </div>
                </div>
                <div className={styles.reviewContent}>
                  "태양광 투자는 부담스러웠는데, 지붕 임대라는 개념이 이해가 됐어요. 특히 계약서에서 누수·철거 조항을 먼저 보여줘서 '아, 진짜 책임을 지는구나' 싶었습니다. 지금은 매년 800만 원씩 받고 있어요."
                </div>
              </div>

              <div className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewName}>박○○</div>
                  <div className={styles.reviewType}>공장 건물주</div>
                </div>
                <div className={styles.reviewStats}>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>지붕 면적:</span>
                    <span className={styles.reviewStatValue}>약 500평</span>
                  </div>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>연 임대료:</span>
                    <span className={styles.reviewStatValue}>약 1,330만 원</span>
                  </div>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>지급 방식:</span>
                    <span className={styles.reviewStatValue}>연 단위 지급 선택</span>
                  </div>
                </div>
                <div className={styles.reviewContent}>
                  "설명보다 '안 되는 경우도 있다'고 솔직하게 말해준 게 신뢰가 갔어요. 억지로 진행하려는 회사 같지 않았거든요. 지금은 신경 쓸 일 없이 매년 1,330만 원씩 받고 있습니다."
                </div>
              </div>

              <div className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewName}>이○○</div>
                  <div className={styles.reviewType}>창고형 상가 건물주</div>
                </div>
                <div className={styles.reviewStats}>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>지붕 면적:</span>
                    <span className={styles.reviewStatValue}>약 200평</span>
                  </div>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>연 임대료:</span>
                    <span className={styles.reviewStatValue}>약 530만 원</span>
                  </div>
                  <div className={styles.reviewStat}>
                    <span className={styles.reviewStatLabel}>지급 방식:</span>
                    <span className={styles.reviewStatValue}>5년 선납 선택</span>
                  </div>
                </div>
                <div className={styles.reviewContent}>
                  "건물 리모델링 계획이 있어서 망설였는데, 조기 해지 조건을 계약에 명확히 넣어줘서 결정했어요. 5년 선납으로 2,660만 원 받고, 필요하면 해지할 수 있다는 게 안심이 됐습니다."
                </div>
              </div>
            </div>
            
            <div className={styles.reviewControls}>
              <button 
                className={styles.reviewNavButton}
                onClick={() => setCurrentReviewIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                aria-label="이전 후기"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={styles.reviewDots}>
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={`${styles.reviewDot} ${currentReviewIndex === index ? styles.reviewDotActive : ''}`}
                    onClick={() => setCurrentReviewIndex(index)}
                    aria-label={`후기 ${index + 1}로 이동`}
                    aria-pressed={currentReviewIndex === index}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setCurrentReviewIndex(index)
                      }
                    }}
                  />
                ))}
              </div>
              <button 
                className={styles.reviewNavButton}
                onClick={() => setCurrentReviewIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                aria-label="다음 후기"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setCurrentReviewIndex((prev) => (prev < 2 ? prev + 1 : 0))
                  }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 13: 맞는 분 / 맞지 않는 분 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[12] = el }}
        data-section="12"
        className={`${styles.section} ${isVisible[12] ? styles.fadeIn : ''}`}
      >
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            이 서비스가 맞는 분 / 맞지 않는 분
          </h2>

          <div className={styles.fitBox}>
            <h3 className={styles.fitTitle}>이런 분께 맞습니다</h3>
            <div className={styles.fitList}>
              <div className={styles.fitItem}>
                <span className={styles.fitIcon}>✓</span>
                <span>태양광 기술에는 관심 없지만</span>
              </div>
              <div className={styles.fitItem}>
                <span className={styles.fitIcon}>✓</span>
                <span>지붕을 놀리는 건 아까운 분</span>
              </div>
              <div className={styles.fitItem}>
                <span className={styles.fitIcon}>✓</span>
                <span>관리·책임·분쟁이 싫은 분</span>
              </div>
              <div className={styles.fitItem}>
                <span className={styles.fitIcon}>✓</span>
                <span>임대처럼 안정적인 구조를 원하는 분</span>
              </div>
            </div>
          </div>

          <div className={styles.notFitBox}>
            <h3 className={styles.notFitTitle}>이런 분께는 맞지 않습니다</h3>
            <div className={styles.notFitList}>
              <div className={styles.notFitItem}>
                <span className={styles.notFitIcon}>✗</span>
                <span>단기 고수익을 기대하는 분</span>
              </div>
              <div className={styles.notFitItem}>
                <span className={styles.notFitIcon}>✗</span>
                <span>직접 운영·투자를 원하시는 분</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 14: 제안서가 필요한 이유 */}
      <section 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[13] = el }}
        data-section="13"
        className={`${styles.section} ${isVisible[13] ? styles.parallaxFade : ''}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionEmoji}>
            <div className={`${styles.clayEmoji} ${styles.floatAnimation}`}>📋</div>
          </div>
          <h2 className={styles.sectionTitle}>
            왜 제안서가 필요한가요?
          </h2>
          <p className={styles.sectionSubtitle}>
            정확한 주소를 통해 <strong>항공뷰로 분석</strong>하고,<br />
            <strong>대략적인 설치 가능 용량</strong>을 알려드립니다.
          </p>

          <div className={styles.proposalProcess}>
            <div className={styles.proposalStep}>
              <div className={styles.proposalStepNumber}>1</div>
              <div className={styles.proposalStepContent}>
                <h3 className={styles.proposalStepTitle}>정확한 주소 확인</h3>
                <p className={styles.proposalStepDescription}>
                  건물의 정확한 주소를 통해 항공뷰로 지붕 구조를 분석합니다.
                </p>
              </div>
            </div>

            <div className={styles.proposalStepArrow}>→</div>

            <div className={styles.proposalStep}>
              <div className={styles.proposalStepNumber}>2</div>
              <div className={styles.proposalStepContent}>
                <h3 className={styles.proposalStepTitle}>항공뷰 분석</h3>
                <p className={styles.proposalStepDescription}>
                  위성 이미지로 지붕 면적, 구조, 그늘 등을 확인하여<br />
                  실제 설치 가능한 패널 배치를 설계합니다.
                </p>
              </div>
            </div>

            <div className={styles.proposalStepArrow}>→</div>

            <div className={styles.proposalStep}>
              <div className={styles.proposalStepNumber}>3</div>
              <div className={styles.proposalStepContent}>
                <h3 className={styles.proposalStepTitle}>설치 용량 계산</h3>
                <p className={styles.proposalStepDescription}>
                  분석 결과를 바탕으로 대략적인 설치 가능 용량(kW)과<br />
                  예상 임대 수익을 계산하여 제안서로 제공합니다.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.proposalImageWrapper}>
            <div className={styles.proposalImageContainer}>
              <Image
                src="/제안서 이유.png"
                alt="항공뷰 기반 태양광 패널 배치 설계 예시"
                width={800}
                height={600}
                className={styles.proposalImage}
                priority={false}
              />
              <div className={styles.proposalImageCaption}>
                <p className={styles.proposalImageTitle}>실제 항공뷰 분석 사례</p>
                <p className={styles.proposalImageDescription}>
                  위성 이미지를 통해 지붕 구조를 분석하고,<br />
                  최적의 패널 배치를 설계하여 설치 가능 용량을 계산합니다.
                </p>
                <div className={styles.proposalImageStats}>
                  <div className={styles.proposalImageStat}>
                    <span className={styles.proposalImageStatLabel}>모듈 수량</span>
                    <span className={styles.proposalImageStatValue}>125EA</span>
                  </div>
                  <div className={styles.proposalImageStat}>
                    <span className={styles.proposalImageStatLabel}>발전 용량</span>
                    <span className={styles.proposalImageStatValue}>80kW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.proposalInfoBox}>
            <h3 className={styles.proposalInfoTitle}>제안서에 포함되는 내용</h3>
            <ul className={styles.proposalInfoList}>
              <li>✓ 항공뷰 기반 지붕 분석 결과</li>
              <li>✓ 대략적인 설치 가능 용량 (kW)</li>
              <li>✓ 예상 연간 임대 수익</li>
              <li>✓ 5년 선납 및 20년 총 수익</li>
              <li>✓ 현장 실사 후 최종 확정 안내</li>
            </ul>
            <p className={styles.proposalInfoNote}>
              <strong>참고:</strong> 제안서의 수치는 항공뷰 분석을 기반으로 한 대략적인 값입니다.<br />
              정확한 수치는 현장 실사 후 최종 확정됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 15: 최종 CTA */}
      <section 
        id="final-cta"
        ref={(el: HTMLDivElement | null) => { sectionsRef.current[14] = el }}
        data-section="14"
        className={`${styles.finalSection} ${isVisible[14] ? styles.bounceScale : ''}`}
      >
        <div className={styles.finalContent}>
          <h2 className={styles.finalTitle}>
            지금, 딱 하나만 확인해보세요
          </h2>
          <p className={styles.finalText}>
            이 페이지를 여기까지 읽으셨다면,<br />
            <strong>이미 관심이 충분히 있으신 겁니다.</strong>
          </p>
          <p className={styles.finalText}>
            이제 확인할 것은 단 하나입니다.
          </p>

          <div className={styles.finalCheckList}>
            <div className={styles.finalCheckItem}>
              <span className={styles.finalCheckIcon}>✓</span>
              <span>내 지붕이 가능한지</span>
            </div>
            <div className={styles.finalCheckItem}>
              <span className={styles.finalCheckIcon}>✓</span>
              <span>가능하다면 얼마나 받을 수 있는지</span>
            </div>
          </div>

          <div className={styles.finalCTA}>
            <div className={styles.finalCTALogo}>
              <Image 
                src="/로고 컬러.png" 
                alt="에코누리 ECO-NURI" 
                width={100} 
                height={33}
                className={styles.logoImage}
              />
            </div>
            <h3 className={styles.finalCTATitle}>
              내 지붕의 정확한 수익,<br />
              <strong>제안서로 확인해보세요</strong>
            </h3>
            <p className={styles.finalCTASubtitle}>
               <strong>정확한 임대 수익 제안서</strong>를 무료로 제공합니다.<br />
               <strong>내 건물이 얼마 받을 수 있는지</strong> 바로 확인하세요.
            </p>
            
            <div className={styles.finalCTAHighlight}>
              <div className={styles.finalCTAHighlightItem}>
                <span className={styles.finalCTAHighlightIcon}>⏱️</span>
                <div>
                  <strong>3일 내 제공</strong>
                  <span>빠른 검토 가능</span>
                </div>
              </div>
              <div className={styles.finalCTAHighlightItem}>
                <span className={styles.finalCTAHighlightIcon}>💰</span>
                <div>
                  <strong>100% 무료</strong>
                  <span>비용·부담 없음</span>
                </div>
              </div>
            </div>

            <button type="button" className={styles.finalCTAButton} onClick={() => setShowInquiry(true)}>
              제안서 무료로 받아보기 →
            </button>
            <button 
              type="button" 
              className={styles.finalCTAShareButton}
              onClick={handleCopyLink}
              aria-label="링크 복사하기"
            >
              <span className={styles.finalCTAShareIcon}>🔗</span>
              <span className={styles.finalCTAShareText}>링크 복사</span>
            </button>
            <div className={styles.finalCTATags}>
              <span className={styles.finalCTATag}>3일 내 제공</span>
              <span className={styles.finalCTATag}>비용·부담 없음</span>
            </div>
          </div>
        </div>
      </section>

      {/* 계산기 모달 */}
      {showCalculator && (
        <div className={styles.modalOverlay} onClick={() => setShowCalculator(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <Image 
                  src="/로고 컬러.png" 
                  alt="에코누리 ECO-NURI" 
                  width={80} 
                  height={27}
                  className={styles.modalLogo}
                />
                <h2 className={styles.modalTitle}>예상 수익 계산하기</h2>
              </div>
              <button className={styles.modalClose} onClick={() => setShowCalculator(false)}>×</button>
            </div>
            
            <div className={styles.calculatorContent}>
              <div className={styles.calculatorInput}>
                <label className={styles.calculatorLabel}>옥상·지붕 면적</label>
                <div className={styles.calculatorInputGroup}>
                  <input
                    type="number"
                    className={styles.calculatorInputField}
                    placeholder="0"
                    value={area || ''}
                    onChange={(e) => handleAreaChange(e.target.value)}
                  />
                  <div className={styles.calculatorUnitToggle}>
                    <button
                      type="button"
                      className={`${styles.unitButton} ${areaUnit === 'pyeong' ? styles.unitButtonActive : ''}`}
                      onClick={() => setAreaUnit('pyeong')}
                    >
                      평
                    </button>
                    <button
                      type="button"
                      className={`${styles.unitButton} ${areaUnit === 'sqm' ? styles.unitButtonActive : ''}`}
                      onClick={() => setAreaUnit('sqm')}
                    >
                      m²
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.calculatorResult}>
                <h3 className={styles.calculatorResultTitle}>🌤️ 예상 발전소 정보</h3>
                <div className={styles.calculatorInfo}>
                  <div className={styles.calculatorInfoItem}>
                    <span className={styles.calculatorInfoLabel}>최대 발전 용량</span>
                    <span className={styles.calculatorInfoValue}>{capacity.toFixed(1)}kW</span>
                    <span className={styles.calculatorInfoNote}>1.5평당 1kW 기준</span>
                  </div>
                  <div className={styles.calculatorInfoItem}>
                    <span className={styles.calculatorInfoLabel}>연간 수익</span>
                    <span className={styles.calculatorInfoValue}>{annualRevenue.toLocaleString()}만원</span>
                    <span className={styles.calculatorInfoNote}>1kW당 연 4만원</span>
                  </div>
                </div>

                <div className={styles.calculatorRevenue}>
                  <h4 className={styles.calculatorRevenueTitle}>💰 {capacity.toFixed(1)}kW 발전소 설치시 예상 임대 수익</h4>
                  <table className={styles.calculatorTable}>
                    <thead>
                      <tr>
                        <th>항목</th>
                        <th>금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>5년치 선지급</td>
                        <td>최대 {fiveYearAdvance.toLocaleString()}만원</td>
                      </tr>
                      <tr>
                        <td>매년 받기</td>
                        <td>최대 {annualRevenue.toLocaleString()}만원</td>
                      </tr>
                      <tr>
                        <td>20년 총 수익</td>
                        <td>최대 {twentyYearTotal >= 10000 ? `${Math.floor(twentyYearTotal / 10000)}억 ${(twentyYearTotal % 10000).toLocaleString()}만원` : `${twentyYearTotal.toLocaleString()}만원`}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.calculatorNotice}>
                  <h5 className={styles.calculatorNoticeTitle}>안내사항</h5>
                  <ul className={styles.calculatorNoticeList}>
                    <li>실제 설치 가능한 면적은 현장 조사를 통해 정확히 산정됩니다</li>
                    <li>수익 금액은 예상 수치이며 실제와 다를 수 있습니다</li>
                  </ul>
                </div>

                <button 
                  className={styles.calculatorCTA} 
                  onClick={async () => { 
                    // 계산 통계 증가
                    try {
                      await fetch('/api/stats', { method: 'POST' })
                    } catch (error) {
                      console.error('통계 업데이트 오류:', error)
                    }
                    setShowCalculator(false)
                    setShowInquiry(true)
                  }}
                >
                  빠른 문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 빠른 문의하기 모달 */}
      {showInquiry && (
        <div className={styles.modalOverlay} onClick={() => setShowInquiry(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <Image 
                  src="/로고 컬러.png" 
                  alt="에코누리 ECO-NURI" 
                  width={80} 
                  height={27}
                  className={styles.modalLogo}
                />
                <h2 className={styles.modalTitle}>빠른 문의하기</h2>
              </div>
              <button className={styles.modalClose} onClick={() => setShowInquiry(false)}>×</button>
            </div>
            
            <form className={styles.inquiryForm} onSubmit={handleInquirySubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>이름 <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>연락처 <span className={styles.required}>*</span></label>
                <input
                  type="tel"
                  className={styles.formInput}
                  required
                  placeholder="010-1234-5678"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>건물형태 <span className={styles.required}>*</span></label>
                <select
                  className={styles.formInput}
                  required
                  value={inquiryForm.buildingType}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, buildingType: e.target.value })}
                >
                  <option value="">선택해주세요</option>
                  <option value="공장">공장</option>
                  <option value="창고">창고</option>
                  <option value="물류센터">물류센터</option>
                  <option value="상가">상가</option>
                  <option value="사무실">사무실</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>건물 주소 <span className={styles.required}>[필수]</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  placeholder="건물 주소를 입력해주세요"
                  value={inquiryForm.address}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, address: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>옥상·지붕 면적</label>
                <div className={styles.formInputGroup}>
                  <input
                    type="number"
                    className={styles.formInput}
                    placeholder="0"
                    value={inquiryForm.area}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, area: e.target.value })}
                  />
                  <select
                    className={styles.formUnitSelect}
                    value={inquiryForm.areaUnit}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, areaUnit: e.target.value as 'pyeong' | 'sqm' })}
                  >
                    <option value="pyeong">평</option>
                    <option value="sqm">m²</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formCheckboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.formCheckbox}
                    required
                  />
                  <span>개인정보 수집 및 이용 동의 <span className={styles.required}>[필수]</span></span>
                </label>
              </div>

              <button type="submit" className={styles.inquirySubmitButton}>
                문의하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
