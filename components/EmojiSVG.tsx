'use client'

import styles from './DetailPage.module.css'

interface EmojiSVGProps {
  emoji: 'house' | 'thinking' | 'worried' | 'money' | 'shrug' | 'pray' | 'construction' | 'smile' | 'document' | 'star'
  size?: number
  className?: string
}

// 이모지를 SVG로 변환한 컴포넌트
export default function EmojiSVG({ emoji, size = 80, className = '' }: EmojiSVGProps) {
  const emojiMap: Record<string, string> = {
    house: '🏠',
    thinking: '🤔',
    worried: '😰',
    money: '💰',
    shrug: '🤷',
    pray: '🙏',
    construction: '🏗️',
    smile: '😊',
    document: '📄',
    star: '⭐',
  }

  const emojiChar = emojiMap[emoji] || ''

  // SVG로 이모지 렌더링 (플랫폼 독립적)
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
      <text 
        x="50" 
        y="75" 
        font-size="${size * 0.8}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Android Emoji, sans-serif"
      >${emojiChar}</text>
    </svg>
  `

  return (
    <div 
      className={`${styles.clayEmoji} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      role="img"
      aria-label={emojiChar}
    />
  )
}
