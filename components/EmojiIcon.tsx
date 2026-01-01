'use client'

import Image from 'next/image'
import styles from './DetailPage.module.css'

interface EmojiIconProps {
  emoji: string
  size?: 'small' | 'medium' | 'large'
  className?: string
  animation?: 'float' | 'pulse' | 'rotate' | 'bounce'
}

// 이모지를 SVG로 변환하는 컴포넌트
export default function EmojiIcon({ 
  emoji, 
  size = 'medium',
  className = '',
  animation
}: EmojiIconProps) {
  const sizeClasses = {
    small: styles.emojiSmall,
    medium: styles.emojiMedium,
    large: styles.emojiLarge,
  }

  const animationClasses = {
    float: styles.floatAnimation,
    pulse: styles.pulseAnimation,
    rotate: styles.rotateAnimation,
    bounce: styles.bounceAnimation,
  }

  // SVG로 이모지 렌더링 (플랫폼 독립적)
  const emojiSvg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <text x="50" y="75" font-size="80" text-anchor="middle" dominant-baseline="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${emoji}</text>
    </svg>
  `)}`

  return (
    <div 
      className={`${styles.clayEmoji} ${sizeClasses[size]} ${animation ? animationClasses[animation] : ''} ${className}`}
      style={{
        backgroundImage: `url("${emojiSvg}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      role="img"
      aria-label={emoji}
    >
      {/* 폴백: 텍스트 이모지 (SVG 로드 실패 시) */}
      <span style={{ opacity: 0, position: 'absolute' }}>{emoji}</span>
    </div>
  )
}
