'use client'

import styles from './LandingPage.module.css'

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21V9H3V21Z" fill="var(--toss-blue-600)"/>
                <path d="M3 9L12 2L21 9" stroke="var(--toss-blue-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V13H15V21" fill="var(--white)"/>
              </svg>
            </div>
            <span className={styles.logoText}>안전집사</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          <button className={styles.iconButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className={styles.main}>
        {/* 타이틀 섹션 */}
        <section className={styles.titleSection}>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleLine1}>가성비 좋은</span>
            <span className={styles.titleLine2}>안전한 집의 발견</span>
          </h1>
          <p className={styles.subtitle}>
            시세보다 좋은 집을 알려드려요.
          </p>
        </section>

        {/* 중앙 그래픽 */}
        <section className={styles.graphicSection}>
          <div className={styles.houseContainer}>
            <div className={styles.diamond}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4L44 24L24 44L4 24L24 4Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
                <path d="M24 4L32 12L24 20L16 12L24 4Z" fill="#FFED4E"/>
                <path d="M24 20L32 28L24 36L16 28L24 20Z" fill="#FFD700"/>
              </svg>
            </div>
            <div className={styles.house}>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 20L100 50V100H20V50L60 20Z" fill="var(--gray-200)"/>
                <path d="M60 20L100 50H20L60 20Z" fill="var(--toss-blue-600)"/>
                <rect x="45" y="70" width="30" height="30" fill="var(--gray-700)"/>
              </svg>
            </div>
          </div>
        </section>

        {/* 기능 리스트 */}
        <section className={styles.featuresSection}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="var(--toss-blue-600)" strokeWidth="2"/>
                <path d="M16 8V16L20 20" stroke="var(--toss-blue-600)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 10L22 22M22 10L10 22" stroke="var(--gray-400)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.featureText}>
              <p className={styles.featureTitle}>우리 집과 동네의</p>
              <p className={styles.featureDescription}>가성비 순위를 확인해요</p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6L20 12L28 13L22 18L24 26L16 22L8 26L10 18L4 13L12 12L16 6Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
              </svg>
            </div>
            <div className={styles.featureText}>
              <p className={styles.featureTitle}>관심있는 집과 동네도</p>
              <p className={styles.featureDescription}>랭킹으로 비교할 수 있어요</p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C10.477 4 6 8.477 6 14C6 20 16 28 16 28C16 28 26 20 26 14C26 8.477 21.523 4 16 4Z" fill="var(--toss-blue-600)"/>
                <circle cx="16" cy="14" r="4" fill="var(--white)"/>
              </svg>
            </div>
            <div className={styles.featureText}>
              <p className={styles.featureTitle}>매물 지도에서</p>
              <p className={styles.featureDescription}>거래 가능한 좋은 집을 찾아보세요</p>
            </div>
          </div>
        </section>

        {/* 시작하기 버튼 */}
        <section className={styles.ctaSection}>
          <button className={styles.startButton}>
            시작하기
          </button>
        </section>
      </main>
    </div>
  )
}
